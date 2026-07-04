import { getDb } from "@/lib/db";
import { getNextUnpaidMilestone } from "@/lib/orders/milestones";
import { createMilestoneCheckoutSession, isStripeConfigured } from "@/lib/payments/stripe";
import { NextResponse } from "next/server";

type RouteContext = { params: Promise<{ orderToken: string }> };

function siteBaseUrl(request: Request): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    new URL(request.url).origin
  );
}

export async function POST(request: Request, context: RouteContext) {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Payments are not configured yet." },
      { status: 503 },
    );
  }

  const { orderToken } = await context.params;
  const db = getDb();
  const order = await db.findOrderByToken(orderToken);

  if (!order) {
    return NextResponse.json({ ok: false, error: "Order not found" }, { status: 404 });
  }

  const milestone = getNextUnpaidMilestone(order.milestones);
  if (!milestone) {
    return NextResponse.json({ ok: false, error: "No unpaid milestones remain." }, { status: 409 });
  }

  const base = siteBaseUrl(request);
  const successUrl = `${base}/my/order/${orderToken}?paid=1`;
  const cancelUrl = `${base}/my/order/${orderToken}?cancelled=1`;

  try {
    const session = await createMilestoneCheckoutSession({
      orderToken,
      orderId: order.id,
      milestoneId: milestone.id,
      milestoneName: milestone.name,
      amountUsd: milestone.amountUsd,
      customerEmail: order.customerEmail,
      successUrl,
      cancelUrl,
    });

    const updatedMilestones = order.milestones.map((m) =>
      m.id === milestone.id ? { ...m, status: "invoiced" as const } : m,
    );
    await db.updateOrder(order.id, { milestones: updatedMilestones });

    return NextResponse.json({
      ok: true,
      checkoutUrl: session.url,
      sessionId: session.sessionId,
      milestoneId: milestone.id,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Checkout failed";
    return NextResponse.json({ ok: false, error: message }, { status: 502 });
  }
}

export async function GET(_request: Request, context: RouteContext) {
  const { orderToken } = await context.params;
  const db = getDb();
  const order = await db.findOrderByToken(orderToken);

  if (!order) {
    return NextResponse.json({ ok: false, error: "Order not found" }, { status: 404 });
  }

  const milestone = getNextUnpaidMilestone(order.milestones);

  return NextResponse.json({
    ok: true,
    stripeConfigured: isStripeConfigured(),
    nextMilestone: milestone
      ? { id: milestone.id, name: milestone.name, amountUsd: milestone.amountUsd, status: milestone.status }
      : null,
  });
}
