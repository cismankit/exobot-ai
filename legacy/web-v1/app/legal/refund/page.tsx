import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Refunds & milestones | Exobod.ai",
  description:
    "How payments, founder reservations, milestones, and refunds work for Exobod orders and Desk One early access.",
};

export default function RefundPage() {
  return (
    <article className="mx-auto max-w-3xl space-y-6 px-4 py-8 text-sm leading-relaxed text-text-muted sm:px-6 sm:py-10">
      <h1 className="text-3xl font-semibold text-text-main">Refunds &amp; milestone payments</h1>
      <p>
        We align with serious buyers: deposits tied to milestones, documented acceptance gates, and refund or rework
        paths spelled out in your agreement. Full upfront payment without documentation is not our default posture.
      </p>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-text-main">Desk One founder reservation (EXB-D1)</h2>
        <p>
          The optional{" "}
          <Link href="/desk-one" className="text-accent-soft hover:underline">
            Desk One early-access
          </Link>{" "}
          payment is a <strong className="font-medium text-text-main/90">crowdfund-style reservation deposit</strong>{" "}
          for the EVT / early-access program — not a purchase of finished inventory and not a guaranteed ship date.
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Processed through Stripe Checkout (card receipts, disputes, and refunds via Stripe).</li>
          <li>
            Refund requests before a later build agreement are handled in good faith for unused reservation deposits;
            contact support with your Stripe receipt.
          </li>
          <li>
            Paying the deposit does <strong className="font-medium text-text-main/90">not</strong> promise a delivery
            calendar, retail SKU fulfillment, or walker / walking-robot capability (Desk One is a desk mount).
          </li>
          <li>Manual rails (e.g. Zelle) require human confirmation and are not automatic ecommerce.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-text-main">Custom builds &amp; milestones</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>Milestone invoices after agreed deliverables (design review, EVT, DVT, etc. as applicable).</li>
          <li>Escrow or third-party payment rails can be used when contractually agreed.</li>
          <li>Refund eligibility for contracted builds follows the executed agreement, not marketing copy on this site.</li>
        </ul>
      </section>
    </article>
  );
}
