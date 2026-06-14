import { getConfiguratorCatalog } from "@/lib/catalog/products";
import { NextResponse } from "next/server";

export async function GET() {
  const catalog = getConfiguratorCatalog();
  return NextResponse.json({ ok: true, catalog });
}
