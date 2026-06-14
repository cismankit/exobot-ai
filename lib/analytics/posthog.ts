import type { AnalyticsEvent, AnalyticsProperties } from "@/lib/analytics/events";

const CLIENT_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const SERVER_KEY = process.env.POSTHOG_KEY ?? CLIENT_KEY;
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";

export function isPostHogEnabled(): boolean {
  return Boolean(CLIENT_KEY);
}

export function isPostHogServerEnabled(): boolean {
  return Boolean(SERVER_KEY);
}

type PostHogCapture = (event: string, props?: AnalyticsProperties) => void;

declare global {
  interface Window {
    posthog?: { capture: PostHogCapture; init?: (...args: unknown[]) => void };
  }
}

/** Minimal client stub — sets window.posthog when key is configured. */
export function initPostHogClient(): void {
  if (typeof window === "undefined" || !CLIENT_KEY) return;
  if (window.posthog?.capture) return;

  window.posthog = {
    init: () => undefined,
    capture: (event, props) => {
      if (process.env.NODE_ENV !== "production") {
        console.info("[posthog stub]", { event, props, host: POSTHOG_HOST });
      }
      // Ready for posthog-js: posthog.init(CLIENT_KEY, { api_host: POSTHOG_HOST })
    },
  };
}

export function captureClientEvent(
  event: AnalyticsEvent | string,
  properties?: AnalyticsProperties,
): void {
  if (!CLIENT_KEY || typeof window === "undefined") return;
  initPostHogClient();
  window.posthog?.capture(event, properties);
}

/** Server-side capture stub — logs structured events; wire to PostHog HTTP API when ready. */
export async function captureServerEvent(
  event: string,
  properties?: AnalyticsProperties & { distinctId?: string },
): Promise<void> {
  if (!SERVER_KEY) return;

  const payload = {
    event,
    timestamp: new Date().toISOString(),
    distinctId: properties?.distinctId ?? "server",
    properties: { ...properties, distinctId: undefined },
  };

  if (process.env.NODE_ENV !== "production") {
    console.info("[posthog server stub]", payload);
    return;
  }

  try {
    await fetch(`${POSTHOG_HOST}/capture/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: SERVER_KEY,
        event,
        distinct_id: payload.distinctId,
        properties: payload.properties,
      }),
    });
  } catch {
    // Non-blocking analytics
  }
}
