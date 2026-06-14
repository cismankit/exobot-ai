import { createIncidentReport } from "@/lib/incidents/store";
import { sendIncidentAlert } from "@/lib/adapters/email";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { NextResponse } from "next/server";
import { z } from "zod";

const incidentSchema = z.object({
  reporterName: z.string().min(2).max(120),
  reporterEmail: z.string().email(),
  serialNumber: z.string().max(32).optional(),
  orderToken: z.string().max(64).optional(),
  category: z.enum([
    "injury",
    "near_miss",
    "hardware_failure",
    "software_bug",
    "privacy",
    "other",
  ]),
  severity: z.enum(["low", "medium", "high", "urgent"]),
  description: z.string().min(10).max(8000),
  occurredAt: z.string().optional(),
  region: z.string().max(8).optional(),
});

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rate = checkRateLimit(`incident:${ip}`, { limit: 5, windowMs: 60 * 60 * 1000 });
  if (!rate.allowed) {
    return NextResponse.json(
      { ok: false, error: "Too many reports. Please try again later or email support@exobod.ai." },
      { status: 429 },
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = incidentSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const report = await createIncidentReport(parsed.data);

  void sendIncidentAlert({
    reportId: report.id,
    reporterName: parsed.data.reporterName,
    reporterEmail: parsed.data.reporterEmail,
    category: parsed.data.category,
    severity: parsed.data.severity,
    description: parsed.data.description,
    serialNumber: parsed.data.serialNumber,
    orderToken: parsed.data.orderToken,
    region: parsed.data.region,
  }).catch((err) => console.error("[exobod incident alert]", err));

  return NextResponse.json({ ok: true, reportId: report.id });
}
