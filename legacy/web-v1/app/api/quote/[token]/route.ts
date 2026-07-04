import { getSavedConfig } from "@/lib/adapters/configStore";
import { sendQuoteAcceptedEmail } from "@/lib/adapters/email";
import { isEduQuote, validateEduSupervision } from "@/lib/compliance/edu-gating";
import { getDb } from "@/lib/db";
import type { CustomerQuoteResponse } from "@/lib/orders/types";
import { validateSafetyAcknowledgment } from "@/lib/safety/acknowledgment";
import { NextResponse } from "next/server";
import { z } from "zod";

const actionSchema = z.object({
  action: z.enum(["accept", "decline", "request_changes"]),
  changeNotes: z.string().max(4000).optional(),
  safetyAcknowledged: z.boolean().optional(),
  safetyAckVersion: z.string().optional(),
  eduSupervisionConfirmed: z.boolean().optional(),
  learnerAgeBand: z.enum(["under-13", "13-17", "18-plus"]).optional(),
  supervisorName: z.string().max(200).optional(),
  supervisorEmail: z.string().email().optional(),
});

type RouteContext = { params: Promise<{ token: string }> };

function formatUsd(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

function isQuoteExpired(quote: { validUntil: string; status: string }): boolean {
  if (quote.status === "expired" || quote.status === "superseded") return true;
  return new Date(quote.validUntil).getTime() < Date.now();
}

export async function GET(_request: Request, context: RouteContext) {
  const { token } = await context.params;
  const db = getDb();
  const quote = await db.findQuoteByToken(token);

  if (!quote) {
    return NextResponse.json({ ok: false, error: "Quote not found" }, { status: 404 });
  }

  if (quote.status === "sent") {
    await db.updateQuote(quote.id, { status: "viewed" });
    quote.status = "viewed";
  }

  return NextResponse.json({
    ok: true,
    quote: {
      ...quote,
      expired: isQuoteExpired(quote),
      totalLabel: formatUsd(quote.totalUsd),
    },
  });
}

export async function POST(request: Request, context: RouteContext) {
  const { token } = await context.params;
  const db = getDb();
  const quote = await db.findQuoteByToken(token);

  if (!quote) {
    return NextResponse.json({ ok: false, error: "Quote not found" }, { status: 404 });
  }

  if (isQuoteExpired(quote)) {
    if (quote.status !== "expired") {
      await db.updateQuote(quote.id, { status: "expired" });
    }
    return NextResponse.json({ ok: false, error: "Quote has expired" }, { status: 410 });
  }

  if (quote.status === "accepted" || quote.status === "declined") {
    return NextResponse.json(
      { ok: false, error: `Quote already ${quote.status}` },
      { status: 409 },
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = actionSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const now = new Date().toISOString();
  const responseMap: Record<typeof parsed.data.action, CustomerQuoteResponse> = {
    accept: "accept",
    decline: "decline",
    request_changes: "request_changes",
  };
  const customerResponse = responseMap[parsed.data.action];

  if (parsed.data.action === "accept") {
    const safety = validateSafetyAcknowledgment({
      safetyAcknowledged: parsed.data.safetyAcknowledged,
      safetyAckVersion: parsed.data.safetyAckVersion,
    });
    if (!safety.ok) {
      return NextResponse.json({ ok: false, error: safety.error }, { status: 400 });
    }

    const lead = await db.findLeadById(quote.leadId);
    const saved = quote.configurationId ? await getSavedConfig(quote.configurationId) : null;
    const eduOrder = isEduQuote({
      quote,
      config: saved?.config,
      lead,
    });

    let eduSupervision: {
      learnerAgeBand: "under-13" | "13-17" | "18-plus";
      supervisorName?: string;
      supervisorEmail?: string;
      confirmedAt: string;
    } | undefined;

    if (eduOrder) {
      const edu = validateEduSupervision({
        eduSupervisionConfirmed: parsed.data.eduSupervisionConfirmed,
        learnerAgeBand: parsed.data.learnerAgeBand,
        supervisorName: parsed.data.supervisorName,
        supervisorEmail: parsed.data.supervisorEmail,
      });
      if (!edu.ok) {
        return NextResponse.json({ ok: false, error: edu.error }, { status: 400 });
      }
      eduSupervision = {
        learnerAgeBand: edu.data.learnerAgeBand,
        supervisorName: edu.data.supervisorName,
        supervisorEmail: edu.data.supervisorEmail,
        confirmedAt: now,
      };
    }

    const existingOrder = await db.findOrderByQuoteId(quote.id);
    if (existingOrder) {
      return NextResponse.json({
        ok: true,
        quote: { ...quote, status: "accepted" as const, orderId: existingOrder.id },
        order: existingOrder,
        orderUrl: `/my/order/${existingOrder.token}`,
      });
    }

    const order = await db.createOrderFromQuote(quote);
    await db.updateOrder(order.id, {
      safetyAcknowledgedAt: now,
      safetyAckVersion: safety.data.safetyAckVersion,
      eduSupervision,
    });
    const finalizedOrder = (await db.findOrderById(order.id)) ?? order;

    await db.updateQuote(quote.id, {
      status: "accepted",
      customerResponse,
      customerResponseAt: now,
      orderId: order.id,
    });
    await db.updateOpportunity(quote.opportunityId, { status: "won" });
    await db.updateLead(quote.leadId, { status: "won" });

    const orderUrl = `/my/order/${finalizedOrder.token}`;
    void sendQuoteAcceptedEmail({ order: finalizedOrder, orderUrl }).catch((err) => {
      console.error("[exobod quote accept email]", err);
    });

    return NextResponse.json({
      ok: true,
      quote: { ...quote, status: "accepted" as const, orderId: order.id },
      order: finalizedOrder,
      orderUrl,
    });
  }

  const status = parsed.data.action === "decline" ? "declined" : "change_requested";
  const updated = await db.updateQuote(quote.id, {
    status,
    customerResponse,
    customerResponseAt: now,
    customerChangeNotes: parsed.data.changeNotes,
  });

  if (parsed.data.action === "decline") {
    await db.updateOpportunity(quote.opportunityId, { status: "lost" });
    await db.updateLead(quote.leadId, { status: "lost" });
  }

  return NextResponse.json({ ok: true, quote: updated });
}
