"""Console sessions — one Orchestrator + one body per live session.

Anonymous (landing demo): mock provider + in-process ReflexCore sim,
memory in a throwaway sqlite. Authenticated: the user's enabled providers
(BYOK keys decrypted into per-user env aliases so core's provider code
runs unchanged), their routing table, their default persona, and either
the sim or a paired device relay as the body.
"""

import asyncio
import json
import os
import time
import uuid

from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

import settings
from core_bridge import (
    DEFAULT_IDENTITY_PATH,
    DEFAULT_ROUTES,
    Orchestrator,
    PersonaState,
    PROVIDER_REGISTRY,
    TaskType,
)
from crypto import decrypt_key
from links import DeviceRelayLink, LocalSimLink, build_session_link
from mock_ext import PlatformMockProvider, install_platform_mock
from models import Persona, ProviderConfig, RouteConfig


def persona_db_path(persona_id: str) -> str:
    return str(settings.DATA_DIR / f"persona_{persona_id}.db")


def load_default_identity() -> dict:
    return json.loads(DEFAULT_IDENTITY_PATH.read_text())


def build_user_providers(configs: list[ProviderConfig], user_id: str) -> dict:
    """Instantiate core provider classes with per-user keys, without
    modifying core: env_key/model_id are overridden per instance and the
    decrypted key is exposed under a user-scoped env alias."""
    providers: dict = {}
    for cfg in configs:
        if not cfg.enabled or cfg.provider not in PROVIDER_REGISTRY:
            continue
        p = PROVIDER_REGISTRY[cfg.provider]()
        if cfg.key_ciphertext and p.env_key:
            plaintext = decrypt_key(cfg.key_ciphertext)
            if plaintext:
                alias = f"{p.env_key}__{user_id}"
                os.environ[alias] = plaintext
                p.env_key = alias
        if cfg.model_id:
            p.model_id = cfg.model_id
        providers[cfg.provider] = p
    providers["mock"] = PlatformMockProvider()
    return providers


def build_user_routes(rows: list[RouteConfig]) -> dict:
    routes = {t: list(chain) for t, chain in DEFAULT_ROUTES.items()}
    for row in rows:
        try:
            routes[TaskType(row.task_type)] = list(row.providers)
        except ValueError:
            continue
    # mock is the terminal fallback everywhere — degrade, never die
    for chain in routes.values():
        if "mock" not in chain:
            chain.append("mock")
    return routes


class ConsoleSession:
    def __init__(self, session_id: str, user_id: str | None,
                 orchestrator: Orchestrator, link, link_label: str,
                 persona_name: str):
        self.session_id = session_id
        self.user_id = user_id
        self.orchestrator = orchestrator
        self.link = link
        self.link_label = link_label
        self.persona_name = persona_name
        self.default_task = TaskType.CONVERSATION
        self.last_active = time.monotonic()
        self._hb_task: asyncio.Task | None = None
        self._lock = asyncio.Lock()

    def touch(self):
        self.last_active = time.monotonic()

    def consulted(self, task_type: TaskType) -> list[str]:
        """Which minds will be consulted for this stimulus — consensus fans
        out to every available backend; routed tasks walk the chain."""
        orch = self.orchestrator
        chain = orch.routes.get(task_type, [])
        if task_type == TaskType.CONSENSUS:
            return [n for n in chain
                    if n in orch.providers and orch.providers[n].available()]
        first = next((n for n in chain
                      if n in orch.providers and orch.providers[n].available()),
                     None)
        return [first] if first else []

    async def handle(self, stimulus: str, task_type: TaskType | None = None) -> dict:
        self.touch()
        async with self._lock:
            return await self.orchestrator.handle(
                stimulus, task_type or self.default_task)

    async def estop(self) -> dict:
        """Route estop as an intent so every link kind (sim, zmq, device
        relay) takes the same protocol path and returns a real ack."""
        self.touch()
        return await self.link.send_intent(
            {"action": "estop", "params": {}, "src": "console", "conf": 1.0})

    async def poll_pose(self) -> dict | None:
        if isinstance(self.link, LocalSimLink):
            return await self.link.heartbeat()
        return None

    def start_heartbeat(self):
        if self._hb_task is None and isinstance(self.link, LocalSimLink):
            self._hb_task = asyncio.create_task(self.link.heartbeat_loop())

    async def close(self):
        if self._hb_task:
            self._hb_task.cancel()
        await self.orchestrator.drain()


class SessionManager:
    def __init__(self):
        self.sessions: dict[str, ConsoleSession] = {}
        self._lock = asyncio.Lock()

    async def get(self, session_id: str) -> ConsoleSession | None:
        return self.sessions.get(session_id)

    async def create_anonymous(self, session_id: str | None = None) -> ConsoleSession:
        anon_count = sum(1 for s in self.sessions.values() if s.user_id is None)
        if anon_count >= settings.MAX_ANON_SESSIONS:
            await self.reap(max_idle_s=60)
        sid = session_id or uuid.uuid4().hex
        persona = PersonaState(load_default_identity(), _memdb())
        link = build_session_link()
        await link.connect()
        orch = Orchestrator(persona, link, {"providers": ["mock"]})
        install_platform_mock(orch)
        sess = ConsoleSession(sid, None, orch, link, "sim", persona.identity["name"])
        sess.start_heartbeat()
        async with self._lock:
            self.sessions[sid] = sess
        return sess

    async def create_for_user(self, db: AsyncSession, user_id: str,
                              session_id: str | None = None,
                              device_link: DeviceRelayLink | None = None) -> ConsoleSession:
        sid = session_id or uuid.uuid4().hex

        persona_row = (await db.execute(
            select(Persona).where(Persona.user_id == user_id)
            .order_by(Persona.is_default.desc(), Persona.created_at)
        )).scalars().first()
        identity = persona_row.identity_json if persona_row else load_default_identity()
        mem_path = persona_db_path(persona_row.id) if persona_row \
            else str(settings.DATA_DIR / f"user_{user_id}.db")
        import sqlite3
        conn = sqlite3.connect(mem_path, check_same_thread=False)
        _ensure_memory_schema(conn)
        persona = PersonaState(identity, conn)

        cfg_rows = (await db.execute(
            select(ProviderConfig).where(ProviderConfig.user_id == user_id)
        )).scalars().all()
        route_rows = (await db.execute(
            select(RouteConfig).where(RouteConfig.user_id == user_id)
        )).scalars().all()

        link = device_link or build_session_link()
        await link.connect()
        orch = Orchestrator(persona, link, {"providers": ["mock"]})
        install_platform_mock(orch)
        if cfg_rows:
            orch.providers = build_user_providers(list(cfg_rows), user_id)
        orch.routes = build_user_routes(list(route_rows))

        label = "device" if device_link else "sim"
        sess = ConsoleSession(sid, user_id, orch, link, label,
                              identity.get("name", "Exo"))
        sess.start_heartbeat()
        async with self._lock:
            self.sessions[sid] = sess
        return sess

    async def reap(self, max_idle_s: int | None = None):
        ttl = max_idle_s or settings.SESSION_IDLE_TTL_S
        now = time.monotonic()
        stale = [sid for sid, s in self.sessions.items()
                 if now - s.last_active > ttl]
        for sid in stale:
            sess = self.sessions.pop(sid, None)
            if sess:
                await sess.close()

    async def reaper_loop(self):
        while True:
            await asyncio.sleep(60)
            await self.reap()


def _memdb():
    import sqlite3

    conn = sqlite3.connect(":memory:", check_same_thread=False)
    _ensure_memory_schema(conn)
    return conn


def _ensure_memory_schema(conn):
    conn.execute("""CREATE TABLE IF NOT EXISTS episodes (
        ts REAL, stimulus TEXT, response TEXT, model TEXT)""")
    conn.execute("""CREATE TABLE IF NOT EXISTS facts (
        key TEXT PRIMARY KEY, value TEXT, updated REAL)""")
    conn.commit()


manager = SessionManager()
