import { claimSerial } from "@/lib/companion/claims";
import { getSerialByNumber } from "@/lib/manufacturing/serial";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { SAFETY_ACK_VERSION, validateSafetyAcknowledgment } from "@/lib/safety/acknowledgment";
import { NextResponse } from "next/server";
import { z } from "zod";

const claimSchema = z.object({
  serialNumber: z.string().min(6).max(32),
  deviceLabel: z.string().max(120).optional(),
  safetyAcknowledged: z.boolean(),
  safetyAckVersion: z.string(),
});

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rate = checkRateLimit(`companion-claim:${ip}`, { limit: 20, windowMs: 60 * 60 * 1000 });
  if (!rate.allowed) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please try again later." },
      { status: 429 },
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = claimSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const safety = validateSafetyAcknowledgment({
    safetyAcknowledged: parsed.data.safetyAcknowledged,
    safetyAckVersion: parsed.data.safetyAckVersion,
  });
  if (!safety.ok) {
    return NextResponse.json({ ok: false, error: safety.error }, { status: 400 });
  }

  const serial = await getSerialByNumber(parsed.data.serialNumber);
  if (!serial) {
    return NextResponse.json(
      { ok: false, error: "Serial number not found. Contact support if this unit was recently shipped." },
      { status: 404 },
    );
  }

  const result = await claimSerial({
    serialNumber: parsed.data.serialNumber,
    deviceLabel: parsed.data.deviceLabel,
    safetyAckVersion: SAFETY_ACK_VERSION,
    orderId: serial.orderId,
    workOrderId: serial.workOrderId,
  });

  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 409 });
  }

  return NextResponse.json({
    ok: true,
    claim: result.claim,
    firmwareProfileId: serial.firmwareProfileId,
    configurationId: serial.configurationId,
  });
}
