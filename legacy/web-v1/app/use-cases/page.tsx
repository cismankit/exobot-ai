import { MotionReveal } from "@/components/motion-reveal";
import { SectionHeader } from "@/components/section-header";
import { UseCaseCard } from "@/components/use-case-card";
import { pageUseCases } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Use Cases | Exobod.ai",
  description:
    "Education, creators, makers, desk assistants, demos, accessibility research, robotics learning, and AI companion R&D with Exobod.",
};

export default function UseCasesPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:space-y-8 sm:px-6 sm:py-10">
      <MotionReveal>
        <SectionHeader
          eyebrow="Use cases"
          title="Handset-first motion for concrete bench problems."
          description="Each card ties a lab or studio problem to an Exobod configuration. Nothing here claims medical clearance, consumer safety certification, or autonomous operation in the wild."
          align="center"
          className="mx-auto text-center"
        />
      </MotionReveal>

      <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
        {pageUseCases.map((item, idx) => (
          <MotionReveal key={item.title} delay={idx * 0.02}>
            <UseCaseCard {...item} />
          </MotionReveal>
        ))}
      </div>
    </div>
  );
}
