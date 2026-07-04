from fastapi import APIRouter, Depends
from pydantic import BaseModel, EmailStr
from sqlalchemy import func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from db import get_session
from models import WaitlistEntry

router = APIRouter()


class WaitlistIn(BaseModel):
    email: EmailStr
    referred_by: str | None = None


class WaitlistOut(BaseModel):
    position: int
    already_joined: bool = False


@router.post("/waitlist", response_model=WaitlistOut)
async def join_waitlist(body: WaitlistIn, db: AsyncSession = Depends(get_session)):
    email = body.email.lower().strip()
    existing = (await db.execute(
        select(WaitlistEntry).where(WaitlistEntry.email == email)
    )).scalar_one_or_none()
    if existing:
        return WaitlistOut(position=existing.position, already_joined=True)

    count = (await db.execute(
        select(func.count()).select_from(WaitlistEntry))).scalar_one()
    entry = WaitlistEntry(email=email, position=count + 1,
                          referred_by=body.referred_by)
    db.add(entry)
    await db.commit()
    return WaitlistOut(position=entry.position)
