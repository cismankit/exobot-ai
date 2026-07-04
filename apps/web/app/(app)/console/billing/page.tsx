"use client";

/** Billing — order history from /me plus preorder entry point. Everything
 * money-shaped goes through Stripe; nothing here is decorative. */

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Badge, Button, Card, CardTitle } from "@exobod/ui";
import { api, ApiError } from "@/lib/api";

export default function BillingPage() {
  const me = useQuery({ queryKey: ["me"], queryFn: () => api.me() });
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function preorder() {
    if (!me.data) return;
    setBusy(true);
    setMsg(null);
    try {
      const r = await api.preorderCheckout(me.data.email);
      window.location.href = r.checkout_url;
    } catch (e) {
      setMsg(e instanceof ApiError ? e.detail : "checkout failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="display text-2xl">Billing</h1>
      <p className="mt-1 text-sm text-muted">
        The software costs nothing while we build. The only thing for sale is
        a refundable dev-kit deposit.
      </p>

      <Card className="mt-6">
        <CardTitle>Orders</CardTitle>
        {me.isLoading ? (
          <p className="telemetry mt-3 text-sm text-muted">loading…</p>
        ) : me.data?.orders.length ? (
          <div className="mt-3 space-y-2">
            {me.data.orders.map((o) => (
              <div
                key={o.id}
                className="flex items-center justify-between rounded-md border border-line px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium">Exobod Dev Kit — {o.tier}</p>
                  <p className="telemetry text-[11px] text-muted">
                    {o.id.slice(0, 8)} · {new Date(o.created_at).toLocaleDateString()}
                  </p>
                </div>
                <Badge tone={o.status === "paid" ? "signal" : o.status === "canceled" ? "danger" : "muted"}>
                  {o.status}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-muted">no orders yet</p>
        )}
      </Card>

      <Card className="mt-4">
        <CardTitle>Dev kit preorder</CardTitle>
        <p className="mt-3 text-sm text-muted">
          $199 refundable deposit through Stripe Checkout. Reserves an Exobod
          v1 desktop frame against your build slot.
        </p>
        <Button className="mt-4" onClick={preorder} disabled={busy || !me.data}>
          {busy ? "opening Stripe…" : "Preorder via Stripe"}
        </Button>
        {msg && <p className="telemetry mt-3 text-sm text-danger">{msg}</p>}
      </Card>
    </div>
  );
}
