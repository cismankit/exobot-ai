import { z } from "zod";

/** Bump when /legal/safety content materially changes. */
export const SAFETY_ACK_VERSION = "2026-05";

export const safetyAcknowledgmentSchema = z.object({
  safetyAcknowledged: z.literal(true, {
    errorMap: () => ({
      message: "You must acknowledge the safety & limitations document.",
    }),
  }),
  safetyAckVersion: z.string().min(1),
});

export type SafetyAcknowledgmentInput = z.infer<typeof safetyAcknowledgmentSchema>;

export function validateSafetyAcknowledgment(input: unknown): {
  ok: true;
  data: SafetyAcknowledgmentInput;
} | {
  ok: false;
  error: string;
} {
  const parsed = safetyAcknowledgmentSchema.safeParse(input);
  if (!parsed.success) {
    const msg =
      parsed.error.flatten().fieldErrors.safetyAcknowledged?.[0] ??
      "Safety acknowledgment is required.";
    return { ok: false, error: msg };
  }

  if (parsed.data.safetyAckVersion !== SAFETY_ACK_VERSION) {
    return {
      ok: false,
      error: `Please refresh and re-read the current safety document (version ${SAFETY_ACK_VERSION}).`,
    };
  }

  return { ok: true, data: parsed.data };
}

export const SAFETY_ACK_CHECKBOX_LABEL =
  "I have read and accept the Exobod safety & limitations document. I understand this is prototype hardware requiring supervised operation unless my agreement states otherwise.";

export const SAFETY_DOC_PATH = "/legal/safety";
