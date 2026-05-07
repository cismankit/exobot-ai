import { MotionReveal } from "@/components/motion-reveal";
import { SectionHeader } from "@/components/section-header";
import { SkillCard } from "@/components/skill-card";
import { exobodSkillsLayer, skills, skillsEngineNames } from "@/lib/content";
import Link from "next/link";

export function SkillsEngineSection() {
  const engineSkills = skillsEngineNames
    .map((name) => skills.find((s) => s.name === name))
    .filter((s): s is (typeof skills)[number] => Boolean(s));

  return (
    <section className="bg-gradient-to-b from-surface/25 to-background py-10 sm:py-14">
      <div className="mx-auto max-w-6xl space-y-8 px-4 sm:space-y-9 sm:px-6">
        <MotionReveal>
          <div className="mx-auto max-w-3xl rounded-2xl border border-accent/20 bg-surface/50 p-5 text-center sm:p-6">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">
              Intelligence layer
            </p>
            <h2 className="mt-2 text-xl font-semibold text-text-main sm:text-2xl">{exobodSkillsLayer.title}</h2>
            <div className="mt-4 grid gap-3 text-sm font-semibold text-text-main sm:grid-cols-3">
              {exobodSkillsLayer.lines.map((line) => (
                <div key={line} className="rounded-lg border border-line/60 bg-background/40 px-3 py-2">
                  {line}
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs leading-relaxed text-text-muted sm:text-sm">{exobodSkillsLayer.supporting}</p>
          </div>
        </MotionReveal>

        <MotionReveal delay={0.04}>
          <SectionHeader
            eyebrow="Skills engine"
            title="Skills Engine"
            description="Walk, dance, follow, patrol, record, carry, gesture, and assist are requested and tuned through the Exobod control app and portal - never hard-coded mystery motion. Each skill maps to joint targets, speed clamps, and estop behavior we ship per prototype program."
            align="center"
            className="mx-auto max-w-3xl text-center"
          />
        </MotionReveal>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
          {engineSkills.map((skill, idx) => (
            <MotionReveal key={skill.name} delay={idx * 0.02}>
              <SkillCard name={skill.name} blurb={skill.blurb} />
            </MotionReveal>
          ))}
        </div>
        <p className="text-center text-xs text-text-muted sm:text-sm">
          Additional motion presets (teach, present, monitor, react) follow the same app → MCU pipeline and are enabled only when your signed body plan supports them.
        </p>
        <div className="flex justify-center">
          <Link
            href="/customize"
            className="text-sm font-semibold text-accent-soft underline-offset-4 hover:underline"
          >
            Open configurator to bundle skills with your build request
          </Link>
        </div>
      </div>
    </section>
  );
}
