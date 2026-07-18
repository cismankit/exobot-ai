"use client";

import { BrandFigure, BrandWordmark } from "@/components/brand-logo";
import { primaryCta, secondaryCta } from "@/lib/ctas";
import { navLinks } from "@/lib/content";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-line/60 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 md:py-3.5">
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-2.5 whitespace-nowrap py-0.5 sm:gap-3"
        >
          <BrandFigure size="md" priority />
          <BrandWordmark className="text-base sm:text-lg" />
        </Link>
        <nav className="hidden items-center gap-x-5 text-sm font-medium text-text-muted lg:flex">
          {navLinks.map((link) => {
            const path = link.href.split("#")[0];
            const active =
              Boolean(path) &&
              pathname === path &&
              link.href.startsWith("/") &&
              !link.href.includes("#");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "shrink-0 whitespace-nowrap transition hover:text-text-main",
                  active && "text-text-main",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="hidden shrink-0 items-center gap-3 lg:flex">
          <Link
            href={secondaryCta.href}
            className="text-sm font-medium text-text-muted transition hover:text-text-main"
          >
            {secondaryCta.label}
          </Link>
          <Link
            href={primaryCta.href}
            className="rounded-lg bg-accent px-3.5 py-1.5 text-sm font-semibold text-background transition hover:bg-accent-soft"
          >
            {primaryCta.label}
          </Link>
        </div>
        <button
          type="button"
          className="inline-flex shrink-0 items-center justify-center rounded-lg border border-line/70 p-2 text-text-main lg:hidden"
          aria-expanded={open}
          aria-label="Toggle navigation"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open ? (
        <div className="border-t border-line/60 bg-background/98 px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-1 text-sm font-medium text-text-muted">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-2 py-2.5 hover:text-text-main"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={primaryCta.href}
              className="mt-3 rounded-xl bg-accent px-3 py-3 text-center font-semibold text-background"
              onClick={() => setOpen(false)}
            >
              {primaryCta.label}
            </Link>
            <Link
              href={secondaryCta.href}
              className="rounded-xl border border-line px-3 py-3 text-center font-semibold text-text-main"
              onClick={() => setOpen(false)}
            >
              {secondaryCta.label}
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
