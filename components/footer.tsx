import { BrandMark, BrandWordmark } from "@/components/brand-logo";
import { footerNote, navLinks, site } from "@/lib/content";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-line/60 bg-surface/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:flex-row sm:items-start sm:justify-between sm:px-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2.5 text-lg font-semibold leading-none tracking-[-0.02em]">
            <BrandMark size="sm" gradientId="exobod-footer-mark" />
            <BrandWordmark />
          </div>
          <p className="text-sm text-text-muted">{site.tagline}</p>
          <p className="max-w-md text-xs text-text-muted/80">{footerNote}</p>
        </div>
        <div className="grid grid-cols-2 gap-6 text-sm text-text-muted sm:grid-cols-2">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-text-main">
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
