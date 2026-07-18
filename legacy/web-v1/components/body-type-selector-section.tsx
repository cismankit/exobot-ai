"use client";

import { useEmbodiment } from "@/components/embodiment-context";
import { MotionReveal } from "@/components/motion-reveal";
import { SectionHeader } from "@/components/section-header";
import { secondaryCta } from "@/lib/ctas";
import { bodyTypes, type BodyTypeSlug } from "@/lib/content";
import { BODY_DESK, BODY_ROVER, BODY_UTILITY, BODY_WALKER } from "@/lib/site-assets";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

const bodyVisuals: Record<BodyTypeSlug, { src: string; note: string }> = {
  walker: {
    src: BODY_WALKER,
    note: "Biped concept visualization",
  },
  "desk-assistant": {
    src: BODY_DESK,
    note: "Desk One EVT form",
  },
  rover: {
    src: BODY_ROVER,
    note: "Wheeled concept visualization",
  },
  "utility-helper": {
    src: BODY_UTILITY,
    note: "Utility helper concept visualization",
  },
};

export function BodyTypeSelectorSection() {
  const { body, setBody } = useEmbodiment();
  const active = bodyTypes.find((b) => b.slug === body) ?? bodyTypes[0];
  const visual = bodyVisuals[active.slug];

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
          <div className="grid overflow-hidden rounded-3xl border border-line/70 bg-background/55 shadow-panel lg:grid-cols-[1.15fr_0.85fr]">
            {/* Portrait-friendly frame so contain shows full Walker / concept bodies */}
            <div className="relative aspect-[3/4] min-h-[420px] overflow-hidden sm:min-h-[560px] lg:aspect-auto lg:min-h-[640px]">
              <div className="absolute inset-0 p-5 sm:p-8">
                <div className="relative h-full w-full">
                  <Image
                    key={active.slug}
                    src={visual.src}
                    alt={`${active.name} Exobod ${active.slug === "desk-assistant" ? "form" : "concept"}`}
                    fill
                    className="object-contain object-center transition-opacity duration-300"
                    sizes="(max-width: 1024px) 100vw, 620px"
                  />
                </div>
              </div>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
              <p className="absolute bottom-4 left-4 rounded-full border border-white/15 bg-black/60 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-white/75 backdrop-blur">
                {visual.note} · not final hardware
              </p>
            </div>
            <div className="flex flex-col justify-center space-y-4 p-6 text-left sm:p-9 lg:p-10">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">
                {active.slug === "desk-assistant" ? "Flagship path" : "Concept path"}
              </p>
              <h3 className="font-display text-3xl font-semibold tracking-tight text-text-main sm:text-4xl">
                {active.name}
              </h3>
              <p className="text-base leading-relaxed text-text-muted">{active.purpose}</p>
              <p className="text-sm leading-relaxed text-text-muted">{active.bestFor}</p>
              <div className="grid grid-cols-2 gap-2 border-t border-line/50 pt-5">
                {active.actions.map((action) => (
                  <span key={action} className="rounded-lg border border-line/50 bg-surface/55 px-3 py-2 text-xs font-medium text-text-main">
                    {action}
                  </span>
                ))}
              </div>
              <div className="flex flex-col gap-2 pt-2 sm:flex-row">
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
