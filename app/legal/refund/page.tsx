import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refunds & milestones | Exobod.ai",
  description: "How payments, milestones, refunds, and escrow-style structures work for Exobod orders.",
};

export default function RefundPage() {
  return (
    <article className="mx-auto max-w-3xl space-y-4 px-4 py-8 text-sm leading-relaxed text-text-muted sm:px-6 sm:py-10">
      <h1 className="text-3xl font-semibold text-text-main">Refunds &amp; milestone payments</h1>
      <p>
        We align with serious buyers: deposits tied to milestones, documented acceptance gates, and refund or rework
        paths spelled out in your agreement. Full upfront payment without documentation is not our default posture.
      </p>
      <ul className="list-disc space-y-2 pl-5">
        <li>Milestone invoices after agreed deliverables (design review, EVT, DVT, etc. as applicable).</li>
        <li>Escrow or third-party payment rails can be used when contractually agreed.</li>
        <li>Refund eligibility follows the executed agreement, not marketing copy on this site.</li>
      </ul>
    </article>
  );
}
