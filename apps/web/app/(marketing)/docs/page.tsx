import type { Metadata } from "next";

export const metadata: Metadata = { title: "Docs — Exobod" };

function Code({ children }: { children: string }) {
  return (
    <pre className="telemetry overflow-x-auto rounded-xl border border-line bg-surface p-4 text-[12.5px] leading-relaxed text-fg">
      {children}
    </pre>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="display mt-14 text-2xl sm:text-3xl">{children}</h2>;
}

export default function Docs() {
  return (
    <div className="mx-auto max-w-3xl px-5 pb-28 pt-36">
      <p className="telemetry text-[12px] uppercase tracking-[0.3em] text-signal">
        docs
      </p>
      <h1 className="display mt-4 text-4xl sm:text-5xl">
        Run the whole thing yourself.
      </h1>
      <p className="mt-4 text-muted">
        Exobod is a working stack, not a promise: a python core (orchestrator
        + body simulator + firmware), a FastAPI control plane, and this
        console. Everything below runs with zero API keys.
      </p>

      <H2>Quick start (local, keyless)</H2>
      <Code>{`git clone https://github.com/cismankit/exobot-ai
cd exobot-ai
python3 -m venv .venv && .venv/bin/pip install -r apps/api/requirements.txt
pnpm install

pnpm dev:api     # FastAPI on :8000 — body sim runs in-process
pnpm dev:web     # this site on :3000`}</Code>
      <p className="mt-3 text-sm text-muted">
        Open the console, type <span className="telemetry text-fg">look left</span>,
        watch the head move. The deterministic mock mind answers when no keys
        are configured — the routing chain upgrades itself the moment you add
        one in <span className="telemetry text-fg">Minds</span>.
      </p>

      <H2>One-command stack (docker)</H2>
      <Code>{`docker compose -f infra/docker-compose.yml up
# postgres :5432 · api :8000 · reflex-sim (zmq body) — LINK_KIND=zmq`}</Code>

      <H2>The wire protocol</H2>
      <p className="mt-3 text-sm text-muted">
        One NDJSON protocol from brain to body, identical over the zmq
        simulator and USB serial to the ESP32:
      </p>
      <Code>{`brain -> body : {"t":"intent","action":"gaze","params":{"pan":-40},"seq":7}
                {"t":"hb","seq":8}          # heartbeat, 5 Hz
                {"t":"estop"}
body  -> brain: {"t":"ack","executed":true,"reason":"clamped",
                 "pose":{"pan":-25.0,"tilt":0.0},"vbat":7.9,"estop":false}`}</Code>

      <H2>The console socket</H2>
      <Code>{`ws://localhost:8000/ws/console/{session_id}

-> {"type":"stimulus","text":"look left","task_type":"conversation"}
-> {"type":"estop"}
<- {"type":"thinking","providers":["claude","deepseek"]}
<- {"type":"answer","model":"claude","latency_ms":812,
    "speech":"...","intents":[...],"body_acks":[...]}   # verbatim
<- {"type":"pose","pan":-25.0,"tilt":0.0,"estop":false,"vbat":7.9}`}</Code>
      <p className="mt-3 text-sm text-muted">
        The <span className="telemetry text-fg">answer</span> payload is the
        orchestrator&apos;s return value verbatim. Safety fields are never
        reshaped between the firmware and your screen.
      </p>

      <H2>Safety model</H2>
      <ul className="mt-4 space-y-2.5 text-sm text-muted">
        <li>— Joint limits: pan ±80°, tilt −30°/+45°, enforced per intent.</li>
        <li>— Step clamp: ≤25° per command. A 200° whip becomes a 25° turn.</li>
        <li>— Heartbeat watchdog: 1s of brain silence neutralizes motion.</li>
        <li>— Estop latches. Software can set it; only a physical 2s button hold releases it.</li>
        <li>— These live in ReflexCore and the ESP32 firmware only. The web layer visualizes; it never re-decides.</li>
      </ul>

      <H2>Real hardware</H2>
      <Code>{`cd packages/core/firmware/exobod_mcu
pio run -t upload        # ESP32-S3; wiring in the file header
# then: pnpm dev:api with LINK_KIND=serial (or pair via Devices)`}</Code>
      <p className="mt-3 text-sm text-muted">
        Honest note: the firmware compiles conceptually and mirrors the tested
        simulator — run <span className="telemetry text-fg">pio run</span> and
        bench-test before trusting it with servos.
      </p>

      <H2>API surface</H2>
      <Code>{`POST /waitlist                      GET  /me
POST /preorder/checkout             GET/PUT /me/providers   (BYOK, encrypted)
POST /stripe/webhook                GET/PUT /me/routes
GET  /health                        CRUD /personas (+ /preview)
WS   /ws/console/{session}          GET  /personas/{id}/facts · /episodes
WS   /ws/device/{pairing_code}      POST /devices/pair · /devices/{id}/estop`}</Code>
      <p className="mt-3 text-sm text-muted">
        OpenAPI at <span className="telemetry text-fg">/docs</span> on the API
        itself; the typed TS client in{" "}
        <span className="telemetry text-fg">packages/sdk</span> regenerates
        with <span className="telemetry text-fg">pnpm --filter @exobod/sdk generate</span>.
      </p>
    </div>
  );
}
