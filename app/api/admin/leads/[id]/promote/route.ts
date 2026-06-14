import { verifyAdminRequest } from "@/lib/admin/auth";
import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";

function unauthorized() {
  return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
}

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_request: Request, context: RouteContext) {
  if (!verifyAdminRequest(_request)) {
    return unauthorized();
  }

  const { id: leadId } = await context.params;
  const db = getDb();
  const lead = await db.findLeadById(leadId);

  if (!lead) {
    return NextResponse.json({ ok: false, error: "Lead not found" }, { status: 404 });
  }

  if (lead.status !== "qualified") {
    return NextResponse.json(
      { ok: false, error: "Lead must be qualified before promotion" },
      { status: 400 },
    );
  }

  const existing = await db.findOpportunityByLeadId(leadId);
  if (existing) {
    return NextResponse.json({ ok: true, opportunity: existing, alreadyExists: true });
  }

  const opportunity = await db.createOpportunity({
    leadId: lead.id,
    configurationId: lead.configurationId,
    configurationSummary: lead.configurationSummary,
    customerName: lead.name,
    customerEmail: lead.email,
    owner: lead.owner,
    notes: lead.internalNotes,
  });

  return NextResponse.json({ ok: true, opportunity });
}
