import { getUnitBySerial, normalizeSerial } from "@/lib/companion/registry";
import { NextResponse } from "next/server";

type RouteContext = { params: Promise<{ serial: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { serial: raw } = await context.params;
  const serial = normalizeSerial(decodeURIComponent(raw));

  const unit = getUnitBySerial(serial);
  if (!unit) {
    return NextResponse.json({ ok: false, error: "Unit not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, unit });
}
