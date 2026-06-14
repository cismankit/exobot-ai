import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";

type RouteContext = { params: Promise<{ token: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { token } = await context.params;
  const db = getDb();
  const order = await db.findOrderByToken(token);

  if (!order) {
    return NextResponse.json({ ok: false, error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, order });
}
