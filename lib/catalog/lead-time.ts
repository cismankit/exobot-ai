import { legacyLabelsToConfiguration, type LegacyConfigLabels } from "./legacy";
import type { EstimateResult, LeadTimeBand, ProductConfiguration } from "./types";

const TIER_WEEKS: Record<string, { low: number; high: number }> = {
  "tier-concept-render": { low: 2, high: 4 },
  "tier-prototype-shell": { low: 4, high: 8 },
  "tier-moving-prototype": { low: 8, high: 16 },
  "tier-custom-consult": { low: 12, high: 24 },
};

const BODY_WEEK_ADD: Record<string, number> = {
  "body-walker": 2,
  "body-desk-assistant": 0,
  "body-rover": 1,
  "body-utility-helper": 1,
};

const SIGNOFF_ADD_WEEKS = 2;

const DISCLAIMER =
  "Indicative lead-time band — not a committed ship date. Engineering sign-off and material lead times may extend windows.";

export function calculateLeadTimeBand(config: ProductConfiguration): LeadTimeBand {
  const tier = TIER_WEEKS[config.tierId] ?? { low: 4, high: 8 };
  const bodyAdd = BODY_WEEK_ADD[config.bodyArchetypeId] ?? 0;

  let lowWeeks = tier.low + bodyAdd;
  let highWeeks = tier.high + bodyAdd;

  const needsSignOff =
    config.tierId === "tier-moving-prototype" ||
    config.tierId === "tier-custom-consult" ||
    config.finishId === "finish-custom" ||
    config.accessoryId === "acc-gripper-hand" ||
    config.accessoryId === "acc-sensor-mount" ||
    config.skillPackId === "pack-patrol" ||
    config.skillPackId === "pack-demo-bot";

  if (needsSignOff) {
    lowWeeks += SIGNOFF_ADD_WEEKS;
    highWeeks += SIGNOFF_ADD_WEEKS;
  }

  const label =
    lowWeeks === highWeeks
      ? `~${lowWeeks} weeks`
      : `${lowWeeks}–${highWeeks} weeks`;

  return {
    lowWeeks,
    highWeeks,
    label,
    disclaimer: DISCLAIMER,
  };
}

/** Legacy alias for Phase C configurator — accepts label-based config */
export function estimateLeadTime(config: LegacyConfigLabels | ProductConfiguration): EstimateResult {
  const productConfig =
    "phoneModelId" in config ? config : legacyLabelsToConfiguration(config);
  const band = calculateLeadTimeBand(productConfig);
  return {
    label: band.label,
    note: band.disclaimer,
  };
}
