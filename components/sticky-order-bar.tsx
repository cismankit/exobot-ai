"use client";

import { primaryCta, secondaryCta } from "@/lib/ctas";
import Link from "next/link";

export function StickyOrderBar() {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-3 z-40 px-3 sm:bottom-4 sm:px-6">
      <div className="pointer-events-auto mx-auto flex w-full max-w-4xl items-center justify-between gap-3 rounded-2xl border border-line/70 bg-background/88 p-2.5 shadow-[0_18px_45px_rgba(0,0,0,0.45)] backdrop-blur-xl">
        <p className="hidden pl-2 text-xs font-medium text-text-main/90 sm:block">
          Ready to configure your Exobod?
        </p>
        <div className="ml-auto flex w-full gap-2 sm:w-auto">
          <Link
            href={primaryCta.href}
            className="inline-flex flex-1 items-center justify-center rounded-xl bg-accent px-4 py-2.5 text-xs font-semibold text-background transition hover:bg-accent-soft sm:flex-none"
          >
            {primaryCta.label}
          </Link>
          <Link
            href={secondaryCta.href}
            className="inline-flex flex-1 items-center justify-center rounded-xl border border-line px-4 py-2.5 text-xs font-semibold text-text-main transition hover:border-accent/40 hover:text-accent-soft sm:flex-none"
          >
            {secondaryCta.label}
          </Link>
        </div>
      </div>
    </div>
  );
}
