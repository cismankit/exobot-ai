import { verifyAdminRequest } from "@/lib/admin/auth";
import { getDb } from "@/lib/db";
import type { LeadStatus } from "@/lib/db/types";
import { listWorkOrders } from "@/lib/manufacturing/store";
import type { OrderStatus, QuoteStatus } from "@/lib/orders/types";
import { promises as fs } from "fs";
import { NextResponse } from "next/server";
import path from "path";

function unauthorized() {
  return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
}

function countByStatus<T extends string>(
  items: { status: T }[],
): Record<string, number> {
  return items.reduce<Record<string, number>>((acc, item) => {
    acc[item.status] = (acc[item.status] ?? 0) + 1;
    return acc;
  }, {});
}

async function countSavedConfigs(): Promise<number> {
  try {
    const raw = await fs.readFile(path.join(process.cwd(), "data/saved-configs.json"), "utf8");
    const parsed = JSON.parse(raw) as unknown[];
    return Array.isArray(parsed) ? parsed.length : 0;
  } catch {
    return 0;
  }
}

async function countAffiliateLeads(): Promise<number> {
  const db = getDb();
  const leads = await db.listLeads();
  return leads.filter((l) => Boolean(l.affiliateRef)).length;
}

export async function GET(request: Request) {
  if (!verifyAdminRequest(request)) {
    return unauthorized();
  }

  const db = getDb();
  const [leads, quotes, orders, workOrders, savedConfigCount, affiliateLeadCount] =
    await Promise.all([
      db.listLeads(),
      db.listQuotes(),
      db.listOrders(),
      listWorkOrders(),
      countSavedConfigs(),
      countAffiliateLeads(),
    ]);

  const leadStatuses = countByStatus<LeadStatus>(leads);
  const quoteStatuses = countByStatus<QuoteStatus>(quotes);
  const orderStatuses = countByStatus<OrderStatus>(orders);

  const pipelineValueUsd = quotes
    .filter((q) => q.status === "sent" || q.status === "accepted")
    .reduce((sum, q) => sum + (q.totalUsd ?? 0), 0);

  const wonLeads = leadStatuses.won ?? 0;
  const qualifiedLeads = leadStatuses.qualified ?? 0;
  const conversionRate =
    leads.length > 0 ? Math.round((wonLeads / leads.length) * 1000) / 10 : 0;

  return NextResponse.json({
    ok: true,
    generatedAt: new Date().toISOString(),
    pipeline: {
      leads: {
        total: leads.length,
        byStatus: leadStatuses,
        withConfiguration: leads.filter((l) => l.configurationId).length,
        affiliateAttributed: affiliateLeadCount,
        overdue24h: leads.filter((l) => {
          const age = Date.now() - new Date(l.createdAt).getTime();
          return l.status === "new" && age > 24 * 60 * 60 * 1000;
        }).length,
      },
      quotes: {
        total: quotes.length,
        byStatus: quoteStatuses,
        pipelineValueUsd,
      },
      orders: {
        total: orders.length,
        byStatus: orderStatuses,
        inProduction: orderStatuses.in_production ?? 0,
        shipped: orderStatuses.shipped ?? 0,
      },
      workOrders: {
        total: workOrders.length,
        byStatus: countByStatus(workOrders),
        open: workOrders.filter((wo) => wo.status !== "shipped").length,
      },
      configs: {
        savedSnapshots: savedConfigCount,
      },
    },
    unitEconomics: {
      note: "Stub — wire to finance system for COGS and margin.",
      avgQuoteUsd:
        quotes.length > 0
          ? Math.round(
              quotes.reduce((s, q) => s + (q.totalUsd ?? 0), 0) / quotes.length,
            )
          : 0,
      qualifiedToWonRatePct: conversionRate,
      qualifiedPipeline: qualifiedLeads,
    },
    quality: {
      note: "Stub — defect rates from QC module when manufacturing telemetry is live.",
      defectRatePct: null,
      qcPending: workOrders.filter((wo) => wo.status === "qc").length,
    },
  });
}
