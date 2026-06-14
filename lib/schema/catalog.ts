import { z } from "zod";

export const productConfigurationSchema = z.object({
  phoneModelId: z.string().min(1),
  bodyArchetypeId: z.string().min(1),
  finishId: z.string().min(1),
  skillPackId: z.string().min(1),
  accessoryId: z.string().min(1),
  tierId: z.string().min(1),
});

export type ProductConfigurationInput = z.infer<typeof productConfigurationSchema>;
