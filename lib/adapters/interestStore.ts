import type { InterestPayload } from "@/lib/types/interest";

export interface InterestStoreResult {
  ok: true;
}

/**
 * Persists preorder / interest submissions.
 * TODO: Replace console logging with Supabase insert, Resend email, or a queue
 * when those services are configured. Keep this function as the single boundary.
 */
export async function persistInterest(
  data: InterestPayload,
): Promise<InterestStoreResult> {
  if (process.env.NODE_ENV !== "production") {
    console.info("[exobod interest]", JSON.stringify(data, null, 2));
  } else {
    console.info("[exobod interest received]", {
      email: data.email,
      bodyType: data.bodyType,
      useCase: data.useCase,
    });
  }
  return { ok: true };
}
