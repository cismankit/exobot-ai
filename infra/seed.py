#!/usr/bin/env python3
"""Seed the platform DB with a demo persona + waitlist rows.

    .venv/bin/python infra/seed.py

Idempotent: safe to re-run.
"""

import asyncio
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "apps" / "api"))

import core_bridge  # noqa: F401,E402 — core sys.path setup
from sqlmodel import select  # noqa: E402

from db import init_db, session_factory  # noqa: E402
from models import Persona, User, WaitlistEntry  # noqa: E402
from sessions import load_default_identity  # noqa: E402


async def main():
    await init_db()
    async with session_factory() as db:
        user = (await db.execute(
            select(User).where(User.email == "dev@exobod.local")
        )).scalar_one_or_none()
        if user is None:
            user = User(email="dev@exobod.local")
            db.add(user)
            await db.commit()
            await db.refresh(user)

        existing = (await db.execute(
            select(Persona).where(Persona.user_id == user.id)
        )).scalars().first()
        if existing is None:
            db.add(Persona(user_id=user.id, name="Exo",
                           identity_json=load_default_identity(),
                           is_default=True))

        count = len((await db.execute(select(WaitlistEntry))).scalars().all())
        if count == 0:
            for i, email in enumerate(
                ["first@exobod.ai", "second@exobod.ai", "third@exobod.ai"], 1
            ):
                db.add(WaitlistEntry(email=email, position=i))
        await db.commit()
    print("seeded: dev user, default persona 'Exo', 3 waitlist rows")


if __name__ == "__main__":
    asyncio.run(main())
