import { companyContact } from "@/lib/trust";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Company & contact | Exobod.ai",
  description: "Company identity, contact channels, and how to reach the Exobod team for orders and partnerships.",
};

export default function CompanyPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-8 sm:px-6 sm:py-10">
      <div className="space-y-3">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-accent">Company</p>
        <h1 className="text-3xl font-semibold text-text-main sm:text-4xl">Who we are</h1>
        <p className="text-sm leading-relaxed text-text-muted sm:text-base">
          Exobod.ai is the public face of our hardware program for modular smartphone embodiment. Team roster,
          cap table, and detailed bios are shared during diligence and onboarding for institutional and enterprise
          buyers.
        </p>
      </div>

      <section className="rounded-2xl border border-line/70 bg-surface/60 p-5 sm:p-6">
        <h2 className="text-base font-semibold text-text-main">Registered identity (placeholder)</h2>
        <p className="mt-2 text-sm text-text-muted">
          Legal entity name and registration number will appear here once finalized with counsel. Until then, all
          commercial work is routed through written agreements naming the contracting party.
        </p>
        <dl className="mt-4 space-y-2 text-sm">
          <div>
            <dt className="font-semibold text-text-main">Working name</dt>
            <dd className="text-text-muted">{companyContact.legalName}</dd>
          </div>
          <div>
            <dt className="font-semibold text-text-main">Mailing / HQ</dt>
            <dd className="text-text-muted">{companyContact.addressSummary}</dd>
          </div>
          <div>
            <dt className="font-semibold text-text-main">Support &amp; order desk</dt>
            <dd>
              <a
                href={`mailto:${companyContact.supportEmail}`}
                className="text-accent-soft underline-offset-2 hover:underline"
              >
                {companyContact.supportEmail}
              </a>
            </dd>
          </div>
        </dl>
      </section>

      <section className="rounded-2xl border border-line/70 bg-surface/40 p-5 sm:p-6">
        <h2 className="text-base font-semibold text-text-main">Team</h2>
        <p className="mt-2 text-sm text-text-muted">
          A dedicated team page with photos, roles, and backgrounds is in preparation. For press, procurement, or
          partnership vetting, request the team pack through the order inquiry form.
        </p>
      </section>
    </div>
  );
}
