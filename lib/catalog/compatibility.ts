import {
  accessories,
  bodyArchetypes,
  buildTiers,
  compatibilityRules,
  finishes,
  phoneModels,
  skillPacks,
} from "./products";
import type { CompatibilityRule, ProductConfiguration, ValidationResult } from "./types";

function ruleMatches(rule: CompatibilityRule, config: ProductConfiguration): boolean {
  const checks: [string[] | undefined, string][] = [
    [rule.bodyArchetypeIds, config.bodyArchetypeId],
    [rule.phoneModelIds, config.phoneModelId],
    [rule.accessoryIds, config.accessoryId],
    [rule.skillPackIds, config.skillPackId],
    [rule.tierIds, config.tierId],
    [rule.finishIds, config.finishId],
  ];

  return checks.every(([allowed, selected]) => !allowed || allowed.includes(selected));
}

function collectSignOffWarnings(config: ProductConfiguration): string[] {
  const warnings: string[] = [];

  const phone = phoneModels.find((p) => p.id === config.phoneModelId);
  const body = bodyArchetypes.find((b) => b.id === config.bodyArchetypeId);
  const finish = finishes.find((f) => f.id === config.finishId);
  const pack = skillPacks.find((s) => s.id === config.skillPackId);
  const accessory = accessories.find((a) => a.id === config.accessoryId);
  const tier = buildTiers.find((t) => t.id === config.tierId);

  for (const entity of [phone, body, finish, pack, accessory, tier]) {
    if (entity?.engineeringSignOff) {
      warnings.push(`Engineering sign-off required for: ${entity.name}.`);
    }
  }

  return warnings;
}

export function validateConfiguration(config: ProductConfiguration): ValidationResult {
  const warnings: string[] = [];
  const errors: string[] = [];
  const blockedReasons: string[] = [];

  const ids = [
    config.phoneModelId,
    config.bodyArchetypeId,
    config.finishId,
    config.skillPackId,
    config.accessoryId,
    config.tierId,
  ];

  const catalogs = [phoneModels, bodyArchetypes, finishes, skillPacks, accessories, buildTiers];
  const hasInvalidId = ids.some((id, i) => !catalogs[i].some((item) => item.id === id));

  if (hasInvalidId) {
    errors.push("One or more configuration IDs are not recognized in the current catalog version.");
  }

  for (const rule of compatibilityRules) {
    if (!ruleMatches(rule, config)) continue;

    switch (rule.severity) {
      case "block":
        blockedReasons.push(rule.message);
        break;
      case "warn":
        warnings.push(rule.message);
        break;
      case "error":
        errors.push(rule.message);
        break;
    }
  }

  const signOffWarnings = collectSignOffWarnings(config);
  for (const w of signOffWarnings) {
    if (!warnings.includes(w)) warnings.push(w);
  }

  const valid = blockedReasons.length === 0 && errors.length === 0;

  return { valid, warnings, errors, blockedReasons };
}

export function getOutOfScopeWarnings(bodyArchetypeId: string): string[] {
  const body = bodyArchetypes.find((b) => b.id === bodyArchetypeId);
  return body?.outOfScopeWarnings ?? [];
}
