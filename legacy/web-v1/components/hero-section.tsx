"use client";

import { BrandWordmark } from "@/components/brand-logo";
import { HeroProductVisual } from "@/components/hero-product-visual";
import { MotionReveal } from "@/components/motion-reveal";
import { primaryCta, secondaryCta } from "@/lib/ctas";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative min-h-[min(92vh,900px)] overflow-x-clip">
      {/* Full-bleed cinematic atmosphere (Joby / Terafab depth) */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_70%_20%,rgba(255,122,26,0.16),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_10%_80%,rgba(40,55,75,0.35),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#050709_0%,#070a0d_45%,#0a0e14_100%)]" />
        <div
          className="absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.028)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.028)_1px,transparent_1px)",
            backgroundSize: "56px 56px",
            maskImage: "linear-gradient(180deg, black 0%, transparent 85%)",
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.55)_100%)]" />
      </div>

      <div className="relative mx-auto flex min-h-[min(92vh,900px)] max-w-6xl flex-col justify-center gap-10 px-4 pb-14 pt-10 sm:gap-12 sm:px-6 sm:pb-16 sm:pt-12 lg:flex-row lg:items-center lg:gap-10 xl:gap-16">
        <MotionReveal className="flex min-w-0 flex-1 flex-col space-y-7 lg:max-w-xl">
          <div className="space-y-5">
            <BrandWordmark className="text-3xl sm:text-4xl md:text-[2.75rem]" />
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-accent">
              EXB-D1 · Desk One · EVT
            </p>
            <h1 className="font-display text-[2.35rem] font-semibold leading-[1.05] tracking-tight text-text-main sm:text-5xl lg:text-[3.4rem] xl:text-[3.75rem]">
              Your phone.
              <br />
              <span className="text-accent">A real body.</span>
            </h1>
            <p className="max-w-md text-base leading-relaxed text-text-muted sm:text-lg">
              Stationary 2-axis pan/tilt dock for early builders. The handset stays the brain —
              camera, mic, screen, and the assistant you already run.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Link
              href={primaryCta.href}
              className="inline-flex w-fit items-center justify-center rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-background shadow-[0_0_48px_-12px_rgba(255,122,26,0.45)] transition hover:bg-accent-soft"
            >
              {primaryCta.label}
            </Link>
            <Link
              href={secondaryCta.href}
              className="inline-flex w-fit items-center justify-center rounded-xl border border-line/70 px-6 py-3 text-sm font-semibold text-text-main transition hover:border-accent/45 hover:text-accent-soft"
            >
              {secondaryCta.label}
            </Link>
          </div>

          <p className="max-w-sm text-xs leading-relaxed text-text-muted/85">
            Honest EVT framing — not a walker, not battery-powered v1, not finished retail inventory.{" "}
            <a href="#embodiment" className="text-accent-soft underline-offset-2 hover:underline">
              Explore body concepts
            </a>
          </p>
        </MotionReveal>

        <MotionReveal
          className="flex w-full min-w-0 flex-1 justify-center lg:justify-end"
          delay={0.06}
        >
          <HeroProductVisual />
        </MotionReveal>
      </div>
    </section>
  );
}
