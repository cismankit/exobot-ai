"use client";

import { MotionReveal } from "@/components/motion-reveal";
import { SectionHeader } from "@/components/section-header";
import { EXOBOD_HERO_IMAGE } from "@/lib/site-assets";
import { targetSpecs } from "@/lib/content";
import Image from "next/image";
import Link from "next/link";

const highlightSpecs = targetSpecs.slice(0, 8);

export function HomeProductHub() {
  return (
    <section className="border-y border-line/50 bg-surface/20 py-8 sm:py-10">
      <div className="mx-auto max-w-6xl space-y-6 px-4 sm:space-y-8 sm:px-6">
        <MotionReveal>
          <SectionHeader
            eyebrow="Product"
            title="Robot, specs, and reality in one view."
            description="Targets below are engineering goals per configuration, not checkout SKUs. Final numbers lock in your agreement after review."
          />
        </MotionReveal>
        <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
          <MotionReveal>
            <div className="relative overflow-hidden rounded-3xl border border-line/60 bg-gradient-to-b from-surface/70 to-background shadow-panel">
              <div className="relative aspect-[3/4] w-full max-h-[min(70vh,640px)] mx-auto">
                <Image
                  src={EXOBOD_HERO_IMAGE}
                  alt="Exobod 3D concept render"
                  fill
                  className="object-contain p-4"
                  sizes="(max-width: 1024px) 100vw, 480px"
                  priority
                />
              </div>
              <p className="border-t border-line/50 px-4 py-2 text-center font-mono text-[10px] text-text-muted">
                3D render for visualization. Production geometry may differ by build tier.
              </p>
            </div>
          </MotionReveal>
          <MotionReveal delay={0.04}>
            <div className="grid gap-2 sm:grid-cols-2">
              {highlightSpecs.map((row) => (
                <div
                  key={row.label}
                  className="rounded-xl border border-line/55 bg-background/50 px-3 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                >
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-accent">{row.label}</p>
                  <p className="mt-1 text-xs leading-snug text-text-muted">{row.value}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href="/build-system"
                className="inline-flex items-center rounded-xl border border-line px-4 py-2.5 text-xs font-semibold text-text-main transition hover:border-accent/45 hover:text-accent-soft"
              >
                Full architecture
              </Link>
              <Link
                href="/trust"
                className="inline-flex items-center rounded-xl border border-accent/35 bg-accent/10 px-4 py-2.5 text-xs font-semibold text-text-main transition hover:bg-accent/15"
              >
                Buyer protections
              </Link>
            </div>
          </MotionReveal>
        </div>
      </div>
    </section>
  );
}
