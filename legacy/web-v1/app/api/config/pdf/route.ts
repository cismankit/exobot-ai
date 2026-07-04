import { calculateLeadTimeBand } from "@/lib/catalog/lead-time";
import { calculatePriceBand } from "@/lib/catalog/pricing";
import type { ProductConfiguration } from "@/lib/catalog/types";
import { pdfConfigSchema } from "@/lib/schema/config";
import { NextResponse } from "next/server";

function isProductConfig(
  config: unknown,
): config is ProductConfiguration {
  return (
    typeof config === "object" &&
    config !== null &&
    "phoneModelId" in config
  );
}

function buildSpecSheet(
  configId: string | undefined,
  summary: string,
  config: ProductConfiguration,
): string {
  const price = calculatePriceBand(config);
  const lead = calculateLeadTimeBand(config);

  return [
    "EXOBOD.AI — CONFIGURATION SPEC SHEET",
    "=====================================",
    "",
    configId ? `Configuration ID: ${configId}` : null,
    `Generated: ${new Date().toISOString()}`,
    "",
    "--- BUILD SUMMARY ---",
    summary,
    "",
    "--- ESTIMATES (INDICATIVE) ---",
    `Price band: $${price.lowUsd.toLocaleString("en-US")} – $${price.highUsd.toLocaleString("en-US")}`,
    `Lead time: ${lead.label}`,
    "",
    price.disclaimer,
    lead.disclaimer,
    "",
    "--- NEXT STEPS ---",
    "Submit a build request at https://exobod.ai/customize",
    "or email saved configs through the configurator desk.",
    "",
    "Exobod systems are custom hardware builds reviewed case-by-case.",
  ]
    .filter((line) => line !== null)
    .join("\n");
}

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = pdfConfigSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const { configId, config, summary } = parsed.data;

  if (!isProductConfig(config)) {
    return NextResponse.json(
      { ok: false, error: "Legacy config format not supported for PDF export." },
      { status: 400 },
    );
  }

  const body = buildSpecSheet(configId, summary, config);
  const filename = configId
    ? `exobod-${configId.toLowerCase()}.txt`
    : "exobod-config.txt";

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
