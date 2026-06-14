import Constants from "expo-constants";
import type { CompanionUnitProfile } from "./types";

const DEFAULT_API_BASE = "http://localhost:3000";

export function getApiBaseUrl(): string {
  const extra = Constants.expoConfig?.extra as { apiBaseUrl?: string } | undefined;
  if (extra?.apiBaseUrl) return extra.apiBaseUrl;

  if (typeof window !== "undefined" && window.location?.hostname === "localhost") {
    return DEFAULT_API_BASE;
  }

  // Expo Go on device — set EXPO_PUBLIC_API_BASE in .env or app config
  return process.env.EXPO_PUBLIC_API_BASE ?? DEFAULT_API_BASE;
}

export async function fetchUnitProfile(serial: string): Promise<CompanionUnitProfile> {
  const base = getApiBaseUrl();
  const res = await fetch(`${base}/api/companion/unit/${encodeURIComponent(serial)}`);

  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error ?? `Unit lookup failed (${res.status})`);
  }

  const data = (await res.json()) as { ok: boolean; unit: CompanionUnitProfile };
  return data.unit;
}

export async function claimUnit(serial: string, claimToken?: string): Promise<CompanionUnitProfile> {
  const base = getApiBaseUrl();
  const res = await fetch(`${base}/api/companion/claim`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ serial, claimToken }),
  });

  const data = (await res.json()) as {
    ok: boolean;
    unit?: CompanionUnitProfile;
    error?: string;
  };

  if (!res.ok || !data.ok || !data.unit) {
    throw new Error(data.error ?? "Claim failed");
  }

  return data.unit;
}
