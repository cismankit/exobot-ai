import type { Lead } from "@/lib/db/types";
import type { Quote } from "@/lib/orders/types";
import type { ProductConfiguration } from "@/lib/catalog/types";
import { z } from "zod";

export const EDU_SKILL_PACK_ID = "pack-education";
export const EDU_USE_CASE = "Education";

export type LearnerAgeBand = "under-13" | "13-17" | "18-plus";

export const eduSupervisionSchema = z.object({
  eduSupervisionConfirmed: z.literal(true, {
    errorMap: () => ({
      message: "Education orders require confirmed adult supervision.",
    }),
  }),
  learnerAgeBand: z.enum(["under-13", "13-17", "18-plus"]),
  supervisorName: z.string().min(2).optional(),
  supervisorEmail: z.string().email().optional(),
});

export type EduSupervisionInput = z.infer<typeof eduSupervisionSchema>;

export function isEduConfiguration(config: ProductConfiguration | null | undefined): boolean {
  if (!config) return false;
  return config.skillPackId === EDU_SKILL_PACK_ID;
}

export function isEduLead(lead: Lead | null | undefined): boolean {
  if (!lead) return false;
  return lead.useCase === EDU_USE_CASE;
}

export function isEduQuote(input: {
  quote: Quote;
  config?: ProductConfiguration | null;
  lead?: Lead | null;
}): boolean {
  if (isEduConfiguration(input.config)) return true;
  if (isEduLead(input.lead)) return true;
  const summary = input.quote.configurationSummary?.toLowerCase() ?? "";
  return summary.includes("education") || summary.includes("edu kit");
}

export function validateEduSupervision(input: unknown): {
  ok: true;
  data: EduSupervisionInput;
} | {
  ok: false;
  error: string;
} {
  const parsed = eduSupervisionSchema.safeParse(input);
  if (!parsed.success) {
    const flat = parsed.error.flatten().fieldErrors;
    const msg =
      flat.eduSupervisionConfirmed?.[0] ??
      flat.learnerAgeBand?.[0] ??
      flat.supervisorName?.[0] ??
      flat.supervisorEmail?.[0] ??
      "Education supervision details are required.";
    return { ok: false, error: msg };
  }

  const { learnerAgeBand, supervisorName, supervisorEmail } = parsed.data;
  if (learnerAgeBand !== "18-plus") {
    if (!supervisorName?.trim()) {
      return { ok: false, error: "Supervisor name is required for learners under 18." };
    }
    if (!supervisorEmail?.trim()) {
      return { ok: false, error: "Supervisor email is required for learners under 18." };
    }
  }

  return { ok: true, data: parsed.data };
}

export const EDU_SUPERVISION_LABEL =
  "I confirm this Exobod unit will be operated under responsible adult supervision in an educational or lab setting, consistent with our safety & limitations policy.";
