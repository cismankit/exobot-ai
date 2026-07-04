import * as React from "react";
import { cn } from "./cn";

type Tone = "signal" | "danger" | "muted";

const tones: Record<Tone, string> = {
  signal: "border-signal/40 bg-signal-dim text-signal",
  danger: "border-danger/40 bg-danger-dim text-danger",
  muted: "border-line bg-surface-2 text-muted",
};

export function Badge({
  tone = "muted",
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-wider",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}

/** Live/dead link dot — green means the body link is alive. */
export function StatusDot({
  live,
  danger,
  className,
}: {
  live: boolean;
  danger?: boolean;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-block h-2 w-2 rounded-full",
        danger
          ? "bg-danger shadow-danger"
          : live
            ? "bg-signal shadow-signal animate-pulse-signal"
            : "bg-muted/40",
        className,
      )}
    />
  );
}
