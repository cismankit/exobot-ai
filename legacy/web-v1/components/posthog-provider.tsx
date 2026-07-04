"use client";

import { initPostHogClient } from "@/lib/analytics/posthog";
import { useEffect } from "react";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initPostHogClient();
  }, []);

  return children;
}
