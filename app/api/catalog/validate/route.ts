import { validateConfiguration } from "@/lib/catalog/compatibility";
import { calculateLeadTimeBand } from "@/lib/catalog/lead-time";
import { calculatePriceBand } from "@/lib/catalog/pricing";
import { productConfigurationSchema } from "@/lib/schema/catalog";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = productConfigurationSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const config = parsed.data;
  const validation = validateConfiguration(config);
  const priceBand = calculatePriceBand(config);
  const leadTime = calculateLeadTimeBand(config);

  return NextResponse.json({
    ok: true,
    validation,
    priceBand,
    leadTime,
  });
}
