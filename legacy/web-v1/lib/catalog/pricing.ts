import { legacyLabelsToConfiguration, type LegacyConfigLabels } from "./legacy";
import { getBOMTemplate } from "./products";
import type { EstimateResult, PriceBand, ProductConfiguration } from "./types";

const TIER_BASE_USD: Record<string, { low: number; high: number }> = {
  "tier-concept-render": { low: 800, high: 2500 },
  "tier-prototype-shell": { low: 2500, high: 6500 },
  "tier-moving-prototype": { low: 8000, high: 22000 },
  "tier-custom-consult": { low: 15000, high: 45000 },
};

const BODY_MULTIPLIER: Record<string, number> = {
  "body-walker": 1.25,
  "body-desk-assistant": 1.0,
  "body-rover": 1.15,
  "body-utility-helper": 1.1,
};

const ACCESSORY_ADD_USD: Record<string, { low: number; high: number }> = {
  "acc-tray-hand": { low: 150, high: 400 },
  "acc-camera-rig": { low: 300, high: 900 },
  "acc-light-module": { low: 120, high: 350 },
  "acc-gripper-hand": { low: 450, high: 1200 },
  "acc-sensor-mount": { low: 200, high: 800 },
  "acc-presentation-stand": { low: 180, high: 500 },
};

const PACK_ADD_USD: Record<string, { low: number; high: number }> = {
  "pack-companion": { low: 0, high: 500 },
  "pack-creator": { low: 200, high: 800 },
  "pack-education": { low: 300, high: 1000 },
  "pack-patrol": { low: 500, high: 1500 },
  "pack-utility": { low: 250, high: 900 },
  "pack-demo-bot": { low: 600, high: 2000 },
};

const FINISH_ADD_USD: Record<string, { low: number; high: number }> = {
  "finish-custom": { low: 400, high: 1500 },
};

const MARGIN = 1.35;
const DISCLAIMER =
  "Indicative price band only — not a binding quote. Final pricing follows engineering review and signed scope.";

function applyMargin(low: number, high: number) {
  return {
    lowUsd: Math.round(low * MARGIN),
    highUsd: Math.round(high * MARGIN),
  };
}

export function calculatePriceBand(config: ProductConfiguration): PriceBand {
  const tierBase = TIER_BASE_USD[config.tierId] ?? { low: 1000, high: 3000 };
  const bodyMult = BODY_MULTIPLIER[config.bodyArchetypeId] ?? 1;
  const accessory = ACCESSORY_ADD_USD[config.accessoryId] ?? { low: 0, high: 0 };
  const pack = PACK_ADD_USD[config.skillPackId] ?? { low: 0, high: 0 };
  const finish = FINISH_ADD_USD[config.finishId] ?? { low: 0, high: 0 };

  const bom = getBOMTemplate(config.bodyArchetypeId, config.tierId);
  const servoPremium =
    bom && bom.servoCount.max > 0
      ? { low: bom.servoCount.min * 80, high: bom.servoCount.max * 150 }
      : { low: 0, high: 0 };

  const breakdown = [
    {
      label: "Base tier",
      ...applyMargin(tierBase.low * bodyMult, tierBase.high * bodyMult),
    },
    {
      label: "Accessory",
      ...applyMargin(accessory.low, accessory.high),
    },
    {
      label: "Skill pack",
      ...applyMargin(pack.low, pack.high),
    },
    {
      label: "Finish",
      ...applyMargin(finish.low, finish.high),
    },
    {
      label: "Actuation / BOM",
      ...applyMargin(servoPremium.low, servoPremium.high),
    },
  ];

  const totalLow = breakdown.reduce((s, b) => s + b.lowUsd, 0);
  const totalHigh = breakdown.reduce((s, b) => s + b.highUsd, 0);

  return {
    lowUsd: totalLow,
    highUsd: totalHigh,
    currency: "USD",
    disclaimer: DISCLAIMER,
    breakdown,
  };
}

function formatUsd(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

/** Legacy alias for Phase C configurator — accepts label-based config */
export function estimatePriceBand(config: LegacyConfigLabels | ProductConfiguration): EstimateResult {
  const productConfig =
    "phoneModelId" in config ? config : legacyLabelsToConfiguration(config);
  const band = calculatePriceBand(productConfig);
  return {
    label: `${formatUsd(band.lowUsd)} – ${formatUsd(band.highUsd)}`,
    note: band.disclaimer,
  };
}
