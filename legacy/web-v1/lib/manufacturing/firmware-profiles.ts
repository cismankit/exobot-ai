import type { BodyArchetypeSlug } from "@/lib/catalog/types";

export interface FirmwareProfile {
  id: string;
  name: string;
  bodyTypeSlug: BodyArchetypeSlug;
  tierSlug: string;
  /** Allowed motion primitive set for skill pack runtime */
  motionPrimitives: string[];
  /** Safety governor limits (stub values for Phase E) */
  maxJointSpeedDegPerSec: number;
  maxPayloadGrams: number;
  version: string;
}

const PROFILES: FirmwareProfile[] = [
  {
    id: "fw-walker-concept",
    name: "Walker — concept render",
    bodyTypeSlug: "walker",
    tierSlug: "concept-render",
    motionPrimitives: [],
    maxJointSpeedDegPerSec: 0,
    maxPayloadGrams: 0,
    version: "0.1.0-stub",
  },
  {
    id: "fw-walker-shell",
    name: "Walker — prototype shell",
    bodyTypeSlug: "walker",
    tierSlug: "prototype-shell",
    motionPrimitives: ["pose-hold"],
    maxJointSpeedDegPerSec: 15,
    maxPayloadGrams: 200,
    version: "0.2.0-stub",
  },
  {
    id: "fw-walker-moving",
    name: "Walker — moving prototype",
    bodyTypeSlug: "walker",
    tierSlug: "moving-prototype",
    motionPrimitives: ["pose-hold", "gesture-wave", "walk-lab"],
    maxJointSpeedDegPerSec: 45,
    maxPayloadGrams: 500,
    version: "0.3.0-stub",
  },
  {
    id: "fw-walker-consult",
    name: "Walker — custom consult",
    bodyTypeSlug: "walker",
    tierSlug: "custom-consult",
    motionPrimitives: ["pose-hold", "gesture-wave", "walk-lab", "custom-primitive"],
    maxJointSpeedDegPerSec: 60,
    maxPayloadGrams: 800,
    version: "0.4.0-stub",
  },
  {
    id: "fw-desk-concept",
    name: "Desk Assistant — concept render",
    bodyTypeSlug: "desk-assistant",
    tierSlug: "concept-render",
    motionPrimitives: [],
    maxJointSpeedDegPerSec: 0,
    maxPayloadGrams: 0,
    version: "0.1.0-stub",
  },
  {
    id: "fw-desk-shell",
    name: "Desk Assistant — prototype shell",
    bodyTypeSlug: "desk-assistant",
    tierSlug: "prototype-shell",
    motionPrimitives: ["pose-hold"],
    maxJointSpeedDegPerSec: 20,
    maxPayloadGrams: 300,
    version: "0.2.0-stub",
  },
  {
    id: "fw-desk-moving",
    name: "Desk Assistant — moving prototype",
    bodyTypeSlug: "desk-assistant",
    tierSlug: "moving-prototype",
    motionPrimitives: ["pose-hold", "gesture-wave", "head-track"],
    maxJointSpeedDegPerSec: 35,
    maxPayloadGrams: 600,
    version: "0.3.0-stub",
  },
  {
    id: "fw-rover-shell",
    name: "Rover — prototype shell",
    bodyTypeSlug: "rover",
    tierSlug: "prototype-shell",
    motionPrimitives: ["pose-hold"],
    maxJointSpeedDegPerSec: 10,
    maxPayloadGrams: 500,
    version: "0.2.0-stub",
  },
  {
    id: "fw-rover-moving",
    name: "Rover — moving prototype",
    bodyTypeSlug: "rover",
    tierSlug: "moving-prototype",
    motionPrimitives: ["drive-lab", "patrol-tag", "follow-tag"],
    maxJointSpeedDegPerSec: 80,
    maxPayloadGrams: 1500,
    version: "0.3.0-stub",
  },
  {
    id: "fw-utility-shell",
    name: "Utility Helper — prototype shell",
    bodyTypeSlug: "utility-helper",
    tierSlug: "prototype-shell",
    motionPrimitives: ["pose-hold"],
    maxJointSpeedDegPerSec: 15,
    maxPayloadGrams: 400,
    version: "0.2.0-stub",
  },
  {
    id: "fw-utility-moving",
    name: "Utility Helper — moving prototype",
    bodyTypeSlug: "utility-helper",
    tierSlug: "moving-prototype",
    motionPrimitives: ["pose-hold", "carry-lab", "tool-swap"],
    maxJointSpeedDegPerSec: 40,
    maxPayloadGrams: 1200,
    version: "0.3.0-stub",
  },
  {
    id: "fw-utility-consult",
    name: "Utility Helper — custom consult",
    bodyTypeSlug: "utility-helper",
    tierSlug: "custom-consult",
    motionPrimitives: ["pose-hold", "carry-lab", "tool-swap", "custom-primitive"],
    maxJointSpeedDegPerSec: 55,
    maxPayloadGrams: 2000,
    version: "0.4.0-stub",
  },
];

const TIER_ID_TO_SLUG: Record<string, string> = {
  "tier-concept-render": "concept-render",
  "tier-prototype-shell": "prototype-shell",
  "tier-moving-prototype": "moving-prototype",
  "tier-custom-consult": "custom-consult",
};

const BODY_ID_TO_SLUG: Record<string, BodyArchetypeSlug> = {
  "body-walker": "walker",
  "body-desk-assistant": "desk-assistant",
  "body-rover": "rover",
  "body-utility-helper": "utility-helper",
};

export function getFirmwareProfile(
  bodyArchetypeId: string,
  tierId: string,
): FirmwareProfile {
  const bodySlug = BODY_ID_TO_SLUG[bodyArchetypeId] ?? "walker";
  const tierSlug = TIER_ID_TO_SLUG[tierId] ?? "concept-render";
  const match = PROFILES.find(
    (p) => p.bodyTypeSlug === bodySlug && p.tierSlug === tierSlug,
  );
  if (match) return match;

  return {
    id: `fw-${bodySlug}-${tierSlug}`,
    name: `${bodySlug} — ${tierSlug}`,
    bodyTypeSlug: bodySlug,
    tierSlug,
    motionPrimitives: ["pose-hold"],
    maxJointSpeedDegPerSec: 30,
    maxPayloadGrams: 500,
    version: "0.0.0-stub",
  };
}

export function listFirmwareProfiles(): FirmwareProfile[] {
  return [...PROFILES];
}
