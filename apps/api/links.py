"""Body links available to a console session.

LocalSimLink runs the REAL ReflexCore (packages/core/reflex/reflex_sim.py)
in-process behind the core's own Link interface. It is not a reimplementation:
every message goes through ReflexCore.handle(), the same code path the zmq
simulator and the test suite exercise. The web layer never re-decides safety.

DeviceRelayLink forwards the same NDJSON protocol to a paired device that is
connected over the device WebSocket (a real MCU behind a serial bridge, or
an emulated one).
"""

import asyncio
import json

from core_bridge import Link, ReflexCore, ZmqLink, make_link  # noqa: F401
import settings


class LocalSimLink(Link):
    """In-process body: ReflexCore + a 5 Hz heartbeat so the watchdog
    semantics stay identical to the wire version."""

    def __init__(self):
        super().__init__()
        self.reflex = ReflexCore()
        self._lock = asyncio.Lock()

    async def connect(self) -> bool:
        self.connected = True
        return True

    async def send_intent(self, intent_wire: dict, timeout_s: float = 2.0) -> dict:
        self.seq += 1
        async with self._lock:
            return self.reflex.handle({"t": "intent", **intent_wire, "seq": self.seq})

    async def estop(self) -> dict:
        async with self._lock:
            return self.reflex.handle({"t": "estop"})

    async def heartbeat(self) -> dict:
        async with self._lock:
            return self.reflex.handle({"t": "hb"})

    async def heartbeat_loop(self):
        while True:
            await self.heartbeat()
            await asyncio.sleep(0.2)

    # Link ABC plumbing — unused because send_intent is overridden.
    async def _send_line(self, line: str) -> None:  # pragma: no cover
        pass

    async def _recv_line(self, timeout_s: float) -> str | None:  # pragma: no cover
        return None


class DeviceRelayLink(Link):
    """Relays intents to a device WebSocket (see routers/devices.py).
    The device side speaks the same NDJSON protocol as the serial wire."""

    def __init__(self, device_ws):
        super().__init__()
        self._ws = device_ws
        self.connected = True
        self._pending: asyncio.Queue = asyncio.Queue()

    async def connect(self) -> bool:
        return self.connected

    async def _send_line(self, line: str) -> None:
        await self._ws.send_text(line)

    async def _recv_line(self, timeout_s: float) -> str | None:
        try:
            return await asyncio.wait_for(self._pending.get(), timeout=timeout_s)
        except asyncio.TimeoutError:
            return None

    def feed(self, raw: str) -> None:
        """Called by the device WS receive loop with each ack line."""
        self._pending.put_nowait(raw)

    async def estop(self) -> None:
        await self._send_line(json.dumps({"t": "estop"}))
        # consume the ack so the queue stays aligned
        await self._recv_line(2.0)


def build_session_link() -> Link:
    """Default body for a console session, from env: in-process sim (default)
    or a zmq reflex_sim service (docker-compose demo pool)."""
    if settings.LINK_KIND == "zmq":
        return ZmqLink(settings.REFLEX_ENDPOINT)
    return LocalSimLink()
