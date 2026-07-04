"""BYOK — bring your own minds. Keys are Fernet-encrypted at rest and only
ever leave the server masked. Availability tests instantiate the REAL core
provider class against the stored key."""

import asyncio
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from auth import current_user
from core_bridge import DEFAULT_ROUTES, PROVIDER_REGISTRY, TaskType
from crypto import decrypt_key, encrypt_key, mask_key
from db import get_session
from models import ProviderConfig, RouteConfig, User
from sessions import build_user_providers

router = APIRouter()

KEYLESS_PROVIDERS = {"ollama", "mock"}


class ProviderOut(BaseModel):
    provider: str
    enabled: bool
    has_key: bool
    key_masked: str | None
    model_id: str | None
    needs_key: bool


class ProviderIn(BaseModel):
    provider: str
    enabled: bool = True
    api_key: str | None = None  # write-only
    model_id: str | None = None
    clear_key: bool = False


class RoutesOut(BaseModel):
    routes: dict[str, list[str]]


class RoutesIn(BaseModel):
    routes: dict[str, list[str]]


def _to_out(cfg: ProviderConfig) -> ProviderOut:
    plaintext = decrypt_key(cfg.key_ciphertext) if cfg.key_ciphertext else None
    return ProviderOut(
        provider=cfg.provider, enabled=cfg.enabled,
        has_key=bool(plaintext),
        key_masked=mask_key(plaintext) if plaintext else None,
        model_id=cfg.model_id,
        needs_key=cfg.provider not in KEYLESS_PROVIDERS,
    )


@router.get("/me/providers", response_model=list[ProviderOut])
async def list_providers(user: User = Depends(current_user),
                         db: AsyncSession = Depends(get_session)):
    rows = {c.provider: c for c in (await db.execute(
        select(ProviderConfig).where(ProviderConfig.user_id == user.id)
    )).scalars().all()}
    out = []
    for name in PROVIDER_REGISTRY:
        cfg = rows.get(name) or ProviderConfig(
            user_id=user.id, provider=name,
            enabled=name in KEYLESS_PROVIDERS)
        out.append(_to_out(cfg))
    return out


@router.put("/me/providers", response_model=list[ProviderOut])
async def upsert_provider(body: ProviderIn,
                          user: User = Depends(current_user),
                          db: AsyncSession = Depends(get_session)):
    if body.provider not in PROVIDER_REGISTRY:
        raise HTTPException(400, f"unknown provider {body.provider!r}")
    cfg = (await db.execute(
        select(ProviderConfig).where(
            ProviderConfig.user_id == user.id,
            ProviderConfig.provider == body.provider)
    )).scalar_one_or_none()
    if cfg is None:
        cfg = ProviderConfig(user_id=user.id, provider=body.provider)
    cfg.enabled = body.enabled
    if body.clear_key:
        cfg.key_ciphertext = None
    elif body.api_key:
        cfg.key_ciphertext = encrypt_key(body.api_key.strip())
    if body.model_id is not None:
        cfg.model_id = body.model_id or None
    cfg.updated_at = datetime.now(timezone.utc)
    db.add(cfg)
    await db.commit()
    return await list_providers(user, db)


@router.post("/me/providers/{provider}/test")
async def test_provider(provider: str,
                        user: User = Depends(current_user),
                        db: AsyncSession = Depends(get_session)):
    """Ping availability using the real core provider class + stored key."""
    if provider not in PROVIDER_REGISTRY:
        raise HTTPException(400, f"unknown provider {provider!r}")
    rows = (await db.execute(
        select(ProviderConfig).where(ProviderConfig.user_id == user.id)
    )).scalars().all()
    providers = build_user_providers(list(rows), user.id)
    p = providers.get(provider) or PROVIDER_REGISTRY[provider]()
    available = await asyncio.to_thread(p.available)
    return {"provider": provider, "available": available}


@router.get("/me/routes", response_model=RoutesOut)
async def get_routes(user: User = Depends(current_user),
                     db: AsyncSession = Depends(get_session)):
    rows = (await db.execute(
        select(RouteConfig).where(RouteConfig.user_id == user.id)
    )).scalars().all()
    routes = {t.value: list(chain) for t, chain in DEFAULT_ROUTES.items()}
    for row in rows:
        routes[row.task_type] = list(row.providers)
    return RoutesOut(routes=routes)


@router.put("/me/routes", response_model=RoutesOut)
async def put_routes(body: RoutesIn,
                     user: User = Depends(current_user),
                     db: AsyncSession = Depends(get_session)):
    valid_tasks = {t.value for t in TaskType}
    for task, chain in body.routes.items():
        if task not in valid_tasks:
            raise HTTPException(400, f"unknown task type {task!r}")
        bad = [p for p in chain if p not in PROVIDER_REGISTRY]
        if bad:
            raise HTTPException(400, f"unknown providers {bad}")
        row = (await db.execute(
            select(RouteConfig).where(RouteConfig.user_id == user.id,
                                      RouteConfig.task_type == task)
        )).scalar_one_or_none()
        if row is None:
            row = RouteConfig(user_id=user.id, task_type=task, providers=chain)
        else:
            row.providers = chain
        row.updated_at = datetime.now(timezone.utc)
        db.add(row)
    await db.commit()
    return await get_routes(user, db)
