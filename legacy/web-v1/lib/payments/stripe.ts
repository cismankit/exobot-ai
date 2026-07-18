/** Stripe Checkout via REST (no SDK required). */

import { createHmac, timingSafeEqual } from "crypto";
import {
  EARLY_ACCESS_COPY,
  EARLY_ACCESS_PRODUCT,
  earlyOrderPriceCents,
} from "@/lib/payments/early-access";

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY?.trim());
}

export function isStripeWebhookConfigured(): boolean {
  return Boolean(process.env.STRIPE_WEBHOOK_SECRET?.trim());
}

export interface MilestoneCheckoutInput {
  orderToken: string;
  orderId: string;
  milestoneId: string;
  milestoneName: string;
  amountUsd: number;
  customerEmail: string;
  successUrl: string;
  cancelUrl: string;
}

export interface MilestoneCheckoutResult {
  sessionId: string;
  url: string;
}

export interface EarlyAccessCheckoutInput {
  earlyOrderId: string;
  customerEmail: string;
  customerName?: string;
  successUrl: string;
  cancelUrl: string;
  amountCents?: number;
}

export interface EarlyAccessCheckoutResult {
  sessionId: string;
  url: string;
}

function stripeSecretKey(): string {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }
  return key;
}

async function createCheckoutSession(
  params: URLSearchParams,
): Promise<{ sessionId: string; url: string }> {
  const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${stripeSecretKey()}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  const data = (await response.json()) as {
    id?: string;
    url?: string;
    error?: { message?: string };
  };

  if (!response.ok || !data.id || !data.url) {
    throw new Error(data.error?.message ?? "Failed to create Stripe Checkout session");
  }

  return { sessionId: data.id, url: data.url };
}

export async function createMilestoneCheckoutSession(
  input: MilestoneCheckoutInput,
): Promise<MilestoneCheckoutResult> {
  const amountCents = Math.round(input.amountUsd * 100);
  if (amountCents < 50) {
    throw new Error("Milestone amount must be at least $0.50");
  }

  const params = new URLSearchParams();
  params.set("mode", "payment");
  params.set("customer_email", input.customerEmail);
  params.set("success_url", input.successUrl);
  params.set("cancel_url", input.cancelUrl);
  params.set("line_items[0][quantity]", "1");
  params.set("line_items[0][price_data][currency]", "usd");
  params.set("line_items[0][price_data][unit_amount]", String(amountCents));
  params.set(
    "line_items[0][price_data][product_data][name]",
    `Exobod — ${input.milestoneName}`,
  );
  params.set(
    "line_items[0][price_data][product_data][description]",
    `Milestone payment for order ${input.orderId.slice(0, 8)}…`,
  );
  params.set("metadata[order_token]", input.orderToken);
  params.set("metadata[order_id]", input.orderId);
  params.set("metadata[milestone_id]", input.milestoneId);

  return createCheckoutSession(params);
}

export async function createEarlyAccessCheckoutSession(
  input: EarlyAccessCheckoutInput,
): Promise<EarlyAccessCheckoutResult> {
  const amountCents = input.amountCents ?? earlyOrderPriceCents();
  if (amountCents < 50) {
    throw new Error("Reservation amount must be at least $0.50");
  }

  const params = new URLSearchParams();
  params.set("mode", "payment");
  params.set("customer_email", input.customerEmail);
  params.set("success_url", input.successUrl);
  params.set("cancel_url", input.cancelUrl);
  params.set("line_items[0][quantity]", "1");
  params.set("line_items[0][price_data][currency]", "usd");
  params.set("line_items[0][price_data][unit_amount]", String(amountCents));
  params.set(
    "line_items[0][price_data][product_data][name]",
    EARLY_ACCESS_COPY.productName,
  );
  params.set(
    "line_items[0][price_data][product_data][description]",
    EARLY_ACCESS_COPY.productDescription,
  );
  params.set("metadata[product]", EARLY_ACCESS_PRODUCT);
  params.set("metadata[sku]", "EXB-D1");
  params.set("metadata[early_order_id]", input.earlyOrderId);
  if (input.customerName) {
    params.set("metadata[customer_name]", input.customerName.slice(0, 200));
  }

  return createCheckoutSession(params);
}

/**
 * Verify Stripe-Signature header (HMAC SHA-256) without the Stripe SDK.
 * Rejects timestamps older than 5 minutes.
 */
export async function retrieveCheckoutSession(sessionId: string): Promise<{
  id: string;
  paymentStatus: string;
  customerEmail?: string;
  amountTotal?: number;
  metadata?: Record<string, string>;
} | null> {
  if (!isStripeConfigured()) return null;
  const response = await fetch(
    `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`,
    {
      headers: { Authorization: `Bearer ${stripeSecretKey()}` },
      cache: "no-store",
    },
  );
  const data = (await response.json()) as {
    id?: string;
    payment_status?: string;
    customer_details?: { email?: string | null };
    customer_email?: string | null;
    amount_total?: number;
    metadata?: Record<string, string>;
    error?: { message?: string };
  };
  if (!response.ok || !data.id) return null;
  return {
    id: data.id,
    paymentStatus: data.payment_status ?? "unknown",
    customerEmail: data.customer_details?.email ?? data.customer_email ?? undefined,
    amountTotal: data.amount_total,
    metadata: data.metadata,
  };
}

export function verifyStripeWebhookSignature(
  payload: string,
  signatureHeader: string,
  secret: string,
): boolean {
  const elements = signatureHeader.split(",");
  let timestamp = "";
  const signatures: string[] = [];

  for (const element of elements) {
    const [key, ...rest] = element.split("=");
    const value = rest.join("=");
    if (key === "t") timestamp = value;
    if (key === "v1") signatures.push(value);
  }

  if (!timestamp || signatures.length === 0) return false;

  const ageSec = Math.floor(Date.now() / 1000) - Number(timestamp);
  if (!Number.isFinite(ageSec) || ageSec < 0 || ageSec > 300) return false;

  const expected = createHmac("sha256", secret)
    .update(`${timestamp}.${payload}`, "utf8")
    .digest("hex");

  return signatures.some((sig) => {
    try {
      const a = Buffer.from(expected, "utf8");
      const b = Buffer.from(sig, "utf8");
      return a.length === b.length && timingSafeEqual(a, b);
    } catch {
      return false;
    }
  });
}
