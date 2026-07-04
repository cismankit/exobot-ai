# exobod

**Your phone stays the brain. Exobod becomes the body.**

A multi-model federation (Claude · ChatGPT · GLM · DeepSeek · local Ollama)
speaks as one persona and drives a servo body through a safety-clamping MCU.
This repo is the whole thing: the tested python core, the FastAPI control
plane, and the exobod.ai site + live console.

```
apps/
  web/        Next.js — cinematic marketing site + the console (3D head,
              live telemetry, persona editor, BYOK, devices, memory)
  api/        FastAPI — wraps the core; REST + /ws/console + device relay
  companion/  Expo app (BLE pairing, estop, face) — earlier wave
packages/
  core/       exobod-core, moved verbatim: orchestrator, providers,
              persona memory, intent parser, reflex sim, ESP32 firmware
  ui/         design tokens ("living machine") + shared components
  sdk/        typed TS client + WS protocol types (openapi regen script)
infra/        docker-compose (postgres+api+reflex-sim), fly.toml,
              emulated_device.py, seed.py
legacy/       the previous exobod.ai site, preserved
```

## Status: working end to end, tested

- `packages/core` — **20/20** (intent parsing, reflex safety invariants,
  full pipeline against the live simulator)
- `apps/api` — **8/8** (WS safety story over the wire: look-left moves,
  the 200° whip is clamped to 25° *by the body*, estop latches across
  turns; waitlist dedupe; masked BYOK keys; persona preview; device pairing)
- `apps/web` — **4/4** Playwright (landing, embedded demo clamp + estop
  from a real browser, dev-auth live console, waitlist form)

## Quick start — zero keys, zero docker

```bash
python3 -m venv .venv && .venv/bin/pip install -r apps/api/requirements.txt
pnpm install

pnpm dev:api        # FastAPI :8000 — ReflexCore body sim runs in-process
pnpm dev:web        # site + console on :3000
```

Open http://localhost:3000, scroll to **Live, right now**, and type
`look left` · `whip your head around fast` (watch the body clamp it) ·
`emergency stop` then `look right` (watch it refuse). No signup, no keys —
the deterministic mock mind keeps the whole pipeline alive. Add real keys
in **Console → Minds** and the routing chain upgrades itself.

One-command stack with Postgres + a zmq body instead:

```bash
docker compose -f infra/docker-compose.yml up
```

## Tests

```bash
pnpm test:core                     # 20 — the brain + the constitution
pnpm test:api                      # 8  — REST + WS e2e
pnpm --filter @exobod/web test     # 4  — Playwright smoke (boots both servers)
```

## Pair a body (no hardware required)

Console → Devices → *Generate pairing code*, then:

```bash
.venv/bin/python infra/emulated_device.py EXO-XXXXXX ws://localhost:8000
```

The fleet row flips online with live pose/vbat/estop. A real ESP32 speaks
the identical NDJSON protocol (`packages/core/firmware/exobod_mcu/` —
compiles conceptually; run `pio run` and bench-test before trusting it
with servos).

## Design laws (inherited from the core, enforced in the platform)

1. **One source of safety truth.** Joint limits (pan ±80°, tilt −30/+45°),
   the ≤25°/command step clamp, the 1 s heartbeat watchdog, and the estop
   latch live in `ReflexCore`/firmware only. The API relays; the browser
   visualizes; neither re-decides.
2. **One memory.** Every backend reads/writes the same persona state.
   Facts and episodes browse from that same sqlite via the API.
3. **Degrade, never die.** cloud → local → mock; device → sim;
   Clerk → dev auth; Postgres → sqlite. The console must work with
   zero keys, and does.

## Configuration & deploy

Copy `.env.example` and fill what you have — everything is optional
locally. Provider keys pasted in the console are Fernet-encrypted at rest,
returned only masked, never logged (set `FERNET_KEY` in production).

- **web → Vercel**: root directory `apps/web`, env `NEXT_PUBLIC_API_URL`
  (+ Clerk publishable/secret keys when ready)
- **api → Fly.io**: `fly launch --config infra/fly.toml` from the repo
  root, then `fly secrets set …` (see the file header)
- **Stripe**: test-mode keys make `/preorder/checkout` + the webhook real;
  without them the endpoint says preorders aren't open — it never fakes a
  purchase.
- Seed a demo persona + waitlist: `.venv/bin/python infra/seed.py`

## Honesty ledger

What this is: a working control plane over a tested simulator + a real
protocol, with real payments and real key handling. What it is not yet:
mass-produced hardware (the BOM in `packages/core/hardware/` is a build
guide, not a shipping product), hosted inference, or a mobile-quality 3D
asset pipeline. The firmware note stands: compile and bench-test before
flashing anything with torque.
