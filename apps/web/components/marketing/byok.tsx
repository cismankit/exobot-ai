"use client";

import { Reveal } from "./reveal";

const BACKENDS = [
  { name: "Claude", detail: "Anthropic API — conversation, planning, arbitration" },
  { name: "ChatGPT", detail: "OpenAI API — planning, consensus" },
  { name: "DeepSeek", detail: "code + reasoning, first in the code route" },
  { name: "GLM", detail: "Zhipu bigmodel — consensus voice" },
  { name: "Ollama", detail: "local models on-device — works fully offline" },
];

export function Byok() {
  return (
    <section className="border-t border-line py-28">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <p className="telemetry text-[12px] uppercase tracking-[0.3em] text-signal">
            bring your own minds
          </p>
          <h2 className="display mt-4 max-w-2xl text-4xl sm:text-5xl">
            Your keys. Your models. Your persona.
          </h2>
          <p className="mt-4 max-w-xl text-muted">
            Paste your own API keys in the console — encrypted at rest, never
            shown again, never logged. Route each kind of moment to the mind
            you trust with it. No keys at all? The local + mock chain keeps the
            body alive.
          </p>
        </Reveal>
        <div className="mt-12 divide-y divide-line overflow-hidden rounded-2xl border border-line">
          {BACKENDS.map((b, i) => (
            <Reveal key={b.name} delay={i * 0.05}>
              <div className="flex items-center justify-between gap-4 bg-surface px-6 py-4">
                <span className="display text-xl">{b.name}</span>
                <span className="telemetry text-right text-[12px] text-muted">
                  {b.detail}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
