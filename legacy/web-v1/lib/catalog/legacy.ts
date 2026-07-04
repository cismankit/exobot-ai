import {
  accessories,
  bodyArchetypes,
  buildTiers,
  finishes,
  phoneModels,
  skillPacks,
} from "./products";
import type { ProductConfiguration } from "./types";

/** Legacy configurator labels (Phase C ConfigState) → catalog IDs */
export type LegacyConfigLabels = {
  phone: string;
  body: string;
  style: string;
  pack: string;
  accessory: string;
  tier: string;
};

const LEGACY_PHONE_MAP: Record<string, string> = {
  iPhone: "phone-iphone-15-pro",
  Android: "phone-android-generic",
  "Universal mount": "phone-universal-v1",
};

export function legacyLabelsToConfiguration(labels: LegacyConfigLabels): ProductConfiguration {
  const body = bodyArchetypes.find((b) => b.name === labels.body);
  const finish = finishes.find((f) => f.name === labels.style);
  const pack = skillPacks.find((s) => s.name === labels.pack);
  const accessory = accessories.find((a) => a.name === labels.accessory);
  const tier = buildTiers.find((t) => t.name === labels.tier);

  return {
    phoneModelId: LEGACY_PHONE_MAP[labels.phone] ?? phoneModels[0].id,
    bodyArchetypeId: body?.id ?? bodyArchetypes[0].id,
    finishId: finish?.id ?? finishes[0].id,
    skillPackId: pack?.id ?? skillPacks[0].id,
    accessoryId: accessory?.id ?? accessories[0].id,
    tierId: tier?.id ?? buildTiers[0].id,
  };
}

export function configurationToLegacyLabels(config: ProductConfiguration): LegacyConfigLabels {
  return {
    phone:
      Object.entries(LEGACY_PHONE_MAP).find(([, id]) => id === config.phoneModelId)?.[0] ??
      phoneModels.find((p) => p.id === config.phoneModelId)?.name ??
      "iPhone",
    body: bodyArchetypes.find((b) => b.id === config.bodyArchetypeId)?.name ?? "Walker",
    style: finishes.find((f) => f.id === config.finishId)?.name ?? "Graphite Orange",
    pack: skillPacks.find((s) => s.id === config.skillPackId)?.name ?? "Companion",
    accessory: accessories.find((a) => a.id === config.accessoryId)?.name ?? "Tray hand",
    tier: buildTiers.find((t) => t.id === config.tierId)?.name ?? "Concept render",
  };
}
