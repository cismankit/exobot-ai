import { AppleScrollShowcase } from "@/components/apple-scroll-showcase";
import { BodyTypeSelectorSection } from "@/components/body-type-selector-section";
import { BuyerTrustRibbon } from "@/components/buyer-trust-ribbon";
import { CtaPair } from "@/components/cta-pair";
import { CTASection } from "@/components/cta-section";
import { EmbodimentProvider } from "@/components/embodiment-context";
import { FeatureCard } from "@/components/feature-card";
import { HeroSection } from "@/components/hero-section";
import { HomeFaqSection } from "@/components/home-faq-section";
import { HomeProductHub } from "@/components/home-product-hub";
import { InfographicStrip } from "@/components/infographic-strip";
import {
  ConfigurationsSection,
  ForBuildersSection,
  WhyExobodSection,
} from "@/components/home-conversion-sections";
import { InterestForm } from "@/components/interest-form";
import { MotionReveal } from "@/components/motion-reveal";
import { OrderAssuranceStrip } from "@/components/order-assurance-strip";
import { PrototypeDemoSection } from "@/components/prototype-demo-section";
import { SectionHeader } from "@/components/section-header";
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
      <BuyerTrustRibbon />

      <BodyTypeSelectorSection />

      <WhyExobodSection />

      <section id="product" className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:space-y-8 sm:px-6 sm:py-10">
        <MotionReveal>
          <SectionHeader
            eyebrow="Product"
            title="Configure once. Understand everything."
            description="Pick a body, phone mount, motion profile, and accessories - then one order inquiry."
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
          Capabilities on this site are engineering targets until your agreement locks scope.
        </p>
      </section>

      <HomeProductHub />

      <PrototypeDemoSection />

      <ConfigurationsSection />

      <section className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:space-y-8 sm:px-6 sm:py-10">
        <MotionReveal>
          <SectionHeader
            eyebrow="Order flow"
            title="From configuration to delivery."
            description="Five steps. Human review at every gate."
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

      <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <MotionReveal>
          <CTASection
            eyebrow="Custom hardware"
            title="No mystery checkout."
            description="You receive a written scope, milestones, and payment structure before major funds move. If we cannot meet your load case or timeline, we say so plainly."
            primary={primaryCta}
            secondary={secondaryCta}
          />
        </MotionReveal>
      </section>

      <section className="border-y border-line/60 bg-surface/28 py-8 sm:py-10">
        <div className="mx-auto max-w-6xl space-y-6 px-4 sm:space-y-7 sm:px-6">
          <MotionReveal>
            <SectionHeader
              eyebrow="Use cases"
              title="Built for teams that need embodied AI on a bench."
              description="Four highlights below. More scenarios on the use cases page."
              align="center"
              className="text-center"
            />
          </MotionReveal>
          <div className="grid gap-3 sm:grid-cols-2">
            {homeUseCases.slice(0, 4).map((item, idx) => (
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
              All use cases
            </Link>
            <CtaPair className="sm:justify-center" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-5 px-4 py-8 sm:space-y-6 sm:px-6 sm:py-10">
        <MotionReveal>
          <SectionHeader
            eyebrow="Build system"
            title="Hybrid frame. Serviceable layout."
            description="Printed shells for speed; metal at torque nodes. Details on the build system page."
          />
        </MotionReveal>
        <MotionReveal delay={0.04}>
          <CardShell className="space-y-4" hover={false}>
            <ul className="grid gap-2 text-sm text-text-muted sm:grid-cols-2">
              <li className="rounded-lg border border-line/50 bg-background/30 px-3 py-2">Printed carriers for fast geometry iteration.</li>
              <li className="rounded-lg border border-line/50 bg-background/30 px-3 py-2">Metal linkages at hips, shoulders, drivetrain.</li>
              <li className="rounded-lg border border-line/50 bg-background/30 px-3 py-2">Servo channels matched to each body plan.</li>
              <li className="rounded-lg border border-line/50 bg-background/30 px-3 py-2">Removable mount and swappable harness tails.</li>
            </ul>
            <Link
              href="/build-system"
              className="inline-flex w-full items-center justify-center rounded-xl border border-line bg-transparent px-4 py-3 text-sm font-semibold text-text-main transition hover:border-accent/50 hover:text-accent-soft sm:w-auto"
            >
              Full hardware stack
            </Link>
          </CardShell>
        </MotionReveal>
      </section>

      <HomeFaqSection />

      <ForBuildersSection />

      <section className="bg-gradient-to-b from-background to-surface/35 py-8 sm:py-10">
        <div className="mx-auto max-w-4xl space-y-5 px-4 sm:space-y-6 sm:px-6">
          <MotionReveal>
            <div className="space-y-3 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">Order now</p>
              <h2 className="text-3xl font-semibold text-text-main sm:text-4xl">Tell us what you want to build.</h2>
              <p className="text-sm text-text-muted sm:text-base">
                We route your inquiry to configuration, quote, and milestone planning. See{" "}
                <Link href="/trust" className="font-semibold text-accent-soft underline-offset-2 hover:underline">
                  Trust &amp; buyer protections
                </Link>{" "}
                first if you need de-risking detail.
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
