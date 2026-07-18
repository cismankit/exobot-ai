import { verifyAdminRequest } from "@/lib/admin/auth";
import { listEarlyOrders } from "@/lib/payments/early-access-store";
import { NextResponse } from "next/server";

function unauthorized() {
  return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
}

export async function GET(request: Request) {
  if (!verifyAdminRequest(request)) {
    return unauthorized();
  }

  const orders = await listEarlyOrders();
  return NextResponse.json({ ok: true, orders });
}
