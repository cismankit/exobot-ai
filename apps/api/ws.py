"""/ws/console/{session_id} — the live control channel.

Client → server : {type:"stimulus", text, task_type?}
                  {type:"estop"}
                  {type:"set_task", task_type}
Server → client : {type:"hello", session_id, link, persona, pose}
                  {type:"thinking", providers:[...]}
                  {type:"answer", model, latency_ms, speech, intents, body_acks}
                  {type:"pose", pan, tilt, estop, vbat}
                  {type:"error", detail}

The answer payload is the Orchestrator.handle() result VERBATIM — the
safety fields (body_acks reasons, clamps, estop) are never reshaped here.
"""

import json

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from core_bridge import TaskType
from db import session_factory
from auth import ws_user
from sessions import manager

router = APIRouter()

MAX_STIMULUS_LEN = 2000


def _pose_msg(ack: dict) -> dict | None:
    pose = ack.get("pose")
    if not pose:
        return None
    return {
        "type": "pose",
        "pan": pose.get("pan", 0.0),
        "tilt": pose.get("tilt", 0.0),
        "estop": ack.get("estop", False),
        "vbat": ack.get("vbat"),
    }


@router.websocket("/ws/console/{session_id}")
async def console_ws(websocket: WebSocket, session_id: str):
    await websocket.accept()

    async with session_factory() as db:
        user = await ws_user(websocket, db)
        sess = await manager.get(session_id)
        if sess is not None and sess.user_id is not None and (
            user is None or user.id != sess.user_id
        ):
            await websocket.close(code=4403, reason="not your session")
            return
        if sess is None:
            if user is not None:
                sess = await manager.create_for_user(db, user.id, session_id)
            else:
                sess = await manager.create_anonymous(session_id)

    hello_pose = await sess.poll_pose()
    await websocket.send_json({
        "type": "hello",
        "session_id": sess.session_id,
        "link": sess.link_label,
        "persona": sess.persona_name,
        "providers": sorted(
            n for n, p in sess.orchestrator.providers.items() if p.available()
        ),
        "pose": (_pose_msg(hello_pose) if hello_pose else None),
    })

    try:
        while True:
            raw = await websocket.receive_text()
            try:
                msg = json.loads(raw)
            except json.JSONDecodeError:
                await websocket.send_json({"type": "error", "detail": "bad json"})
                continue

            mtype = msg.get("type")

            if mtype == "estop":
                ack = await sess.estop()
                pose = _pose_msg(ack)
                if pose:
                    await websocket.send_json(pose)
                await websocket.send_json({
                    "type": "answer", "model": "reflex", "latency_ms": 0,
                    "speech": "Emergency stop. Motion locked until the "
                              "physical button resets it.",
                    "intents": [{"action": "estop", "params": {},
                                 "src": "console", "conf": 1.0}],
                    "body_acks": [ack],
                })
                continue

            if mtype == "set_task":
                try:
                    sess.default_task = TaskType(msg.get("task_type", "conversation"))
                    await websocket.send_json({
                        "type": "task_set", "task_type": sess.default_task.value})
                except ValueError:
                    await websocket.send_json(
                        {"type": "error", "detail": "unknown task_type"})
                continue

            if mtype == "stimulus":
                text = (msg.get("text") or "").strip()
                if not text:
                    await websocket.send_json(
                        {"type": "error", "detail": "empty stimulus"})
                    continue
                text = text[:MAX_STIMULUS_LEN]
                try:
                    task = TaskType(msg["task_type"]) if msg.get("task_type") \
                        else sess.default_task
                except ValueError:
                    task = sess.default_task

                await websocket.send_json({
                    "type": "thinking",
                    "task_type": task.value,
                    "providers": sess.consulted(task),
                })
                try:
                    result = await sess.handle(text, task)
                except Exception as e:  # noqa: BLE001 — degrade, never die
                    await websocket.send_json(
                        {"type": "error", "detail": f"orchestrator: {type(e).__name__}"})
                    continue

                await websocket.send_json({"type": "answer", **result})
                for ack in result.get("body_acks", []):
                    pose = _pose_msg(ack)
                    if pose:
                        await websocket.send_json(pose)
                continue

            await websocket.send_json(
                {"type": "error", "detail": f"unknown message type {mtype!r}"})

    except WebSocketDisconnect:
        pass
