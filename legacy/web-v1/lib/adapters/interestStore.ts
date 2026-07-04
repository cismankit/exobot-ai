import { sendLeadConfirmation, sendTeamAlert } from "@/lib/adapters/email";
import { getDb } from "@/lib/db";
import type { Lead, LeadCreateInput } from "@/lib/db/types";

export interface InterestStoreResult {
  ok: true;
  leadId: string;
  merged: boolean;
}

export type InterestStoreInput = LeadCreateInput;

/**
 * Persists preorder / interest submissions to the lead store.
 * Handles duplicate email merge within 30 days and triggers email stubs.
 */
export async function persistInterest(data: InterestStoreInput): Promise<InterestStoreResult> {
  const db = getDb();
  const existing = await db.findRecentLeadByEmail(data.email, 30);

  let lead: Lead;
  let merged = false;

  if (existing) {
    const updated = await db.updateLead(existing.id, {
      phone: data.phone ?? existing.phone,
      bodyType: data.bodyType,
      useCase: data.useCase,
      budget: data.budget,
      message: data.message ?? existing.message,
      configurationSummary: data.configurationSummary ?? existing.configurationSummary,
      configurationId: data.configurationId ?? existing.configurationId,
      ...(data.utmSource ? { utmSource: data.utmSource } : {}),
      ...(data.utmMedium ? { utmMedium: data.utmMedium } : {}),
      ...(data.utmCampaign ? { utmCampaign: data.utmCampaign } : {}),
      ...(data.affiliateRef ? { affiliateRef: data.affiliateRef } : {}),
      ...(data.referrer ? { referrer: data.referrer } : {}),
      ...(data.sourcePage ? { sourcePage: data.sourcePage } : {}),
    });
    lead = updated ?? existing;
    merged = true;
  } else {
    lead = await db.createLead(data);
  }

  await Promise.all([sendLeadConfirmation(lead), sendTeamAlert(lead)]);

  if (process.env.NODE_ENV !== "production") {
    console.info("[exobod interest]", { leadId: lead.id, merged, email: lead.email });
  }

  return { ok: true, leadId: lead.id, merged };
}
