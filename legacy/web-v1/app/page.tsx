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

      <section
        id="product"
        className="scroll-mt-24 border-y border-line/40 bg-gradient-to-b from-accent/[0.05] via-surface/25 to-background py-12 sm:py-16"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <MotionReveal>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl space-y-3">
                <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-accent">
                  Flagship · EXB-D1
                </p>
                <h2 className="font-display text-3xl font-semibold tracking-tight text-text-main sm:text-4xl">
                  Desk One — honest motion on a desk.
                </h2>
                <p className="text-sm leading-relaxed text-text-muted sm:text-base">
                  Stationary 2-axis pan/tilt for early builders. Your phone stays the brain. Not a walker,
                  not battery-powered v1, not a finished retail SKU.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href={primaryCta.href}
                  className="inline-flex items-center justify-center rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-background transition hover:bg-accent-soft"
                >
                  {primaryCta.label}
                </Link>
                <Link
                  href="/desk-one"
                  className="inline-flex items-center justify-center rounded-xl border border-line/70 px-6 py-3 text-sm font-semibold text-text-main transition hover:border-accent/50 hover:text-accent-soft"
                >
                  See Desk One
                </Link>
              </div>
            </div>
          </MotionReveal>
        </div>
      </section>

      <section
        id="how-it-works"
        className="mx-auto max-w-6xl scroll-mt-24 space-y-6 px-4 py-10 sm:space-y-8 sm:px-6 sm:py-12"
      >
        <MotionReveal>
          <SectionHeader
            eyebrow="How it works"
            title="From configuration to delivery."
            description="Four steps. Human review at every gate. No mystery checkout."
          />
        </MotionReveal>
        <MotionReveal>
          <InfographicStrip
            columns={4}
            items={[
              { title: "1. Configure", caption: "Pick body type and phone fit.", icon: SlidersHorizontal },
              { title: "2. Submit", caption: "Reserve Desk One interest or file a build request.", icon: ClipboardList },
              { title: "3. Review", caption: "Team validates scope, quote, and milestones.", icon: ShieldCheck },
              { title: "4. Build", caption: "Approved units move into production scheduling.", icon: Truck },
            ]}
          />
        </MotionReveal>
      </section>

      <BodyTypeSelectorSection />

      <WhyExobodSection />

      <section className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:space-y-8 sm:px-6 sm:py-10">
        <MotionReveal>
          <SectionHeader
            eyebrow="Platform"
            title="Configure once. Understand everything."
            description="Pick a body, phone mount, motion profile, and accessories — then one clear next step."
          />
        </MotionReveal>
        <MotionReveal>
          <InfographicStrip
            items={[
              { title: "Choose Body", caption: "Desk One (EVT) or concept paths: Walker, Rover, Utility.", icon: SlidersHorizontal },
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

      <section id="use-cases" className="scroll-mt-24 border-y border-line/60 bg-surface/28 py-8 sm:py-10">
        <div className="mx-auto max-w-6xl space-y-6 px-4 sm:space-y-7 sm:px-6">
          <MotionReveal>
            <SectionHeader
              eyebrow="Use cases"
              title="Built for teams that need embodied AI on a bench."
              description="Makers, classrooms, desks, and labs — same phone brain, different motion jobs."
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
          <div className="flex justify-center">
            <CtaPair className="sm:justify-center" />
          </div>
        </div>
      </section>

      <section
        id="build-system"
        className="mx-auto max-w-6xl scroll-mt-24 space-y-5 px-4 py-8 sm:space-y-6 sm:px-6 sm:py-10"
      >
        <MotionReveal>
          <SectionHeader
            eyebrow="Build system"
            title="Hybrid frame. Serviceable layout."
            description="Printed shells for speed; metal at torque nodes. Removable mount, matched servo channels, swappable harness tails."
          />
        </MotionReveal>
        <MotionReveal delay={0.04}>
          <CardShell className="space-y-4" hover={false}>
            <ul className="grid gap-2 text-sm text-text-muted sm:grid-cols-2">
              <li className="rounded-lg border border-line/50 bg-background/30 px-3 py-2">
                Printed carriers for fast geometry iteration.
              </li>
              <li className="rounded-lg border border-line/50 bg-background/30 px-3 py-2">
                Metal linkages at hips, shoulders, drivetrain.
              </li>
              <li className="rounded-lg border border-line/50 bg-background/30 px-3 py-2">
                Servo channels matched to each body plan.
              </li>
              <li className="rounded-lg border border-line/50 bg-background/30 px-3 py-2">
                Removable mount and swappable harness tails.
              </li>
            </ul>
          </CardShell>
        </MotionReveal>
      </section>

      <HomeFaqSection />

      <ForBuildersSection />

      <section id="order" className="scroll-mt-24 bg-gradient-to-b from-background to-surface/35 py-8 sm:py-10">
        <div className="mx-auto max-w-4xl space-y-5 px-4 sm:space-y-6 sm:px-6">
          <MotionReveal>
            <div className="space-y-3 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">Next step</p>
              <h2 className="text-3xl font-semibold text-text-main sm:text-4xl">
                Reserve Desk One, or tell us what to build.
              </h2>
              <p className="text-sm text-text-muted sm:text-base">
                Prefer early hardware access?{" "}
                <Link href={primaryCta.href} className="font-semibold text-accent-soft underline-offset-2 hover:underline">
                  {primaryCta.label}
                </Link>
                . Need buyer de-risking detail first? See{" "}
                <Link href="/trust" className="font-semibold text-accent-soft underline-offset-2 hover:underline">
                  Trust &amp; buyer protections
                </Link>
                .
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
