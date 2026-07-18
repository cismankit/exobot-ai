import {
  markEarlyOrderCanceled,
  markEarlyOrderPaid,
} from "@/lib/payments/early-access-store";
import {
  isStripeConfigured,
  isStripeWebhookConfigured,
  verifyStripeWebhookSignature,
} from "@/lib/payments/stripe";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type StripeEvent = {
  type?: string;
  data?: {
    object?: {
      id?: string;
      metadata?: Record<string, string>;
      customer_details?: { email?: string | null };
      customer_email?: string | null;
      payment_intent?: string | { id?: string } | null;
      status?: string;
    };
  };
};

function paymentIntentId(
  pi: string | { id?: string } | null | undefined,
): string | undefined {
  if (!pi) return undefined;
  if (typeof pi === "string") return pi;
  return pi.id;
}

export async function POST(request: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json({ ok: false, error: "Stripe not configured" }, { status: 503 });
  }

  const payload = await request.text();
  const sig = request.headers.get("stripe-signature") ?? "";

  if (isStripeWebhookConfigured()) {
    const secret = process.env.STRIPE_WEBHOOK_SECRET!.trim();
    if (!verifyStripeWebhookSignature(payload, sig, secret)) {
      return NextResponse.json({ ok: false, error: "Invalid signature" }, { status: 400 });
    }
  } else if (process.env.NODE_ENV === "production") {
    // Refuse unsigned webhooks in production — require STRIPE_WEBHOOK_SECRET.
    return NextResponse.json(
      { ok: false, error: "STRIPE_WEBHOOK_SECRET is required in production" },
      { status: 503 },
    );
  }

  let event: StripeEvent;
  try {
    event = JSON.parse(payload) as StripeEvent;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const obj = event.data?.object;
  const sessionId = obj?.id;
  const product = obj?.metadata?.product;

  if (event.type === "checkout.session.completed" && sessionId) {
    if (product === "desk-one" || obj?.metadata?.early_order_id) {
      const email =
        obj?.customer_details?.email ?? obj?.customer_email ?? undefined;
      const amountTotal =
        typeof (obj as { amount_total?: number }).amount_total === "number"
          ? (obj as { amount_total?: number }).amount_total
          : undefined;
      await markEarlyOrderPaid({
        stripeSessionId: sessionId,
        stripePaymentIntentId: paymentIntentId(obj?.payment_intent),
        email: email ?? undefined,
        name: obj?.metadata?.customer_name,
        amountCents: amountTotal,
        earlyOrderId: obj?.metadata?.early_order_id,
      });
    }
  } else if (event.type === "checkout.session.expired" && sessionId) {
    if (product === "desk-one" || obj?.metadata?.early_order_id) {
      await markEarlyOrderCanceled(sessionId);
    }
  }

  return NextResponse.json({ received: true });
}
