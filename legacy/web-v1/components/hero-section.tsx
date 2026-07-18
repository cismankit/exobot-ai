"use client";

import { BrandWordmark } from "@/components/brand-logo";
import { HeroProductVisual } from "@/components/hero-product-visual";
import { MotionReveal } from "@/components/motion-reveal";
import { primaryCta, secondaryCta } from "@/lib/ctas";
import Link from "next/link";

/**
 * Clean product hero — phone-as-body render prominent, readable copy + CTAs.
 * Subtle dark premium atmosphere only; no particles, filmic crush, or blocking layers.
 */
export function HeroSection() {
  return (
    <section className="relative overflow-x-clip pb-12 pt-8 sm:pb-16 sm:pt-10 lg:pb-20">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-accent/[0.09] via-accent/[0.02] to-transparent blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background via-background/70 to-transparent" />
      </div>

      <div className="relative z-[1] mx-auto flex max-w-6xl flex-col gap-10 px-4 sm:gap-12 sm:px-6 lg:flex-row lg:items-center lg:gap-14 xl:gap-16">
        <MotionReveal className="flex min-w-0 flex-1 flex-col space-y-6 lg:max-w-[30rem] xl:max-w-[34rem]">
          <div className="space-y-4">
            <BrandWordmark className="text-4xl sm:text-5xl md:text-[3.25rem]" />
            <h1 className="font-display text-[2.4rem] font-semibold leading-[1.05] tracking-tight text-text-main sm:text-5xl lg:text-[3.15rem]">
              Give your phone
              <br />
              <span className="text-accent">a real body.</span>
            </h1>
            <p className="max-w-md text-base leading-relaxed text-text-muted sm:text-lg">
              Your handset stays the brain. Exobod builds the limbs, mounts, and motion around it.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Link
              href={primaryCta.href}
              className="inline-flex w-fit items-center justify-center rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-background shadow-[0_0_40px_-12px_rgba(255,122,26,0.45)] transition hover:bg-accent-soft"
            >
              {primaryCta.label}
            </Link>
            <Link
              href={secondaryCta.href}
              className="inline-flex w-fit items-center justify-center rounded-xl border border-white/15 bg-white/[0.03] px-6 py-3 text-sm font-semibold text-text-main transition hover:border-accent/45 hover:text-accent-soft"
            >
              {secondaryCta.label}
            </Link>
          </div>

          <p className="max-w-sm text-xs leading-relaxed text-text-muted/85">
            Desk One ships first as honest EVT hardware.{" "}
            <Link href="/desk-one" className="text-accent-soft underline-offset-2 hover:underline">
              See Desk One
            </Link>
            {" · "}
            <a href="#embodiment" className="text-accent-soft underline-offset-2 hover:underline">
              Explore body concepts
            </a>
          </p>
        </MotionReveal>

        <MotionReveal
          className="relative flex w-full min-w-0 flex-[1.2] justify-center lg:justify-end"
          delay={0.05}
        >
          <HeroProductVisual />
        </MotionReveal>
      </div>
    </section>
  );
}
