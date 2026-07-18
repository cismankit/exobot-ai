"use client";

import { HeroProductVisual } from "@/components/hero-product-visual";
import { MotionReveal } from "@/components/motion-reveal";
import { primaryCta, secondaryCta } from "@/lib/ctas";
import { heroTrustChips, site } from "@/lib/content";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative overflow-x-clip pb-10 pt-8 sm:pb-14 sm:pt-10 lg:pb-16">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:40px_40px] opacity-50" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-accent/10 via-accent/[0.02] to-transparent blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background via-transparent to-transparent" />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-4 sm:gap-12 sm:px-6 lg:flex-row lg:items-center lg:gap-16">
        <MotionReveal className="flex min-w-0 flex-1 flex-col space-y-6">
          <div className="space-y-4">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-accent">
              Smartphone · exoskeleton · motion
            </p>
            <h1 className="font-display text-4xl font-semibold leading-[1.08] tracking-tight text-text-main sm:text-5xl lg:text-[3.35rem] xl:text-[3.65rem]">
              Give Your <span className="text-accent">Phone</span> a Real{" "}
              <span className="text-accent">Body</span>.
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-text-muted sm:text-lg">
              Mount your iPhone or Android in a removable core. Exobod supplies the limbs, wheels,
              mounts, and servo hardware; the handset keeps camera, mic, screen, and the assistant stack
              you already run.
            </p>
            <p className="text-sm font-medium text-text-main/90">{site.secondary}</p>
          </div>
          <div className="max-w-xl rounded-2xl border border-accent/25 bg-surface-soft/40 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-sm sm:p-5">
            <p className="text-xs leading-relaxed text-text-muted sm:text-sm">
              <span className="font-semibold text-text-main/95">Built-to-order customization.</span> Configure
              your body plan, mounts, motion package, and accessories. We guide each request through review,
              quoting, and production scheduling.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Link
              href={primaryCta.href}
              className="inline-flex w-fit items-center justify-center rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-background shadow-[0_0_40px_-10px_rgba(255,122,26,0.35)] transition hover:bg-accent-soft"
            >
              {primaryCta.label}
            </Link>
            <Link
              href={secondaryCta.href}
              className="text-sm font-medium text-text-muted underline-offset-4 transition hover:text-accent-soft hover:underline"
            >
              {secondaryCta.label}
            </Link>
          </div>
          <p className="font-mono text-[10px] text-text-muted">
            <a href="#embodiment" className="text-accent-soft underline-offset-2 hover:underline">
              Try body types →
            </a>
          </p>
          <div>
            <p className="mb-2.5 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-accent/90">
              Built for
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-2.5 lg:grid-cols-1 xl:grid-cols-2">
              {heroTrustChips.map((chip) => (
                <span
                  key={chip}
                  className="inline-flex min-h-[2.5rem] items-center rounded-full border border-line/80 bg-background/40 px-3.5 py-2 text-center text-[11px] font-medium leading-snug text-text-main/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:text-left sm:text-xs"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </MotionReveal>
        <MotionReveal className="flex w-full min-w-0 flex-1 justify-center lg:justify-end" delay={0.06}>
          <HeroProductVisual />
        </MotionReveal>
      </div>
    </section>
  );
}
