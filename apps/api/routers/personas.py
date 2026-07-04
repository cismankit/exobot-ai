"""Persona CRUD over the identity schema from core's persona_state.py,
plus a live voice preview that runs a real Orchestrator turn."""

import sqlite3

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from auth import current_user
from core_bridge import Orchestrator, PersonaState, TaskType
from db import get_session
from models import Persona, User
from sessions import _ensure_memory_schema, build_user_providers, persona_db_path
from models import ProviderConfig

router = APIRouter()


class IdentityModel(BaseModel):
    """Mirrors packages/core/persona/identity.json."""
    name: str = Field(min_length=1, max_length=60)
    disposition: str = ""
    values: list[str] = []
    voice: str = ""
    hard_rules: list[str] = []
    boot_greeting: str = ""
    version: str = "1.0"


class PersonaIn(BaseModel):
    name: str = Field(min_length=1, max_length=60)
    identity: IdentityModel
    is_default: bool = False


class PersonaOut(BaseModel):
    id: str
    name: str
    identity: IdentityModel
    is_default: bool


class PreviewIn(BaseModel):
    identity: IdentityModel
    stimulus: str = "Introduce yourself in one sentence."


def _out(p: Persona) -> PersonaOut:
    return PersonaOut(id=p.id, name=p.name,
                      identity=IdentityModel(**p.identity_json),
                      is_default=p.is_default)


async def _get_owned(db: AsyncSession, user_id: str, persona_id: str) -> Persona:
    p = (await db.execute(select(Persona).where(
        Persona.id == persona_id, Persona.user_id == user_id
    ))).scalar_one_or_none()
    if p is None:
        raise HTTPException(404, "persona not found")
    return p


@router.get("/personas", response_model=list[PersonaOut])
async def list_personas(user: User = Depends(current_user),
                        db: AsyncSession = Depends(get_session)):
    rows = (await db.execute(
        select(Persona).where(Persona.user_id == user.id)
        .order_by(Persona.is_default.desc(), Persona.created_at)
    )).scalars().all()
    return [_out(p) for p in rows]


@router.post("/personas", response_model=PersonaOut)
async def create_persona(body: PersonaIn,
                         user: User = Depends(current_user),
                         db: AsyncSession = Depends(get_session)):
    if body.is_default:
        await _clear_default(db, user.id)
    p = Persona(user_id=user.id, name=body.name,
                identity_json=body.identity.model_dump(),
                is_default=body.is_default)
    db.add(p)
    await db.commit()
    await db.refresh(p)
    return _out(p)


@router.put("/personas/{persona_id}", response_model=PersonaOut)
async def update_persona(persona_id: str, body: PersonaIn,
                         user: User = Depends(current_user),
                         db: AsyncSession = Depends(get_session)):
    p = await _get_owned(db, user.id, persona_id)
    if body.is_default and not p.is_default:
        await _clear_default(db, user.id)
    p.name = body.name
    p.identity_json = body.identity.model_dump()
    p.is_default = body.is_default
    db.add(p)
    await db.commit()
    return _out(p)


@router.delete("/personas/{persona_id}")
async def delete_persona(persona_id: str,
                         user: User = Depends(current_user),
                         db: AsyncSession = Depends(get_session)):
    p = await _get_owned(db, user.id, persona_id)
    await db.delete(p)
    await db.commit()
    return {"deleted": persona_id}


@router.post("/personas/preview")
async def voice_preview(body: PreviewIn,
                        user: User = Depends(current_user),
                        db: AsyncSession = Depends(get_session)):
    """Run one real orchestrator turn against the draft identity (no body,
    throwaway memory) so editing feels alive before saving."""
    conn = sqlite3.connect(":memory:", check_same_thread=False)
    _ensure_memory_schema(conn)
    persona = PersonaState(body.identity.model_dump(), conn)
    orch = Orchestrator(persona, link=None, config={"providers": ["mock"]})
    cfg_rows = (await db.execute(
        select(ProviderConfig).where(ProviderConfig.user_id == user.id)
    )).scalars().all()
    if cfg_rows:
        orch.providers = build_user_providers(list(cfg_rows), user.id)
    result = await orch.handle(body.stimulus[:500], TaskType.CONVERSATION)
    await orch.drain()
    return result


async def _clear_default(db: AsyncSession, user_id: str):
    rows = (await db.execute(select(Persona).where(
        Persona.user_id == user_id, Persona.is_default == True  # noqa: E712
    ))).scalars().all()
    for r in rows:
        r.is_default = False
        db.add(r)
