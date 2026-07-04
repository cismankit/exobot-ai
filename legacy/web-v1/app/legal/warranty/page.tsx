import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Warranty (prototype) | Exobod.ai",
  description: "Prototype-appropriate warranty and support expectations for Exobod hardware.",
};

export default function WarrantyPage() {
  return (
    <article className="mx-auto max-w-3xl space-y-4 px-4 py-8 text-sm leading-relaxed text-text-muted sm:px-6 sm:py-10">
      <h1 className="text-3xl font-semibold text-text-main">Warranty (prototype)</h1>
      <p>
        Coverage, duration, and remedy types are defined per signed agreement and SKU. Prototype builds typically
        include workmanship coverage for defined periods and explicit exclusions for experimental misuse.
      </p>
      <p>Retail-style &quot;no questions asked&quot; warranties do not apply to custom lab hardware unless written.</p>
    </article>
  );
}
