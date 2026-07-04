"use client";

import { trackEvent } from "@/lib/analytics";
import type { ProductConfiguration } from "@/lib/catalog/types";
import { useState } from "react";

export function ConfigSaveForm({
  configId,
  config,
  summary,
}: {
  configId: string;
  config: ProductConfiguration;
  summary: string;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter a valid email.");
      return;
    }

    setStatus("sending");
    const res = await fetch("/api/config/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.trim(),
        configId,
        config,
        summary,
      }),
    });

    if (!res.ok) {
      setStatus("error");
      setError("Could not save — try again shortly.");
      return;
    }

    trackEvent("config_saved", { configId, email: email.trim() });
    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <p className="rounded-xl border border-accent/30 bg-accent/8 px-3 py-2.5 text-sm text-text-main">
        Saved. View your spec at{" "}
        <a
          href={`/customize/summary/${configId}`}
          className="font-semibold text-accent-soft underline-offset-4 hover:underline"
        >
          /customize/summary/{configId}
        </a>
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <label className="block text-xs font-semibold uppercase tracking-wide text-text-muted">
        Email me this config
        <input
          type="email"
          placeholder="you@lab.edu"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2 w-full rounded-xl border border-line/80 bg-surface-soft/80 px-3 py-3 text-sm text-text-main outline-none transition focus:border-accent/60 focus:ring-2 focus:ring-accent/30"
        />
      </label>
      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex w-full items-center justify-center rounded-xl border border-line/80 bg-background/60 px-4 py-3 text-sm font-semibold text-text-main transition hover:border-accent/40 disabled:opacity-60"
      >
        {status === "sending" ? "Saving…" : "Send snapshot"}
      </button>
      {error ? <p className="text-xs text-warning">{error}</p> : null}
    </form>
  );
}
