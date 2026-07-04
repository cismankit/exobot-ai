#!/usr/bin/env python3
"""Emulated Exobod MCU — pairs with the platform like real hardware.

Runs the REAL ReflexCore (same constitution as the firmware) and speaks the
NDJSON protocol over the device WebSocket, exactly what the serial bridge
does for an ESP32.

    python infra/emulated_device.py EXO-A1B2C3 [ws://localhost:8000]

Then open the console: the fleet row flips online, and Live Console
sessions relay intents to this body.
"""

import asyncio
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "packages" / "core"))

from reflex.reflex_sim import ReflexCore  # noqa: E402

try:
    import websockets
except ImportError:
    sys.exit("pip install websockets  (already in apps/api/requirements.txt)")


async def run(pairing_code: str, base: str):
    url = f"{base}/ws/device/{pairing_code}"
    core = ReflexCore()
    print(f"[emu-mcu] body online, dialing {url}")
    async with websockets.connect(url) as ws:
        await ws.send(json.dumps({"t": "hello", "fw": "emu-1.0.0"}))
        print("[emu-mcu] paired — constitution active "
              "(pan±80° tilt -30/+45° step≤25°)")
        async for raw in ws:
            try:
                msg = json.loads(raw)
            except json.JSONDecodeError:
                continue
            reply = core.handle(msg)
            await ws.send(json.dumps(reply))
            if msg.get("t") == "intent":
                print(f"[emu-mcu] {msg.get('action')}({msg.get('params')}) "
                      f"-> {reply['reason']} pose={reply.get('pose')}")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    code = sys.argv[1]
    base = sys.argv[2] if len(sys.argv) > 2 else "ws://localhost:8000"
    try:
        asyncio.run(run(code, base))
    except KeyboardInterrupt:
        print("\n[emu-mcu] body offline")
