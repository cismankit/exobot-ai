/** Cal.com booking link — set NEXT_PUBLIC_CALCOM_LINK in env for production. */
export const calComConfig = {
  bookingUrl:
    process.env.NEXT_PUBLIC_CALCOM_LINK ?? "https://cal.com/exobod/demo",
  eventName: "Exobod build desk demo",
  durationMinutes: 30,
} as const;

/** Append config context as Cal.com metadata query params where supported. */
export function buildCalBookingUrl(options?: {
  configId?: string | null;
  name?: string;
  email?: string;
}): string {
  const url = new URL(calComConfig.bookingUrl);
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
