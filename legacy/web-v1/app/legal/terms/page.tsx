import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of service | Exobod.ai",
  description: "Terms governing use of Exobod.ai and custom hardware order programs.",
};

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-3xl space-y-4 px-4 py-8 text-sm leading-relaxed text-text-muted sm:px-6 sm:py-10">
      <h1 className="text-3xl font-semibold text-text-main">Terms of service</h1>
      <p className="text-sm">
        Last updated: May 7, 2026. This is a working draft for transparency. A counsel-reviewed version will replace
        this page; until then, binding terms are only those signed in your order or prototype agreement.
      </p>
      <h2 className="pt-2 text-lg font-semibold text-text-main">1. Site use</h2>
      <p>
        Information on this site describes target capabilities and custom programs. Nothing here is an offer to sell
        finished consumer inventory unless a separate agreement says so.
      </p>
      <h2 className="pt-2 text-lg font-semibold text-text-main">2. Orders</h2>
      <p>
        Submitting forms starts a review. Quotes, milestones, and payment schedules are confirmed only in executed
        documents.
      </p>
      <h2 className="pt-2 text-lg font-semibold text-text-main">3. Liability</h2>
      <p>
        Hardware is experimental unless explicitly certified for your use case. You assume appropriate lab safety and
        compliance obligations.
      </p>
    </article>
  );
}
