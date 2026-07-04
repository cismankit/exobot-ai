"""Auth — Clerk JWT when configured, deterministic dev user otherwise.

Clerk mode: verify the session JWT against Clerk's JWKS (cached), then
upsert the user row by clerk_id. Dev mode (no CLERK_JWKS_URL): a fixed
local user, so the console is fully usable with zero keys — the same
degrade-never-die law the core follows.
"""

import time

import httpx
from fastapi import Depends, HTTPException, Request, WebSocket
from jose import jwt
from jose.exceptions import JWTError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

import settings
from db import get_session
from models import User

DEV_USER_EMAIL = "dev@exobod.local"

_jwks_cache: dict = {"keys": None, "fetched": 0.0}
_JWKS_TTL = 3600.0


async def _jwks() -> dict:
    now = time.monotonic()
    if _jwks_cache["keys"] and now - _jwks_cache["fetched"] < _JWKS_TTL:
        return _jwks_cache["keys"]
    async with httpx.AsyncClient(timeout=5.0) as client:
        r = await client.get(settings.CLERK_JWKS_URL)
        r.raise_for_status()
    _jwks_cache.update(keys=r.json(), fetched=now)
    return _jwks_cache["keys"]


async def _verify_clerk_token(token: str) -> dict:
    try:
        keys = await _jwks()
        header = jwt.get_unverified_header(token)
        key = next(k for k in keys["keys"] if k["kid"] == header["kid"])
        claims = jwt.decode(
            token, key, algorithms=[header.get("alg", "RS256")],
            issuer=settings.CLERK_ISSUER or None,
            options={"verify_aud": False},
        )
        return claims
    except (JWTError, StopIteration, httpx.HTTPError) as e:
        raise HTTPException(401, f"invalid token: {type(e).__name__}")


async def _upsert_user(db: AsyncSession, *, clerk_id: str | None, email: str) -> User:
    q = select(User).where(User.clerk_id == clerk_id) if clerk_id else \
        select(User).where(User.email == email)
    user = (await db.execute(q)).scalar_one_or_none()
    if user is None:
        user = User(email=email, clerk_id=clerk_id)
        db.add(user)
        await db.commit()
        await db.refresh(user)
    return user


async def _resolve(token: str | None, db: AsyncSession) -> User:
    if settings.DEV_AUTH:
        return await _upsert_user(db, clerk_id=None, email=DEV_USER_EMAIL)
    if not token:
        raise HTTPException(401, "missing bearer token")
    claims = await _verify_clerk_token(token)
    email = claims.get("email") or f"{claims['sub']}@clerk.local"
    return await _upsert_user(db, clerk_id=claims["sub"], email=email)


async def current_user(
    request: Request, db: AsyncSession = Depends(get_session)
) -> User:
    authz = request.headers.get("authorization", "")
    token = authz.removeprefix("Bearer ").strip() if authz else None
    return await _resolve(token, db)


async def ws_user(websocket: WebSocket, db: AsyncSession) -> User | None:
    """Best-effort auth for WebSocket connects (token query param).
    Returns None for anonymous demo sessions."""
    token = websocket.query_params.get("token")
    if settings.DEV_AUTH and websocket.query_params.get("auth") == "dev":
        return await _upsert_user(db, clerk_id=None, email=DEV_USER_EMAIL)
    if not token:
        return None
    try:
        claims = await _verify_clerk_token(token)
    except HTTPException:
        return None
    email = claims.get("email") or f"{claims['sub']}@clerk.local"
    return await _upsert_user(db, clerk_id=claims["sub"], email=email)
