"use client";

import { InterestForm } from "@/components/interest-form";
import { MotionReveal } from "@/components/motion-reveal";
import { customizationOptions, type BodyTypeSlug } from "@/lib/content";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

const slugToLabel: Record<BodyTypeSlug, (typeof customizationOptions.bodyTypes)[number]> = {
  walker: "Walker",
  "desk-assistant": "Desk Assistant",
  rover: "Rover",
  "utility-helper": "Utility Helper",
};

function initialBodyType(searchType: string | null) {
  if (searchType && searchType in slugToLabel) {
    return slugToLabel[searchType as BodyTypeSlug];
  }
  return "Walker" as const;
}

export function Configurator() {
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type");

  const [phone, setPhone] = useState<(typeof customizationOptions.phoneTypes)[number]>("iPhone");
  const [body, setBody] = useState(() => initialBodyType(typeParam));

  useEffect(() => {
    setBody(initialBodyType(typeParam));
  }, [typeParam]);
  const [style, setStyle] = useState<(typeof customizationOptions.styles)[number]>("Graphite Orange");
  const [pack, setPack] = useState<(typeof customizationOptions.skillPacks)[number]>("Companion");
  const [accessory, setAccessory] = useState<(typeof customizationOptions.accessories)[number]>("Tray hand");
  const [tier, setTier] = useState<(typeof customizationOptions.buildTiers)[number]>("Concept render");

  const summary = useMemo(
    () =>
      [
        `Phone mount: ${phone}`,
        `Body: ${body}`,
        `Finish: ${style}`,
        `Skill pack: ${pack}`,
        `Accessory: ${accessory}`,
        `Prototype tier: ${tier}`,
      ].join("\n"),
    [phone, body, style, pack, accessory, tier],
  );

  const defaultBodySlug =
    body === "Walker"
      ? "walker"
      : body === "Desk Assistant"
        ? "desk-assistant"
        : body === "Rover"
          ? "rover"
          : "utility-helper";

  return (
    <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
      <MotionReveal>
        <div className="space-y-5 rounded-2xl border border-line/70 bg-surface/75 p-5 shadow-panel backdrop-blur sm:p-6">
          <div>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">
              Build desk
            </p>
            <h2 className="mt-2 text-xl font-semibold text-text-main sm:text-2xl">Lock the options we quote against</h2>
            <p className="mt-2 text-sm leading-relaxed text-text-muted">
              Client-side only - nothing leaves your browser until you submit the form. Tiers map to render
              studies, printed shells, articulated prototypes, or a scoped engineering consult. No inventory
              counters, no implied ship dates.
            </p>
          </div>

          <div className="space-y-4">
            <fieldset className="space-y-2">
              <legend className="text-sm font-semibold text-text-main">Handset / mount</legend>
              <div className="flex flex-wrap gap-2">
                {customizationOptions.phoneTypes.map((option) => (
                  <ChoiceChip key={option} active={phone === option} onClick={() => setPhone(option)}>
                    {option}
                  </ChoiceChip>
                ))}
              </div>
            </fieldset>

            <fieldset className="space-y-2">
              <legend className="text-sm font-semibold text-text-main">Body architecture</legend>
              <div className="flex flex-wrap gap-2">
                {customizationOptions.bodyTypes.map((option) => (
                  <ChoiceChip key={option} active={body === option} onClick={() => setBody(option)}>
                    {option}
                  </ChoiceChip>
                ))}
              </div>
            </fieldset>

            <fieldset className="space-y-2">
              <legend className="text-sm font-semibold text-text-main">Finish / color system</legend>
              <div className="flex flex-wrap gap-2">
                {customizationOptions.styles.map((option) => (
                  <ChoiceChip key={option} active={style === option} onClick={() => setStyle(option)}>
                    {option}
                  </ChoiceChip>
                ))}
              </div>
            </fieldset>

            <fieldset className="space-y-2">
              <legend className="text-sm font-semibold text-text-main">Skill pack</legend>
              <div className="flex flex-wrap gap-2">
                {customizationOptions.skillPacks.map((option) => (
                  <ChoiceChip key={option} active={pack === option} onClick={() => setPack(option)}>
                    {option}
                  </ChoiceChip>
                ))}
              </div>
            </fieldset>

            <fieldset className="space-y-2">
              <legend className="text-sm font-semibold text-text-main">Accessory</legend>
              <div className="flex flex-wrap gap-2">
                {customizationOptions.accessories.map((option) => (
                  <ChoiceChip key={option} active={accessory === option} onClick={() => setAccessory(option)}>
                    {option}
                  </ChoiceChip>
                ))}
              </div>
            </fieldset>

            <fieldset className="space-y-2">
              <legend className="text-sm font-semibold text-text-main">Prototype tier</legend>
              <div className="flex flex-wrap gap-2">
                {customizationOptions.buildTiers.map((option) => (
                  <ChoiceChip key={option} active={tier === option} onClick={() => setTier(option)}>
                    {option}
                  </ChoiceChip>
                ))}
              </div>
            </fieldset>
          </div>
        </div>
      </MotionReveal>

      <MotionReveal delay={0.04}>
        <div className="space-y-5 rounded-2xl border border-line/70 bg-surface-soft/70 p-5 shadow-panel backdrop-blur sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">
                Live summary
              </p>
              <h3 className="mt-2 text-lg font-semibold text-text-main sm:text-xl">Your Exobod configuration</h3>
            </div>
            <span className="rounded-md border border-line px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wide text-text-muted">
              Quote draft
            </span>
          </div>
          <pre className="max-h-48 overflow-auto whitespace-pre-wrap rounded-xl border border-line/60 bg-background/70 p-4 font-mono text-[11px] leading-relaxed text-text-muted sm:text-xs">
            {summary}
          </pre>
          <div className="space-y-3 border-t border-line/60 pt-4">
            <p className="text-sm leading-relaxed text-text-muted">
              Submitting attaches this summary to your contact record so estimators can respond with clarifying
              questions or decline politely if the load case is out of scope.
            </p>
            <InterestForm
              defaultBodyType={defaultBodySlug}
              configurationSummary={summary}
              submitLabel="Send build request"
            />
          </div>
        </div>
      </MotionReveal>
    </div>
  );
}

function ChoiceChip({
  children,
  active,
  onClick,
}: {
  children: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cnChip(active)}
    >
      {children}
    </button>
  );
}

function cnChip(active: boolean) {
  return [
    "rounded-lg border px-3 py-2 text-left text-xs font-semibold transition sm:text-sm",
    active
      ? "border-accent/70 bg-accent/12 text-text-main shadow-[0_0_0_1px_rgba(255,122,26,0.15)]"
      : "border-line/70 bg-background/50 text-text-muted hover:border-accent/35 hover:text-text-main",
  ].join(" ");
}
