import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy policy | Exobod.ai",
  description: "How Exobod.ai handles information you submit through forms and correspondence.",
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl space-y-4 px-4 py-8 text-sm leading-relaxed text-text-muted sm:px-6 sm:py-10">
      <h1 className="text-3xl font-semibold text-text-main">Privacy policy</h1>
      <p className="text-sm">Last updated: May 7, 2026. Working draft for transparency.</p>
      <h2 className="pt-2 text-lg font-semibold text-text-main">Data we collect</h2>
      <p>
        Order inquiry forms collect contact and configuration details you provide. Server logs may include IP and
        timestamps for abuse prevention.
      </p>
      <h2 className="pt-2 text-lg font-semibold text-text-main">How we use it</h2>
      <p>To respond to inquiries, prepare quotes, and operate the program. We do not sell personal data.</p>
      <h2 className="pt-2 text-lg font-semibold text-text-main">Retention</h2>
      <p>Records are kept as needed for agreements, accounting, and safety traceability, then deleted or archived per policy.</p>
      <h2 className="pt-2 text-lg font-semibold text-text-main">Contact</h2>
      <p>
        Privacy requests:{" "}
        <a href="mailto:support@exobod.ai" className="text-accent-soft">
          support@exobod.ai
        </a>
      </p>
    </article>
  );
}
