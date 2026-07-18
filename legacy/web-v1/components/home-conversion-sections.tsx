import { CardShell } from "@/components/card-shell";
import { MotionReveal } from "@/components/motion-reveal";
import { SectionHeader } from "@/components/section-header";
import {
  configurationProducts,
  forBuilders,
  phoneAsBrainArchitecture,
  skillSafetyLayer,
  targetSpecs,
  whyExobod,
  workRoles,
} from "@/lib/content";
import { secondaryCta } from "@/lib/ctas";
import Link from "next/link";

export function WhyExobodSection() {
  const reasons = [
    ["Keep the capable core", "Camera, microphone, display, connectivity, apps, and on-device intelligence stay on your phone."],
    ["Add serviceable motion", "Mounts, controller, actuators, and replaceable frame parts are scoped around the job."],
    ["Upgrade without starting over", "A removable phone core keeps the body useful when the handset or software stack changes."],
  ];

  return (
    <section id="why-exobod" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-12 sm:px-6 sm:py-16">
      <MotionReveal>
        <div className="rounded-3xl border border-line/60 bg-gradient-to-br from-surface/80 via-surface-soft/40 to-background p-6 shadow-panel sm:p-10">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-accent">Why Exobod</p>
          <h2 className="mt-3 max-w-3xl text-3xl font-semibold leading-tight text-text-main sm:text-4xl">
            {whyExobod.headline}
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-text-muted sm:text-lg">{whyExobod.copy}</p>
          <div className="mt-6 flex flex-col gap-3 border-l-2 border-accent/50 pl-4 sm:flex-row sm:items-center sm:gap-8">
            <p className="text-lg font-semibold text-text-main">{whyExobod.missionLine}</p>
            <p className="text-sm font-semibold text-accent-soft">{whyExobod.separation}</p>
          </div>
          <div className="mt-8 grid gap-3 border-t border-line/50 pt-6 md:grid-cols-3">
            {reasons.map(([title, detail], idx) => (
              <div key={title} className="rounded-2xl border border-line/50 bg-background/40 p-4">
                <p className="font-mono text-[10px] text-accent">{String(idx + 1).padStart(2, "0")}</p>
                <h3 className="mt-2 text-base font-semibold text-text-main">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </MotionReveal>
    </section>
  );
}

export function ConfigurationsSection() {
  return (
    <section id="configurations" className="border-y border-line/55 bg-surface/30 py-8 sm:py-10">
      <div className="mx-auto max-w-6xl space-y-6 px-4 sm:space-y-8 sm:px-6">
        <MotionReveal>
          <SectionHeader
            eyebrow="Configurations"
            title="Desk One is the buyable path. Everything else is concept."
            description="EXB-D1 Desk One is the early-access / reservable product. Walker, Rover, Utility, EDU, and prototyping kits are concept paths — configure and inquire, not retail shelf SKUs."
            align="center"
            className="mx-auto max-w-3xl text-center"
          />
        </MotionReveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {configurationProducts.map((cfg, idx) => (
            <MotionReveal key={cfg.name} delay={idx * 0.02}>
              <CardShell className="flex h-full flex-col gap-3 p-5" hover>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-lg font-semibold text-text-main">{cfg.name}</h3>
                  <span
                    className={
                      cfg.badge === "Available path"
                        ? "shrink-0 rounded-md border border-accent/40 bg-accent/10 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-accent"
                        : "shrink-0 rounded-md border border-line/60 bg-surface-soft/60 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-text-muted"
                    }
                  >
                    {cfg.badge}
                  </span>
                </div>
                <dl className="space-y-2 text-xs text-text-muted sm:text-sm">
                  <div>
                    <dt className="font-semibold text-text-main">Best for</dt>
                    <dd className="mt-0.5">{cfg.bestFor}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-text-main">Motion type</dt>
                    <dd className="mt-0.5">{cfg.motionType}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-text-main">Skill examples</dt>
                    <dd className="mt-0.5">{cfg.skillExamples.join(" · ")}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-text-main">Prototype tier</dt>
                    <dd className="mt-0.5">{cfg.prototypeTier}</dd>
                  </div>
                </dl>
                <div className="mt-auto pt-2">
                  <Link
                    href={cfg.href}
                    className="inline-flex w-full items-center justify-center rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-background transition hover:bg-accent-soft"
                  >
                    {cfg.href === "/desk-one" ? "See Desk One" : secondaryCta.label}
                  </Link>
                </div>
              </CardShell>
            </MotionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function WorkRolesSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <MotionReveal>
        <p className="text-center font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">
          Work-role framing
        </p>
        <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-text-muted">
          Body configurations for different roles - not a cute assistant toy, but torque-bounded jobs on a desk,
          floor, or lab bench.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {workRoles.map((role) => (
            <span
              key={role.name}
              className="rounded-lg border border-line/60 bg-surface-soft/70 px-3 py-2 text-left text-xs text-text-main sm:text-sm"
            >
              <span className="font-semibold text-accent-soft">{role.name}:</span> {role.detail}
            </span>
          ))}
        </div>
      </MotionReveal>
    </section>
  );
}

export function TargetSpecsSection() {
  return (
    <section id="target-specs" className="border-y border-line/50 bg-background py-8 sm:py-10">
      <div className="mx-auto max-w-6xl space-y-6 px-4 sm:px-6">
        <MotionReveal>
          <SectionHeader
            eyebrow="Prototype targets"
            title="Target specs (not final retail numbers)"
            description="Numbers below are engineering targets for preorder and prototype programs. They tighten only after CAD lock, BOM review, and safety walkthroughs for your specific configuration."
            align="center"
            className="mx-auto max-w-3xl text-center"
          />
        </MotionReveal>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {targetSpecs.map((row, idx) => (
            <MotionReveal key={row.label} delay={idx * 0.015}>
              <div className="rounded-xl border border-line/55 bg-surface/70 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-accent">{row.label}</p>
                <p className="mt-1 text-sm text-text-muted">{row.value}</p>
              </div>
            </MotionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PhoneAsBrainSection() {
  return (
    <section className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:space-y-8 sm:px-6 sm:py-10">
      <MotionReveal>
        <SectionHeader
          eyebrow="Architecture"
          title="Phone as the brain"
          description="Intelligence stays on the handset. Exobod only closes the loop to motion hardware once targets pass app and firmware checks."
        />
      </MotionReveal>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {phoneAsBrainArchitecture.map((row, idx) => (
          <MotionReveal key={row.title} delay={idx * 0.02}>
            <div className="h-full rounded-xl border border-line/60 bg-surface-soft/50 p-4">
              <p className="font-mono text-[10px] text-accent">{String(idx + 1).padStart(2, "0")}</p>
              <h3 className="mt-1 text-sm font-semibold text-text-main">{row.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-text-muted">{row.detail}</p>
            </div>
          </MotionReveal>
        ))}
      </div>
    </section>
  );
}

export function SkillSafetySection() {
  return (
    <section className="border-y border-line/55 bg-surface/25 py-8 sm:py-10">
      <div className="mx-auto max-w-3xl space-y-5 px-4 text-center sm:px-6">
        <MotionReveal>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">
            {skillSafetyLayer.headline}
          </p>
          <p className="mt-3 text-base font-semibold leading-relaxed text-text-main sm:text-lg">
            {skillSafetyLayer.trainableLine}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-text-muted sm:text-base">{skillSafetyLayer.copy}</p>
        </MotionReveal>
      </div>
    </section>
  );
}

export function ForBuildersSection() {
  return (
    <section id="builders" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-8 sm:px-6 sm:py-10">
      <MotionReveal>
        <div className="rounded-2xl border border-accent/25 bg-gradient-to-br from-accent/10 via-surface/80 to-background p-6 shadow-panel sm:p-8">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">
            {forBuilders.headline}
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-text-main sm:text-3xl">{forBuilders.subhead}</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-text-muted sm:text-base">{forBuilders.copy}</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href="/partners"
              className="inline-flex flex-1 items-center justify-center rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-background transition hover:bg-accent-soft sm:flex-none"
            >
              Partner with Exobod
            </Link>
            <Link
              href={secondaryCta.href}
              className="inline-flex flex-1 items-center justify-center rounded-xl border border-line px-6 py-3 text-sm font-semibold text-text-main transition hover:border-accent/45 hover:text-accent-soft sm:flex-none"
            >
              {secondaryCta.label}
            </Link>
          </div>
        </div>
      </MotionReveal>
    </section>
  );
}
