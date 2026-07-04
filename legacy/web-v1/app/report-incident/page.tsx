import { ReportIncidentForm } from "@/components/report-incident-form";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Report an incident | Exobod.ai",
  description: "Report safety incidents, near misses, or hardware issues involving Exobod units.",
};

export default function ReportIncidentPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 md:py-14">
      <div className="mb-8 space-y-2">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-accent">
          Trust &amp; safety
        </p>
        <h1 className="font-display text-3xl font-semibold text-text-main">Report an incident</h1>
        <p className="text-sm text-text-muted">
          Use this channel for injuries, near misses, hardware failures, or privacy concerns. For
          life-threatening emergencies, contact local emergency services first.
        </p>
      </div>

      <ReportIncidentForm />

      <p className="mt-8 text-center text-xs text-text-muted">
        See also{" "}
        <Link href="/legal/safety" className="underline underline-offset-4">
          safety &amp; limitations
        </Link>{" "}
        and{" "}
        <Link href="/legal/privacy" className="underline underline-offset-4">
          privacy policy
        </Link>
        .
      </p>
    </div>
  );
}
