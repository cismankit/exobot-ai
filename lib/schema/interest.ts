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
});

export type InterestFormValues = z.infer<typeof interestFormSchema>;
