import { CtaPair } from "@/components/cta-pair";
import { InterestForm } from "@/components/interest-form";
import { MotionReveal } from "@/components/motion-reveal";
import { preorderPageCopy } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Join Preorder List — Exobod.ai",
  description:
    "Preorder interest for Exobod prototype builds, maker kits, and custom engineering consultations—concept-stage hardware only.",
};

export default function PreorderPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-10 sm:space-y-10 sm:px-6 sm:py-14">
      <MotionReveal>
        <div className="space-y-4 text-center">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-accent">
            Preorder interest
          </p>
          <h1 className="text-4xl font-semibold leading-tight text-text-main sm:text-5xl">
            Join the preorder list with your lab constraints.
          </h1>
          <p className="mx-auto max-w-3xl text-base leading-relaxed text-text-muted sm:text-lg">
            Tell us which handset you mount, what the body must do on the bench, and how far along your team
            is. We route qualified notes to prototype shells, articulated kits, or a scoped engineering
            consult—never silent ship promises.
          </p>
          <div className="flex justify-center pt-2">
            <CtaPair className="justify-center" />
          </div>
        </div>
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
          <h2 className="text-xl font-semibold text-text-main sm:text-2xl">Preorder + intake form</h2>
          <p className="mt-2 text-sm leading-relaxed text-text-muted">
            No payment fields. Submitting is consent for email follow-up about prototype feasibility—not a
            binding manufacturing PO.
          </p>
          <div className="mt-6">
            <InterestForm submitLabel="Send preorder request" />
          </div>
        </div>
      </MotionReveal>
    </div>
  );
}
