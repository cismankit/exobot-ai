/** Stripe Checkout stub for milestone deposits — uses REST API (no SDK required). */

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY?.trim());
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

function stripeSecretKey(): string {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }
  return key;
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
