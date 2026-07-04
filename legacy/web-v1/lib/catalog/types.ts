/** Product catalog entity types — Phase B foundation */

export type BodyArchetypeSlug = "walker" | "desk-assistant" | "rover" | "utility-helper";

export type PhonePlatform = "iphone" | "android" | "universal";

export type CompatibilitySeverity = "block" | "warn" | "error";

export interface BodyArchetype {
  id: string;
  slug: BodyArchetypeSlug;
  name: string;
  purpose: string;
  /** Shown in configurator when this body is selected */
  outOfScopeWarnings: string[];
  engineeringSignOff: boolean;
}

export interface Finish {
  id: string;
  sku: string;
  name: string;
  colorHex?: string;
  engineeringSignOff: boolean;
}

export interface Accessory {
  id: string;
  sku: string;
  name: string;
  category: "end-effector" | "rig" | "mount" | "sensor" | "lighting";
  engineeringSignOff: boolean;
}

export interface SkillPack {
  id: string;
  sku: string;
  name: string;
  skills: string[];
  engineeringSignOff: boolean;
}

export interface BuildTier {
  id: string;
  sku: string;
  name: string;
  slug: string;
  order: number;
  description: string;
  engineeringSignOff: boolean;
}

export interface PhoneModel {
  id: string;
  sku: string;
  name: string;
  platform: PhonePlatform;
  brand: string;
  mountCoreId: string;
  engineeringSignOff: boolean;
}

export interface BOMTemplate {
  id: string;
  bodyArchetypeId: string;
  tierId: string;
  servoCount: { min: number; max: number };
  materials: string[];
  estimatedWeightGrams: { min: number; max: number };
  engineeringSignOff: boolean;
}

export interface CompatibilityRule {
  id: string;
  severity: CompatibilitySeverity;
  message: string;
  bodyArchetypeIds?: string[];
  phoneModelIds?: string[];
  accessoryIds?: string[];
  skillPackIds?: string[];
  tierIds?: string[];
  finishIds?: string[];
}

export interface CatalogVersion {
  version: string;
  releasedAt: string;
  changelog: string;
}

/** Runtime configuration assembled in the configurator */
export interface ProductConfiguration {
  phoneModelId: string;
  bodyArchetypeId: string;
  finishId: string;
  skillPackId: string;
  accessoryId: string;
  tierId: string;
}

export interface ValidationResult {
  valid: boolean;
  warnings: string[];
  errors: string[];
  blockedReasons: string[];
}

export interface PriceBand {
  lowUsd: number;
  highUsd: number;
  currency: "USD";
  /** Always indicative — not a binding quote */
  disclaimer: string;
  breakdown: { label: string; lowUsd: number; highUsd: number }[];
}

export interface LeadTimeBand {
  lowWeeks: number;
  highWeeks: number;
  label: string;
  disclaimer: string;
}

/** Legacy estimate shape for summary/PDF routes */
export interface EstimateResult {
  label: string;
  note: string;
}

/** Configurator-facing option groups (replaces customizationOptions) */
export interface ConfiguratorCatalog {
  version: CatalogVersion;
  phoneModels: PhoneModel[];
  bodyArchetypes: BodyArchetype[];
  finishes: Finish[];
  skillPacks: SkillPack[];
  accessories: Accessory[];
  buildTiers: BuildTier[];
}
