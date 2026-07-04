import { CtaPair } from "@/components/cta-pair";
import { InfographicStrip } from "@/components/infographic-strip";
import { InterestForm } from "@/components/interest-form";
import { MotionReveal } from "@/components/motion-reveal";
import { preorderPageCopy } from "@/lib/content";
import { ClipboardList, FileCheck2, PackageCheck, Settings2 } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Inquiry | Exobod.ai",
  description:
    "Start an order inquiry for Exobod custom builds, team deployments, education kits, and engineering-backed configurations.",
};

export default function PreorderPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:space-y-8 sm:px-6 sm:py-10">
      <MotionReveal>
        <div className="space-y-4 text-center">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-accent">
            Order inquiry
          </p>
          <h1 className="text-4xl font-semibold leading-tight text-text-main sm:text-5xl">
            Start your Exobod order with your exact requirements.
          </h1>
          <p className="mx-auto max-w-3xl text-base leading-relaxed text-text-muted sm:text-lg">
            Share your handset, body type, use case, and deployment goals. We match you with the right
            configuration path and move qualified requests into quoting and production scheduling.
          </p>
          <div className="flex justify-center pt-2">
            <CtaPair className="justify-center" />
          </div>
        </div>
      </MotionReveal>

      <MotionReveal>
        <InfographicStrip
          items={[
            { title: "Step 1: Configure", caption: "Choose phone type, body, and use case.", icon: Settings2 },
            { title: "Step 2: Submit", caption: "Send a single order inquiry form.", icon: ClipboardList },
            { title: "Step 3: Confirm", caption: "Get recommended build + quote path.", icon: FileCheck2 },
            { title: "Step 4: Build & Ship", caption: "Approved orders move to production scheduling.", icon: PackageCheck },
          ]}
        />
      </MotionReveal>

      <div className="grid gap-4 md:grid-cols-3 md:gap-5">
        <MotionReveal>
          <div className="h-full rounded-2xl border border-line/70 bg-surface/70 p-5 shadow-panel">
            <h2 className="text-base font-semibold text-text-main">Who this is for</h2>
            <p className="mt-3 text-sm leading-relaxed text-text-muted">{preorderPageCopy.whoFor}</p>
          </div>
        </MotionReveal>
        <MotionReveal delay={0.03}>
          <div className="h-full rounded-2xl border border-line/70 bg-surface/70 p-5 shadow-panel">
            <h2 className="text-base font-semibold text-text-main">What you can request</h2>
            <p className="mt-3 text-sm leading-relaxed text-text-muted">{preorderPageCopy.whatRequest}</p>
          </div>
        </MotionReveal>
        <MotionReveal delay={0.06}>
          <div className="h-full rounded-2xl border border-line/70 bg-surface/70 p-5 shadow-panel">
            <h2 className="text-base font-semibold text-text-main">What happens next</h2>
            <p className="mt-3 text-sm leading-relaxed text-text-muted">{preorderPageCopy.whatNext}</p>
          </div>
        </MotionReveal>
      </div>

      <MotionReveal>
        <div className="rounded-2xl border border-line/70 bg-surface-soft/55 p-5 shadow-panel backdrop-blur sm:p-8">
          <h2 className="text-xl font-semibold text-text-main sm:text-2xl">Order details form</h2>
          <p className="mt-2 text-sm leading-relaxed text-text-muted">
            No payment required here. This form starts your sales and engineering review so we can confirm the
            right build plan before order finalization.
          </p>
          <div className="mt-6">
            <InterestForm submitLabel="Send order inquiry" />
          </div>
        </div>
      </MotionReveal>
    </div>
  );
}
