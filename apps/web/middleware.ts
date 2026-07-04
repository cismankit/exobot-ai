import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Clerk middleware only when keys exist; keyless dev mode passes through
// (the API serves a deterministic dev user — degrade, never die).
const clerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

export default clerkEnabled ? clerkMiddleware() : () => NextResponse.next();

export const config = {
  matcher: [
    "/((?!_next|.*\\.(?:png|jpg|jpeg|svg|ico|webp|css|js|woff2?)).*)",
  ],
};
