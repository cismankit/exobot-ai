import { Configurator } from "@/components/configurator";
import { CtaPair } from "@/components/cta-pair";
import { MotionReveal } from "@/components/motion-reveal";
import { secondaryCta } from "@/lib/ctas";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Customize | Exobod.ai",
  description:
    "Configure phone mount, body architecture, finish, skill pack, accessories, and build tier. Submit a custom prototype request today - response is human, not automated checkout.",
};

export default function CustomizePage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:space-y-8 sm:px-6 sm:py-10">
      <MotionReveal>
        <div className="space-y-5 text-center">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-accent">
            Custom build desk
          </p>
          <h1 className="text-4xl font-semibold leading-tight text-text-main sm:text-5xl">
            Design My Exobod - file a build request today.
          </h1>
          <p className="mx-auto max-w-3xl text-base leading-relaxed text-text-muted sm:text-lg">
            Lock your handset family, chassis, finish, motion pack, accessory, and prototype tier. Submitting
            fires a structured packet to our hardware team; you get a human review - not a fake cart
            confirmation. Final BOM, torque, and timelines follow a signed prototype agreement.
          </p>
          <div className="flex flex-col items-center gap-3">
            <CtaPair className="justify-center" />
            <p className="max-w-xl text-xs text-text-muted">
              Already locked options elsewhere?{" "}
              <Link href={secondaryCta.href} className="font-semibold text-accent-soft underline-offset-4 hover:underline">
                {secondaryCta.label}
              </Link>{" "}
              with a shorter form.
            </p>
          </div>
        </div>
      </MotionReveal>

      <Suspense
        fallback={
          <div className="rounded-2xl border border-line/60 bg-surface/60 p-8 text-center text-sm text-text-muted">
            Loading configurator…
          </div>
        }
      >
        <Configurator />
      </Suspense>
    </div>
  );
}
