"""Database tables (§6 of the platform spec) — SQLModel over Postgres or SQLite.

Persona facts/episodes intentionally live in core's per-persona SQLite
(PersonaState) — one source of memory truth; the API reads them through
PersonaState rather than mirroring rows here.
"""

import uuid
from datetime import datetime, timezone

from sqlalchemy import Column, JSON, UniqueConstraint
from sqlmodel import Field, SQLModel


def _id() -> str:
    return uuid.uuid4().hex


def _now() -> datetime:
    return datetime.now(timezone.utc)


class User(SQLModel, table=True):
    __tablename__ = "users"
    id: str = Field(default_factory=_id, primary_key=True)
    email: str = Field(index=True, unique=True)
    clerk_id: str | None = Field(default=None, index=True)
    created_at: datetime = Field(default_factory=_now)


class WaitlistEntry(SQLModel, table=True):
    __tablename__ = "waitlist"
    id: str = Field(default_factory=_id, primary_key=True)
    email: str = Field(index=True, unique=True)
    position: int
    referred_by: str | None = None
    created_at: datetime = Field(default_factory=_now)


class Order(SQLModel, table=True):
    __tablename__ = "orders"
    id: str = Field(default_factory=_id, primary_key=True)
    user_id: str | None = Field(default=None, index=True)
    email: str = Field(index=True)
    stripe_session_id: str = Field(index=True)
    status: str = "pending"  # pending | paid | canceled
    tier: str = "devkit"
    created_at: datetime = Field(default_factory=_now)


class ProviderConfig(SQLModel, table=True):
    __tablename__ = "provider_configs"
    __table_args__ = (UniqueConstraint("user_id", "provider"),)
    id: str = Field(default_factory=_id, primary_key=True)
    user_id: str = Field(index=True)
    provider: str  # claude | openai | glm | deepseek | ollama | mock
    enabled: bool = True
    key_ciphertext: str | None = None
    model_id: str | None = None
    updated_at: datetime = Field(default_factory=_now)


class Persona(SQLModel, table=True):
    __tablename__ = "personas"
    id: str = Field(default_factory=_id, primary_key=True)
    user_id: str = Field(index=True)
    name: str
    identity_json: dict = Field(sa_column=Column(JSON))
    is_default: bool = False
    created_at: datetime = Field(default_factory=_now)


class RouteConfig(SQLModel, table=True):
    """Per-user routing priority per task type (drag-to-reorder in Minds)."""
    __tablename__ = "route_configs"
    __table_args__ = (UniqueConstraint("user_id", "task_type"),)
    id: str = Field(default_factory=_id, primary_key=True)
    user_id: str = Field(index=True)
    task_type: str
    providers: list = Field(sa_column=Column(JSON))  # priority order
    updated_at: datetime = Field(default_factory=_now)


class Device(SQLModel, table=True):
    __tablename__ = "devices"
    id: str = Field(default_factory=_id, primary_key=True)
    user_id: str = Field(index=True)
    name: str
    pairing_code: str = Field(index=True)
    status: str = "pairing"  # pairing | online | offline
    fw_version: str | None = None
    last_pose: dict | None = Field(default=None, sa_column=Column(JSON))
    last_vbat: float | None = None
    estopped: bool = False
    last_seen_at: datetime | None = None
    created_at: datetime = Field(default_factory=_now)
