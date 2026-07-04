import type { BodyArchetypeSlug } from "@/lib/catalog/types";

export const SERIAL_PATTERN = /^EXB-\d{4}-\d{4}$/;

export interface CompanionUnitProfile {
  serialNumber: string;
  bodyTypeSlug: BodyArchetypeSlug;
  tierSlug: string;
  firmwareProfileId: string;
  firmwareVersion: string;
  /** Motion primitive IDs unlocked for this serial */
  motionPrimitives: string[];
  skillPacks: CompanionSkillPack[];
  safetyLimits: {
    maxJointSpeedDegPerSec: number;
    maxPayloadGrams: number;
  };
  claimed: boolean;
  claimedAt?: string;
  claimToken?: string;
}

export interface CompanionSkillPack {
  id: string;
  name: string;
  skills: string[];
  unlocked: boolean;
}

export interface ClaimUnitRequest {
  serial: string;
  claimToken?: string;
}

export interface ClaimUnitResponse {
  ok: boolean;
  unit?: CompanionUnitProfile;
  error?: string;
}
