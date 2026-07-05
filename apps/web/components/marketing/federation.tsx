"use client";

/**
 * One body, many minds — the README pipeline as a living diagram.
 * As it scrolls into view the minds "light up" in sequence, exactly the
 * way the orchestrator consults them: route for the task, fan out for
 * consensus, one persona speaks.
 */

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@exobod/ui";
import { Reveal } from "./reveal";

const MINDS = [
  { id: "claude", label: "Claude", role: "conversation · planning" },
  { id: "openai", label: "ChatGPT", role: "planning · consensus" },
  { id: "deepseek", label: "DeepSeek", role: "code · reasoning" },
  { id: "glm", label: "GLM", role: "consensus" },
  { id: "ollama", label: "Ollama", role: "local · perception" },
];

export function Federation() {
  const [lit, setLit] = useState(-1);
  const [inView, setInView] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setLit(MINDS.length);
      return;
    }
    let i = -1;
    const t = setInterval(() => {
      i += 1;
      setLit(i % (MINDS.length + 3)); // brief all-dark beat between sweeps
    }, 650);
    return () => clearInterval(t);
  }, [inView, reduced]);

  return (
    <section className="mx-auto max-w-6xl px-5 py-20">
      <Reveal>
        <p className="telemetry text-[12px] uppercase tracking-[0.3em] text-signal">
          the federation
        </p>
        <h2 className="display mt-4 max-w-2xl text-4xl sm:text-5xl">
          One body. Many minds. One voice.
        </h2>
        <p className="mt-4 max-w-xl text-muted">
          Every stimulus is routed to the right mind for the moment — or
          fanned out to all of them and arbitrated. They share one identity,
          one memory. You never hear the seams.
        </p>
      </Reveal>

      <motion.div
        onViewportEnter={() => setInView(true)}
        onViewportLeave={() => setInView(false)}
        className="mt-14 grid items-center gap-4 lg:grid-cols-[1fr_auto_1.4fr_auto_1fr]"
      >
        <div className="rounded-xl border border-line bg-surface p-5 text-center">
          <p className="telemetry text-[11px] uppercase tracking-widest text-muted">
            stimulus
          </p>
          <p className="mt-2 font-mono text-sm">
            “look at whoever
            <br />
            is speaking”
          </p>
        </div>

        <Arrow />

        <div className="grid gap-2">
          {MINDS.map((m, i) => (
            <div
              key={m.id}
              className={cn(
                "flex items-center justify-between rounded-lg border px-4 py-2.5 transition-all duration-300",
                lit >= i && lit < MINDS.length + 1
                  ? "border-signal/60 bg-signal-dim shadow-signal"
                  : "border-line bg-surface",
              )}
            >
              <span className="text-sm font-medium">{m.label}</span>
              <span className="telemetry text-[11px] text-muted">{m.role}</span>
            </div>
          ))}
          <p className="telemetry mt-1 text-center text-[11px] text-muted">
            + deterministic mock mind — the whole stack runs with zero keys
          </p>
        </div>

        <Arrow />

        <div className="grid gap-3">
          <div className="rounded-xl border border-signal/50 bg-surface p-5 text-center">
            <p className="telemetry text-[11px] uppercase tracking-widest text-signal">
              one persona
            </p>
            <p className="mt-2 text-sm text-muted">
              shared identity + memory
            </p>
          </div>
          <div className="rounded-xl border border-line bg-surface p-5 text-center">
            <p className="telemetry text-[11px] uppercase tracking-widest text-muted">
              intents → MCU
            </p>
            <p className="telemetry mt-2 text-[12px] text-muted">
              {'{"action":"gaze","params":{"pan":-40}}'}
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function Arrow() {
  return (
    <div
      aria-hidden
      className="hidden h-px w-10 bg-gradient-to-r from-line to-signal/60 lg:block"
    />
  );
}
