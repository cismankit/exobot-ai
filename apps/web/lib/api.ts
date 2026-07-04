"use client";

import { ExobodClient } from "@exobod/sdk";
import { API_URL, CLERK_ENABLED } from "./config";

export { ApiError } from "@exobod/sdk";

/** Token getter is installed by the console shell when Clerk is live;
 * in dev-auth mode requests go bare and the API serves the dev user. */
let tokenGetter: (() => Promise<string | null>) | null = null;

export function installTokenGetter(fn: () => Promise<string | null>) {
  tokenGetter = fn;
}

export const api = new ExobodClient({
  baseUrl: API_URL,
  getToken: async () => (CLERK_ENABLED && tokenGetter ? tokenGetter() : null),
});

export async function consoleWsUrl(sessionId: string, authed: boolean) {
  const base = API_URL.replace(/^http/, "ws");
  if (!authed) return `${base}/ws/console/${sessionId}`;
  if (CLERK_ENABLED && tokenGetter) {
    const token = await tokenGetter();
    if (token)
      return `${base}/ws/console/${sessionId}?token=${encodeURIComponent(token)}`;
  }
  return `${base}/ws/console/${sessionId}?auth=dev`;
}
