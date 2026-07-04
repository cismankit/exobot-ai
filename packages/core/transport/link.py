"""
Transport — how the brain talks to the body.

One wire protocol, two carriers:
  ZmqLink    : local simulation / development (reflex simulator process)
  SerialLink : real Exobod MCU over USB-CDC or a BLE-UART bridge

Protocol (newline-delimited JSON — human-debuggable with a serial monitor):
  brain -> body : {"t":"intent","action":"gaze","params":{...},"seq":N}
                  {"t":"hb","seq":N}                     (heartbeat, 5 Hz)
                  {"t":"estop"}
  body -> brain : {"t":"ack","seq":N,"executed":true,"reason":"ok",
                   "pose":{"pan":..,"tilt":..},"vbat":..}
                  {"t":"telemetry", ...}

Safety contract mirrored in firmware: if the MCU sees no heartbeat for
HEARTBEAT_TIMEOUT_MS it neutralizes all motion. The brain being smart
never matters more than the body being safe.
"""

import asyncio
import json
import time
from abc import ABC, abstractmethod

HEARTBEAT_HZ = 5


class Link(ABC):
    def __init__(self):
        self.seq = 0
        self.connected = False

    @abstractmethod
    async def connect(self) -> bool: ...
    @abstractmethod
    async def _send_line(self, line: str) -> None: ...
    @abstractmethod
    async def _recv_line(self, timeout_s: float) -> str | None: ...

    async def send_intent(self, intent_wire: dict,
                          timeout_s: float = 2.0) -> dict:
        self.seq += 1
        msg = {"t": "intent", **intent_wire, "seq": self.seq}
        await self._send_line(json.dumps(msg))
        raw = await self._recv_line(timeout_s)
        if raw is None:
            return {"t": "ack", "executed": False, "reason": "link timeout",
                    "seq": self.seq}
        try:
            return json.loads(raw)
        except json.JSONDecodeError:
            return {"t": "ack", "executed": False,
                    "reason": f"garbled ack: {raw[:80]}", "seq": self.seq}

    async def estop(self) -> None:
        await self._send_line(json.dumps({"t": "estop"}))

    async def heartbeat_loop(self):
        while True:
            try:
                await self._send_line(json.dumps({"t": "hb", "ts": time.time()}))
            except Exception:
                self.connected = False
            await asyncio.sleep(1 / HEARTBEAT_HZ)


class ZmqLink(Link):
    """Talks to reflex/reflex_sim.py over tcp — the development body."""
    def __init__(self, endpoint: str = "tcp://127.0.0.1:5555"):
        super().__init__()
        self.endpoint = endpoint
        self._sock = None

    async def connect(self) -> bool:
        import zmq
        import zmq.asyncio
        ctx = zmq.asyncio.Context.instance()
        self._sock = ctx.socket(zmq.REQ)
        self._sock.setsockopt(zmq.LINGER, 0)
        self._sock.setsockopt(zmq.RCVTIMEO, 2000)
        self._sock.connect(self.endpoint)
        # probe
        try:
            await self._send_line(json.dumps({"t": "hb", "ts": time.time()}))
            pong = await self._recv_line(2.0)
            self.connected = pong is not None
        except Exception:
            self.connected = False
        return self.connected

    async def _send_line(self, line: str) -> None:
        await self._sock.send_string(line)

    async def _recv_line(self, timeout_s: float) -> str | None:
        import zmq
        try:
            return await asyncio.wait_for(self._sock.recv_string(),
                                          timeout=timeout_s)
        except (asyncio.TimeoutError, zmq.error.Again):
            return None

    async def heartbeat_loop(self):
        # REQ/REP is strictly alternating; heartbeats are sent inline by
        # send_intent traffic in sim mode. Real pub/sub or serial carriers
        # run the base-class loop.
        while True:
            await asyncio.sleep(3600)


class SerialLink(Link):
    """Real MCU over pyserial (USB-CDC on ESP32-S3, or HC-05/BLE-UART)."""
    def __init__(self, port: str = "/dev/ttyACM0", baud: int = 115200):
        super().__init__()
        self.port, self.baud = port, baud
        self._ser = None
        self._reader_buf = b""

    async def connect(self) -> bool:
        import serial
        try:
            self._ser = serial.Serial(self.port, self.baud, timeout=0)
            await asyncio.sleep(1.2)          # ESP32 reset-on-open settle
            self._ser.reset_input_buffer()
            self.connected = True
        except serial.SerialException as e:
            print(f"[link] serial connect failed: {e}")
            self.connected = False
        return self.connected

    async def _send_line(self, line: str) -> None:
        await asyncio.to_thread(self._ser.write, (line + "\n").encode())

    async def _recv_line(self, timeout_s: float) -> str | None:
        deadline = time.monotonic() + timeout_s
        while time.monotonic() < deadline:
            chunk = await asyncio.to_thread(self._ser.read, 256)
            if chunk:
                self._reader_buf += chunk
                if b"\n" in self._reader_buf:
                    line, self._reader_buf = self._reader_buf.split(b"\n", 1)
                    return line.decode(errors="replace").strip()
            await asyncio.sleep(0.01)
        return None


def make_link(kind: str, **kw) -> Link:
    if kind == "serial":
        return SerialLink(**{k: v for k, v in kw.items()
                             if k in ("port", "baud")})
    return ZmqLink(**{k: v for k, v in kw.items() if k in ("endpoint",)})
