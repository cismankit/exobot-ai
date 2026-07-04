#!/usr/bin/env python3
"""
Exobod runtime — single entry point.

  python run.py                 # text REPL, zmq body (start reflex_sim first)
  python run.py --voice         # wake word / push-to-talk voice loop
  python run.py --link serial --port /dev/ttyACM0    # real MCU
  python run.py --no-body       # brain only (speech, no motion)

Config: config.yaml (providers, routes, link defaults, persona paths).
"""

import argparse
import asyncio
import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT / "orchestrator"))
sys.path.insert(0, str(ROOT))

from orchestrator.core import Orchestrator, TaskType          # noqa: E402
from orchestrator.persona_state import PersonaState           # noqa: E402
from transport.link import make_link                          # noqa: E402


def load_config() -> dict:
    p = ROOT / "config.yaml"
    return yaml.safe_load(p.read_text()) if p.exists() else {}


async def boot(args) -> Orchestrator:
    cfg = load_config()
    persona = PersonaState.load(
        ROOT / cfg.get("identity", "persona/identity.json"),
        ROOT / cfg.get("memory_db", "persona/memory.db"))

    link = None
    if not args.no_body:
        kind = args.link or cfg.get("link", {}).get("kind", "zmq")
        kw = dict(cfg.get("link", {}))
        kw.pop("kind", None)
        if args.port:
            kw["port"] = args.port
        link = make_link(kind, **kw)
        ok = await link.connect()
        print(f"[boot] body link ({kind}): {'up' if ok else 'DOWN — speech-only mode'}")
        if ok and kind == "serial":
            asyncio.create_task(link.heartbeat_loop())

    orch = Orchestrator(persona, link, cfg)
    live = [n for n, p in orch.providers.items() if p.available()]
    print(f"[boot] minds online: {', '.join(live) or 'NONE'}")
    print(f"[boot] persona: {persona.identity['name']} "
          f"({len(persona.facts())} facts in memory)")
    return orch


async def text_repl(orch: Orchestrator):
    print("\ntype to talk · '/consensus <q>' fans out · '/facts' · Ctrl+C quits\n")
    while True:
        try:
            stimulus = await asyncio.to_thread(input, "you> ")
        except (EOFError, KeyboardInterrupt):
            break
        stimulus = stimulus.strip()
        if not stimulus:
            continue
        if stimulus == "/facts":
            print(orch.persona.facts()); continue
        if stimulus.startswith("/consensus "):
            result = await orch.handle(stimulus[11:], TaskType.CONSENSUS)
        else:
            result = await orch.handle(stimulus)
        print(f"\n[{result['model']} · {result['latency_ms']}ms] "
              f"{result['speech']}")
        for it, ack in zip(result["intents"], result["body_acks"]):
            print(f"  ⚙ {it['action']}{it['params']} -> "
                  f"{'✓' if ack.get('executed') else '✗'} "
                  f"{ack.get('reason')} pose={ack.get('pose')}")
        print()
    await orch.drain()


async def voice_loop(orch: Orchestrator):
    from voice.pipeline import VoicePipeline
    vp = VoicePipeline()
    print(f"[voice] {vp.caps.summary()}")
    while True:
        await vp.wait_for_wake()
        if vp.caps.stt and vp.caps.audio:
            print("[voice] listening…")
            audio = await vp.listen_utterance()
            stimulus = await vp.transcribe(audio)
        else:
            stimulus = await asyncio.to_thread(input, "you (typed)> ")
        if not stimulus.strip():
            continue
        print(f"[voice] heard: {stimulus}")
        result = await orch.handle(stimulus.strip())
        await vp.say(result["speech"])


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--voice", action="store_true")
    ap.add_argument("--no-body", action="store_true")
    ap.add_argument("--link", choices=["zmq", "serial"])
    ap.add_argument("--port", help="serial port for real MCU")
    args = ap.parse_args()

    async def _run():
        orch = await boot(args)
        if args.voice:
            await voice_loop(orch)
        else:
            await text_repl(orch)

    try:
        asyncio.run(_run())
    except KeyboardInterrupt:
        print("\n[exit] persona memory saved.")


if __name__ == "__main__":
    main()
