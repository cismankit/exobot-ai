"""Memory browser — reads facts/episodes straight from the persona's own
sqlite (core's PersonaState schema). One source of memory truth."""

import sqlite3
from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException

from auth import current_user
from db import get_session
from models import User
from routers.personas import _get_owned
from sessions import persona_db_path
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter()


def _conn(persona_id: str) -> sqlite3.Connection | None:
    path = Path(persona_db_path(persona_id))
    if not path.exists():
        return None
    return sqlite3.connect(path, check_same_thread=False)


@router.get("/personas/{persona_id}/facts")
async def list_facts(persona_id: str, q: str | None = None,
                     user: User = Depends(current_user),
                     db: AsyncSession = Depends(get_session)):
    await _get_owned(db, user.id, persona_id)
    conn = _conn(persona_id)
    if conn is None:
        return {"facts": []}
    if q:
        rows = conn.execute(
            "SELECT key, value, updated FROM facts "
            "WHERE key LIKE ? OR value LIKE ? ORDER BY updated DESC",
            (f"%{q}%", f"%{q}%")).fetchall()
    else:
        rows = conn.execute(
            "SELECT key, value, updated FROM facts ORDER BY updated DESC"
        ).fetchall()
    conn.close()
    return {"facts": [{"key": k, "value": v, "updated": u} for k, v, u in rows]}


@router.delete("/personas/{persona_id}/facts/{key}")
async def delete_fact(persona_id: str, key: str,
                      user: User = Depends(current_user),
                      db: AsyncSession = Depends(get_session)):
    await _get_owned(db, user.id, persona_id)
    conn = _conn(persona_id)
    if conn is None:
        raise HTTPException(404, "no memory yet")
    cur = conn.execute("DELETE FROM facts WHERE key = ?", (key,))
    conn.commit()
    conn.close()
    if cur.rowcount == 0:
        raise HTTPException(404, "fact not found")
    return {"deleted": key}


@router.get("/personas/{persona_id}/episodes")
async def list_episodes(persona_id: str, limit: int = 50, q: str | None = None,
                        user: User = Depends(current_user),
                        db: AsyncSession = Depends(get_session)):
    await _get_owned(db, user.id, persona_id)
    conn = _conn(persona_id)
    if conn is None:
        return {"episodes": []}
    limit = max(1, min(limit, 500))
    if q:
        rows = conn.execute(
            "SELECT ts, stimulus, response, model FROM episodes "
            "WHERE stimulus LIKE ? OR response LIKE ? "
            "ORDER BY ts DESC LIMIT ?", (f"%{q}%", f"%{q}%", limit)).fetchall()
    else:
        rows = conn.execute(
            "SELECT ts, stimulus, response, model FROM episodes "
            "ORDER BY ts DESC LIMIT ?", (limit,)).fetchall()
    conn.close()
    return {"episodes": [
        {"ts": ts, "stimulus": s, "response": r, "model": m}
        for ts, s, r, m in rows]}
