import { MotionReveal } from "@/components/motion-reveal";
import { SectionHeader } from "@/components/section-header";
import { homeFaq } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ | Exobod.ai",
  description: "Frequently asked questions about Exobod hardware, ordering, safety, and capabilities.",
};

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-8 sm:px-6 sm:py-10">
      <MotionReveal>
        <SectionHeader
          eyebrow="FAQ"
          title="Straight answers."
          description="Prototype hardware, honest limits, and how we work with schools, vendors, and labs."
        />
      </MotionReveal>
      <div className="space-y-2">
        {homeFaq.map((item, idx) => (
          <MotionReveal key={item.q} delay={idx * 0.015}>
            <details className="rounded-xl border border-line/60 bg-surface/70 px-4 py-3 open:border-accent/35 open:bg-surface-soft/55">
              <summary className="cursor-pointer list-none text-sm font-semibold text-text-main marker:content-none [&::-webkit-details-marker]:hidden">
                {item.q}
              </summary>
              <p className="mt-3 border-t border-line/40 pt-3 text-sm leading-relaxed text-text-muted">{item.a}</p>
            </details>
          </MotionReveal>
        ))}
      </div>
    </div>
  );
}
