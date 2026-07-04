"use client";

import { Badge, StatusDot, cn } from "@exobod/ui";
import type { ConsoleState, LogEntry } from "@/lib/use-console";

export function PoseReadout({ state }: { state: ConsoleState }) {
  return (
    <div className="telemetry grid grid-cols-2 gap-x-6 gap-y-1 text-[13px]">
      <Row k="pan" v={`${state.pose.pan.toFixed(1)}°`} />
      <Row k="tilt" v={`${state.pose.tilt.toFixed(1)}°`} />
      <Row k="vbat" v={state.vbat != null ? `${state.vbat.toFixed(1)}V` : "—"} />
      <Row
        k="latency"
        v={state.lastLatencyMs != null ? `${state.lastLatencyMs}ms` : "—"}
      />
      <Row k="model" v={state.lastModel ?? "—"} wide />
      <Row
        k="link"
        v={
          <span className="inline-flex items-center gap-1.5">
            <StatusDot live={state.connected} danger={state.estop} />
            {state.connected ? state.linkLabel : "reconnecting"}
            {state.estop && (
              <span className="font-semibold text-danger">ESTOP</span>
            )}
          </span>
        }
        wide
      />
    </div>
  );
}

function Row({
  k,
  v,
  wide,
}: {
  k: string;
  v: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div className={cn("flex items-baseline justify-between gap-3", wide && "col-span-2")}>
      <span className="text-muted">{k}</span>
      <span className="text-fg">{v}</span>
    </div>
  );
}

const kindStyles: Record<LogEntry["kind"], string> = {
  stimulus: "text-fg",
  speech: "text-signal",
  intent: "text-muted",
  ack: "text-muted",
  system: "text-muted italic",
  error: "text-danger",
};

export function IntentLog({
  log,
  className,
}: {
  log: LogEntry[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "console-scroll telemetry space-y-1 overflow-y-auto text-[12.5px] leading-relaxed",
        className,
      )}
      role="log"
      aria-live="polite"
    >
      {log.length === 0 && (
        <p className="text-muted">
          # body link ready — try “look left”, “whip your head around fast”,
          “emergency stop”
        </p>
      )}
      {log.map((e) => (
        <p
          key={e.id}
          className={cn(
            kindStyles[e.kind],
            e.danger && "text-danger",
            "break-words",
          )}
        >
          {e.kind === "stimulus" ? "› " : e.kind === "speech" ? "◆ " : "  "}
          {e.text}
        </p>
      ))}
    </div>
  );
}

export function MindsRow({
  available,
  thinking,
}: {
  available: string[];
  thinking: string[];
}) {
  const all = ["claude", "openai", "glm", "deepseek", "ollama", "mock"];
  return (
    <div className="flex flex-wrap gap-1.5">
      {all.map((m) => {
        const isAvail = available.includes(m);
        const isThinking = thinking.includes(m);
        return (
          <Badge
            key={m}
            tone={isThinking ? "signal" : "muted"}
            className={cn(
              !isAvail && "opacity-35",
              isThinking && "animate-pulse-signal shadow-signal",
            )}
          >
            {m}
          </Badge>
        );
      })}
    </div>
  );
}
