import type { Lead, LeadStatus, LeadWithSla } from "@/lib/db/types";

const CLOSED_STATUSES: LeadStatus[] = ["won", "lost", "spam"];

export function computeSlaFlags(lead: Lead): Pick<LeadWithSla, "isOverdue24h" | "isOverdue72h"> {
  if (CLOSED_STATUSES.includes(lead.status)) {
    return { isOverdue24h: false, isOverdue72h: false };
  }

  const ageMs = Date.now() - new Date(lead.createdAt).getTime();
  const ageHours = ageMs / (1000 * 60 * 60);

  return {
    isOverdue24h: ageHours >= 24,
    isOverdue72h: ageHours >= 72,
  };
}

export function withSla(lead: Lead): LeadWithSla {
  return { ...lead, ...computeSlaFlags(lead) };
}
