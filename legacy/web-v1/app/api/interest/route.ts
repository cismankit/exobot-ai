import { persistInterest } from "@/lib/adapters/interestStore";
import { interestFormSchema } from "@/lib/schema/interest";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rate = checkRateLimit(`interest:${ip}`, { limit: 8, windowMs: 60 * 60 * 1000 });
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

  const parsed = interestFormSchema.safeParse(json);
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

  const referrer = request.headers.get("referer") ?? undefined;
  const utmSource =
    data.utmSource ?? request.headers.get("x-utm-source") ?? undefined;
  const utmMedium =
    data.utmMedium ?? request.headers.get("x-utm-medium") ?? undefined;
  const utmCampaign =
    data.utmCampaign ?? request.headers.get("x-utm-campaign") ?? undefined;
  const affiliateRef = data.affiliateRef ?? undefined;

  const result = await persistInterest({
    name: data.name.trim(),
    email: data.email.trim(),
    phone: data.phone?.trim() || undefined,
    bodyType: data.bodyType,
    useCase: data.useCase,
    budget: data.budget,
    message: data.message?.trim() || undefined,
    configurationSummary: data.configurationSummary?.trim() || undefined,
    configurationId: data.configurationId?.trim() || undefined,
    utmSource,
    utmMedium,
    utmCampaign,
    affiliateRef,
    referrer,
    sourcePage: data.sourcePage?.trim() || undefined,
  });

  return NextResponse.json({ ok: true, leadId: result.leadId, merged: result.merged });
}
