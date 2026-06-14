import type { BodyArchetypeSlug } from "./types";

export interface SafetyLimits {
  maxJointSpeedDegPerSec: number;
  maxPayloadGrams: number;
}

export interface SafetyGovernorState {
  speedCapPct: number;
  estopActive: boolean;
  bleConnected: boolean;
  sessionExpired: boolean;
  geofenceEnabled: boolean;
}

export interface SafetyCheckResult {
  allowed: boolean;
  reason?: string;
}

const DEFAULT_SPEED_CAP = 100;

/** Geofence applies to rover body type only (stub) */
export function isGeofenceRequired(bodyType: BodyArchetypeSlug): boolean {
  return bodyType === "rover";
}

export function createInitialGovernorState(bodyType: BodyArchetypeSlug): SafetyGovernorState {
  return {
    speedCapPct: DEFAULT_SPEED_CAP,
    estopActive: false,
    bleConnected: false,
    sessionExpired: false,
    geofenceEnabled: isGeofenceRequired(bodyType),
  };
}

export function checkMotionAllowed(
  state: SafetyGovernorState,
  requestedSpeedPct: number,
  limits: SafetyLimits,
): SafetyCheckResult {
  if (state.estopActive) {
    return { allowed: false, reason: "E-STOP active — reset before motion" };
  }

  if (!state.bleConnected) {
    return { allowed: false, reason: "BLE not connected" };
  }

  if (state.sessionExpired) {
    return { allowed: false, reason: "Supervision session expired" };
  }

  const effectiveCap = Math.min(state.speedCapPct, 100);
  if (requestedSpeedPct > effectiveCap) {
    return {
      allowed: false,
      reason: `Speed ${requestedSpeedPct}% exceeds cap ${effectiveCap}%`,
    };
  }

  const maxDeg = limits.maxJointSpeedDegPerSec;
  if (maxDeg <= 0) {
    return { allowed: false, reason: "Firmware profile blocks motion on this tier" };
  }

  return { allowed: true };
}

export function effectiveMaxSpeedDeg(
  limits: SafetyLimits,
  speedCapPct: number,
): number {
  return (limits.maxJointSpeedDegPerSec * speedCapPct) / 100;
}

export function triggerEstop(state: SafetyGovernorState): SafetyGovernorState {
  return { ...state, estopActive: true, speedCapPct: 0 };
}

export function resetEstop(state: SafetyGovernorState): SafetyGovernorState {
  return { ...state, estopActive: false, speedCapPct: DEFAULT_SPEED_CAP };
}
