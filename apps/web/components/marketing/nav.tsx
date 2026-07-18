"use client";

import Link from "next/link";
import { Button } from "@exobod/ui";
import { LogoMark } from "./logo";

export function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line/60 bg-bg/70 backdrop-blur-md">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
        <Link href="/" className="flex items-center gap-2" aria-label="Exobod home">
          <LogoMark className="h-6 w-6" />
          <span className="display text-[17px] tracking-tight">exobod</span>
        </Link>
        <div className="hidden items-center gap-6 text-sm text-muted sm:flex">
          <Link href="/manifesto" className="transition-colors hover:text-fg">
            Manifesto
          </Link>
          <Link href="/pricing" className="transition-colors hover:text-fg">
            Pricing
          </Link>
          <Link href="/docs" className="transition-colors hover:text-fg">
            Docs
          </Link>
          <Link href="/console" className="transition-colors hover:text-fg">
            Console
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/#waitlist">
            <Button size="sm">Join the waitlist</Button>
          </Link>
        </div>
      </nav>
    </header>
  );
}
