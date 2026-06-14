import { verifyAdminRequest } from "@/lib/admin/auth";
import { getDb, type LeadStatus } from "@/lib/db";
import { withSla } from "@/lib/leads/sla";
import { NextResponse } from "next/server";
import { z } from "zod";

const leadStatuses = [
  "new",
  "triaged",
  "qualified",
  "quoted",
  "won",
  "lost",
  "spam",
] as const;

const patchSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(leadStatuses).optional(),
  owner: z.string().optional(),
  internalNotes: z.string().optional(),
});

function unauthorized() {
  return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
}

export async function GET(request: Request) {
  if (!verifyAdminRequest(request)) {
    return unauthorized();
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") as LeadStatus | null;
  const owner = searchParams.get("owner") ?? undefined;
  const search = searchParams.get("search") ?? undefined;

  const db = getDb();
  const leads = await db.listLeads({
    status: status && leadStatuses.includes(status) ? status : undefined,
    owner: owner || undefined,
    search: search || undefined,
  });

  return NextResponse.json({
    ok: true,
    leads: leads.map(withSla),
  });
}

export async function PATCH(request: Request) {
  if (!verifyAdminRequest(request)) {
    return unauthorized();
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const { id, ...updates } = parsed.data;
  const db = getDb();
  const updated = await db.updateLead(id, updates);

  if (!updated) {
    return NextResponse.json({ ok: false, error: "Lead not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, lead: withSla(updated) });
}
