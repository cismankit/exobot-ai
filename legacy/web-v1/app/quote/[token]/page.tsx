import {
  QuoteLineItemsTable,
  QuotePortalActions,
  formatDate,
  formatUsd,
} from "@/components/quote-portal";
import { getSavedConfig } from "@/lib/adapters/configStore";
import { isEduQuote } from "@/lib/compliance/edu-gating";
import { getDb } from "@/lib/db";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ token: string }> };

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Your Exobod quote",
    description: "Review and respond to your custom Exobod build quote.",
    robots: { index: false, follow: false },
  };
}

export default async function QuotePage({ params }: Props) {
  const { token } = await params;
  const db = getDb();
  const quote = await db.findQuoteByToken(token);

  if (!quote) {
    notFound();
  }

  const expired =
    quote.status === "expired" ||
    quote.status === "superseded" ||
    new Date(quote.validUntil).getTime() < Date.now();

  let orderUrl: string | null = null;
  if (quote.orderId) {
    const order = await db.findOrderByQuoteId(quote.id);
    if (order) orderUrl = `/my/order/${order.token}`;
  }

  const lead = await db.findLeadById(quote.leadId);
  const saved = quote.configurationId ? await getSavedConfig(quote.configurationId) : null;
  const isEduOrder = isEduQuote({ quote, config: saved?.config, lead });

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:py-14">
      <div className="mb-8 space-y-2">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-accent">
          Custom build quote
        </p>
        <h1 className="font-display text-3xl font-semibold text-text-main">
          Quote for {quote.customerName}
        </h1>
        <p className="text-sm text-text-muted">
          Revision {quote.revision} · Valid until {formatDate(quote.validUntil)}
          {expired ? " · Expired" : ""}
        </p>
        {isEduOrder ? (
          <p className="text-xs text-warning">
            Education order — adult supervision acknowledgment required before acceptance.
          </p>
        ) : null}
      </div>

      <div className="space-y-6 rounded-2xl border border-line/70 bg-surface/75 p-6 shadow-panel">
        {quote.configurationSummary ? (
          <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-text-muted">
            {quote.configurationSummary}
          </pre>
        ) : null}

        <QuoteLineItemsTable quote={quote} />

        <p className="text-xs text-text-muted">
          All amounts in USD. This quote is binding upon acceptance. Milestone payments: 40% deposit,
          40% at build start, 20% before shipment.
        </p>
      </div>

      {!expired ? (
        <QuotePortalActions
          token={token}
          initialStatus={quote.status}
          configurationId={quote.configurationId}
          initialOrderUrl={orderUrl}
          isEduOrder={isEduOrder}
        />
      ) : (
        <p className="mt-8 text-sm text-text-muted">
          This quote is no longer valid. Contact the build desk for a revised quote.
        </p>
      )}

      <p className="mt-8 text-center text-xs text-text-muted">
        Total quoted: {formatUsd(quote.totalUsd)}
      </p>
    </div>
  );
}
