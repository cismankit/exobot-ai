import { calculateLeadTimeBand } from "@/lib/catalog/lead-time";
import { calculatePriceBand } from "@/lib/catalog/pricing";
import { legacyLabelsToConfiguration } from "@/lib/catalog/legacy";
import type { ProductConfiguration } from "@/lib/catalog/types";
import type { ConfigState } from "@/lib/config/state";

export type ConfiguratorEstimate = {
  label: string;
  note: string;
};

function toProductConfiguration(
  config: ConfigState | ProductConfiguration,
): ProductConfiguration {
  return "phoneModelId" in config ? config : legacyLabelsToConfiguration(config);
}

function formatUsdRange(low: number, high: number) {
  const fmt = (n: number) => `$${n.toLocaleString("en-US")}`;
  return `${fmt(low)} – ${fmt(high)}`;
}

export function estimatePriceBand(
  config: ConfigState | ProductConfiguration,
): ConfiguratorEstimate {
  const band = calculatePriceBand(toProductConfiguration(config));
  return {
    label: formatUsdRange(band.lowUsd, band.highUsd),
    note: band.disclaimer,
  };
}

export function estimateLeadTime(
  config: ConfigState | ProductConfiguration,
): ConfiguratorEstimate {
  const band = calculateLeadTimeBand(toProductConfiguration(config));
  return {
    label: band.label,
    note: band.disclaimer,
  };
}
