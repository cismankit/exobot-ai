export type BodyArchetypeSlug = "walker" | "desk-assistant" | "rover" | "utility-helper";

export interface CompanionSkillPack {
  id: string;
  name: string;
  skills: string[];
  unlocked: boolean;
}

export interface CompanionUnitProfile {
  serialNumber: string;
  bodyTypeSlug: BodyArchetypeSlug;
  tierSlug: string;
  firmwareProfileId: string;
  firmwareVersion: string;
  motionPrimitives: string[];
  skillPacks: CompanionSkillPack[];
  safetyLimits: {
    maxJointSpeedDegPerSec: number;
    maxPayloadGrams: number;
  };
  claimed: boolean;
  claimedAt?: string;
}

export type FaceMood = "idle" | "listening" | "speaking" | "thinking" | "estop";

export interface VoiceIntent {
  id: string;
  transcript: string;
  intent: string;
  status: "queued" | "processing" | "done" | "blocked";
  createdAt: string;
}

export type BleConnectionState =
  | "disconnected"
  | "scanning"
  | "connecting"
  | "connected"
  | "error";
