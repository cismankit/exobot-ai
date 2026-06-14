"use client";

import { CardShell } from "@/components/card-shell";
import type { Order, WorkOrder, WorkOrderStatus } from "@/lib/manufacturing/types";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useMemo, useState } from "react";

const STATUSES: WorkOrderStatus[] = [
  "queued",
  "printing",
  "assembly",
  "qc",
  "ready",
  "shipped",
];

const STORAGE_KEY = "exobod-admin-secret";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString();
}

function statusColor(status: WorkOrderStatus): string {
  switch (status) {
    case "queued":
      return "border-line text-text-muted";
    case "printing":
      return "bg-accent/15 text-accent-soft";
    case "assembly":
      return "bg-accent/20 text-accent";
    case "qc":
      return "bg-warning/15 text-warning";
    case "ready":
      return "bg-emerald-500/15 text-emerald-400";
    case "shipped":
      return "bg-surface-soft text-text-muted";
    default:
      return "border-line text-text-muted";
  }
}

export function WorkOrdersAdminPanel() {
  const [secret, setSecret] = useState("");
  const [inputSecret, setInputSecret] = useState("");
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [eligibleOrders, setEligibleOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<WorkOrderStatus | "">("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

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

  const fetchWorkOrders = useCallback(async () => {
    if (!secret) return;
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ includeOrders: "true" });
      if (statusFilter) params.set("status", statusFilter);
      if (search.trim()) params.set("search", search.trim());
      const res = await fetch(`/api/admin/work-orders?${params}`, {
        headers: { Authorization: `Bearer ${secret}` },
      });
      if (res.status === 401) {
        sessionStorage.removeItem(STORAGE_KEY);
        setSecret("");
        setError("Invalid admin secret.");
        return;
      }
      if (!res.ok) {
        setError("Failed to load work orders.");
        return;
      }
      const data = (await res.json()) as {
        workOrders: WorkOrder[];
        eligibleOrders?: Order[];
      };
      setWorkOrders(data.workOrders);
      setEligibleOrders(data.eligibleOrders ?? []);
    } catch {
      setError("Failed to load work orders.");
    } finally {
      setLoading(false);
    }
  }, [secret, statusFilter, search]);

  useEffect(() => {
    if (secret) void fetchWorkOrders();
  }, [secret, fetchWorkOrders]);

  const saveWorkOrder = async (
    id: string,
    patch: { status?: WorkOrderStatus; assignedStation?: string; qcChecklist?: WorkOrder["qcChecklist"] },
  ) => {
    setSavingId(id);
    setError(null);
    try {
      const res = await fetch("/api/admin/work-orders", {
        method: "PATCH",
        headers: authHeaders,
        body: JSON.stringify({ id, ...patch }),
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setError(typeof data.error === "string" ? data.error : "Failed to save work order.");
        return;
      }
      const data = (await res.json()) as { workOrder: WorkOrder };
      setWorkOrders((prev) => prev.map((wo) => (wo.id === id ? data.workOrder : wo)));
    } catch {
      setError("Failed to save work order.");
    } finally {
      setSavingId(null);
    }
  };

  const createFromOrder = async (orderId: string) => {
    setCreating(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/work-orders", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ orderId }),
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setError(typeof data.error === "string" ? data.error : "Failed to create work order.");
        return;
      }
      await fetchWorkOrders();
    } catch {
      setError("Failed to create work order.");
    } finally {
      setCreating(false);
    }
  };

  const toggleQcItem = (wo: WorkOrder, itemId: string, pass: boolean) => {
    const updatedItems = wo.qcChecklist.items.map((item) =>
      item.id === itemId
        ? { ...item, pass, testedAt: new Date().toISOString() }
        : item,
    );
    void saveWorkOrder(wo.id, {
      qcChecklist: { ...wo.qcChecklist, items: updatedItems },
    });
  };

  if (!secret) {
    return (
      <CardShell hover={false} className="mx-auto max-w-md">
        <h1 className="font-display text-xl font-semibold text-text-main">Work orders</h1>
        <p className="mt-2 text-sm text-text-muted">Enter the admin secret to manage manufacturing.</p>
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
          <h1 className="font-display text-2xl font-semibold text-text-main">Work orders</h1>
          <p className="mt-1 text-sm text-text-muted">
            {workOrders.length} work order{workOrders.length === 1 ? "" : "s"}
            {loading ? " · loading…" : ""}
          </p>
        </div>
        <button
          type="button"
          onClick={() => void fetchWorkOrders()}
          className="rounded-lg border border-line px-3 py-2 text-sm text-text-main hover:border-accent/40"
        >
          Refresh
        </button>
      </div>

      {eligibleOrders.length > 0 ? (
        <CardShell hover={false} className="p-4">
          <p className="text-sm font-medium text-text-main">Create from order</p>
          <p className="mt-1 text-xs text-text-muted">
            Contracted orders without a work order yet.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {eligibleOrders.map((order) => (
              <button
                key={order.id}
                type="button"
                disabled={creating}
                onClick={() => void createFromOrder(order.id)}
                className="rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-background hover:bg-accent-soft disabled:opacity-50"
              >
                {order.customerName} · {order.configurationId.slice(0, 12)}…
              </button>
            ))}
          </div>
        </CardShell>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as WorkOrderStatus | "")}
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
            if (e.key === "Enter") void fetchWorkOrders();
          }}
          placeholder="Search ID, order, serial…"
          className="min-w-[220px] flex-1 rounded-lg border border-line bg-surface-soft px-3 py-2 text-sm text-text-main"
        />
        <button
          type="button"
          onClick={() => void fetchWorkOrders()}
          className="rounded-lg border border-line px-3 py-2 text-sm hover:border-accent/40"
        >
          Apply filters
        </button>
      </div>

      {error ? <p className="text-sm text-warning">{error}</p> : null}

      <div className="space-y-4">
        {workOrders.map((wo) => {
          const expanded = expandedId === wo.id;
          return (
            <CardShell key={wo.id} hover={false} className="p-4 md:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-text-main">
                    {wo.serialNumber ?? "No serial yet"}
                  </p>
                  <p className="text-sm text-text-muted">
                    Order {wo.orderId.slice(0, 8)}… · Config {wo.configurationId}
                  </p>
                  <p className="mt-1 text-xs text-text-muted">
                    Created {formatDate(wo.createdAt)}
                    {wo.shippedAt ? ` · Shipped ${formatDate(wo.shippedAt)}` : ""}
                  </p>
                </div>
                <span
                  className={cn(
                    "rounded-full border px-2 py-0.5 text-xs font-medium capitalize",
                    statusColor(wo.status),
                  )}
                >
                  {wo.status}
                </span>
              </div>

              <div className="mt-3 grid gap-2 text-sm text-text-muted md:grid-cols-3">
                <p>
                  <span className="text-text-main">Catalog:</span> {wo.catalogVersion}
                </p>
                <p>
                  <span className="text-text-main">Firmware:</span> {wo.firmwareProfileId}
                </p>
                <p>
                  <span className="text-text-main">BOM lines:</span> {wo.bomLines.length}
                </p>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <label className="block text-xs text-text-muted">
                  Status
                  <select
                    value={wo.status}
                    disabled={savingId === wo.id}
                    onChange={(e) =>
                      void saveWorkOrder(wo.id, { status: e.target.value as WorkOrderStatus })
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
                  Assigned station
                  <input
                    type="text"
                    defaultValue={wo.assignedStation ?? ""}
                    disabled={savingId === wo.id}
                    onBlur={(e) => {
                      const v = e.target.value.trim();
                      if (v !== (wo.assignedStation ?? "")) {
                        void saveWorkOrder(wo.id, { assignedStation: v });
                      }
                    }}
                    placeholder="Print farm A / Bench 2"
                    className="mt-1 w-full rounded-lg border border-line bg-background px-2 py-1.5 text-sm text-text-main"
                  />
                </label>
              </div>

              <button
                type="button"
                onClick={() => setExpandedId(expanded ? null : wo.id)}
                className="mt-3 text-sm text-accent-soft hover:text-accent"
              >
                {expanded ? "Hide details" : "Show BOM, QC & packaging"}
              </button>

              {expanded ? (
                <div className="mt-4 space-y-4 border-t border-line/60 pt-4">
                  <div>
                    <p className="text-sm font-medium text-text-main">QC checklist</p>
                    {wo.qcChecklist.overallPass !== null ? (
                      <p
                        className={cn(
                          "mt-1 text-xs font-medium",
                          wo.qcChecklist.overallPass ? "text-emerald-400" : "text-warning",
                        )}
                      >
                        {wo.qcChecklist.overallPass ? "All tests passed" : "Failed — rework required"}
                      </p>
                    ) : null}
                    <ul className="mt-2 space-y-2">
                      {wo.qcChecklist.items.map((item) => (
                        <li
                          key={item.id}
                          className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-surface-soft p-2 text-sm"
                        >
                          <div>
                            <p className="text-text-main">{item.label}</p>
                            {item.description ? (
                              <p className="text-xs text-text-muted">{item.description}</p>
                            ) : null}
                          </div>
                          <div className="flex gap-1">
                            <button
                              type="button"
                              disabled={savingId === wo.id}
                              onClick={() => toggleQcItem(wo, item.id, true)}
                              className={cn(
                                "rounded px-2 py-1 text-xs font-medium",
                                item.pass === true
                                  ? "bg-emerald-500/20 text-emerald-400"
                                  : "border border-line text-text-muted hover:border-emerald-500/40",
                              )}
                            >
                              Pass
                            </button>
                            <button
                              type="button"
                              disabled={savingId === wo.id}
                              onClick={() => toggleQcItem(wo, item.id, false)}
                              className={cn(
                                "rounded px-2 py-1 text-xs font-medium",
                                item.pass === false
                                  ? "bg-warning/20 text-warning"
                                  : "border border-line text-text-muted hover:border-warning/40",
                              )}
                            >
                              Fail
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-text-main">BOM explosion</p>
                    <ul className="mt-2 space-y-1 text-xs text-text-muted">
                      {wo.bomLines.map((line, i) => (
                        <li key={`${line.sku}-${i}`}>
                          <span className="text-text-main">{line.sku}</span> × {line.quantity} —{" "}
                          {line.name}
                          {line.vendorSku ? ` (${line.vendorSku})` : ""}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-text-main">Packaging BOM</p>
                    <ul className="mt-2 space-y-1 text-xs text-text-muted">
                      {wo.packagingBom.lines.map((line) => (
                        <li key={line.sku}>
                          <span className="text-text-main">{line.sku}</span> × {line.quantity} —{" "}
                          {line.name}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-text-main">Build instructions</p>
                    <ol className="mt-2 list-decimal space-y-1 pl-4 text-xs text-text-muted">
                      {wo.buildInstructions.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              ) : null}
            </CardShell>
          );
        })}

        {!loading && workOrders.length === 0 ? (
          <p className="text-center text-sm text-text-muted">
            No work orders yet. Create one from an eligible order above.
          </p>
        ) : null}
      </div>
    </div>
  );
}
