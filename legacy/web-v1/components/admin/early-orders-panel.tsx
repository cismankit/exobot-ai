"use client";

import { useEffect, useState } from "react";

type EarlyOrderRow = {
  id: string;
  email: string;
  name?: string;
  product: string;
  sku: string;
  amountCents: number;
  status: string;
  stripeSessionId?: string;
  createdAt: string;
  paidAt?: string;
};

function formatUsd(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export function EarlyOrdersAdminPanel() {
  const [secret, setSecret] = useState("");
  const [orders, setOrders] = useState<EarlyOrderRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const load = async (token: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/early-orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = (await res.json()) as {
        ok: boolean;
        orders?: EarlyOrderRow[];
        error?: string;
      };
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Failed to load");
        setOrders([]);
        return;
      }
      setOrders(data.orders ?? []);
    } catch {
      setError("Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const saved = sessionStorage.getItem("exobod_admin_secret");
    if (saved) {
      setSecret(saved);
      void load(saved);
    }
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-text-main">Early orders (Desk One)</h1>
        <p className="mt-1 text-sm text-text-muted">
          Paid and pending founder reservations from Stripe Checkout. Requires ADMIN_SECRET.
        </p>
      </div>

      <form
        className="flex flex-wrap items-end gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          sessionStorage.setItem("exobod_admin_secret", secret);
          void load(secret);
        }}
      >
        <label className="block space-y-1">
          <span className="text-xs text-text-muted">Admin bearer token</span>
          <input
            type="password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            className="w-64 rounded-lg border border-line/70 bg-background px-3 py-2 text-sm"
          />
        </label>
        <button
          type="submit"
          disabled={loading || !secret}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-background disabled:opacity-50"
        >
          {loading ? "Loading…" : "Load"}
        </button>
      </form>

      {error ? <p className="text-sm text-warning">{error}</p> : null}

      <div className="overflow-x-auto rounded-xl border border-line/60">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-surface-soft/80 text-xs uppercase tracking-wider text-text-muted">
            <tr>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Amount</th>
              <th className="px-3 py-2">Created</th>
              <th className="px-3 py-2">Paid</th>
              <th className="px-3 py-2">Session</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-3 py-6 text-text-muted">
                  No early orders yet.
                </td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr key={o.id} className="border-t border-line/40">
                  <td className="px-3 py-2 capitalize">{o.status}</td>
                  <td className="px-3 py-2">
                    {o.email}
                    {o.name ? (
                      <span className="block text-xs text-text-muted">{o.name}</span>
                    ) : null}
                  </td>
                  <td className="px-3 py-2">{formatUsd(o.amountCents)}</td>
                  <td className="px-3 py-2 text-xs text-text-muted">
                    {new Date(o.createdAt).toLocaleString()}
                  </td>
                  <td className="px-3 py-2 text-xs text-text-muted">
                    {o.paidAt ? new Date(o.paidAt).toLocaleString() : "—"}
                  </td>
                  <td className="px-3 py-2 font-mono text-xs text-text-muted">
                    {o.stripeSessionId?.slice(0, 18) ?? "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
