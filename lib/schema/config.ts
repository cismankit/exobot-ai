import { customizationOptions } from "@/lib/content";
import { isValidConfigId } from "@/lib/config/id";
import { z } from "zod";

const productConfigSchema = z.object({
  phoneModelId: z.string().min(1),
  bodyArchetypeId: z.string().min(1),
  finishId: z.string().min(1),
  skillPackId: z.string().min(1),
  accessoryId: z.string().min(1),
  tierId: z.string().min(1),
});

/** Legacy label-based schema for backward-compatible API payloads */
const legacyConfigStateSchema = z.object({
  phone: z.enum(customizationOptions.phoneTypes),
  body: z.enum(customizationOptions.bodyTypes),
  style: z.enum(customizationOptions.styles),
  pack: z.enum(customizationOptions.skillPacks),
  accessory: z.enum(customizationOptions.accessories),
  tier: z.enum(customizationOptions.buildTiers),
});

export const saveConfigSchema = z.object({
  email: z.string().email("Enter a valid email."),
  configId: z
    .string()
    .refine(isValidConfigId, "Invalid configuration ID."),
  config: z.union([productConfigSchema, legacyConfigStateSchema]),
  summary: z.string().min(1),
});

export type SaveConfigValues = z.infer<typeof saveConfigSchema>;

export const pdfConfigSchema = z.object({
  configId: z.string().optional(),
  config: z.union([productConfigSchema, legacyConfigStateSchema]),
  summary: z.string().min(1),
});

export type PdfConfigValues = z.infer<typeof pdfConfigSchema>;
