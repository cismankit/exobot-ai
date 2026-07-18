"use client";

import { InterestForm } from "@/components/interest-form";
import { formatUsdFromCents } from "@/lib/payments/early-access";
import Link from "next/link";
import { useState } from "react";

type Props = {
  stripeConfigured: boolean;
  priceCents: number;
  zelleEmail?: string | null;
  cancelled?: boolean;
  /** When true, skip the large title (page already provides a section header). */
  embedded?: boolean;
};

export function ReserveCta({
  stripeConfigured,
  priceCents,
  zelleEmail,
  cancelled = false,
  embedded = false,
}: Props) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const priceLabel = formatUsdFromCents(priceCents);

  const startCheckout = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout/early-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          name: name.trim() || undefined,
        }),
      });
      const data = (await res.json()) as {
        ok: boolean;
        checkoutUrl?: string;
        error?: string;
      };
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

  if (!stripeConfigured) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-dashed border-line/80 bg-surface-soft/40 px-5 py-5 sm:px-6">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-accent-soft">
            Desk One reservation
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-text-main">
            Reserve interest for Desk One
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-text-muted">
            Card checkout is not live yet. Join the early-access list below — we will email you when
            paid founder reservations open. No charge today.
          </p>
        </div>
        <div className="rounded-2xl border border-line/70 bg-surface/70 p-5 shadow-panel sm:p-6">
          <h3 className="text-lg font-semibold text-text-main">Reserve Desk One interest</h3>
          <p className="mt-1 text-sm text-text-muted">
            Tell us you want EXB-D1. This is interest only — not a payment.
          </p>
          <div className="mt-5">
            <InterestForm
              defaultBodyType="Desk Assistant"
              submitLabel="Reserve Desk One"
              configurationSummary="Desk One (EXB-D1) early-access interest — paid reservation not open yet"
            />
          </div>
        </div>
        {zelleEmail ? <ZelleFallback email={zelleEmail} priceLabel={priceLabel} /> : null}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {cancelled ? (
        <p className="rounded-xl border border-line/70 bg-surface-soft/50 px-4 py-3 text-sm text-text-muted">
          Checkout cancelled — no charge was made. You can try again when ready.
        </p>
      ) : null}

      <div className="rounded-2xl border border-line/70 bg-surface/70 p-5 shadow-panel sm:p-6">
        {!embedded ? (
          <>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-accent">
              Founder reservation
            </p>
            <h2 className="mt-2 font-display text-2xl font-semibold text-text-main sm:text-3xl">
              Reserve Desk One — {priceLabel}
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-text-muted">
              Crowdfund-style deposit for the EXB-D1 Desk One EVT / early-access program.
              Receipt and refunds run through Stripe. This is a reservation deposit — not a
              guaranteed ship date, and not a walker promise.
            </p>
          </>
        ) : (
          <p className="text-sm leading-relaxed text-text-muted">
            Enter your email to open Stripe Checkout for the {priceLabel} founder reservation.
          </p>
        )}

        <form
          className={embedded ? "mt-5 space-y-4" : "mt-6 space-y-4"}
          onSubmit={(e) => {
            e.preventDefault();
            void startCheckout();
          }}
        >
          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-text-muted">Email</span>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-line/70 bg-background px-3.5 py-2.5 text-sm text-text-main outline-none ring-accent/40 focus:ring-2"
              placeholder="you@company.com"
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-text-muted">Name (optional)</span>
            <input
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-line/70 bg-background px-3.5 py-2.5 text-sm text-text-main outline-none ring-accent/40 focus:ring-2"
              placeholder="Alex Founder"
            />
          </label>

          {error ? <p className="text-sm text-warning">{error}</p> : null}

          <button
            type="submit"
            disabled={loading || !email.trim()}
            className="w-full rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-background transition hover:bg-accent-soft disabled:opacity-50 sm:w-auto"
          >
            {loading ? "Opening checkout…" : `Reserve Desk One — ${priceLabel}`}
          </button>
        </form>

        <p className="mt-4 text-xs leading-relaxed text-text-muted">
          By continuing you agree this is a{" "}
          <strong className="font-medium text-text-main/90">reservation / deposit</strong> for
          the Desk One EVT program.{" "}
          <Link href="/legal/refund" className="text-accent-soft underline-offset-2 hover:underline">
            Refund &amp; milestone terms
          </Link>
          . No promised delivery date until a later build agreement.
        </p>
      </div>

      {zelleEmail ? <ZelleFallback email={zelleEmail} priceLabel={priceLabel} /> : null}
    </div>
  );
}

function ZelleFallback({ email, priceLabel }: { email: string; priceLabel: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-line/70 bg-surface-soft/30 px-5 py-4">
      <p className="text-sm font-semibold text-text-main">Manual fallback: Zelle</p>
      <p className="mt-1 text-xs leading-relaxed text-text-muted">
        Optional only if you cannot use card checkout. Send {priceLabel} via Zelle to{" "}
        <span className="font-mono text-accent-soft">{email}</span>, then email support with
        your name and &quot;Desk One reservation&quot;.{" "}
        <strong className="font-medium text-warning">Manual confirmation required</strong> —
        Zelle is not automated ecommerce; your spot is not confirmed until we reply.
      </p>
    </div>
  );
}
