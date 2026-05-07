import { BodyTypeSelectorSection } from "@/components/body-type-selector-section";
import { CtaPair } from "@/components/cta-pair";
import { CTASection } from "@/components/cta-section";
import { CustomOrderPathSection } from "@/components/custom-order-path-section";
import { EmbodimentProvider } from "@/components/embodiment-context";
import { FeatureCard } from "@/components/feature-card";
import { HeroSection } from "@/components/hero-section";
import { HomeFaqSection } from "@/components/home-faq-section";
import {
  ConfigurationsSection,
  ForBuildersSection,
  PhoneAsBrainSection,
  SkillSafetySection,
  TargetSpecsSection,
  WhyExobodSection,
  WorkRolesSection,
} from "@/components/home-conversion-sections";
import { InterestForm } from "@/components/interest-form";
import { MotionReveal } from "@/components/motion-reveal";
import { ProcessStep } from "@/components/process-step";
import { SectionHeader } from "@/components/section-header";
import { SkillsEngineSection } from "@/components/skills-engine-section";
import { CardShell } from "@/components/card-shell";
import { primaryCta, secondaryCta } from "@/lib/ctas";
import { featureCards, homeUseCases, processSteps } from "@/lib/content";
import Link from "next/link";

export default function HomePage() {
  return (
    <EmbodimentProvider>
      <HeroSection />

      <BodyTypeSelectorSection />

      <WhyExobodSection />

      <section id="product" className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:space-y-10 sm:px-6 sm:py-16">
        <MotionReveal>
          <SectionHeader
            eyebrow="Product"
            title="Not a stand. Not a toy. A body for your AI."
            description="Exobod is a handset-first embodiment rig: the phone runs assistants and vision; the exoskeleton carries torque, balance, and tooling so commands leave the screen and hit the bench."
          />
        </MotionReveal>
        <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
          {featureCards.map((card) => (
            <MotionReveal key={card.title}>
              <FeatureCard title={card.title} description={card.description} />
            </MotionReveal>
          ))}
        </div>
        <p className="text-center text-sm text-text-muted">
          Your phone already has the intelligence. Exobod gives it motion.
        </p>
      </section>

      <ConfigurationsSection />

      <WorkRolesSection />

      <section className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:space-y-10 sm:px-6 sm:py-16">
        <MotionReveal>
          <SectionHeader
            eyebrow="How it works"
            title="Same handset. Articulated output."
            description="Skill intents leave the phone, cross the transport layer, hit the on-body MCU, and become torque at the joints—inside the guardrails we ship for each prototype batch."
          />
        </MotionReveal>
        <div className="grid gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-3">
          {processSteps.map((step, idx) => (
            <MotionReveal key={step.title} delay={idx * 0.02}>
              <ProcessStep {...step} />
            </MotionReveal>
          ))}
        </div>
      </section>

      <SkillsEngineSection />

      <TargetSpecsSection />

      <PhoneAsBrainSection />

      <SkillSafetySection />

      <CustomOrderPathSection />

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <MotionReveal>
          <CTASection
            eyebrow="Custom hardware"
            title="Request a build sheet, not a shopping cart."
            description="Pick body architecture, finish, limbs, accessory ports, motion packs, and budget band. We answer with a prototype scope or decline if the load case is outside current lab capacity—never silent shipping promises."
            primary={primaryCta}
            secondary={secondaryCta}
          />
        </MotionReveal>
      </section>

      <section className="border-y border-line/60 bg-surface/28 py-10 sm:py-16">
        <div className="mx-auto max-w-6xl space-y-8 px-4 sm:space-y-9 sm:px-6">
          <MotionReveal>
            <SectionHeader
              eyebrow="Where it ships first"
              title="Makers, classrooms, and prototype labs—not toy aisles."
              description="Each scenario is about mounting the phone you already carry and giving it torque-limited motion for experiments, teaching, or demos."
              align="center"
              className="text-center"
            />
          </MotionReveal>
          <div className="grid gap-3 sm:gap-5 md:grid-cols-2 xl:grid-cols-4">
            {homeUseCases.map((item, idx) => (
              <MotionReveal key={item.title} delay={idx * 0.015}>
                <FeatureCard title={item.title} description={item.description} />
              </MotionReveal>
            ))}
          </div>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/use-cases"
              className="inline-flex items-center justify-center rounded-xl border border-line px-5 py-2.5 text-sm font-semibold text-text-main transition hover:border-accent/50 hover:text-accent-soft"
            >
              Read scenario briefs
            </Link>
            <CtaPair className="sm:justify-center" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-6 px-4 py-10 sm:space-y-8 sm:px-6 sm:py-14">
        <MotionReveal>
          <SectionHeader
            eyebrow="Build system"
            title="3D printed where it should be. Metal where it matters."
            description="Hybrid shells iterate fast; hardened linkages carry joint torque. Controller packs, fused power, and harness exits are laid out for serviceability on the bench—not hidden glue blobs."
          />
        </MotionReveal>
        <MotionReveal delay={0.04}>
          <CardShell className="space-y-4" hover={false}>
            <ul className="space-y-2.5 text-sm text-text-muted">
              <li>Printed carriers and covers for geometry experiments without CNC lead time.</li>
              <li>Metal billet or plate linkages at hips, shoulders, and drivetrain nodes that see shock loads.</li>
              <li>Servo channels matched to each body plan with logged thermal checks during prototype bring-up.</li>
              <li>Removable mount + field-swappable harness tails so handset upgrades do not scrap limbs.</li>
            </ul>
            <Link
              href="/build-system"
              className="inline-flex w-full items-center justify-center rounded-xl border border-line bg-transparent px-4 py-3 text-sm font-semibold text-text-main transition hover:border-accent/50 hover:text-accent-soft sm:w-auto"
            >
              See full hardware stack
            </Link>
          </CardShell>
        </MotionReveal>
      </section>

      <HomeFaqSection />

      <ForBuildersSection />

      <section className="bg-gradient-to-b from-background to-surface/35 py-10 sm:py-16">
        <div className="mx-auto max-w-4xl space-y-6 px-4 sm:space-y-8 sm:px-6">
          <MotionReveal>
            <div className="space-y-3 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">Preorder interest</p>
              <h2 className="text-3xl font-semibold text-text-main sm:text-4xl">
                Tell us what to prototype around your handset.
              </h2>
              <p className="text-sm text-text-muted sm:text-base">
                Join the list for milestone-based builds—shell studies, articulated prototypes, or scoped
                engineering consults. Nothing implied about retail shelf timing.
              </p>
            </div>
          </MotionReveal>
          <MotionReveal delay={0.04}>
            <div className="rounded-2xl border border-line/70 bg-surface/70 p-5 shadow-panel backdrop-blur sm:p-8">
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <CtaPair className="sm:justify-center" />
              </div>
              <InterestForm submitLabel="Send preorder request" />
            </div>
          </MotionReveal>
        </div>
      </section>
    </EmbodimentProvider>
  );
}
