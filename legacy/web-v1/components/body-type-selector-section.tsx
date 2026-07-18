"use client";

import { useEmbodiment } from "@/components/embodiment-context";
import { ExobodVisual } from "@/components/exobod-visual";
import { MotionReveal } from "@/components/motion-reveal";
import { SectionHeader } from "@/components/section-header";
import { secondaryCta } from "@/lib/ctas";
import { bodyTypes } from "@/lib/content";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function BodyTypeSelectorSection() {
  const { body, setBody } = useEmbodiment();
  const active = bodyTypes.find((b) => b.slug === body) ?? bodyTypes[0];

  return (
    <section id="embodiment" className="border-y border-line/40 bg-surface/20 py-12 sm:py-16">
      <div className="mx-auto max-w-6xl space-y-10 px-4 sm:px-6">
        <MotionReveal>
          <SectionHeader
            eyebrow="Body concepts"
            title="One phone brain. Different bodies."
            description="Desk One is the real EVT product. Walker, Rover, and Utility remain concept paths — tap to preview the silhouette."
            align="center"
            className="mx-auto max-w-2xl text-center"
          />
        </MotionReveal>

        <MotionReveal delay={0.04}>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {bodyTypes.map((item) => (
              <button
                key={item.slug}
                type="button"
                onClick={() => setBody(item.slug)}
                className={cn(
                  "rounded-xl border px-4 py-2.5 text-sm font-semibold transition",
                  body === item.slug
                    ? "border-accent/70 bg-accent/15 text-text-main shadow-[0_0_0_1px_rgba(255,122,26,0.2)]"
                    : "border-line/60 bg-background/40 text-text-muted hover:border-accent/35 hover:text-text-main",
                )}
              >
                {item.name}
                {item.slug === "desk-assistant" ? (
                  <span className="ml-1.5 font-mono text-[10px] font-normal uppercase tracking-wider text-accent">
                    EVT
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        </MotionReveal>

        <MotionReveal delay={0.06}>
          <div className="mx-auto grid max-w-3xl items-center gap-8 sm:grid-cols-[minmax(0,240px)_1fr] sm:gap-10">
            <ExobodVisual bodyType={active.slug} />
            <div className="space-y-3 text-center sm:text-left">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">
                {active.slug === "desk-assistant" ? "Flagship path" : "Concept path"}
              </p>
              <h3 className="font-display text-2xl font-semibold tracking-tight text-text-main">
                {active.name}
              </h3>
              <p className="text-sm leading-relaxed text-text-muted">{active.purpose}</p>
              <p className="text-xs leading-relaxed text-text-muted sm:text-sm">{active.bestFor}</p>
              <div className="flex flex-col items-center gap-2 pt-2 sm:flex-row sm:items-start">
                {active.slug === "desk-assistant" ? (
                  <>
                    <Link
                      href="/desk-one"
                      className="inline-flex items-center justify-center rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-background transition hover:bg-accent-soft"
                    >
                      See Desk One
                    </Link>
                    <Link
                      href="/customize?type=desk-assistant"
                      className="inline-flex items-center justify-center rounded-xl border border-line px-5 py-2.5 text-sm font-semibold text-text-main transition hover:border-accent/45"
                    >
                      {secondaryCta.label}
                    </Link>
                  </>
                ) : (
                  <Link
                    href={`/customize?type=${active.slug}`}
                    className="inline-flex items-center justify-center rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-background transition hover:bg-accent-soft"
                  >
                    {secondaryCta.label} — {active.name}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </MotionReveal>
      </div>
    </section>
  );
}
