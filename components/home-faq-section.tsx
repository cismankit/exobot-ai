import { MotionReveal } from "@/components/motion-reveal";
import { SectionHeader } from "@/components/section-header";
import { homeFaq } from "@/lib/content";

export function HomeFaqSection() {
  return (
    <section className="border-y border-line/50 bg-surface/20 py-10 sm:py-14">
      <div className="mx-auto max-w-3xl space-y-8 px-4 sm:px-6">
        <MotionReveal>
          <SectionHeader
            eyebrow="FAQ"
            title="Straight answers before you file interest."
            description="Prototype hardware, honest limits, and how we work with schools, vendors, and labs."
            align="center"
            className="text-center"
          />
        </MotionReveal>
        <div className="space-y-2">
          {homeFaq.map((item, idx) => (
            <MotionReveal key={item.q} delay={idx * 0.02}>
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
    </section>
  );
}
