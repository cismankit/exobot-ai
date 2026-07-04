import { ArchitectureDiagram } from "@/components/architecture-diagram";
import { CtaPair } from "@/components/cta-pair";
import { MotionReveal } from "@/components/motion-reveal";
import { SectionHeader } from "@/components/section-header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Build System | Exobod.ai",
  description:
    "Control plane, mechanical stack, MCU, servos, hybrid frame, and power architecture for Exobod smartphone embodiment prototypes.",
};

export default function BuildSystemPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:space-y-8 sm:px-6 sm:py-10">
      <MotionReveal>
        <SectionHeader
          eyebrow="Hardware"
          title="3D printed where it should be. Metal where it matters."
          description="Exobod splits cleanly: the handset runs assistants and vision; the frame carries mechanical load; the controller enforces safety clamps before any torque hits the floor. Below is the actual architecture we prototype against - two parallel stacks that meet at the servo harness and mount datum."
        />
      </MotionReveal>

      <MotionReveal delay={0.04}>
        <ArchitectureDiagram />
      </MotionReveal>

      <MotionReveal delay={0.06}>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-line/70 bg-surface/70 p-5 shadow-panel sm:p-6">
            <h3 className="text-lg font-semibold text-text-main">Hybrid materials</h3>
            <p className="mt-3 text-sm leading-relaxed text-text-muted">
              Printed carriers prove geometry quickly; metal linkages and shoulder blocks handle shock and
              bending moments we measure on the test stand. Every preorder path includes a materials gate
              before we cut hardened parts.
            </p>
          </div>
          <div className="rounded-2xl border border-line/70 bg-surface/70 p-5 shadow-panel sm:p-6">
            <h3 className="text-lg font-semibold text-text-main">Power + safety</h3>
            <p className="mt-3 text-sm leading-relaxed text-text-muted">
              Fused battery packs feed burst current into servo banks with monitored bus voltage. Manual
              estop and software clamps both land on the MCU - dual paths because this is lab hardware, not a
              certified consumer appliance.
            </p>
          </div>
        </div>
      </MotionReveal>

      <MotionReveal delay={0.08}>
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-line/60 bg-surface-soft/40 px-4 py-6 sm:flex-row">
          <p className="text-center text-sm text-text-muted sm:text-left">
            Ready to stress-fit a mount or pick a torque tier? Move to the configurator with your lab constraints in hand.
          </p>
          <CtaPair className="sm:justify-end" />
        </div>
      </MotionReveal>
    </div>
  );
}
