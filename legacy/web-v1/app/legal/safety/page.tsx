import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Safety & limitations | Exobod.ai",
  description: "Safety expectations and limitations for Exobod prototype and custom hardware.",
};

export default function SafetyPage() {
  return (
    <article className="mx-auto max-w-3xl space-y-4 px-4 py-8 text-sm leading-relaxed text-text-muted sm:px-6 sm:py-10">
      <h1 className="text-3xl font-semibold text-text-main">Safety &amp; limitations</h1>
      <p className="text-sm">Read this before operating any hardware.</p>
      <ul className="list-disc space-y-2 pl-5">
        <li>Not a certified consumer toy; not medical equipment.</li>
        <li>Motion is bounded by firmware and must be supervised in lab conditions unless your agreement states otherwise.</li>
        <li>Keep clear of pinch points; use estop and manual override when provided.</li>
        <li>Outdoor autonomy, uneven terrain, and child safety are not default guarantees.</li>
      </ul>
      <p>Program-specific safety addenda ship with each build tier.</p>
    </article>
  );
}
