"""Devices — pairing, fleet, per-device estop, and the device WebSocket.

A device (real MCU behind the serial bridge script, or an emulated body)
connects to /ws/device/{pairing_code} and speaks the same NDJSON protocol
as the serial wire. Console sessions relay intents to it through
DeviceRelayLink; telemetry acks update the fleet row.
"""

import asyncio
import json
import secrets
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from auth import current_user
from db import get_session, session_factory
from links import DeviceRelayLink
from models import Device, User

router = APIRouter()

# pairing_code -> live DeviceRelayLink (in-process registry)
live_links: dict[str, DeviceRelayLink] = {}


class PairIn(BaseModel):
    name: str = Field(default="Exobod unit", max_length=60)


class DeviceOut(BaseModel):
    id: str
    name: str
    pairing_code: str
    status: str
    fw_version: str | None
    last_pose: dict | None
    last_vbat: float | None
    estopped: bool
    last_seen_at: str | None
    online: bool


def _out(d: Device) -> DeviceOut:
    return DeviceOut(
        id=d.id, name=d.name, pairing_code=d.pairing_code, status=d.status,
        fw_version=d.fw_version, last_pose=d.last_pose, last_vbat=d.last_vbat,
        estopped=d.estopped,
        last_seen_at=d.last_seen_at.isoformat() if d.last_seen_at else None,
        online=d.pairing_code in live_links,
    )


async def _owned(db: AsyncSession, user_id: str, device_id: str) -> Device:
    d = (await db.execute(select(Device).where(
        Device.id == device_id, Device.user_id == user_id
    ))).scalar_one_or_none()
    if d is None:
        raise HTTPException(404, "device not found")
    return d


@router.post("/devices/pair", response_model=DeviceOut)
async def pair_device(body: PairIn, user: User = Depends(current_user),
                      db: AsyncSession = Depends(get_session)):
    code = f"EXO-{secrets.token_hex(3).upper()}"
    d = Device(user_id=user.id, name=body.name, pairing_code=code)
    db.add(d)
    await db.commit()
    await db.refresh(d)
    return _out(d)


@router.get("/devices", response_model=list[DeviceOut])
async def fleet(user: User = Depends(current_user),
                db: AsyncSession = Depends(get_session)):
    rows = (await db.execute(select(Device).where(
        Device.user_id == user.id).order_by(Device.created_at)
    )).scalars().all()
    return [_out(d) for d in rows]


@router.post("/devices/{device_id}/estop")
async def device_estop(device_id: str, user: User = Depends(current_user),
                       db: AsyncSession = Depends(get_session)):
    d = await _owned(db, user.id, device_id)
    link = live_links.get(d.pairing_code)
    if link is None:
        raise HTTPException(409, "device offline — estop not deliverable")
    ack = await link.send_intent(
        {"action": "estop", "params": {}, "src": "fleet", "conf": 1.0})
    d.estopped = bool(ack.get("estop", True))
    if pose := ack.get("pose"):
        d.last_pose = pose
    d.last_seen_at = datetime.now(timezone.utc)
    db.add(d)
    await db.commit()
    return {"device_id": d.id, "ack": ack}


@router.delete("/devices/{device_id}")
async def forget_device(device_id: str, user: User = Depends(current_user),
                        db: AsyncSession = Depends(get_session)):
    d = await _owned(db, user.id, device_id)
    live = live_links.pop(d.pairing_code, None)
    if live:
        live.connected = False
    await db.delete(d)
    await db.commit()
    return {"deleted": device_id}


@router.websocket("/ws/device/{pairing_code}")
async def device_ws(websocket: WebSocket, pairing_code: str):
    """The device side of the relay. First message may be a hello with
    fw_version; every ack/telemetry line updates the fleet row."""
    async with session_factory() as db:
        d = (await db.execute(select(Device).where(
            Device.pairing_code == pairing_code
        ))).scalar_one_or_none()
        if d is None:
            await websocket.close(code=4404, reason="unknown pairing code")
            return
        await websocket.accept()
        link = DeviceRelayLink(websocket)
        live_links[pairing_code] = link
        d.status = "online"
        d.last_seen_at = datetime.now(timezone.utc)
        db.add(d)
        await db.commit()
        device_id = d.id

    try:
        while True:
            raw = await websocket.receive_text()
            try:
                msg = json.loads(raw)
            except json.JSONDecodeError:
                continue
            if msg.get("t") == "hello":
                async with session_factory() as db:
                    d = await db.get(Device, device_id)
                    if d and msg.get("fw"):
                        d.fw_version = str(msg["fw"])[:40]
                        db.add(d)
                        await db.commit()
                continue
            # ack/telemetry: feed the relay queue and mirror into the fleet row
            link.feed(raw)
            if msg.get("t") in ("ack", "telemetry"):
                async with session_factory() as db:
                    d = await db.get(Device, device_id)
                    if d:
                        if pose := msg.get("pose"):
                            d.last_pose = pose
                        if (vbat := msg.get("vbat")) is not None:
                            d.last_vbat = float(vbat)
                        d.estopped = bool(msg.get("estop", d.estopped))
                        d.last_seen_at = datetime.now(timezone.utc)
                        db.add(d)
                        await db.commit()
    except WebSocketDisconnect:
        pass
    finally:
        if live_links.get(pairing_code) is link:
            live_links.pop(pairing_code, None)
        async with session_factory() as db:
            d = await db.get(Device, device_id)
            if d:
                d.status = "offline"
                d.last_seen_at = datetime.now(timezone.utc)
                db.add(d)
                await db.commit()
