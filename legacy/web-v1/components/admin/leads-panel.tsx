"use client";

import { CardShell } from "@/components/card-shell";
import type { LeadStatus, LeadWithSla } from "@/lib/db/types";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useMemo, useState } from "react";

const STATUSES: LeadStatus[] = [
  "new",
  "triaged",
  "qualified",
  "quoted",
  "won",
  "lost",
  "spam",
];

const STORAGE_KEY = "exobod-admin-secret";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString();
}

function slaBadge(lead: LeadWithSla): string | null {
  if (lead.isOverdue72h) return "72h+ overdue";
  if (lead.isOverdue24h) return "24h+ overdue";
  return null;
}

function leadsToCsv(leads: LeadWithSla[]): string {
  const headers = [
    "id",
    "createdAt",
    "name",
    "email",
    "phone",
    "bodyType",
    "useCase",
    "budget",
    "status",
    "owner",
    "internalNotes",
    "utmSource",
    "utmMedium",
    "utmCampaign",
    "referrer",
    "sourcePage",
    "message",
    "configurationSummary",
    "configurationId",
    "isOverdue24h",
    "isOverdue72h",
  ];
  const escape = (v: string | boolean | undefined) => {
    const s = v ?? "";
    if (String(s).includes(",") || String(s).includes('"') || String(s).includes("\n")) {
      return `"${String(s).replace(/"/g, '""')}"`;
    }
    return String(s);
  };
  const rows = leads.map((l) =>
    headers
      .map((h) => escape(l[h as keyof LeadWithSla] as string | boolean | undefined))
      .join(","),
  );
  return [headers.join(","), ...rows].join("\n");
}

export function LeadsAdminPanel() {
  const [secret, setSecret] = useState("");
  const [inputSecret, setInputSecret] = useState("");
  const [leads, setLeads] = useState<LeadWithSla[]>([]);
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "">("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

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

  const fetchLeads = useCallback(async () => {
    if (!secret) return;
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set("status", statusFilter);
      if (search.trim()) params.set("search", search.trim());
      const qs = params.toString();
      const res = await fetch(`/api/admin/leads${qs ? `?${qs}` : ""}`, {
        headers: { Authorization: `Bearer ${secret}` },
      });
      if (res.status === 401) {
        sessionStorage.removeItem(STORAGE_KEY);
        setSecret("");
        setError("Invalid admin secret.");
        return;
      }
      if (!res.ok) {
        setError("Failed to load leads.");
        return;
      }
      const data = (await res.json()) as { leads: LeadWithSla[] };
      setLeads(data.leads);
    } catch {
      setError("Failed to load leads.");
    } finally {
      setLoading(false);
    }
  }, [secret, statusFilter, search]);

  useEffect(() => {
    if (secret) void fetchLeads();
  }, [secret, fetchLeads]);

  const saveLead = async (
    id: string,
    patch: { status?: LeadStatus; owner?: string; internalNotes?: string },
  ) => {
    setSavingId(id);
    setError(null);
    try {
      const res = await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: authHeaders,
        body: JSON.stringify({ id, ...patch }),
      });
      if (!res.ok) {
        setError("Failed to save lead.");
        return;
      }
      const data = (await res.json()) as { lead: LeadWithSla };
      setLeads((prev) => prev.map((l) => (l.id === id ? data.lead : l)));
    } catch {
      setError("Failed to save lead.");
    } finally {
      setSavingId(null);
    }
  };

  const exportCsv = () => {
    const csv = leadsToCsv(leads);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `exobod-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!secret) {
    return (
      <CardShell hover={false} className="mx-auto max-w-md">
        <h1 className="font-display text-xl font-semibold text-text-main">Lead admin</h1>
        <p className="mt-2 text-sm text-text-muted">Enter the admin secret to manage leads.</p>
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
          <h1 className="font-display text-2xl font-semibold text-text-main">Leads</h1>
          <p className="mt-1 text-sm text-text-muted">
            {leads.length} lead{leads.length === 1 ? "" : "s"}
            {loading ? " · loading…" : ""}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void fetchLeads()}
            className="rounded-lg border border-line px-3 py-2 text-sm text-text-main hover:border-accent/40"
          >
            Refresh
          </button>
          <button
            type="button"
            onClick={exportCsv}
            disabled={leads.length === 0}
            className="rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-background hover:bg-accent-soft disabled:opacity-50"
          >
            Export CSV
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as LeadStatus | "")}
          className="rounded-lg border border-line bg-surface-soft px-3 py-2 text-sm text-text-main"
        >
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") void fetchLeads();
          }}
          placeholder="Search name, email, message…"
          className="min-w-[220px] flex-1 rounded-lg border border-line bg-surface-soft px-3 py-2 text-sm text-text-main"
        />
        <button
          type="button"
          onClick={() => void fetchLeads()}
          className="rounded-lg border border-line px-3 py-2 text-sm hover:border-accent/40"
        >
          Apply filters
        </button>
      </div>

      {error ? <p className="text-sm text-warning">{error}</p> : null}

      <div className="space-y-4">
        {leads.map((lead) => {
          const overdue = slaBadge(lead);
          return (
            <CardShell key={lead.id} hover={false} className="p-4 md:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-text-main">{lead.name}</p>
                  <p className="text-sm text-text-muted">
                    {lead.email}
                    {lead.phone ? ` · ${lead.phone}` : ""}
                  </p>
                  <p className="mt-1 text-xs text-text-muted">{formatDate(lead.createdAt)}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {overdue ? (
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-medium",
                        lead.isOverdue72h
                          ? "bg-warning/20 text-warning"
                          : "bg-accent/15 text-accent-soft",
                      )}
                    >
                      {overdue}
                    </span>
                  ) : null}
                  <span className="rounded-full border border-line px-2 py-0.5 text-xs capitalize text-text-muted">
                    {lead.status}
                  </span>
                </div>
              </div>

              <div className="mt-3 grid gap-2 text-sm text-text-muted md:grid-cols-3">
                <p>
                  <span className="text-text-main">Body:</span> {lead.bodyType}
                </p>
                <p>
                  <span className="text-text-main">Use case:</span> {lead.useCase}
                </p>
                <p>
                  <span className="text-text-main">Budget:</span> {lead.budget}
                </p>
              </div>

              {(lead.utmSource || lead.referrer || lead.sourcePage) && (
                <p className="mt-2 text-xs text-text-muted">
                  Source: {[lead.sourcePage, lead.utmSource, lead.utmMedium, lead.utmCampaign]
                    .filter(Boolean)
                    .join(" · ") || lead.referrer}
                </p>
              )}

              {lead.message ? (
                <p className="mt-2 text-sm text-text-muted">{lead.message}</p>
              ) : null}
              {lead.configurationSummary ? (
                <pre className="mt-2 overflow-x-auto rounded-lg bg-surface-soft p-2 text-xs text-text-muted">
                  {lead.configurationSummary}
                </pre>
              ) : null}

              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <label className="block text-xs text-text-muted">
                  Status
                  <select
                    defaultValue={lead.status}
                    disabled={savingId === lead.id}
                    onChange={(e) =>
                      void saveLead(lead.id, { status: e.target.value as LeadStatus })
                    }
                    className="mt-1 w-full rounded-lg border border-line bg-background px-2 py-1.5 text-sm text-text-main"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block text-xs text-text-muted">
                  Owner
                  <input
                    type="text"
                    defaultValue={lead.owner ?? ""}
                    disabled={savingId === lead.id}
                    onBlur={(e) => {
                      const v = e.target.value.trim();
                      if (v !== (lead.owner ?? "")) void saveLead(lead.id, { owner: v });
                    }}
                    placeholder="Unassigned"
                    className="mt-1 w-full rounded-lg border border-line bg-background px-2 py-1.5 text-sm text-text-main"
                  />
                </label>
                <label className="block text-xs text-text-muted md:col-span-1">
                  Internal notes
                  <textarea
                    rows={2}
                    defaultValue={lead.internalNotes ?? ""}
                    disabled={savingId === lead.id}
                    onBlur={(e) => {
                      const v = e.target.value;
                      if (v !== (lead.internalNotes ?? "")) void saveLead(lead.id, { internalNotes: v });
                    }}
                    className="mt-1 w-full rounded-lg border border-line bg-background px-2 py-1.5 text-sm text-text-main"
                  />
                </label>
              </div>
            </CardShell>
          );
        })}

        {!loading && leads.length === 0 ? (
          <p className="text-center text-sm text-text-muted">No leads match your filters.</p>
        ) : null}
      </div>
    </div>
  );
}
