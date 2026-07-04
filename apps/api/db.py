"""Async engine + session dependency. create_all on startup keeps local dev
zero-step; Alembic (infra/alembic) owns schema changes in deployed envs."""

from collections.abc import AsyncIterator

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlmodel import SQLModel

import settings

engine = create_async_engine(settings.DATABASE_URL, echo=False, future=True)
session_factory = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


async def init_db() -> None:
    import models  # noqa: F401 — register tables

    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)


async def get_session() -> AsyncIterator[AsyncSession]:
    async with session_factory() as session:
        yield session
