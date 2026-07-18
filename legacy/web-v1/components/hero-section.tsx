"use client";

import { BrandWordmark } from "@/components/brand-logo";
import { HeroEmbers } from "@/components/hero-embers";
import { HeroProductVisual } from "@/components/hero-product-visual";
import { MotionReveal } from "@/components/motion-reveal";
import { primaryCta, secondaryCta } from "@/lib/ctas";
import Link from "next/link";

/**
 * Full-bleed cinematic hero — original walker PNG restored as the dominant visual,
 * staged with dark volcanic atmosphere, ember particles, and filmic grade.
 * Style inspiration only (ATLAS / Joby energy) — no third-party art assets.
 */
export function HeroSection() {
  return (
    <section className="relative min-h-[min(94vh,960px)] overflow-x-clip">
      {/* Volcanic / industrial atmosphere */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#030405_0%,#08060a_38%,#0c0806_72%,#050709_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_72%_48%,rgba(255,122,26,0.22),transparent_58%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_18%_78%,rgba(120,40,10,0.22),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_100%,rgba(255,90,20,0.12),transparent_50%)]" />
        {/* Smoke haze */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_40%_30%,rgba(30,28,32,0.55),transparent_65%)]" />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E\")",
            backgroundSize: "180px 180px",
            mixBlendMode: "overlay",
          }}
        />
        {/* Crushed-black vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_28%,rgba(0,0,0,0.72)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background via-background/80 to-transparent" />
        {/* Filmic contrast grade */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.35)_0%,transparent_35%,rgba(20,8,0,0.25)_100%)] mix-blend-multiply" />
      </div>

      <HeroEmbers />

      <div className="relative z-[3] mx-auto flex min-h-[min(94vh,960px)] max-w-7xl flex-col justify-center gap-8 px-4 pb-16 pt-8 sm:gap-10 sm:px-6 sm:pb-20 sm:pt-10 lg:flex-row lg:items-end lg:gap-6 xl:gap-10">
        <MotionReveal className="flex min-w-0 flex-1 flex-col space-y-6 lg:max-w-[28rem] lg:pb-10 xl:max-w-[32rem]">
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
              className="inline-flex w-fit items-center justify-center rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-background shadow-[0_0_56px_-10px_rgba(255,122,26,0.55)] transition hover:bg-accent-soft"
            >
              {primaryCta.label}
            </Link>
            <Link
              href={secondaryCta.href}
              className="inline-flex w-fit items-center justify-center rounded-xl border border-white/15 bg-black/25 px-6 py-3 text-sm font-semibold text-text-main backdrop-blur-sm transition hover:border-accent/45 hover:text-accent-soft"
            >
              {secondaryCta.label}
            </Link>
          </div>

          <p className="max-w-sm text-xs leading-relaxed text-text-muted/80">
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
          className="relative flex w-full min-w-0 flex-[1.35] justify-center lg:justify-end"
          delay={0.05}
        >
          <HeroProductVisual />
        </MotionReveal>
      </div>
    </section>
  );
}
