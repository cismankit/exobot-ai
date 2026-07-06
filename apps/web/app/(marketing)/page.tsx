import { Hero } from "@/components/marketing/hero";
import { Reveal } from "@/components/marketing/reveal";
import { ExoskeletonSection } from "@/components/marketing/exoskeleton";
import { Federation } from "@/components/marketing/federation";
import { Constitution } from "@/components/marketing/constitution";
import { LiveDemo } from "@/components/marketing/live-demo";
import { Byok } from "@/components/marketing/byok";
import { Specs } from "@/components/marketing/specs";
import { Waitlist } from "@/components/marketing/waitlist";

export default function Landing() {
  return (
    <>
      <Hero />

      {/* the idea in one sentence */}
      <section className="mx-auto max-w-5xl px-5 py-24 text-center">
        <Reveal>
          <p className="display text-3xl leading-tight sm:text-4xl md:text-5xl">
            Your phone is already the smartest thing you own.
            <br />
            <span className="text-brand">
              Exobod gives it eyes, arms, a stance, and a voice.
            </span>
          </p>
        </Reveal>
      </section>

      <ExoskeletonSection />
      <Federation />
      <Constitution />
      <LiveDemo />
      <Byok />
      <Specs />
      <Waitlist />
    </>
  );
}
