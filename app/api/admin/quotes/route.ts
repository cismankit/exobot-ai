import { verifyAdminRequest } from "@/lib/admin/auth";
import { getDb, type QuoteStatus } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";

const quoteStatuses = [
  "draft",
  "sent",
  "viewed",
  "accepted",
  "declined",
  "change_requested",
  "expired",
  "superseded",
] as const;

const createSchema = z.object({
  opportunityId: z.string().uuid(),
  validDays: z.number().int().min(1).max(90).optional(),
});

function unauthorized() {
  return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
}

export async function GET(request: Request) {
  if (!verifyAdminRequest(request)) {
    return unauthorized();
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") as QuoteStatus | null;
  const opportunityId = searchParams.get("opportunityId") ?? undefined;

  const db = getDb();
  const quotes = await db.listQuotes({
    status: status && quoteStatuses.includes(status) ? status : undefined,
    opportunityId: opportunityId || undefined,
  });

  return NextResponse.json({ ok: true, quotes });
}

export async function POST(request: Request) {
  if (!verifyAdminRequest(request)) {
    return unauthorized();
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = createSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const db = getDb();
  const opportunity = await db.findOpportunityById(parsed.data.opportunityId);
  if (!opportunity) {
    return NextResponse.json({ ok: false, error: "Opportunity not found" }, { status: 404 });
  }

  if (!opportunity.configurationId) {
    return NextResponse.json(
      { ok: false, error: "Opportunity has no linked configuration" },
      { status: 400 },
    );
  }

  const quote = await db.createQuote(parsed.data);
  if (!quote) {
    return NextResponse.json(
      {
        ok: false,
        error: "Could not build quote — saved configuration snapshot required",
      },
      { status: 400 },
    );
  }

  await db.updateLead(opportunity.leadId, { status: "quoted" });

  const baseUrl = new URL(request.url).origin;
  return NextResponse.json({
    ok: true,
    quote,
    customerUrl: `${baseUrl}/quote/${quote.token}`,
  });
}
