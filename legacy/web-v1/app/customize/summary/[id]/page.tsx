import { calculateLeadTimeBand } from "@/lib/catalog/lead-time";
import { calculatePriceBand } from "@/lib/catalog/pricing";
import { getSavedConfig } from "@/lib/adapters/configStore";
import { isValidConfigId } from "@/lib/config/id";
import { PrintButton } from "@/components/print-button";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `${id} | Exobod configuration`,
    description: "Print-friendly configuration summary for your Exobod build.",
  };
}

export default async function ConfigSummaryPage({ params }: Props) {
  const { id } = await params;

  if (!isValidConfigId(id)) {
    notFound();
  }

  const record = await getSavedConfig(id);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 print:max-w-none print:px-8 print:py-6">
      <div className="mb-8 space-y-2 print:mb-6">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-accent">
          Configuration summary
        </p>
        <h1 className="text-3xl font-semibold text-text-main">{id}</h1>
        {record ? (
          <p className="text-sm text-text-muted">
            Saved {new Date(record.savedAt).toLocaleString()} · {record.email}
          </p>
        ) : (
          <p className="text-sm text-text-muted">
            No server snapshot found for this ID — share the customize URL or save via email to
            persist.
          </p>
        )}
      </div>

      {record ? (
        <SummaryBody
          summary={record.summary}
          config={record.config}
          configId={record.configId}
        />
      ) : (
        <div className="rounded-2xl border border-line/70 bg-surface/75 p-6 text-sm text-text-muted">
          <p>
            Open{" "}
            <Link href="/customize" className="font-semibold text-accent-soft underline-offset-4 hover:underline">
              /customize
            </Link>{" "}
            with <code className="font-mono text-xs">?cfg={id}</code> in the URL to load a linked
            configuration, or use &ldquo;Email me this config&rdquo; to store a snapshot.
          </p>
        </div>
      )}

      <div className="mt-8 flex flex-wrap gap-3 print:hidden">
        <PrintButton className="inline-flex items-center rounded-xl border border-line/80 bg-surface-soft/80 px-4 py-2.5 text-sm font-semibold text-text-main transition hover:border-accent/40" />
        <Link
          href="/customize"
          className="inline-flex items-center rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-background transition hover:bg-accent-soft"
        >
          Back to configurator
        </Link>
      </div>
    </div>
  );
}

function SummaryBody({
  summary,
  config,
  configId,
}: {
  summary: string;
  config: NonNullable<Awaited<ReturnType<typeof getSavedConfig>>>["config"];
  configId: string;
}) {
  const price = calculatePriceBand(config);
  const lead = calculateLeadTimeBand(config);
  const priceLabel = `$${price.lowUsd.toLocaleString("en-US")} – $${price.highUsd.toLocaleString("en-US")}`;

  return (
    <div className="space-y-6 rounded-2xl border border-line/70 bg-surface/75 p-6 shadow-panel print:border-black/20 print:shadow-none">
      <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-text-muted">
        {summary}
      </pre>
      <div className="grid gap-4 border-t border-line/60 pt-4 sm:grid-cols-2">
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">
            Price band
          </p>
          <p className="mt-1 text-lg font-semibold text-text-main">{priceLabel}</p>
          <p className="mt-1 text-xs text-text-muted">{price.disclaimer}</p>
        </div>
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">
            Lead time
          </p>
          <p className="mt-1 text-lg font-semibold text-text-main">{lead.label}</p>
          <p className="mt-1 text-xs text-text-muted">{lead.disclaimer}</p>
        </div>
      </div>
      <p className="text-xs text-text-muted">
        Spec sheet ID: {configId} · Exobod.ai custom build desk
      </p>
    </div>
  );
}
