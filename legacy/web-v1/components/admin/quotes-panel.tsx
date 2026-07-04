"use client";

import { CardShell } from "@/components/card-shell";
import type { Quote, QuoteStatus } from "@/lib/orders/types";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

const STATUSES: QuoteStatus[] = [
  "draft",
  "sent",
  "viewed",
  "accepted",
  "declined",
  "change_requested",
  "expired",
  "superseded",
];

const STORAGE_KEY = "exobod-admin-secret";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString();
}

function formatUsd(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export function QuotesAdminPanel() {
  const [secret, setSecret] = useState("");
  const [inputSecret, setInputSecret] = useState("");
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [statusFilter, setStatusFilter] = useState<QuoteStatus | "">("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [opportunityId, setOpportunityId] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) setSecret(stored);
  }, []);

  const authHeaders = useMemo(
    () => ({
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/json",
    }),
    [secret],
  );

  const fetchQuotes = useCallback(async () => {
    if (!secret) return;
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set("status", statusFilter);
      const qs = params.toString();
      const res = await fetch(`/api/admin/quotes${qs ? `?${qs}` : ""}`, {
        headers: { Authorization: `Bearer ${secret}` },
      });
      if (res.status === 401) {
        sessionStorage.removeItem(STORAGE_KEY);
        setSecret("");
        setError("Invalid admin secret.");
        return;
      }
      if (!res.ok) {
        setError("Failed to load quotes.");
        return;
      }
      const data = (await res.json()) as { quotes: Quote[] };
      setQuotes(data.quotes);
    } catch {
      setError("Failed to load quotes.");
    } finally {
      setLoading(false);
    }
  }, [secret, statusFilter]);

  useEffect(() => {
    if (secret) void fetchQuotes();
  }, [secret, fetchQuotes]);

  const createQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!opportunityId.trim()) return;
    setCreating(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch("/api/admin/quotes", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ opportunityId: opportunityId.trim() }),
      });
      const data = (await res.json()) as {
        ok: boolean;
        error?: string | Record<string, string[]>;
        customerUrl?: string;
        quote?: Quote;
      };
      if (!res.ok || !data.ok) {
        setError(typeof data.error === "string" ? data.error : "Failed to create quote.");
        return;
      }
      setSuccess(data.customerUrl ?? "Quote created.");
      setOpportunityId("");
      if (data.quote) {
        setQuotes((prev) => [data.quote!, ...prev]);
      } else {
        void fetchQuotes();
      }
    } catch {
      setError("Failed to create quote.");
    } finally {
      setCreating(false);
    }
  };

  if (!secret) {
    return (
      <CardShell hover={false} className="mx-auto max-w-md">
        <h1 className="font-display text-xl font-semibold text-text-main">Quote admin</h1>
        <p className="mt-2 text-sm text-text-muted">Enter the admin secret to manage quotes.</p>
        <form
          className="mt-4 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            sessionStorage.setItem(STORAGE_KEY, inputSecret);
            setSecret(inputSecret);
          }}
        >
          <input
            type="password"
            value={inputSecret}
            onChange={(e) => setInputSecret(e.target.value)}
            placeholder="Admin secret"
            className="w-full rounded-xl border border-line bg-surface-soft px-3 py-2 text-sm text-text-main outline-none focus:border-accent/60"
          />
          <button
            type="submit"
            className="w-full rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-background hover:bg-accent-soft"
          >
            Unlock
          </button>
        </form>
      </CardShell>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-text-main">Quotes</h1>
          <p className="mt-1 text-sm text-text-muted">
            {quotes.length} quote{quotes.length === 1 ? "" : "s"}
            {loading ? " · loading…" : ""}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/leads"
            className="rounded-lg border border-line px-3 py-2 text-sm text-text-main hover:border-accent/40"
          >
            Leads
          </Link>
          <button
            type="button"
            onClick={() => void fetchQuotes()}
            className="rounded-lg border border-line px-3 py-2 text-sm text-text-main hover:border-accent/40"
          >
            Refresh
          </button>
        </div>
      </div>

      <CardShell hover={false} className="p-4 md:p-5">
        <h2 className="text-sm font-semibold text-text-main">Create quote from opportunity</h2>
        <p className="mt-1 text-xs text-text-muted">
          Promote a qualified lead first via{" "}
          <code className="font-mono">POST /api/admin/leads/[id]/promote</code>, then paste the
          opportunity ID here.
        </p>
        <form className="mt-3 flex flex-wrap gap-2" onSubmit={(e) => void createQuote(e)}>
          <input
            type="text"
            value={opportunityId}
            onChange={(e) => setOpportunityId(e.target.value)}
            placeholder="Opportunity UUID"
            className="min-w-[280px] flex-1 rounded-lg border border-line bg-background px-3 py-2 text-sm text-text-main"
          />
          <button
            type="submit"
            disabled={creating || !opportunityId.trim()}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-background hover:bg-accent-soft disabled:opacity-50"
          >
            {creating ? "Creating…" : "Create quote"}
          </button>
        </form>
      </CardShell>

      <div className="flex flex-wrap gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as QuoteStatus | "")}
          className="rounded-lg border border-line bg-surface-soft px-3 py-2 text-sm text-text-main"
        >
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => void fetchQuotes()}
          className="rounded-lg border border-line px-3 py-2 text-sm hover:border-accent/40"
        >
          Apply filter
        </button>
      </div>

      {error ? <p className="text-sm text-warning">{error}</p> : null}
      {success ? (
        <p className="text-sm text-accent-soft">
          Quote created — customer link:{" "}
          <a href={success} className="underline underline-offset-4">
            {success}
          </a>
        </p>
      ) : null}

      <div className="space-y-4">
        {quotes.map((quote) => {
          const expired = new Date(quote.validUntil).getTime() < Date.now();
          return (
            <CardShell key={quote.id} hover={false} className="p-4 md:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-text-main">
                    {quote.customerName} · rev {quote.revision}
                  </p>
                  <p className="text-sm text-text-muted">{quote.customerEmail}</p>
                  <p className="mt-1 text-xs text-text-muted">{formatDate(quote.createdAt)}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {expired ? (
                    <span className="rounded-full bg-warning/20 px-2 py-0.5 text-xs font-medium text-warning">
                      expired
                    </span>
                  ) : null}
                  <span
                    className={cn(
                      "rounded-full border border-line px-2 py-0.5 text-xs capitalize text-text-muted",
                    )}
                  >
                    {quote.status}
                  </span>
                  <span className="text-sm font-semibold text-text-main">
                    {formatUsd(quote.totalUsd)}
                  </span>
                </div>
              </div>

              {quote.configurationSummary ? (
                <pre className="mt-3 overflow-x-auto rounded-lg bg-surface-soft p-2 text-xs text-text-muted">
                  {quote.configurationSummary}
                </pre>
              ) : null}

              <div className="mt-3 flex flex-wrap gap-3 text-xs text-text-muted">
                <p>
                  Valid until: {formatDate(quote.validUntil)}
                </p>
                {quote.orderId ? <p>Order: {quote.orderId}</p> : null}
              </div>

              <p className="mt-3 text-sm">
                <Link
                  href={`/quote/${quote.token}`}
                  className="font-semibold text-accent-soft underline-offset-4 hover:underline"
                >
                  Customer quote page
                </Link>
              </p>
            </CardShell>
          );
        })}

        {!loading && quotes.length === 0 ? (
          <p className="text-center text-sm text-text-muted">No quotes yet.</p>
        ) : null}
      </div>
    </div>
  );
}
