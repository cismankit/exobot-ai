import { MotionReveal } from "@/components/motion-reveal";
import { SectionHeader } from "@/components/section-header";
import {
  deskOne,
  deskOneFaq,
  deskOneSpecs,
  deskOneWhatItIs,
  deskOneWhatItIsNot,
} from "@/lib/desk-one";
import type { Metadata } from "next";
import Link from "next/link";

const pageUrl = "https://www.exobod.ai/desk-one";

export const metadata: Metadata = {
  title: "Desk One (EXB-D1) | Early-builder phone dock | Exobod.ai",
  description:
    "EXB-D1 Desk One is a stationary 2-axis pan/tilt phone dock for EVT builders. Phone stays the brain. Not a walker, not battery-powered v1, not a finished retail SKU.",
  alternates: { canonical: pageUrl },
  openGraph: {
    title: "Desk One (EXB-D1) | Exobod.ai",
    description:
      "Stationary 2-axis phone dock for early builders. Honest EVT framing — not a biped, not ships-today retail.",
    url: pageUrl,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Desk One (EXB-D1) | Exobod.ai",
    description:
      "Stationary pan/tilt phone dock. Phone is the brain. Early-builder access only.",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: deskOneFaq.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
};

export default function DeskOnePage() {
  return (
    <div className="relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line/50">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(255,122,26,0.14),transparent_55%),radial-gradient(ellipse_at_90%_40%,rgba(255,122,26,0.06),transparent_45%),linear-gradient(180deg,rgba(18,18,20,0.2),transparent)]"
        />
        <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <MotionReveal>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-accent">
              {deskOne.sku} · {deskOne.status}
            </p>
            <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-[1.1] tracking-tight text-text-main sm:text-5xl md:text-6xl">
              Exobod {deskOne.name}
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-text-muted sm:text-xl">
              {deskOne.tagline}
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-text-muted sm:text-base">
              {deskOne.summary}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Link
                href="/preorder?body=desk-assistant&intent=desk-one-early-access"
                className="inline-flex items-center justify-center rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-background transition hover:bg-accent-soft"
              >
                Reserve early access
              </Link>
              <Link
                href="/customize?type=desk-assistant"
                className="inline-flex items-center justify-center rounded-xl border border-line px-6 py-3 text-sm font-semibold text-text-main transition hover:border-accent/50 hover:text-accent-soft"
              >
                Customize for desk
              </Link>
              <Link
                href="/demo"
                className="inline-flex items-center justify-center rounded-xl border border-line/70 px-6 py-3 text-sm font-semibold text-text-muted transition hover:border-accent/40 hover:text-text-main"
              >
                Book a demo
              </Link>
            </div>
            <p className="mt-4 max-w-xl text-xs leading-relaxed text-text-muted/80">
              No fake inventory. Early access means builder / EVT queue — not “order now, delivered.” Scope and
              timelines lock only after review.
            </p>
          </MotionReveal>
        </div>
      </section>

      {/* What it is / is not */}
      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:grid-cols-2 sm:px-6 sm:py-14">
        <MotionReveal>
          <div className="h-full rounded-2xl border border-line/60 bg-surface/60 p-6 shadow-panel sm:p-8">
            <h2 className="text-xl font-semibold text-text-main">What it is</h2>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-text-muted">
              {deskOneWhatItIs.map((line) => (
                <li key={line} className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </MotionReveal>
        <MotionReveal delay={0.04}>
          <div className="h-full rounded-2xl border border-line/60 bg-surface/40 p-6 shadow-panel sm:p-8">
            <h2 className="text-xl font-semibold text-text-main">What it is not</h2>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-text-muted">
              {deskOneWhatItIsNot.map((line) => (
                <li key={line} className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-text-muted/50" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </MotionReveal>
      </section>

      {/* Specs */}
      <section className="border-y border-line/50 bg-surface/25 py-10 sm:py-14">
        <div className="mx-auto max-w-6xl space-y-8 px-4 sm:px-6">
          <MotionReveal>
            <SectionHeader
              eyebrow="Specs"
              title="Builder-kit targets for EXB-D1"
              description="Numbers below describe the EVT path from our Desk One docs. Servo brands, CAD, and certification are not production claims."
            />
          </MotionReveal>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {deskOneSpecs.map((row, idx) => (
              <MotionReveal key={row.label} delay={idx * 0.015}>
                <div className="rounded-xl border border-line/55 bg-background/50 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-accent">{row.label}</p>
                  <p className="mt-1 text-sm leading-snug text-text-muted">{row.value}</p>
                </div>
              </MotionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* EVT framing */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <MotionReveal>
          <div className="rounded-2xl border border-accent/25 bg-gradient-to-br from-accent/10 via-surface/50 to-background p-6 sm:p-10">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-accent">
              Early builders
            </p>
            <h2 className="mt-3 max-w-2xl text-2xl font-semibold text-text-main sm:text-3xl">
              EVT framing, not retail theater.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-text-muted sm:text-base">
              Desk One exists so makers and labs can invent, buy parts, print a crude mount, flash firmware over
              USB, and validate joint limits / e-stop on real actuators — in parallel with software demos. We do
              not market this as production-ready customer hardware, “safe for kids,” or the same as a closed-loop
              configurator SKU.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/preorder?body=desk-assistant&intent=desk-one-early-access"
                className="inline-flex items-center justify-center rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-background transition hover:bg-accent-soft"
              >
                Start early-access inquiry
              </Link>
              <Link
                href="/customize?type=desk-assistant"
                className="inline-flex items-center justify-center rounded-xl border border-line px-5 py-2.5 text-sm font-semibold text-text-main transition hover:border-accent/45"
              >
                Open desk configurator
              </Link>
            </div>
          </div>
        </MotionReveal>
      </section>

      {/* FAQ */}
      <section className="border-t border-line/50 bg-surface/20 py-10 sm:py-14">
        <div className="mx-auto max-w-3xl space-y-6 px-4 sm:px-6">
          <MotionReveal>
            <SectionHeader
              eyebrow="FAQ"
              title="Straight answers on Desk One."
              description="If a sentence still works after removing “prototype / builder / EVT,” we probably over-claimed — and we cut it."
              align="center"
              className="text-center"
            />
          </MotionReveal>
          <div className="space-y-2">
            {deskOneFaq.map((item, idx) => (
              <MotionReveal key={item.q} delay={idx * 0.02}>
                <details className="rounded-xl border border-line/60 bg-surface/70 px-4 py-3 open:border-accent/35 open:bg-surface-soft/55">
                  <summary className="cursor-pointer list-none text-sm font-semibold text-text-main marker:content-none [&::-webkit-details-marker]:hidden">
                    {item.q}
                  </summary>
                  <p className="mt-3 border-t border-line/40 pt-3 text-sm leading-relaxed text-text-muted">
                    {item.a}
                  </p>
                </details>
              </MotionReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
