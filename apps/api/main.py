"""Exobod platform API — wraps packages/core, never reimplements it.

Run locally:  ../../.venv/bin/uvicorn main:app --reload --port 8000
Docker:       see infra/docker-compose.yml
"""

import asyncio
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import core_bridge  # noqa: F401 — must import first (sys.path for core)
import settings
from db import init_db
from sessions import manager

import ws
from routers import devices, health, me, memory, personas, preorder, providers, waitlist


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    reaper = asyncio.create_task(manager.reaper_loop())
    yield
    reaper.cancel()
    for sess in list(manager.sessions.values()):
        await sess.close()


app = FastAPI(
    title="Exobod API",
    version="1.0.0",
    description="Control plane for Exobod — phone-as-brain, frame-as-body. "
                "Wraps the exobod-core orchestrator; safety decisions live "
                "in ReflexCore/firmware only.",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, tags=["health"])
app.include_router(waitlist.router, tags=["waitlist"])
app.include_router(preorder.router, tags=["preorder"])
app.include_router(me.router, tags=["me"])
app.include_router(providers.router, tags=["providers"])
app.include_router(personas.router, tags=["personas"])
app.include_router(memory.router, tags=["memory"])
app.include_router(devices.router, tags=["devices"])
app.include_router(ws.router)
