import { PartnerForm } from "@/components/partner-form";
import { MotionReveal } from "@/components/motion-reveal";
import { forBuilders, partnersPageCopy } from "@/lib/content";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Partners | Exobod.ai",
  description:
    "Print shops, schools, and institutional buyers — batch EDU kits, white-label shells, and regional fabrication partners.",
};

export default function PartnersPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:space-y-8 sm:px-6 sm:py-10">
      <MotionReveal>
        <div className="space-y-4 text-center">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-accent">
            {partnersPageCopy.subhead}
          </p>
          <h1 className="text-4xl font-semibold leading-tight text-text-main sm:text-5xl">
            {partnersPageCopy.headline}
          </h1>
          <p className="mx-auto max-w-3xl text-base leading-relaxed text-text-muted sm:text-lg">
            {partnersPageCopy.intro}
          </p>
        </div>
      </MotionReveal>

      <div className="grid gap-4 md:grid-cols-2 md:gap-5">
        <MotionReveal>
          <div className="h-full rounded-2xl border border-line/70 bg-surface/70 p-5 shadow-panel">
            <h2 className="text-base font-semibold text-text-main">Print shops & fabricators</h2>
            <p className="mt-3 text-sm leading-relaxed text-text-muted">
              {partnersPageCopy.printShopBlurb}
            </p>
          </div>
        </MotionReveal>
        <MotionReveal delay={0.03}>
          <div className="h-full rounded-2xl border border-line/70 bg-surface/70 p-5 shadow-panel">
            <h2 className="text-base font-semibold text-text-main">Schools & makerspaces</h2>
            <p className="mt-3 text-sm leading-relaxed text-text-muted">
              {partnersPageCopy.schoolBlurb}
            </p>
          </div>
        </MotionReveal>
      </div>

      <MotionReveal>
        <div className="rounded-2xl border border-line/70 bg-surface-soft/55 p-5 shadow-panel backdrop-blur sm:p-8">
          <h2 className="text-xl font-semibold text-text-main sm:text-2xl">Batch quote interest</h2>
          <p className="mt-2 text-sm leading-relaxed text-text-muted">
            {forBuilders.copy}{" "}
            <Link href="/demo" className="font-semibold text-accent-soft underline-offset-4 hover:underline">
              Book a demo
            </Link>{" "}
            for a live walkthrough before submitting volume interest.
          </p>
          <div className="mt-6">
            <PartnerForm />
          </div>
        </div>
      </MotionReveal>
    </div>
  );
}
