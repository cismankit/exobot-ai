"use client";

/** Overview — real status: /me, /me/providers availability, devices. */

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Activity } from "lucide-react";
import { Badge, Button, Card, CardTitle, StatusDot } from "@exobod/ui";
import { api } from "@/lib/api";

export default function Overview() {
  const me = useQuery({ queryKey: ["me"], queryFn: () => api.me() });
  const providers = useQuery({
    queryKey: ["providers"],
    queryFn: () => api.providers(),
  });
  const devices = useQuery({
    queryKey: ["devices"],
    queryFn: () => api.devices(),
    refetchInterval: 10_000,
  });
  const personas = useQuery({
    queryKey: ["personas"],
    queryFn: () => api.personas(),
  });

  const defaultPersona =
    personas.data?.find((p) => p.is_default) ?? personas.data?.[0];
  const onlineDevices = devices.data?.filter((d) => d.online).length ?? 0;

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="display text-2xl">Overview</h1>
          <p className="telemetry mt-1 text-[12px] text-muted">
            {me.data ? me.data.email : "connecting to control plane…"}
          </p>
        </div>
        <Link href="/console/live">
          <Button size="lg">
            <Activity className="h-4 w-4" /> Open Live Console
          </Button>
        </Link>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Card>
          <CardTitle>Minds online</CardTitle>
          <div className="mt-4 space-y-2.5">
            {providers.isLoading && (
              <p className="telemetry text-sm text-muted">checking backends…</p>
            )}
            {providers.data?.map((p) => (
              <div key={p.provider} className="flex items-center justify-between">
                <span className="flex items-center gap-2.5 text-sm">
                  <StatusDot live={p.enabled && (p.has_key || !p.needs_key)} />
                  {p.provider}
                </span>
                <span className="telemetry text-[11px] text-muted">
                  {p.has_key
                    ? p.key_masked
                    : p.needs_key
                      ? "no key — add in Minds"
                      : "keyless"}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <div className="grid gap-4">
          <Card>
            <CardTitle>Default persona</CardTitle>
            {personas.isLoading ? (
              <p className="telemetry mt-3 text-sm text-muted">loading…</p>
            ) : defaultPersona ? (
              <>
                <p className="display mt-3 text-xl">{defaultPersona.name}</p>
                <p className="mt-1 line-clamp-2 text-sm text-muted">
                  {defaultPersona.identity.disposition}
                </p>
              </>
            ) : (
              <>
                <p className="mt-3 text-sm text-muted">
                  Using the built-in “Exo” identity. Create your own to make
                  the body yours.
                </p>
                <Link href="/console/persona" className="mt-3 inline-block">
                  <Button size="sm" variant="outline">
                    Create persona
                  </Button>
                </Link>
              </>
            )}
          </Card>

          <Card>
            <CardTitle>Bodies</CardTitle>
            <div className="mt-3 flex items-baseline justify-between">
              <p className="telemetry text-3xl">
                {devices.data?.length ?? "—"}
              </p>
              <Badge tone={onlineDevices > 0 ? "signal" : "muted"}>
                {onlineDevices} online
              </Badge>
            </div>
            <p className="mt-2 text-sm text-muted">
              No hardware? The Live Console runs on the simulator — same
              constitution, no servos.
            </p>
          </Card>
        </div>
      </div>

      {me.data && me.data.orders.length > 0 && (
        <Card className="mt-4">
          <CardTitle>Orders</CardTitle>
          <div className="telemetry mt-3 space-y-1.5 text-[13px]">
            {me.data.orders.map((o) => (
              <div key={o.id} className="flex justify-between">
                <span>
                  {o.tier} · {o.id.slice(0, 8)}
                </span>
                <span className={o.status === "paid" ? "text-signal" : "text-muted"}>
                  {o.status}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
