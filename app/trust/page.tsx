import { companyContact, legalNav } from "@/lib/trust";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trust & buyer protections | Exobod.ai",
  description:
    "How we de-risk custom hardware orders: milestones, written scope, demo access, and clear legal documentation.",
};

export default function TrustPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-8 sm:px-6 sm:py-10">
      <div className="space-y-3">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-accent">Trust</p>
        <h1 className="text-3xl font-semibold text-text-main sm:text-4xl">How we earn serious buyers</h1>
        <p className="text-sm leading-relaxed text-text-muted sm:text-base">
          Exobod ships as engineered-to-order hardware. We do not ask for full payment upfront without a signed
          agreement, milestones you can verify, and documentation you can review with counsel.
        </p>
      </div>

      <section className="space-y-3 rounded-2xl border border-line/70 bg-surface/60 p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-text-main">What we offer before money moves</h2>
        <ul className="space-y-3 text-sm text-text-muted">
          <li className="flex gap-2">
            <span className="mt-0.5 text-accent">1.</span>
            <span>
              <strong className="text-text-main">Live or recorded prototype demo</strong> of the configuration
              closest to your scope (availability depends on program phase).
            </span>
          </li>
          <li className="flex gap-2">
            <span className="mt-0.5 text-accent">2.</span>
            <span>
              <strong className="text-text-main">Written build agreement</strong> with scope, milestones, change
              order process, acceptance criteria, and delivery windows.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="mt-0.5 text-accent">3.</span>
            <span>
              <strong className="text-text-main">Milestone or escrow-friendly payment</strong> for qualified
              programs (structure is agreed in writing; we do not require blind full prepayment).
            </span>
          </li>
          <li className="flex gap-2">
            <span className="mt-0.5 text-accent">4.</span>
            <span>
              <strong className="text-text-main">CAD / BOM / evidence pack</strong> shared under NDA when your
              build tier requires it, before final production billing.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="mt-0.5 text-accent">5.</span>
            <span>
              <strong className="text-text-main">Clear company identity</strong>: see{" "}
              <Link href="/company" className="font-semibold text-accent-soft underline-offset-2 hover:underline">
                Company &amp; contact
              </Link>{" "}
              and the legal documents below.
            </span>
          </li>
        </ul>
      </section>

      <section className="rounded-2xl border border-line/60 bg-surface/40 p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-text-main">Pilots, press, and reviews</h2>
        <p className="mt-2 text-sm text-text-muted">
          We are collecting named pilot programs, university labs, and third-party write-ups. Until those are
          published with permission, treat marketing claims as directional. Request references through your order
          inquiry if your procurement process requires them.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-text-main">Legal &amp; policies</h2>
        <ul className="space-y-2 text-sm text-text-muted">
          {legalNav.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="font-medium text-accent-soft underline-offset-2 hover:underline">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <p className="text-xs text-text-muted">
        Questions:{" "}
        <a href={`mailto:${companyContact.supportEmail}`} className="text-accent-soft underline-offset-2 hover:underline">
          {companyContact.supportEmail}
        </a>
      </p>
    </div>
  );
}
