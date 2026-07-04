import type { Metadata } from "next";

export const metadata: Metadata = { title: "Manifesto — Exobod" };

const LAWS = [
  {
    n: "01",
    t: "Body-schema-first",
    d: "Models emit intents; only the MCU touches motors, and it validates every intent against its own limits. The brain can never out-argue the body's constitution.",
  },
  {
    n: "02",
    t: "One memory",
    d: "Every backend reads and writes the same persona state. The self is the continuity, not the model. Swap the mind mid-sentence; the person stays.",
  },
  {
    n: "03",
    t: "Degrade, never die",
    d: "Cloud falls back to local, local to a deterministic mock. Link down means speech-only. Brain silent means the body neutralizes itself. Nothing about presence should require a subscription to keep breathing.",
  },
];

export default function Manifesto() {
  return (
    <div className="mx-auto max-w-3xl px-5 pb-28 pt-36">
      <p className="telemetry text-[12px] uppercase tracking-[0.3em] text-signal">
        manifesto
      </p>
      <h1 className="display mt-4 text-4xl sm:text-6xl">
        Intelligence wants a body.
      </h1>
      <div className="mt-10 space-y-6 text-lg leading-relaxed text-muted">
        <p>
          The most capable computer you have ever owned spends its life face
          down on a table. It can reason, see, and speak — and it cannot turn
          toward you when you enter the room.
        </p>
        <p>
          We think embodiment is not a peripheral. Presence — gaze, posture,
          the small physical acknowledgements of attention — is how minds
          participate in a room. A phone in an Exobod frame stops being an
          appliance you check and becomes a presence you live with.
        </p>
        <p>
          We also think embodiment without restraint is a toy at best and a
          hazard at worst. So the body gets a constitution: joint limits, step
          clamps, a heartbeat watchdog, an emergency stop that software can
          trigger but only a human hand can release. The intelligence is
          federated and replaceable. The restraint is singular and physical.
        </p>
        <p>
          No mind we route to is told it is one of several. No response tells
          you which model produced it. The persona is the product; the models
          are weather.
        </p>
      </div>

      <div className="mt-16 space-y-6">
        {LAWS.map((l) => (
          <div key={l.n} className="rounded-2xl border border-line bg-surface p-6">
            <p className="telemetry text-[12px] text-signal">{l.n}</p>
            <h2 className="display mt-2 text-2xl">{l.t}</h2>
            <p className="mt-3 text-muted">{l.d}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
