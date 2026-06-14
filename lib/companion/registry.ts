import type { BodyArchetypeSlug } from "@/lib/catalog/types";
import { getFirmwareProfile } from "@/lib/manufacturing/firmware-profiles";
import type { CompanionSkillPack, CompanionUnitProfile } from "./types";
import { SERIAL_PATTERN } from "./types";

interface StubRegistryEntry {
  serialNumber: string;
  bodyArchetypeId: string;
  tierId: string;
  skillPackIds: string[];
  claimed: boolean;
  claimedAt?: string;
  claimToken: string;
}

const SKILL_PACKS: Record<
  string,
  { name: string; skills: string[]; motionPrimitives: string[] }
> = {
  "skill-gestures-basic": {
    name: "Basic Gestures",
    skills: ["wave", "nod", "pose-hold"],
    motionPrimitives: ["pose-hold", "gesture-wave"],
  },
  "skill-rover-patrol": {
    name: "Rover Patrol",
    skills: ["patrol", "follow-tag"],
    motionPrimitives: ["drive-lab", "patrol-tag", "follow-tag"],
  },
  "skill-desk-presence": {
    name: "Desk Presence",
    skills: ["head-track", "wave"],
    motionPrimitives: ["pose-hold", "gesture-wave", "head-track"],
  },
  "skill-utility-carry": {
    name: "Utility Carry",
    skills: ["carry", "tool-swap"],
    motionPrimitives: ["pose-hold", "carry-lab", "tool-swap"],
  },
};

/** Demo serials for companion app development — Phase F stub registry */
const STUB_REGISTRY: StubRegistryEntry[] = [
  {
    serialNumber: "EXB-2026-0001",
    bodyArchetypeId: "body-walker",
    tierId: "tier-moving-prototype",
    skillPackIds: ["skill-gestures-basic"],
    claimed: false,
    claimToken: "demo-walker-0001",
  },
  {
    serialNumber: "EXB-2026-0002",
    bodyArchetypeId: "body-rover",
    tierId: "tier-moving-prototype",
    skillPackIds: ["skill-rover-patrol"],
    claimed: false,
    claimToken: "demo-rover-0002",
  },
  {
    serialNumber: "EXB-2026-0003",
    bodyArchetypeId: "body-desk-assistant",
    tierId: "tier-moving-prototype",
    skillPackIds: ["skill-desk-presence"],
    claimed: false,
    claimToken: "demo-desk-0003",
  },
  {
    serialNumber: "EXB-2026-0004",
    bodyArchetypeId: "body-utility-helper",
    tierId: "tier-moving-prototype",
    skillPackIds: ["skill-utility-carry", "skill-gestures-basic"],
    claimed: false,
    claimToken: "demo-utility-0004",
  },
];

const BODY_ID_TO_SLUG: Record<string, BodyArchetypeSlug> = {
  "body-walker": "walker",
  "body-desk-assistant": "desk-assistant",
  "body-rover": "rover",
  "body-utility-helper": "utility-helper",
};

const TIER_ID_TO_SLUG: Record<string, string> = {
  "tier-concept-render": "concept-render",
  "tier-prototype-shell": "prototype-shell",
  "tier-moving-prototype": "moving-prototype",
  "tier-custom-consult": "custom-consult",
};

function buildSkillPacks(packIds: string[], firmwarePrimitives: string[]): CompanionSkillPack[] {
  return Object.entries(SKILL_PACKS).map(([id, pack]) => {
    const packUnlocked = packIds.includes(id);
    const hasMotion =
      packUnlocked &&
      pack.motionPrimitives.some((p) => firmwarePrimitives.includes(p));
    return {
      id,
      name: pack.name,
      skills: pack.skills,
      unlocked: hasMotion,
    };
  });
}

function entryToProfile(entry: StubRegistryEntry): CompanionUnitProfile {
  const bodySlug = BODY_ID_TO_SLUG[entry.bodyArchetypeId] ?? "walker";
  const tierSlug = TIER_ID_TO_SLUG[entry.tierId] ?? "concept-render";
  const fw = getFirmwareProfile(entry.bodyArchetypeId, entry.tierId);

  return {
    serialNumber: entry.serialNumber,
    bodyTypeSlug: bodySlug,
    tierSlug,
    firmwareProfileId: fw.id,
    firmwareVersion: fw.version,
    motionPrimitives: fw.motionPrimitives,
    skillPacks: buildSkillPacks(entry.skillPackIds, fw.motionPrimitives),
    safetyLimits: {
      maxJointSpeedDegPerSec: fw.maxJointSpeedDegPerSec,
      maxPayloadGrams: fw.maxPayloadGrams,
    },
    claimed: entry.claimed,
    claimedAt: entry.claimedAt,
    claimToken: entry.claimToken,
  };
}

export function normalizeSerial(input: string): string {
  return input.trim().toUpperCase();
}

export function isValidSerialFormat(serial: string): boolean {
  return SERIAL_PATTERN.test(normalizeSerial(serial));
}

export function getUnitBySerial(serial: string): CompanionUnitProfile | null {
  const normalized = normalizeSerial(serial);
  if (!isValidSerialFormat(normalized)) return null;

  const entry = STUB_REGISTRY.find((e) => e.serialNumber === normalized);
  if (!entry) return null;

  return entryToProfile(entry);
}

export function claimUnit(
  serial: string,
  claimToken?: string,
): { ok: true; unit: CompanionUnitProfile } | { ok: false; error: string } {
  const normalized = normalizeSerial(serial);

  if (!isValidSerialFormat(normalized)) {
    return { ok: false, error: "Invalid serial format. Use EXB-YYYY-NNNN." };
  }

  const entry = STUB_REGISTRY.find((e) => e.serialNumber === normalized);
  if (!entry) {
    return { ok: false, error: "Serial not found in registry. Contact support." };
  }

  if (entry.claimed) {
    return { ok: false, error: "This unit is already claimed." };
  }

  if (claimToken && claimToken !== entry.claimToken) {
    return { ok: false, error: "Invalid claim token." };
  }

  entry.claimed = true;
  entry.claimedAt = new Date().toISOString();

  return { ok: true, unit: entryToProfile(entry) };
}

export function listDemoSerials(): string[] {
  return STUB_REGISTRY.map((e) => e.serialNumber);
}
