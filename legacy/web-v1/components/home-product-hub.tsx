"use client";

import { MotionReveal } from "@/components/motion-reveal";
import { SectionHeader } from "@/components/section-header";
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
          <MotionReveal className="min-w-0">
            <div className="relative overflow-hidden rounded-3xl border border-line/60 bg-gradient-to-b from-surface/70 to-background shadow-panel">
              {/* Tall portrait frame: hero-robot is ~1:2 — contain + padding keeps full body */}
              <div className="relative aspect-[3/4] min-h-[480px] w-full sm:min-h-[560px]">
                <div className="absolute inset-0 p-5 sm:p-8">
                  <div className="relative h-full w-full">
                    <Image
                      src="/exobod/hero-robot.png"
                      alt="Phone-centered Exobod robot concept"
                      fill
                      className="object-contain object-center"
                      sizes="(max-width: 1024px) 100vw, 576px"
                    />
                  </div>
                </div>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">Phone remains the visible core</p>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-white/80">
                    The frame adds mounting and motion around hardware you already know. Exact geometry, joints, and materials lock only after configuration review.
                  </p>
                </div>
              </div>
              <p className="border-t border-line/50 px-4 py-2 text-center font-mono text-[10px] text-text-muted">
                Concept visualization · production geometry may differ by build tier
              </p>
            </div>
          </MotionReveal>
          <MotionReveal className="min-w-0" delay={0.04}>
            <div className="grid min-w-0 gap-2 sm:grid-cols-2">
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
                href="/#build-system"
                className="inline-flex items-center rounded-xl border border-line px-4 py-2.5 text-xs font-semibold text-text-main transition hover:border-accent/45 hover:text-accent-soft"
              >
                Build system
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
