import { persistInterest } from "@/lib/adapters/interestStore";
import { partnerFormSchema } from "@/lib/schema/partner";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rate = checkRateLimit(`partners:${ip}`, { limit: 6, windowMs: 60 * 60 * 1000 });
  if (!rate.allowed) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(Math.ceil((rate.resetAt - Date.now()) / 1000)) },
      },
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = partnerFormSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const data = parsed.data;
  if (data.website) {
    return NextResponse.json({ ok: true });
  }

  const messageParts = [
    `[Partner: ${data.partnerType}]`,
    `Organization: ${data.organization}`,
    `Estimated units: ${data.estimatedUnits}`,
    data.message?.trim(),
  ].filter(Boolean);

  const result = await persistInterest({
    name: data.contactName.trim(),
    email: data.email.trim(),
    phone: data.phone?.trim() || undefined,
    bodyType: "Not Sure",
    useCase: data.partnerType.includes("School") ? "Education" : "Business Demo",
    budget: "Not Sure",
    message: messageParts.join("\n"),
    utmSource: data.utmSource?.trim() || undefined,
    utmMedium: data.utmMedium?.trim() || undefined,
    utmCampaign: data.utmCampaign?.trim() || undefined,
    affiliateRef: data.affiliateRef?.trim() || undefined,
    sourcePage: data.sourcePage?.trim() || "/partners",
  });

  return NextResponse.json({ ok: true, leadId: result.leadId, merged: result.merged });
}
