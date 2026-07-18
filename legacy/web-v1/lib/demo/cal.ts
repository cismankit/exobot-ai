/**
 * Cal.com booking — only when NEXT_PUBLIC_CALCOM_LINK is set.
 * Never fall back to a hardcoded Cal URL that 404s.
 */

export function getCalBookingUrl(): string | null {
  const raw = process.env.NEXT_PUBLIC_CALCOM_LINK?.trim();
  if (!raw) return null;
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    return url.toString();
  } catch {
    return null;
  }
}

export function isCalConfigured(): boolean {
  return getCalBookingUrl() !== null;
}

export const calComConfig = {
  eventName: "Exobod build desk demo",
  durationMinutes: 30,
} as const;

/** Append config context as Cal.com metadata query params where supported. */
export function buildCalBookingUrl(options?: {
  configId?: string | null;
  name?: string;
  email?: string;
}): string | null {
  const base = getCalBookingUrl();
  if (!base) return null;
  const url = new URL(base);
  if (options?.configId) {
    url.searchParams.set("metadata[configId]", options.configId);
  }
  if (options?.name) {
    url.searchParams.set("name", options.name);
  }
  if (options?.email) {
    url.searchParams.set("email", options.email);
  }
  return url.toString();
}
