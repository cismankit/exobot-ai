# infra

One-command local stack, deploy configs, and the tools that stand in for
hardware.

## docker-compose.yml

```bash
docker compose -f infra/docker-compose.yml up
```

| service    | port | what it is |
|---|---|---|
| postgres   | 5432 | platform DB (`exobod`/`exobod`) |
| api        | 8000 | FastAPI wrapping `packages/core` — `LINK_KIND=zmq` |
| reflex-sim | —    | the body: `packages/core/reflex/reflex_sim.py`, same constitution as the ESP32 firmware |

Without docker, `pnpm dev:api` runs the API with the body sim in-process
and sqlite — zero infra.

## emulated_device.py

A "real" device without hardware: runs the actual `ReflexCore` and speaks
the NDJSON protocol over the device WebSocket, exactly like the serial
bridge for an ESP32.

```bash
.venv/bin/python infra/emulated_device.py EXO-XXXXXX ws://localhost:8000
```

Pairing codes come from Console → Devices. The fleet table flips the row
online and relays estops through it.

## seed.py

Idempotent demo data: dev user, default persona "Exo", three waitlist rows.

## Deploy

- **web → Vercel** — root directory `apps/web`; env `NEXT_PUBLIC_API_URL`
  plus Clerk keys when ready.
- **api → Fly.io** — `fly launch --config infra/fly.toml` (see file header
  for the secrets list). Attach a Fly Postgres and use its
  `postgresql+asyncpg://` URL.
- Set `FERNET_KEY` in production — BYOK provider keys are encrypted with it.
