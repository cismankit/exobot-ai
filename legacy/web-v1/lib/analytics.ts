import { captureClientEvent } from "@/lib/analytics/posthog";
import type { AnalyticsEvent, AnalyticsProperties } from "@/lib/analytics/events";

export type { AnalyticsEvent, AnalyticsProperties };

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function isDev() {
  return process.env.NODE_ENV !== "production";
}

/**
 * Client-side analytics. Logs in dev; forwards to PostHog stub when configured.
 */
export function trackEvent(
  event: AnalyticsEvent,
  properties?: AnalyticsProperties,
): void {
  if (typeof window === "undefined") return;

  const payload = {
    event,
    timestamp: new Date().toISOString(),
    ...properties,
  };

  if (isDev()) {
    console.info("[exobod analytics]", payload);
  }

  captureClientEvent(event, properties);

  if (window.gtag) {
    window.gtag("event", event, properties);
  }
}
