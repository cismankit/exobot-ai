import type { BodyArchetypeSlug } from "./types";

/** Core motion primitive definitions — mirrors lib/manufacturing/firmware-profiles patterns */
export interface MotionPrimitive {
  id: string;
  label: string;
  description: string;
  /** Firmware profile primitive ID */
  firmwareId: string;
  durationMs: number;
  maxSpeedPct: number;
  estopInterruptible: boolean;
  /** Always available regardless of skill pack */
  alwaysAvailable?: boolean;
  /** Body types this primitive applies to; empty = all */
  bodyTypes?: BodyArchetypeSlug[];
}

export const CORE_PRIMITIVES: MotionPrimitive[] = [
  {
    id: "wave",
    label: "Wave",
    description: "Friendly arm wave gesture",
    firmwareId: "gesture-wave",
    durationMs: 2500,
    maxSpeedPct: 70,
    estopInterruptible: true,
    bodyTypes: ["walker", "desk-assistant", "utility-helper"],
  },
  {
    id: "nod",
    label: "Nod",
    description: "Affirmative head nod",
    firmwareId: "head-track",
    durationMs: 1200,
    maxSpeedPct: 50,
    estopInterruptible: true,
    bodyTypes: ["walker", "desk-assistant", "utility-helper"],
  },
  {
    id: "pose-hold",
    label: "Hold Pose",
    description: "Maintain current pose",
    firmwareId: "pose-hold",
    durationMs: 0,
    maxSpeedPct: 0,
    estopInterruptible: true,
  },
  {
    id: "patrol",
    label: "Patrol",
    description: "Short patrol segment",
    firmwareId: "patrol-tag",
    durationMs: 8000,
    maxSpeedPct: 60,
    estopInterruptible: true,
    bodyTypes: ["rover"],
  },
  {
    id: "drive",
    label: "Drive Lab",
    description: "Controlled drive test",
    firmwareId: "drive-lab",
    durationMs: 5000,
    maxSpeedPct: 55,
    estopInterruptible: true,
    bodyTypes: ["rover"],
  },
  {
    id: "carry",
    label: "Carry",
    description: "Carry lab motion",
    firmwareId: "carry-lab",
    durationMs: 4000,
    maxSpeedPct: 45,
    estopInterruptible: true,
    bodyTypes: ["utility-helper"],
  },
  {
    id: "estop",
    label: "E-STOP",
    description: "Emergency stop — cuts all motion instantly",
    firmwareId: "estop",
    durationMs: 0,
    maxSpeedPct: 0,
    estopInterruptible: false,
    alwaysAvailable: true,
  },
];

/** Body-specific nod mapping — rover uses brake hold instead of head nod */
const BODY_NOD_FIRMWARE: Partial<Record<BodyArchetypeSlug, string>> = {
  rover: "pose-hold",
};

export function resolvePrimitiveForBody(
  primitiveId: string,
  bodyType: BodyArchetypeSlug,
): MotionPrimitive | null {
  const base = CORE_PRIMITIVES.find((p) => p.id === primitiveId);
  if (!base) return null;

  if (primitiveId === "nod" && BODY_NOD_FIRMWARE[bodyType]) {
    return {
      ...base,
      firmwareId: BODY_NOD_FIRMWARE[bodyType]!,
      label: bodyType === "rover" ? "Brake Hold" : base.label,
      description:
        bodyType === "rover" ? "Hold position — rover has no head joint" : base.description,
    };
  }

  if (base.bodyTypes && !base.bodyTypes.includes(bodyType)) {
    return null;
  }

  return base;
}

export function getAvailablePrimitives(
  bodyType: BodyArchetypeSlug,
  unlockedFirmwareIds: string[],
): MotionPrimitive[] {
  const unlocked = new Set(unlockedFirmwareIds);

  return CORE_PRIMITIVES.filter((p) => {
    if (p.alwaysAvailable) return true;
    if (p.bodyTypes && !p.bodyTypes.includes(bodyType)) return false;

    const resolved = resolvePrimitiveForBody(p.id, bodyType);
    if (!resolved) return false;

    return unlocked.has(resolved.firmwareId) || unlocked.has(p.firmwareId);
  }).map((p) => resolvePrimitiveForBody(p.id, bodyType)!);
}

export function mapIntentToPrimitive(
  intent: string,
  bodyType: BodyArchetypeSlug,
  unlockedFirmwareIds: string[],
): MotionPrimitive | null {
  const normalized = intent.toLowerCase();
  const available = getAvailablePrimitives(bodyType, unlockedFirmwareIds);

  if (normalized.includes("stop") || normalized.includes("halt")) {
    return available.find((p) => p.id === "estop") ?? null;
  }
  if (normalized.includes("wave") || normalized.includes("hello")) {
    return available.find((p) => p.id === "wave") ?? null;
  }
  if (normalized.includes("nod") || normalized.includes("yes")) {
    return available.find((p) => p.id === "nod") ?? null;
  }
  if (normalized.includes("patrol") || normalized.includes("drive")) {
    return available.find((p) => p.id === "patrol" || p.id === "drive") ?? null;
  }

  return null;
}
