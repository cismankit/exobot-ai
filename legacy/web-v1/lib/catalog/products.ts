import type {
  Accessory,
  BodyArchetype,
  BOMTemplate,
  BuildTier,
  CatalogVersion,
  CompatibilityRule,
  ConfiguratorCatalog,
  Finish,
  PhoneModel,
  ProductConfiguration,
  SkillPack,
} from "./types";

export const catalogVersion: CatalogVersion = {
  version: "2026.06.1",
  releasedAt: "2026-06-14",
  changelog: "Phase B seed catalog — 12 phone models, BOM templates, compatibility rules.",
};

export const bodyArchetypes: BodyArchetype[] = [
  {
    id: "body-walker",
    slug: "walker",
    name: "Walker",
    purpose: "Movement, gestures, interaction, and personality.",
    outOfScopeWarnings: [
      "Outdoor autonomy and uneven-terrain gait are out of scope for standard prototype tiers.",
      "Walker builds cannot guarantee consumer-grade fall recovery or all-day runtime.",
      "Patrol skill packs on biped frames are lab-only — rover is the supported patrol platform.",
    ],
    engineeringSignOff: true,
  },
  {
    id: "body-desk-assistant",
    slug: "desk-assistant",
    name: "Desk Assistant",
    purpose: "Workspace help, reminders, display, and friendly presence.",
    outOfScopeWarnings: [
      "Desk Assistant bodies are not rated for mobile patrol or payload carry beyond light trays.",
      "Full biped locomotion is out of scope — upper-body and base motion only.",
      "Not positioned as a medical or clinical assistive device.",
    ],
    engineeringSignOff: false,
  },
  {
    id: "body-rover",
    slug: "rover",
    name: "Rover",
    purpose: "Wheeled movement, patrol, carrying small payloads, and longer range.",
    outOfScopeWarnings: [
      "Rover drivetrains target smooth indoor floors — stairs, grass, and gravel are out of scope.",
      "Biped gesture packs do not translate to wheeled bases without engineering consult.",
      "Payload claims require accessory + tier sign-off; no silent high-kg promises.",
    ],
    engineeringSignOff: true,
  },
  {
    id: "body-utility-helper",
    slug: "utility-helper",
    name: "Utility Helper",
    purpose: "Task modules, trays, tools, camera rigs, and experimental builds.",
    outOfScopeWarnings: [
      "Utility frames prioritize accessory ports over polished locomotion aesthetics.",
      "Custom end-effectors and sensor masts require engineering review per order.",
      "Not a general-purpose humanoid substitute — scope is maker and lab iteration.",
    ],
    engineeringSignOff: true,
  },
];

export const finishes: Finish[] = [
  { id: "finish-graphite-orange", sku: "FIN-GO", name: "Graphite Orange", colorHex: "#FF7A1A", engineeringSignOff: false },
  { id: "finish-stealth-black", sku: "FIN-SB", name: "Stealth Black", colorHex: "#1A1A1A", engineeringSignOff: false },
  { id: "finish-silver-lab", sku: "FIN-SL", name: "Silver Lab", colorHex: "#C0C5CE", engineeringSignOff: false },
  { id: "finish-white-studio", sku: "FIN-WS", name: "White Studio", colorHex: "#F5F5F0", engineeringSignOff: false },
  { id: "finish-custom", sku: "FIN-CU", name: "Custom", engineeringSignOff: true },
];

export const skillPacks: SkillPack[] = [
  { id: "pack-companion", sku: "SKL-CMP", name: "Companion", skills: ["Follow", "Gesture", "React", "Assist"], engineeringSignOff: false },
  { id: "pack-creator", sku: "SKL-CRT", name: "Creator", skills: ["Record", "Gesture", "Present", "React"], engineeringSignOff: false },
  { id: "pack-education", sku: "SKL-EDU", name: "Education", skills: ["Teach", "Gesture", "Assist", "Patrol"], engineeringSignOff: false },
  { id: "pack-patrol", sku: "SKL-PTR", name: "Patrol", skills: ["Patrol", "Follow", "Record", "Monitor"], engineeringSignOff: true },
  { id: "pack-utility", sku: "SKL-UTL", name: "Utility", skills: ["Carry", "Record", "Monitor", "Assist"], engineeringSignOff: false },
  { id: "pack-demo-bot", sku: "SKL-DMO", name: "Demo Bot", skills: ["Present", "Gesture", "Patrol", "Dance"], engineeringSignOff: true },
];

export const accessories: Accessory[] = [
  { id: "acc-tray-hand", sku: "ACC-TRY", name: "Tray hand", category: "end-effector", engineeringSignOff: false },
  { id: "acc-camera-rig", sku: "ACC-CAM", name: "Camera rig", category: "rig", engineeringSignOff: false },
  { id: "acc-light-module", sku: "ACC-LGT", name: "Light module", category: "lighting", engineeringSignOff: false },
  { id: "acc-gripper-hand", sku: "ACC-GRP", name: "Gripper hand", category: "end-effector", engineeringSignOff: true },
  { id: "acc-sensor-mount", sku: "ACC-SNS", name: "Sensor mount", category: "sensor", engineeringSignOff: true },
  { id: "acc-presentation-stand", sku: "ACC-PRS", name: "Presentation stand", category: "mount", engineeringSignOff: false },
];

export const buildTiers: BuildTier[] = [
  {
    id: "tier-concept-render",
    sku: "TIER-CR",
    name: "Concept render",
    slug: "concept-render",
    order: 1,
    description: "CAD visualization and feasibility memo — no moving hardware.",
    engineeringSignOff: false,
  },
  {
    id: "tier-prototype-shell",
    sku: "TIER-PS",
    name: "Prototype shell",
    slug: "prototype-shell",
    order: 2,
    description: "Printed shells and static fit checks — limited or no actuation.",
    engineeringSignOff: false,
  },
  {
    id: "tier-moving-prototype",
    sku: "TIER-MP",
    name: "Moving prototype",
    slug: "moving-prototype",
    order: 3,
    description: "Articulated prototype with MCU, harness, and safety-clamped motion tables.",
    engineeringSignOff: true,
  },
  {
    id: "tier-custom-consult",
    sku: "TIER-CC",
    name: "Custom engineering consultation",
    slug: "custom-consult",
    order: 4,
    description: "Scoped engineering program for non-catalog geometry, torque, or payload targets.",
    engineeringSignOff: true,
  },
];

export const phoneModels: PhoneModel[] = [
  { id: "phone-iphone-15-pro", sku: "PHN-IP15P", name: "iPhone 15 Pro", platform: "iphone", brand: "Apple", mountCoreId: "core-iphone-15", engineeringSignOff: false },
  { id: "phone-iphone-15", sku: "PHN-IP15", name: "iPhone 15", platform: "iphone", brand: "Apple", mountCoreId: "core-iphone-15", engineeringSignOff: false },
  { id: "phone-iphone-14-pro", sku: "PHN-IP14P", name: "iPhone 14 Pro", platform: "iphone", brand: "Apple", mountCoreId: "core-iphone-14", engineeringSignOff: false },
  { id: "phone-iphone-se", sku: "PHN-IPSE", name: "iPhone SE (3rd gen)", platform: "iphone", brand: "Apple", mountCoreId: "core-iphone-se", engineeringSignOff: false },
  { id: "phone-pixel-8-pro", sku: "PHN-PX8P", name: "Pixel 8 Pro", platform: "android", brand: "Google", mountCoreId: "core-pixel-8", engineeringSignOff: false },
  { id: "phone-pixel-8", sku: "PHN-PX8", name: "Pixel 8", platform: "android", brand: "Google", mountCoreId: "core-pixel-8", engineeringSignOff: false },
  { id: "phone-galaxy-s24", sku: "PHN-S24", name: "Galaxy S24", platform: "android", brand: "Samsung", mountCoreId: "core-galaxy-s24", engineeringSignOff: false },
  { id: "phone-galaxy-s24-ultra", sku: "PHN-S24U", name: "Galaxy S24 Ultra", platform: "android", brand: "Samsung", mountCoreId: "core-galaxy-s24-ultra", engineeringSignOff: false },
  { id: "phone-oneplus-12", sku: "PHN-OP12", name: "OnePlus 12", platform: "android", brand: "OnePlus", mountCoreId: "core-oneplus-12", engineeringSignOff: true },
  { id: "phone-nothing-phone-2", sku: "PHN-NP2", name: "Nothing Phone (2)", platform: "android", brand: "Nothing", mountCoreId: "core-nothing-2", engineeringSignOff: true },
  { id: "phone-universal-v1", sku: "PHN-UNI", name: "Universal mount", platform: "universal", brand: "Exobod", mountCoreId: "core-universal-v1", engineeringSignOff: false },
  { id: "phone-android-generic", sku: "PHN-AND", name: "Android (unspecified)", platform: "android", brand: "Generic", mountCoreId: "core-universal-v1", engineeringSignOff: true },
];

export const bomTemplates: BOMTemplate[] = [
  {
    id: "bom-walker-concept",
    bodyArchetypeId: "body-walker",
    tierId: "tier-concept-render",
    servoCount: { min: 0, max: 0 },
    materials: ["CAD reference only"],
    estimatedWeightGrams: { min: 0, max: 0 },
    engineeringSignOff: false,
  },
  {
    id: "bom-walker-shell",
    bodyArchetypeId: "body-walker",
    tierId: "tier-prototype-shell",
    servoCount: { min: 0, max: 4 },
    materials: ["PLA+ shell", "aluminum shoulder blocks"],
    estimatedWeightGrams: { min: 1800, max: 3200 },
    engineeringSignOff: false,
  },
  {
    id: "bom-walker-moving",
    bodyArchetypeId: "body-walker",
    tierId: "tier-moving-prototype",
    servoCount: { min: 12, max: 20 },
    materials: ["PLA+ shell", "aluminum hip/shoulder blocks", "steel linkage pins", "LiPo pack"],
    estimatedWeightGrams: { min: 4200, max: 7800 },
    engineeringSignOff: true,
  },
  {
    id: "bom-walker-consult",
    bodyArchetypeId: "body-walker",
    tierId: "tier-custom-consult",
    servoCount: { min: 16, max: 24 },
    materials: ["Hybrid print + machined nodes", "custom harness", "program-specific battery"],
    estimatedWeightGrams: { min: 5000, max: 12000 },
    engineeringSignOff: true,
  },
  {
    id: "bom-desk-concept",
    bodyArchetypeId: "body-desk-assistant",
    tierId: "tier-concept-render",
    servoCount: { min: 0, max: 0 },
    materials: ["CAD reference only"],
    estimatedWeightGrams: { min: 0, max: 0 },
    engineeringSignOff: false,
  },
  {
    id: "bom-desk-shell",
    bodyArchetypeId: "body-desk-assistant",
    tierId: "tier-prototype-shell",
    servoCount: { min: 0, max: 2 },
    materials: ["PLA+ base", "desk clamp hardware"],
    estimatedWeightGrams: { min: 900, max: 1800 },
    engineeringSignOff: false,
  },
  {
    id: "bom-desk-moving",
    bodyArchetypeId: "body-desk-assistant",
    tierId: "tier-moving-prototype",
    servoCount: { min: 4, max: 8 },
    materials: ["PLA+ shell", "aluminum arm blocks", "desk-weighted base"],
    estimatedWeightGrams: { min: 2200, max: 4500 },
    engineeringSignOff: true,
  },
  {
    id: "bom-rover-shell",
    bodyArchetypeId: "body-rover",
    tierId: "tier-prototype-shell",
    servoCount: { min: 0, max: 2 },
    materials: ["PLA+ chassis", "rubber wheel set"],
    estimatedWeightGrams: { min: 1500, max: 2800 },
    engineeringSignOff: false,
  },
  {
    id: "bom-rover-moving",
    bodyArchetypeId: "body-rover",
    tierId: "tier-moving-prototype",
    servoCount: { min: 4, max: 10 },
    materials: ["PLA+ chassis", "aluminum motor mounts", "LiPo pack", "encoder harness"],
    estimatedWeightGrams: { min: 3500, max: 6500 },
    engineeringSignOff: true,
  },
  {
    id: "bom-utility-shell",
    bodyArchetypeId: "body-utility-helper",
    tierId: "tier-prototype-shell",
    servoCount: { min: 0, max: 4 },
    materials: ["PLA+ frame", "T-slot accessory rails"],
    estimatedWeightGrams: { min: 1200, max: 2500 },
    engineeringSignOff: false,
  },
  {
    id: "bom-utility-moving",
    bodyArchetypeId: "body-utility-helper",
    tierId: "tier-moving-prototype",
    servoCount: { min: 6, max: 14 },
    materials: ["PLA+ frame", "aluminum rail blocks", "modular bus taps"],
    estimatedWeightGrams: { min: 3000, max: 7000 },
    engineeringSignOff: true,
  },
  {
    id: "bom-utility-consult",
    bodyArchetypeId: "body-utility-helper",
    tierId: "tier-custom-consult",
    servoCount: { min: 8, max: 20 },
    materials: ["Custom linkage", "sensor mast", "program-specific end-effector"],
    estimatedWeightGrams: { min: 4000, max: 10000 },
    engineeringSignOff: true,
  },
];

export const compatibilityRules: CompatibilityRule[] = [
  {
    id: "rule-walker-patrol-block",
    severity: "block",
    message: "Patrol skill pack is blocked on Walker — use Rover for patrol workflows.",
    bodyArchetypeIds: ["body-walker"],
    skillPackIds: ["pack-patrol"],
  },
  {
    id: "rule-desk-patrol-block",
    severity: "block",
    message: "Patrol skill pack requires a mobile base — Desk Assistant cannot patrol.",
    bodyArchetypeIds: ["body-desk-assistant"],
    skillPackIds: ["pack-patrol"],
  },
  {
    id: "rule-concept-motion-block",
    severity: "block",
    message: "Moving skill packs require at least Prototype shell tier.",
    tierIds: ["tier-concept-render"],
    skillPackIds: ["pack-patrol", "pack-demo-bot"],
  },
  {
    id: "rule-shell-demo-warn",
    severity: "warn",
    message: "Demo Bot pack on Prototype shell tier is render + limited pose only — full motion needs Moving prototype.",
    tierIds: ["tier-prototype-shell"],
    skillPackIds: ["pack-demo-bot"],
  },
  {
    id: "rule-walker-gripper-warn",
    severity: "warn",
    message: "Gripper hand on Walker needs torque review — may reduce gait stability.",
    bodyArchetypeIds: ["body-walker"],
    accessoryIds: ["acc-gripper-hand"],
  },
  {
    id: "rule-rover-presentation-stand-block",
    severity: "block",
    message: "Presentation stand is for desk/static mounts — incompatible with Rover chassis.",
    bodyArchetypeIds: ["body-rover"],
    accessoryIds: ["acc-presentation-stand"],
  },
  {
    id: "rule-desk-camera-rig-warn",
    severity: "warn",
    message: "Camera rig on Desk Assistant may limit arm reach — confirm shot list during intake.",
    bodyArchetypeIds: ["body-desk-assistant"],
    accessoryIds: ["acc-camera-rig"],
  },
  {
    id: "rule-iphone-se-walker-warn",
    severity: "warn",
    message: "iPhone SE screen size limits on-body UI for Walker demos — consider 15 Pro or universal mount.",
    bodyArchetypeIds: ["body-walker"],
    phoneModelIds: ["phone-iphone-se"],
  },
  {
    id: "rule-custom-finish-consult",
    severity: "warn",
    message: "Custom finish requires engineering sign-off and extends lead time.",
    finishIds: ["finish-custom"],
  },
  {
    id: "rule-moving-tier-signoff",
    severity: "warn",
    message: "Moving prototype tier requires engineering sign-off before manufacturing kickoff.",
    tierIds: ["tier-moving-prototype"],
  },
  {
    id: "rule-utility-sensor-error",
    severity: "error",
    message: "Sensor mount on Utility Helper at Concept render tier — no physical ports until shell tier.",
    bodyArchetypeIds: ["body-utility-helper"],
    accessoryIds: ["acc-sensor-mount"],
    tierIds: ["tier-concept-render"],
  },
  {
    id: "rule-android-generic-warn",
    severity: "warn",
    message: "Unspecified Android handset needs dimensional confirmation before core mount lock.",
    phoneModelIds: ["phone-android-generic"],
  },
  {
    id: "rule-oneplus-signoff",
    severity: "warn",
    message: "OnePlus 12 mount core is beta — engineering sign-off required.",
    phoneModelIds: ["phone-oneplus-12"],
  },
  {
    id: "rule-demo-bot-walker-warn",
    severity: "warn",
    message: "Demo Bot pack on Walker is showroom-only with speed caps — not for unsupervised operation.",
    bodyArchetypeIds: ["body-walker"],
    skillPackIds: ["pack-demo-bot"],
  },
  {
    id: "rule-companion-rover-ok",
    severity: "warn",
    message: "Companion pack on Rover is supported — follow modes are tag-based lab experiments only.",
    bodyArchetypeIds: ["body-rover"],
    skillPackIds: ["pack-companion"],
  },
];

/** Lookup helpers */
export function getBodyArchetypeById(id: string): BodyArchetype | undefined {
  return bodyArchetypes.find((b) => b.id === id);
}

export function getBodyArchetypeBySlug(slug: string): BodyArchetype | undefined {
  return bodyArchetypes.find((b) => b.slug === slug);
}

export function getPhoneModelById(id: string): PhoneModel | undefined {
  return phoneModels.find((p) => p.id === id);
}

export function getBOMTemplate(bodyArchetypeId: string, tierId: string): BOMTemplate | undefined {
  return bomTemplates.find((b) => b.bodyArchetypeId === bodyArchetypeId && b.tierId === tierId);
}

export function getConfiguratorCatalog(): ConfiguratorCatalog {
  return {
    version: catalogVersion,
    phoneModels,
    bodyArchetypes,
    finishes,
    skillPacks,
    accessories,
    buildTiers: [...buildTiers].sort((a, b) => a.order - b.order),
  };
}

/** Default configuration IDs for initial configurator state */
export const defaultConfigurationIds: ProductConfiguration = {
  phoneModelId: "phone-iphone-15-pro",
  bodyArchetypeId: "body-walker",
  finishId: "finish-graphite-orange",
  skillPackId: "pack-companion",
  accessoryId: "acc-tray-hand",
  tierId: "tier-concept-render",
};
