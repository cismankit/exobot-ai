"use client";

/** Auth gate for the console. Clerk when configured; keyless dev-auth
 * pass-through otherwise (the API serves a deterministic dev user). */

import { RedirectToSignIn, SignedIn, SignedOut, useAuth } from "@clerk/nextjs";
import { useEffect } from "react";
import { CLERK_ENABLED } from "@/lib/config";
import { installTokenGetter } from "@/lib/api";

function TokenBridge() {
  const { getToken } = useAuth();
  useEffect(() => {
    installTokenGetter(() => getToken());
  }, [getToken]);
  return null;
}

export function ClerkGate({ children }: { children: React.ReactNode }) {
  if (!CLERK_ENABLED) return <>{children}</>;
  return (
    <>
      <SignedIn>
        <TokenBridge />
        {children}
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
