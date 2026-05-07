"use client";

import { MotionReveal } from "@/components/motion-reveal";
import { CardShell } from "@/components/card-shell";
import { Play } from "lucide-react";
import Link from "next/link";

export function PrototypeDemoSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <MotionReveal>
        <CardShell className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-start gap-4">
            <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-2xl border border-accent/40 bg-accent/15 text-accent">
              <Play className="ml-0.5 size-5" fill="currentColor" />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-text-main sm:text-xl">Prototype demo</h2>
              <p className="mt-1 max-w-xl text-sm text-text-muted">
                Serious buyers can request a live or recorded walkthrough of the closest configuration to their
                scope. Availability depends on program phase; there is no paywall to ask.
              </p>
            </div>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:items-end">
            <Link
              href="/preorder"
              className="inline-flex items-center justify-center rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-background transition hover:bg-accent-soft"
            >
              Request demo access
            </Link>
            <Link href="/trust" className="text-center text-xs font-medium text-accent-soft underline-offset-2 hover:underline sm:text-right">
              How we de-risk orders
            </Link>
          </div>
        </CardShell>
      </MotionReveal>
    </section>
  );
}
