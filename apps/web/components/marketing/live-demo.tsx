"use client";

/** Section 5 — Live, right now. A real console session against the real
 * orchestrator + real ReflexCore sim, no signup. Not a render. */

import { useState } from "react";
import { Reveal } from "./reveal";
import { MiniConsole } from "@/components/console/mini-console";

function freshSessionId() {
  return `demo-${Math.random().toString(36).slice(2, 10)}`;
}

export function LiveDemo() {
  // one session per page load — each visitor gets their own body
  const [sessionId] = useState(freshSessionId);

  return (
    <section id="live" className="mx-auto max-w-6xl px-5 py-20">
      <Reveal>
        <p className="telemetry text-[12px] uppercase tracking-[0.3em] text-signal">
          live, right now
        </p>
        <h2 className="display mt-4 max-w-2xl text-4xl sm:text-5xl">
          This is not a render.
        </h2>
        <p className="mt-4 max-w-xl text-muted">
          You&apos;re driving a real body simulator through the real
          orchestrator — the same code that drives the servos. Ask for
          something violent and watch the constitution answer.
        </p>
      </Reveal>
      <Reveal delay={0.1} className="mt-10">
        <MiniConsole sessionId={sessionId} />
      </Reveal>
    </section>
  );
}
