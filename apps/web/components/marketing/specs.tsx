"use client";

/** Specs / scale reveal — real numbers from packages/core/hardware/BOM.md
 * and the reflex layer. Big mono figures, Terafab-style. */

import { Reveal } from "./reveal";

const SPECS = [
  { n: "±80°", unit: "gaze pan", d: "−30°/+45° tilt, enforced in firmware" },
  { n: "≤25°", unit: "per command", d: "whip protection, every intent" },
  { n: "0.25", unit: "m/s drive cap", d: "1.0 rad/s turn — desk-safe by law" },
  { n: "1.0s", unit: "watchdog", d: "brain silent → body neutralizes" },
  { n: "3", unit: "carriers", d: "USB-C serial · BLE (app) · WiFi" },
  { n: "9", unit: "intents", d: "gaze nod shake wave point drive face led speak" },
  { n: "5+1", unit: "minds", d: "Claude · GPT · GLM · DeepSeek · Ollama · mock" },
  { n: "$230–450", unit: "v1 BOM", d: "Pi path to Jetson path, printed frame" },
];

export function Specs() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-28">
      <Reveal>
        <p className="telemetry text-[12px] uppercase tracking-[0.3em] text-signal">
          v1 — desktop unit
        </p>
        <h2 className="display mt-4 text-4xl sm:text-5xl">
          Small body. Honest numbers.
        </h2>
      </Reveal>
      <div className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-4">
        {SPECS.map((s, i) => (
          <Reveal key={s.unit} delay={i * 0.04}>
            <div className="h-full bg-bg p-6">
              <p className="telemetry text-3xl text-fg sm:text-4xl">{s.n}</p>
              <p className="telemetry mt-1 text-[11px] uppercase tracking-widest text-signal">
                {s.unit}
              </p>
              <p className="mt-3 text-[13px] leading-snug text-muted">{s.d}</p>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal delay={0.1}>
        <p className="telemetry mt-6 text-[12px] text-muted">
          full bill of materials in the docs · firmware compiles conceptually —
          run <span className="text-fg">pio run</span> before flashing
        </p>
      </Reveal>
    </section>
  );
}
