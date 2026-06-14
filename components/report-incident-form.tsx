"use client";

import { CardShell } from "@/components/card-shell";
import { TextField } from "@/components/form/text-field";
import { TextArea } from "@/components/form/text-area";
import type { IncidentCategory, IncidentSeverity } from "@/lib/incidents/types";
import { useState } from "react";

const CATEGORIES: { value: IncidentCategory; label: string }[] = [
  { value: "injury", label: "Injury" },
  { value: "near_miss", label: "Near miss" },
  { value: "hardware_failure", label: "Hardware failure" },
  { value: "software_bug", label: "Software / app bug" },
  { value: "privacy", label: "Privacy concern" },
  { value: "other", label: "Other" },
];

const SEVERITIES: { value: IncidentSeverity; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent — injury or immediate hazard" },
];

export function ReportIncidentForm() {
  const [reporterName, setReporterName] = useState("");
  const [reporterEmail, setReporterEmail] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [orderToken, setOrderToken] = useState("");
  const [category, setCategory] = useState<IncidentCategory>("near_miss");
  const [severity, setSeverity] = useState<IncidentSeverity>("medium");
  const [description, setDescription] = useState("");
  const [region, setRegion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reportId, setReportId] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/incidents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reporterName: reporterName.trim(),
          reporterEmail: reporterEmail.trim(),
          serialNumber: serialNumber.trim() || undefined,
          orderToken: orderToken.trim() || undefined,
          category,
          severity,
          description: description.trim(),
          region: region.trim() || undefined,
        }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string; reportId?: string };
      if (!res.ok || !data.ok) {
        setError(typeof data.error === "string" ? data.error : "Could not submit report.");
        return;
      }
      setReportId(data.reportId ?? "submitted");
    } catch {
      setError("Could not submit report. Email support@exobod.ai if urgent.");
    } finally {
      setLoading(false);
    }
  };

  if (reportId) {
    return (
      <CardShell hover={false} className="p-6">
        <p className="text-sm font-semibold text-text-main">Report received</p>
        <p className="mt-2 text-sm text-text-muted">
          Reference <span className="font-mono text-xs">{reportId}</span>. Our safety team will
          review and follow up if needed. For urgent injury, also contact local emergency services.
        </p>
      </CardShell>
    );
  }

  return (
    <form onSubmit={(e) => void submit(e)} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Your name"
          name="reporterName"
          required
          value={reporterName}
          onChange={(e) => setReporterName(e.target.value)}
        />
        <TextField
          label="Email"
          name="reporterEmail"
          type="email"
          required
          value={reporterEmail}
          onChange={(e) => setReporterEmail(e.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Serial number (optional)"
          name="serialNumber"
          value={serialNumber}
          onChange={(e) => setSerialNumber(e.target.value)}
          placeholder="EXB-2026-0001"
        />
        <TextField
          label="Order portal token (optional)"
          name="orderToken"
          value={orderToken}
          onChange={(e) => setOrderToken(e.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 text-sm text-text-muted">
          <span className="text-text-main">Category</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as IncidentCategory)}
            className="w-full rounded-xl border border-line/80 bg-surface-soft/80 px-3 py-3 text-sm text-text-main"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block space-y-2 text-sm text-text-muted">
          <span className="text-text-main">Severity</span>
          <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value as IncidentSeverity)}
            className="w-full rounded-xl border border-line/80 bg-surface-soft/80 px-3 py-3 text-sm text-text-main"
          >
            {SEVERITIES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <TextField
        label="Region / country code (optional)"
        name="region"
        value={region}
        onChange={(e) => setRegion(e.target.value)}
        placeholder="US, EU, UK…"
      />

      <TextArea
        label="What happened?"
        name="description"
        required
        rows={6}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      {error ? <p className="text-sm text-warning">{error}</p> : null}

      <button
        type="submit"
        disabled={loading}
        className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-background hover:bg-accent-soft disabled:opacity-50"
      >
        {loading ? "Submitting…" : "Submit incident report"}
      </button>
    </form>
  );
}
