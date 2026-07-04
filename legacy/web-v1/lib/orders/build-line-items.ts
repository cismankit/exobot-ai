import { calculatePriceBand } from "@/lib/catalog/pricing";
import {
  accessories,
  bodyArchetypes,
  buildTiers,
  finishes,
  phoneModels,
  skillPacks,
} from "@/lib/catalog/products";
import type { ProductConfiguration } from "@/lib/catalog/types";
import type { QuoteLineItem } from "@/lib/orders/types";
import { randomUUID } from "crypto";

function midpoint(low: number, high: number): number {
  return Math.round((low + high) / 2);
}

function configLabels(config: ProductConfiguration): string {
  const phone = phoneModels.find((p) => p.id === config.phoneModelId)?.name ?? "Phone";
  const body = bodyArchetypes.find((b) => b.id === config.bodyArchetypeId)?.name ?? "Body";
  const tier = buildTiers.find((t) => t.id === config.tierId)?.name ?? "Tier";
  const finish = finishes.find((f) => f.id === config.finishId)?.name ?? "Finish";
  const pack = skillPacks.find((s) => s.id === config.skillPackId)?.name ?? "Pack";
  const accessory = accessories.find((a) => a.id === config.accessoryId)?.name ?? "Accessory";
  return `${body} · ${tier} · ${phone} · ${finish} · ${pack} · ${accessory}`;
}

/** Build binding quote line items from catalog pricing breakdown (midpoint of bands). */
export function buildQuoteLineItems(config: ProductConfiguration): QuoteLineItem[] {
  const band = calculatePriceBand(config);
  const scope = configLabels(config);

  const items: QuoteLineItem[] = band.breakdown.map((row) => {
    const unit = midpoint(row.lowUsd, row.highUsd);
    return {
      id: randomUUID(),
      label: row.label,
      description: scope,
      quantity: 1,
      unitPriceUsd: unit,
      totalUsd: unit,
    };
  });

  const engineeringReview: QuoteLineItem = {
    id: randomUUID(),
    label: "Engineering review & integration",
    description: "Scope validation, mount fit check, and build desk sign-off",
    quantity: 1,
    unitPriceUsd: 0,
    totalUsd: 0,
  };

  return [...items, engineeringReview];
}

export function quoteTotals(lineItems: QuoteLineItem[]): { subtotalUsd: number; totalUsd: number } {
  const subtotalUsd = lineItems.reduce((sum, item) => sum + item.totalUsd, 0);
  return { subtotalUsd, totalUsd: subtotalUsd };
}
