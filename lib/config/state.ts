import type { ProductConfiguration } from "@/lib/catalog/types";
import {
  accessories,
  bodyArchetypes,
  buildTiers,
  defaultConfigurationIds,
  finishes,
  getBodyArchetypeBySlug,
  phoneModels,
  skillPacks,
} from "@/lib/catalog/products";

export type { ProductConfiguration as ConfigState };

export type ConfigField = keyof ProductConfiguration;

export const CONFIG_PARAM_KEYS = [
  "phone",
  "body",
  "style",
  "pack",
  "accessory",
  "tier",
  "cfg",
] as const;

export const defaultConfig: ProductConfiguration = { ...defaultConfigurationIds };

const phoneToSlug = Object.fromEntries(
  phoneModels.map((p) => [p.id, p.id.replace(/^phone-/, "")]),
);
const phoneFromSlug = Object.fromEntries(
  phoneModels.map((p) => [p.id.replace(/^phone-/, ""), p.id]),
);

const finishToSlug = Object.fromEntries(
  finishes.map((f) => [f.id, f.id.replace(/^finish-/, "")]),
);
const finishFromSlug = Object.fromEntries(
  finishes.map((f) => [f.id.replace(/^finish-/, ""), f.id]),
);

const packToSlug = Object.fromEntries(
  skillPacks.map((p) => [p.id, p.id.replace(/^pack-/, "")]),
);
const packFromSlug = Object.fromEntries(
  skillPacks.map((p) => [p.id.replace(/^pack-/, ""), p.id]),
);

const accessoryToSlug = Object.fromEntries(
  accessories.map((a) => [a.id, a.id.replace(/^acc-/, "")]),
);
const accessoryFromSlug = Object.fromEntries(
  accessories.map((a) => [a.id.replace(/^acc-/, ""), a.id]),
);

const tierToSlug = Object.fromEntries(
  buildTiers.map((t) => [t.id, t.slug]),
);
const tierFromSlug = Object.fromEntries(buildTiers.map((t) => [t.slug, t.id]));

export function configToSearchParams(
  config: ProductConfiguration,
  configId?: string | null,
): URLSearchParams {
  const params = new URLSearchParams();
  const phone = phoneToSlug[config.phoneModelId];
  const body = bodyArchetypes.find((b) => b.id === config.bodyArchetypeId)?.slug;
  const style = finishToSlug[config.finishId];
  const pack = packToSlug[config.skillPackId];
  const accessory = accessoryToSlug[config.accessoryId];
  const tier = tierToSlug[config.tierId];

  if (phone) params.set("phone", phone);
  if (body) params.set("body", body);
  if (style) params.set("style", style);
  if (pack) params.set("pack", pack);
  if (accessory) params.set("accessory", accessory);
  if (tier) params.set("tier", tier);
  if (configId) params.set("cfg", configId);
  return params;
}

export function configFromSearchParams(
  params: URLSearchParams,
  bodyArchetypeOverride?: string | null,
): { config: ProductConfiguration; configId: string | null } {
  const config: ProductConfiguration = { ...defaultConfig };

  const phoneSlug = params.get("phone");
  if (phoneSlug && phoneFromSlug[phoneSlug]) {
    config.phoneModelId = phoneFromSlug[phoneSlug];
  }

  const bodySlug = params.get("body");
  if (bodySlug) {
    const body = getBodyArchetypeBySlug(bodySlug);
    if (body) config.bodyArchetypeId = body.id;
  }

  const styleSlug = params.get("style");
  if (styleSlug && finishFromSlug[styleSlug]) {
    config.finishId = finishFromSlug[styleSlug];
  }

  const packSlug = params.get("pack");
  if (packSlug && packFromSlug[packSlug]) {
    config.skillPackId = packFromSlug[packSlug];
  }

  const accessorySlug = params.get("accessory");
  if (accessorySlug && accessoryFromSlug[accessorySlug]) {
    config.accessoryId = accessoryFromSlug[accessorySlug];
  }

  const tierSlug = params.get("tier");
  if (tierSlug && tierFromSlug[tierSlug]) {
    config.tierId = tierFromSlug[tierSlug];
  }

  if (bodyArchetypeOverride) {
    config.bodyArchetypeId = bodyArchetypeOverride;
  }

  return { config, configId: params.get("cfg") };
}

export function buildSummary(
  config: ProductConfiguration,
  configId?: string | null,
  extras?: { priceLabel?: string; leadLabel?: string },
): string {
  const phone = phoneModels.find((p) => p.id === config.phoneModelId);
  const body = bodyArchetypes.find((b) => b.id === config.bodyArchetypeId);
  const finish = finishes.find((f) => f.id === config.finishId);
  const pack = skillPacks.find((s) => s.id === config.skillPackId);
  const accessory = accessories.find((a) => a.id === config.accessoryId);
  const tier = buildTiers.find((t) => t.id === config.tierId);

  const lines = [
    configId ? `Configuration ID: ${configId}` : null,
    `Phone: ${phone?.name ?? config.phoneModelId}`,
    `Body: ${body?.name ?? config.bodyArchetypeId}`,
    `Finish: ${finish?.name ?? config.finishId}`,
    `Skill pack: ${pack?.name ?? config.skillPackId}`,
    `Accessory: ${accessory?.name ?? config.accessoryId}`,
    `Prototype tier: ${tier?.name ?? config.tierId}`,
    extras?.priceLabel ? `Indicative band: ${extras.priceLabel}` : null,
    extras?.leadLabel ? `Lead time: ${extras.leadLabel}` : null,
  ].filter(Boolean);

  return lines.join("\n");
}

export const LOCAL_STORAGE_KEY = "exobod-config-v1";

export function saveConfigToLocalStorage(
  config: ProductConfiguration,
  configId: string | null,
): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify({ config, configId, savedAt: new Date().toISOString() }),
    );
  } catch {
    // ignore
  }
}

export function loadConfigFromLocalStorage(): {
  config: ProductConfiguration;
  configId: string | null;
} | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as {
      config?: ProductConfiguration;
      configId?: string | null;
    };
    if (!parsed.config) return null;
    return {
      config: { ...defaultConfig, ...parsed.config },
      configId: parsed.configId ?? null,
    };
  } catch {
    return null;
  }
}

export function bodyArchetypeIdToInterestSlug(bodyArchetypeId: string): string {
  return bodyArchetypes.find((b) => b.id === bodyArchetypeId)?.slug ?? "walker";
}
