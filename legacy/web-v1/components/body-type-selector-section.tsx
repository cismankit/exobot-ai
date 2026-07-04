"use client";

import { useEmbodiment } from "@/components/embodiment-context";
import { MotionReveal } from "@/components/motion-reveal";
import { SectionHeader } from "@/components/section-header";
import { bodyTypes } from "@/lib/content";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { primaryCta } from "@/lib/ctas";

export function BodyTypeSelectorSection() {
  const { body, setBody } = useEmbodiment();
  const active = bodyTypes.find((b) => b.slug === body) ?? bodyTypes[0];

  return (
    <section id="embodiment" className="border-y border-line/50 bg-surface/25 py-10 sm:py-14">
      <div className="mx-auto max-w-6xl space-y-8 px-4 sm:space-y-10 sm:px-6">
        <MotionReveal>
          <SectionHeader
            eyebrow="Body type"
            title="Body Type Selector"
            description="Tap a chassis. The hero visual above updates to match. Each path is preorder-interest only until engineering signs off."
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
              </button>
            ))}
          </div>
        </MotionReveal>

        <MotionReveal delay={0.06}>
          <div className="mx-auto max-w-2xl rounded-2xl border border-line/60 bg-surface/70 p-5 text-center shadow-panel sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Selected</p>
            <h3 className="mt-2 text-xl font-semibold text-text-main">{active.name}</h3>
            <p className="mt-3 text-sm leading-relaxed text-text-muted">{active.purpose}</p>
            <p className="mt-2 text-xs leading-relaxed text-text-muted sm:text-sm">{active.bestFor}</p>
            <div className="mt-5">
              <Link
                href={`/customize?type=${active.slug}`}
                className="inline-flex items-center justify-center rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-background transition hover:bg-accent-soft"
              >
                {primaryCta.label} - {active.name}
              </Link>
            </div>
          </div>
        </MotionReveal>
      </div>
    </section>
  );
}
