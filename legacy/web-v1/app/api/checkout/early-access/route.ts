import {
  earlyOrderPriceCents,
  siteBaseUrl,
} from "@/lib/payments/early-access";
import {
  attachStripeSession,
  createEarlyOrder,
} from "@/lib/payments/early-access-store";
import {
  createEarlyAccessCheckoutSession,
  isStripeConfigured,
} from "@/lib/payments/stripe";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { NextResponse } from "next/server";
import { z } from "zod";

const bodySchema = z.object({
  email: z.string().email(),
  name: z.string().max(120).optional(),
});

export async function GET() {
  return NextResponse.json({
    ok: true,
    stripeConfigured: isStripeConfigured(),
    priceCents: earlyOrderPriceCents(),
    product: "desk-one",
    sku: "EXB-D1",
  });
}

export async function POST(request: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        error: "Paid reservations are not open yet. Reserve interest on the Desk One page instead.",
        stripeConfigured: false,
      },
      { status: 503 },
    );
  }

  const ip = getClientIp(request);
  const rate = checkRateLimit(`early-access-checkout:${ip}`, {
    limit: 10,
    windowMs: 60 * 60 * 1000,
  });
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

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Valid email is required." },
      { status: 400 },
    );
  }

  const email = parsed.data.email.trim().toLowerCase();
  const name = parsed.data.name?.trim() || undefined;
  const amountCents = earlyOrderPriceCents();
  const base = siteBaseUrl(request);

  try {
    const order = await createEarlyOrder({
      email,
      name,
      amountCents,
      source: "checkout/early-access",
    });

    const session = await createEarlyAccessCheckoutSession({
      earlyOrderId: order.id,
      customerEmail: email,
      customerName: name,
      amountCents,
      successUrl: `${base}/early-access/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${base}/desk-one?cancelled=1`,
    });

    await attachStripeSession(order.id, session.sessionId);

    return NextResponse.json({
      ok: true,
      checkoutUrl: session.url,
      sessionId: session.sessionId,
      orderId: order.id,
      amountCents,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Checkout failed";
    console.error("[early-access checkout]", message);
    return NextResponse.json({ ok: false, error: message }, { status: 502 });
  }
}
