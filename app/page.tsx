import { AppleScrollShowcase } from "@/components/apple-scroll-showcase";
import { BodyTypeSelectorSection } from "@/components/body-type-selector-section";
import { CtaPair } from "@/components/cta-pair";
import { CTASection } from "@/components/cta-section";
import { CustomOrderPathSection } from "@/components/custom-order-path-section";
import { EmbodimentProvider } from "@/components/embodiment-context";
import { FeatureCard } from "@/components/feature-card";
import { HeroSection } from "@/components/hero-section";
import { HomeFaqSection } from "@/components/home-faq-section";
import { InfographicStrip } from "@/components/infographic-strip";
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
import { OrderAssuranceStrip } from "@/components/order-assurance-strip";
import { SectionHeader } from "@/components/section-header";
import { SkillsEngineSection } from "@/components/skills-engine-section";
import { StickyOrderBar } from "@/components/sticky-order-bar";
import { CardShell } from "@/components/card-shell";
import { primaryCta, secondaryCta } from "@/lib/ctas";
import { homeUseCases } from "@/lib/content";
import { Blocks, ClipboardList, Cpu, ShieldCheck, SlidersHorizontal, Truck } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <EmbodimentProvider>
      <HeroSection />
      <AppleScrollShowcase />
      <OrderAssuranceStrip />

      <BodyTypeSelectorSection />

      <WhyExobodSection />

      <section id="product" className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:space-y-8 sm:px-6 sm:py-12">
        <MotionReveal>
          <SectionHeader
            eyebrow="Product"
            title="A simple configure-to-order robotics platform."
            description="Pick a body, choose your phone mount, select motion capabilities, and submit one order inquiry."
          />
        </MotionReveal>
        <MotionReveal>
          <InfographicStrip
            items={[
              { title: "Choose Body", caption: "Walker, Desk, Rover, or Utility.", icon: SlidersHorizontal },
              { title: "Phone As Brain", caption: "iPhone or Android with removable mount core.", icon: Cpu },
              { title: "Safe Motion Layer", caption: "Controller clamps speed and behavior profiles.", icon: ShieldCheck },
              { title: "Built To Your Spec", caption: "Accessories, finishes, and use-case options.", icon: Blocks },
            ]}
          />
        </MotionReveal>
        <p className="text-center text-sm text-text-muted">
          Same experience pattern as modern device ordering: configure, review, submit, and confirm.
        </p>
      </section>

      <ConfigurationsSection />

      <WorkRolesSection />

      <section className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:space-y-8 sm:px-6 sm:py-12">
        <MotionReveal>
          <SectionHeader
            eyebrow="Order flow"
            title="Five clear steps from configuration to delivery."
            description="No confusing jargon. One clear path from choices to confirmation."
          />
        </MotionReveal>
        <MotionReveal>
          <InfographicStrip
            columns={5}
            items={[
              { title: "1. Configure", caption: "Pick body type and phone fit.", icon: SlidersHorizontal },
              { title: "2. Submit", caption: "Send order inquiry in one form.", icon: ClipboardList },
              { title: "3. Review", caption: "Team validates scope and options.", icon: ShieldCheck },
              { title: "4. Approve", caption: "Confirm quote and timeline.", icon: Cpu },
              { title: "5. Ship", caption: "Receive build-ready package.", icon: Truck },
            ]}
          />
        </MotionReveal>
      </section>

      <SkillsEngineSection />

      <TargetSpecsSection />

      <PhoneAsBrainSection />

      <SkillSafetySection />

      <CustomOrderPathSection />

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <MotionReveal>
          <CTASection
            eyebrow="Custom hardware"
            title="Request a build sheet, not a shopping cart."
            description="Pick body architecture, finish, limbs, accessory ports, motion packs, and budget band. We answer with a prototype scope or decline if the load case is outside current lab capacity - never silent shipping promises."
            primary={primaryCta}
            secondary={secondaryCta}
          />
        </MotionReveal>
      </section>

      <section className="border-y border-line/60 bg-surface/28 py-8 sm:py-12">
        <div className="mx-auto max-w-6xl space-y-6 px-4 sm:space-y-8 sm:px-6">
          <MotionReveal>
            <SectionHeader
              eyebrow="Where it ships first"
              title="Makers, classrooms, and prototype labs - not toy aisles."
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

      <section className="mx-auto max-w-6xl space-y-5 px-4 py-8 sm:space-y-6 sm:px-6 sm:py-10">
        <MotionReveal>
          <SectionHeader
            eyebrow="Build system"
            title="3D printed where it should be. Metal where it matters."
            description="Hybrid shells iterate fast; hardened linkages carry joint torque. Controller packs, fused power, and harness exits are laid out for serviceability on the bench - not hidden glue blobs."
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

      <section className="bg-gradient-to-b from-background to-surface/35 py-8 sm:py-12">
        <div className="mx-auto max-w-4xl space-y-5 px-4 sm:space-y-6 sm:px-6">
          <MotionReveal>
            <div className="space-y-3 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">Order now</p>
              <h2 className="text-3xl font-semibold text-text-main sm:text-4xl">
                Tell us what you want to build and deploy.
              </h2>
              <p className="text-sm text-text-muted sm:text-base">
                Submit your customization goals and we will route your request to the right configuration,
                quoting path, and production timeline.
              </p>
            </div>
          </MotionReveal>
          <MotionReveal delay={0.04}>
            <div className="rounded-2xl border border-line/70 bg-surface/70 p-5 shadow-panel backdrop-blur sm:p-8">
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <CtaPair className="sm:justify-center" />
              </div>
              <InterestForm submitLabel="Send order inquiry" />
            </div>
          </MotionReveal>
        </div>
      </section>
      <StickyOrderBar />
    </EmbodimentProvider>
  );
}
