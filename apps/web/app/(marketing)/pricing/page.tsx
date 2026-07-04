import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@exobod/ui";

export const metadata: Metadata = { title: "Pricing — Exobod" };

const TIERS = [
  {
    name: "Waitlist",
    price: "Free",
    blurb: "A place in line and honest progress updates.",
    features: [
      "Console access with the body simulator",
      "All five minds via your own keys (BYOK)",
      "Persona editor + memory browser",
    ],
    cta: { label: "Join the waitlist", href: "/#waitlist" },
  },
  {
    name: "Dev Kit — preorder",
    price: "$199 deposit",
    blurb:
      "Reserves an Exobod v1 desktop frame. Fully refundable until your unit ships.",
    features: [
      "3-DOF head (pan · tilt · nod), ESP32 MCU",
      "Hardware estop + firmware constitution",
      "BOM path: ~$230 (Pi) to ~$450 (Jetson) all-in",
      "Everything in Waitlist, plus device pairing",
    ],
    cta: { label: "Preorder via Stripe", href: "/#waitlist" },
    highlight: true,
  },
];

export default function Pricing() {
  return (
    <div className="mx-auto max-w-5xl px-5 pb-28 pt-36">
      <p className="telemetry text-[12px] uppercase tracking-[0.3em] text-signal">
        pricing
      </p>
      <h1 className="display mt-4 text-4xl sm:text-6xl">
        Software is free while we build.
      </h1>
      <p className="mt-4 max-w-xl text-muted">
        You bring the phone and the model keys. We're selling the body — and
        we only take deposits we're happy to refund.
      </p>

      <div className="mt-14 grid gap-5 md:grid-cols-2">
        {TIERS.map((t) => (
          <div
            key={t.name}
            className={`rounded-2xl border p-7 ${
              t.highlight
                ? "border-signal/60 bg-surface shadow-signal"
                : "border-line bg-surface"
            }`}
          >
            <p className="telemetry text-[11px] uppercase tracking-widest text-muted">
              {t.name}
            </p>
            <p className="display mt-3 text-4xl">{t.price}</p>
            <p className="mt-2 text-sm text-muted">{t.blurb}</p>
            <ul className="mt-6 space-y-2.5 text-sm">
              {t.features.map((f) => (
                <li key={f} className="flex gap-2.5 text-muted">
                  <span className="text-signal">—</span>
                  {f}
                </li>
              ))}
            </ul>
            <Link href={t.cta.href} className="mt-8 block">
              <Button
                className="w-full"
                variant={t.highlight ? "signal" : "outline"}
              >
                {t.cta.label}
              </Button>
            </Link>
          </div>
        ))}
      </div>
      <p className="telemetry mt-8 text-[12px] text-muted">
        No subscription exists yet, so we don&apos;t charge one. When hosted
        inference lands it will be optional — local Ollama will always work.
      </p>
    </div>
  );
}
