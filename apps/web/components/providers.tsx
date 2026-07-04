"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ClerkProvider } from "@clerk/nextjs";
import { useState } from "react";
import { CLERK_ENABLED } from "@/lib/config";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { staleTime: 10_000, retry: 1 } },
      }),
  );

  const body = (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  // Clerk when keys exist; keyless dev-auth mode otherwise — the same
  // degrade-never-die law the core follows.
  if (CLERK_ENABLED) {
    return <ClerkProvider appearance={{ variables: { colorPrimary: "#3df5a0" } }}>{body}</ClerkProvider>;
  }
  return body;
}
