import { z } from "zod";

export const interestBodyTypes = [
  "Walker",
  "Desk Assistant",
  "Rover",
  "Utility Helper",
  "Not Sure",
] as const;

export const interestUseCases = [
  "Personal",
  "Education",
  "Creator",
  "Business Demo",
  "Research",
  "Accessibility",
  "Other",
] as const;

export const interestBudgets = [
  "Under $250",
  "$250-$500",
  "$500-$1000",
  "$1000+",
  "Not Sure",
] as const;

export const interestFormSchema = z.object({
  name: z.string().min(2, "Please enter your name."),
  email: z.string().email("Enter a valid email."),
  phone: z.string().optional(),
  bodyType: z.enum(interestBodyTypes),
  useCase: z.enum(interestUseCases),
  budget: z.enum(interestBudgets),
  message: z.string().optional(),
  configurationSummary: z.string().optional(),
  configurationId: z
    .string()
    .regex(/^CFG-\d{4}-\d{4}$/)
    .optional(),
  /** Honeypot — must stay empty; validated server-side */
  website: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  /** Affiliate / creator referral slug from ?ref= */
  affiliateRef: z.string().optional(),
  sourcePage: z.string().optional(),
});

export type InterestFormValues = z.infer<typeof interestFormSchema>;
