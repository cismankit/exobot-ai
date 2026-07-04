import { z } from "zod";

export const partnerTypes = [
  "Print shop / fabricator",
  "School / district",
  "Makerspace / library",
  "Reseller / integrator",
  "Other institution",
] as const;

export const partnerFormSchema = z.object({
  organization: z.string().min(2, "Enter your organization name."),
  contactName: z.string().min(2, "Enter a contact name."),
  email: z.string().email("Enter a valid email."),
  phone: z.string().optional(),
  partnerType: z.enum(partnerTypes),
  estimatedUnits: z.string().min(1, "Estimate batch size or cohort size."),
  message: z.string().optional(),
  website: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  affiliateRef: z.string().optional(),
  sourcePage: z.string().optional(),
});

export type PartnerFormValues = z.infer<typeof partnerFormSchema>;
