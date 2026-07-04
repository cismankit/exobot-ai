import { SAFETY_ACK_VERSION } from "@/lib/safety/acknowledgment";
import { randomUUID } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const CLAIMS_FILE = path.join(DATA_DIR, "companion-claims.json");

export interface CompanionClaim {
  id: string;
  serialNumber: string;
  deviceLabel?: string;
  claimedAt: string;
  safetyAckVersion: string;
  orderId?: string;
  workOrderId?: string;
}

let writeLock: Promise<void> = Promise.resolve();

async function withLock<T>(fn: () => Promise<T>): Promise<T> {
  const run = writeLock.then(fn, fn);
  writeLock = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

async function readClaims(): Promise<CompanionClaim[]> {
  await mkdir(DATA_DIR, { recursive: true });
  try {
    const raw = await readFile(CLAIMS_FILE, "utf8");
    const parsed = JSON.parse(raw) as CompanionClaim[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeClaims(claims: CompanionClaim[]): Promise<void> {
  await writeFile(CLAIMS_FILE, JSON.stringify(claims, null, 2), "utf8");
}

export async function claimSerial(input: {
  serialNumber: string;
  deviceLabel?: string;
  safetyAckVersion: string;
  orderId?: string;
  workOrderId?: string;
}): Promise<{ ok: true; claim: CompanionClaim } | { ok: false; error: string }> {
  if (input.safetyAckVersion !== SAFETY_ACK_VERSION) {
    return {
      ok: false,
      error: `Safety acknowledgment version mismatch. Expected ${SAFETY_ACK_VERSION}.`,
    };
  }

  return withLock(async () => {
    const claims = await readClaims();
    const normalized = input.serialNumber.trim().toUpperCase();
    const existing = claims.find((c) => c.serialNumber === normalized);
    if (existing) {
      return { ok: false, error: "This serial is already claimed on another device." };
    }

    const claim: CompanionClaim = {
      id: randomUUID(),
      serialNumber: normalized,
      deviceLabel: input.deviceLabel?.trim() || undefined,
      claimedAt: new Date().toISOString(),
      safetyAckVersion: input.safetyAckVersion,
      orderId: input.orderId,
      workOrderId: input.workOrderId,
    };

    claims.unshift(claim);
    await writeClaims(claims);
    return { ok: true, claim };
  });
}

export async function findClaimBySerial(serialNumber: string): Promise<CompanionClaim | null> {
  const claims = await readClaims();
  const normalized = serialNumber.trim().toUpperCase();
  return claims.find((c) => c.serialNumber === normalized) ?? null;
}
