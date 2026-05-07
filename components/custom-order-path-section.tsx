import { MotionReveal } from "@/components/motion-reveal";
import { ProcessStep } from "@/components/process-step";
import { SectionHeader } from "@/components/section-header";
import { customOrderSteps } from "@/lib/content";

export function CustomOrderPathSection() {
  return (
    <section className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:space-y-9 sm:px-6 sm:py-14">
      <MotionReveal>
        <SectionHeader
          eyebrow="Preorder path"
          title="Custom Order Path"
          description="Five checkpoints from handset choice to human consultation—every step stays inside prototype and preorder-interest language."
          align="center"
          className="mx-auto max-w-3xl text-center"
        />
      </MotionReveal>
      <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {customOrderSteps.map((row, idx) => (
          <MotionReveal key={row.title} delay={idx * 0.03}>
            <ProcessStep {...row} />
          </MotionReveal>
        ))}
      </div>
    </section>
  );
}
