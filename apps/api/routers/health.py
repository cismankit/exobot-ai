import time

from fastapi import APIRouter

import settings

router = APIRouter()
_started = time.monotonic()


@router.get("/health")
async def health():
    return {
        "ok": True,
        "uptime_s": int(time.monotonic() - _started),
        "link_kind": settings.LINK_KIND,
        "dev_auth": settings.DEV_AUTH,
    }
