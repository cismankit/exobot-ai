import { BrandFigure, BrandWordmark } from "@/components/brand-logo";
import { footerNote, navLinks, site } from "@/lib/content";
import { companyContact, legalNav } from "@/lib/trust";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-line/60 bg-surface/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-10 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between sm:px-6 lg:gap-8">
        <div className="space-y-3 sm:max-w-xs">
          <div className="flex items-center gap-2.5 text-lg font-semibold leading-none tracking-[-0.02em]">
            <BrandFigure size="sm" />
            <BrandWordmark />
          </div>
          <p className="text-sm text-text-muted">{site.tagline}</p>
          <p className="max-w-md text-xs text-text-muted/80">{footerNote}</p>
          <p className="text-xs text-text-muted">
            <a href={`mailto:${companyContact.supportEmail}`} className="text-accent-soft hover:underline">
              {companyContact.supportEmail}
            </a>
          </p>
        </div>
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-main/80">Explore</p>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-text-muted">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-text-main">
                {link.label}
              </Link>
            ))}
            <Link href="/faq" className="hover:text-text-main">
              FAQ
            </Link>
          </div>
        </div>
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-main/80">Legal</p>
          <div className="grid gap-2 text-sm text-text-muted">
            {legalNav.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-text-main">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
