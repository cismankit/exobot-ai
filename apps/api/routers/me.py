from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from auth import current_user
from db import get_session
from models import Device, Order, Persona, User

router = APIRouter()


class MeOut(BaseModel):
    id: str
    email: str
    persona_count: int
    device_count: int
    orders: list[dict]


@router.get("/me", response_model=MeOut)
async def me(user: User = Depends(current_user),
             db: AsyncSession = Depends(get_session)):
    personas = (await db.execute(
        select(Persona).where(Persona.user_id == user.id))).scalars().all()
    devices = (await db.execute(
        select(Device).where(Device.user_id == user.id))).scalars().all()
    orders = (await db.execute(
        select(Order).where(Order.email == user.email))).scalars().all()
    return MeOut(
        id=user.id, email=user.email,
        persona_count=len(personas), device_count=len(devices),
        orders=[{"id": o.id, "status": o.status, "tier": o.tier,
                 "created_at": o.created_at.isoformat()} for o in orders],
    )
