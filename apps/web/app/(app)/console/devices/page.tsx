"use client";

/** Devices — pair (code + poll until online), fleet with live telemetry,
 * per-device estop. The emulated MCU script in infra/ makes this testable
 * without hardware: `python infra/emulated_device.py EXO-XXXXXX`. */

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Activity, OctagonX, Trash2 } from "lucide-react";
import { Badge, Button, Card, CardTitle, Input, StatusDot } from "@exobod/ui";
import { api, ApiError } from "@/lib/api";
import { API_URL } from "@/lib/config";

export default function DevicesPage() {
  const qc = useQueryClient();
  const devices = useQuery({
    queryKey: ["devices"],
    queryFn: () => api.devices(),
    refetchInterval: 3000, // poll: pairing → online transitions show live
  });
  const [name, setName] = useState("");
  const [estopErr, setEstopErr] = useState<string | null>(null);

  const pair = useMutation({
    mutationFn: () => api.pairDevice(name || "Exobod unit"),
    onSuccess: () => {
      setName("");
      void qc.invalidateQueries({ queryKey: ["devices"] });
    },
  });

  const estop = useMutation({
    mutationFn: (id: string) => api.deviceEstop(id),
    onSuccess: () => {
      setEstopErr(null);
      void qc.invalidateQueries({ queryKey: ["devices"] });
    },
    onError: (e) =>
      setEstopErr(e instanceof ApiError ? e.detail : "estop failed"),
  });

  const forget = useMutation({
    mutationFn: (id: string) => api.forgetDevice(id),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["devices"] }),
  });

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="display text-2xl">Devices</h1>
      <p className="mt-1 text-sm text-muted">
        Pair a real MCU (or the emulated one) and it shows up here with live
        pose, battery, and estop state.
      </p>

      <Card className="mt-6">
        <CardTitle>Pair a new body</CardTitle>
        <div className="mt-3 flex flex-wrap gap-2">
          <Input
            className="max-w-xs"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="name this body (desk unit, lab rig…)"
          />
          <Button onClick={() => pair.mutate()} disabled={pair.isPending}>
            Generate pairing code
          </Button>
        </div>
        {pair.data && (
          <div className="telemetry mt-4 rounded-lg border border-signal/40 bg-signal-dim p-4 text-[13px]">
            <p>
              pairing code:{" "}
              <span className="text-lg font-bold text-signal">
                {pair.data.pairing_code}
              </span>
            </p>
            <p className="mt-2 text-muted">
              on the device (or to emulate one):
              <br />
              python infra/emulated_device.py {pair.data.pairing_code}{" "}
              {API_URL.replace(/^http/, "ws")}
            </p>
            <p className="mt-1 text-muted">
              this table polls every 3s — the row flips to online when the
              body connects.
            </p>
          </div>
        )}
      </Card>

      <div className="mt-6 overflow-x-auto rounded-xl border border-line">
        <table className="w-full text-sm">
          <thead>
            <tr className="telemetry border-b border-line text-left text-[11px] uppercase tracking-widest text-muted">
              <th className="p-3">body</th>
              <th className="p-3">status</th>
              <th className="p-3">pose</th>
              <th className="p-3">vbat</th>
              <th className="p-3">fw</th>
              <th className="p-3">estop</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody>
            {devices.data?.length === 0 && (
              <tr>
                <td colSpan={7} className="p-6 text-center text-muted">
                  no bodies paired — the Live Console runs on the simulator
                  meanwhile
                </td>
              </tr>
            )}
            {devices.data?.map((d) => (
              <tr key={d.id} className="border-b border-line/60 last:border-0">
                <td className="p-3">
                  <p className="font-medium">{d.name}</p>
                  <p className="telemetry text-[11px] text-muted">
                    {d.pairing_code}
                  </p>
                </td>
                <td className="p-3">
                  <span className="flex items-center gap-2">
                    <StatusDot live={d.online} danger={d.estopped} />
                    <span className="telemetry text-[12px]">
                      {d.online ? "online" : d.status}
                    </span>
                  </span>
                </td>
                <td className="telemetry p-3 text-[12px]">
                  {d.last_pose
                    ? `pan ${d.last_pose.pan}° · tilt ${d.last_pose.tilt}°`
                    : "—"}
                </td>
                <td className="telemetry p-3 text-[12px]">
                  {d.last_vbat != null ? `${d.last_vbat.toFixed(1)}V` : "—"}
                </td>
                <td className="telemetry p-3 text-[12px]">
                  {d.fw_version ?? "—"}
                </td>
                <td className="p-3">
                  {d.estopped ? (
                    <Badge tone="danger">latched</Badge>
                  ) : (
                    <Badge tone="muted">clear</Badge>
                  )}
                </td>
                <td className="p-3">
                  <div className="flex justify-end gap-2">
                    <Link href="/console/live">
                      <Button size="sm" variant="outline">
                        <Activity className="h-3.5 w-3.5" /> Live
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => estop.mutate(d.id)}
                      disabled={!d.online}
                      title={d.online ? "Emergency stop" : "offline"}
                    >
                      <OctagonX className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => forget.mutate(d.id)}
                      aria-label={`forget ${d.name}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {estopErr && <p className="mt-3 text-sm text-danger">{estopErr}</p>}
    </div>
  );
}
