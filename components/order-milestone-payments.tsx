"use client";

import type { Milestone } from "@/lib/orders/types";
import { useState } from "react";

function formatUsd(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

function milestoneStatusLabel(status: Milestone["status"]): string {
  switch (status) {
    case "pending":
      return "Pending";
    case "invoiced":
      return "Invoice sent";
    case "paid":
      return "Paid";
    case "waived":
      return "Waived";
  }
}

export function OrderMilestonePayments({
  orderToken,
  milestones,
  stripeConfigured,
}: {
  orderToken: string;
  milestones: Milestone[];
  stripeConfigured: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sorted = milestones.slice().sort((a, b) => a.sequence - b.sequence);
  const nextUnpaid = sorted.find((m) => m.status === "pending" || m.status === "invoiced");

  const payDeposit = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/payments/milestone/${orderToken}`, { method: "POST" });
      const data = (await res.json()) as { ok: boolean; checkoutUrl?: string; error?: string };
      if (!res.ok || !data.ok || !data.checkoutUrl) {
        setError(data.error ?? "Could not start checkout.");
        return;
      }
      window.location.href = data.checkoutUrl;
    } catch {
      setError("Could not start checkout.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <p className="mt-1 text-xs text-text-muted">
        {stripeConfigured
          ? "Pay milestones securely via Stripe Checkout when invoiced."
          : "Stripe is not configured — payment links appear once STRIPE_SECRET_KEY is set."}
      </p>
      <ul className="mt-4 space-y-3">
        {sorted.map((m) => (
          <li
            key={m.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-line/60 bg-surface-soft/50 px-4 py-3"
          >
            <div>
              <p className="text-sm font-medium text-text-main">
                {m.name} ({m.percentOfTotal}%)
              </p>
              <p className="text-xs text-text-muted">{m.trigger}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-text-main">{formatUsd(m.amountUsd)}</p>
              <p className="text-xs capitalize text-text-muted">{milestoneStatusLabel(m.status)}</p>
            </div>
          </li>
        ))}
      </ul>

      {error ? <p className="mt-3 text-sm text-warning">{error}</p> : null}

      {stripeConfigured && nextUnpaid ? (
        <button
          type="button"
          disabled={loading}
          onClick={() => void payDeposit()}
          className="mt-4 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-background hover:bg-accent-soft disabled:opacity-50"
        >
          {loading
            ? "Redirecting…"
            : nextUnpaid.name.toLowerCase().includes("deposit")
              ? `Pay deposit (${formatUsd(nextUnpaid.amountUsd)})`
              : `Pay ${nextUnpaid.name} (${formatUsd(nextUnpaid.amountUsd)})`}
        </button>
      ) : !stripeConfigured && nextUnpaid ? (
        <p className="mt-4 rounded-lg border border-dashed border-line/80 px-4 py-3 text-xs text-text-muted">
          Next due: {nextUnpaid.name} ({formatUsd(nextUnpaid.amountUsd)}). Your build desk will send
          a manual invoice until online payments are enabled.
        </p>
      ) : null}
    </>
  );
}
