import { getSavedConfig, persistSavedConfig } from "@/lib/adapters/configStore";
import { legacyLabelsToConfiguration } from "@/lib/catalog/legacy";
import type { ProductConfiguration } from "@/lib/catalog/types";
import { saveConfigSchema } from "@/lib/schema/config";
import { NextResponse } from "next/server";

function normalizeConfig(
  config: ProductConfiguration | Parameters<typeof legacyLabelsToConfiguration>[0],
): ProductConfiguration {
  return "phoneModelId" in config ? config : legacyLabelsToConfiguration(config);
}

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = saveConfigSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const data = parsed.data;

  const result = await persistSavedConfig({
    configId: data.configId,
    email: data.email.trim(),
    config: normalizeConfig(data.config),
    summary: data.summary.trim(),
    savedAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true, id: result.id });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ ok: false, error: "Missing id" }, { status: 400 });
  }

  const record = await getSavedConfig(id);
  if (!record) {
    return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    ok: true,
    configId: record.configId,
    summary: record.summary,
    email: record.email,
    savedAt: record.savedAt,
  });
}
