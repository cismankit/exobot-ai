"use client";

import { CardShell } from "@/components/card-shell";
import type { Quote } from "@/lib/orders/types";
import {
  EDU_SUPERVISION_LABEL,
  type LearnerAgeBand,
} from "@/lib/compliance/edu-gating";
import {
  SAFETY_ACK_CHECKBOX_LABEL,
  SAFETY_ACK_VERSION,
  SAFETY_DOC_PATH,
} from "@/lib/safety/acknowledgment";
import Link from "next/link";
import { useState } from "react";

function formatUsd(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function QuotePortalActions({
  token,
  initialStatus,
  configurationId,
  initialOrderUrl,
  isEduOrder,
}: {
  token: string;
  initialStatus: Quote["status"];
  configurationId?: string;
  initialOrderUrl?: string | null;
  isEduOrder?: boolean;
}) {
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderUrl, setOrderUrl] = useState<string | null>(initialOrderUrl ?? null);
  const [changeNotes, setChangeNotes] = useState("");
  const [showChangeForm, setShowChangeForm] = useState(false);
  const [safetyAcknowledged, setSafetyAcknowledged] = useState(false);
  const [eduSupervisionConfirmed, setEduSupervisionConfirmed] = useState(false);
  const [learnerAgeBand, setLearnerAgeBand] = useState<LearnerAgeBand>("18-plus");
  const [supervisorName, setSupervisorName] = useState("");
  const [supervisorEmail, setSupervisorEmail] = useState("");

  const terminal =
    status === "accepted" ||
    status === "declined" ||
    status === "change_requested" ||
    status === "expired" ||
    status === "superseded";

  const needsSupervisorDetails = isEduOrder && learnerAgeBand !== "18-plus";
  const canAccept =
    safetyAcknowledged &&
    (!isEduOrder || (eduSupervisionConfirmed && (!needsSupervisorDetails || (supervisorName.trim() && supervisorEmail.trim()))));

  const respond = async (action: "accept" | "decline" | "request_changes") => {
    setLoading(true);
    setError(null);
    try {
      const body: Record<string, unknown> = {
        action,
        changeNotes: action === "request_changes" ? changeNotes : undefined,
      };

      if (action === "accept") {
        body.safetyAcknowledged = true;
        body.safetyAckVersion = SAFETY_ACK_VERSION;
        if (isEduOrder) {
          body.eduSupervisionConfirmed = true;
          body.learnerAgeBand = learnerAgeBand;
          if (needsSupervisorDetails) {
            body.supervisorName = supervisorName.trim();
            body.supervisorEmail = supervisorEmail.trim();
          }
        }
      }

      const res = await fetch(`/api/quote/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await res.json()) as {
        ok: boolean;
        error?: string;
        orderUrl?: string;
        quote?: Quote;
      };
      if (!res.ok || !data.ok) {
        setError(typeof data.error === "string" ? data.error : "Something went wrong.");
        return;
      }
      if (data.quote) setStatus(data.quote.status);
      if (data.orderUrl) setOrderUrl(data.orderUrl);
      setShowChangeForm(false);
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (terminal) {
    return (
      <CardShell hover={false} className="mt-8 p-5">
        <p className="text-sm font-semibold text-text-main capitalize">Quote {status}</p>
        {status === "accepted" && orderUrl ? (
          <p className="mt-2 text-sm text-text-muted">
            Your order is confirmed.{" "}
            <Link href={orderUrl} className="font-semibold text-accent-soft underline-offset-4 hover:underline">
              View order portal →
            </Link>
          </p>
        ) : null}
        {status === "change_requested" ? (
          <p className="mt-2 text-sm text-text-muted">
            We received your change request. The build desk will follow up with a revised quote.
          </p>
        ) : null}
      </CardShell>
    );
  }

  return (
    <div className="mt-8 space-y-4">
      <p className="text-xs text-text-muted">
        Indicative configurator pricing becomes binding when you accept this quote. Deposit and
        milestone billing follow acceptance.
      </p>

      {configurationId ? (
        <p className="text-sm text-text-muted">
          <Link
            href={`/customize/summary/${configurationId}`}
            className="font-semibold text-accent-soft underline-offset-4 hover:underline"
          >
            View configuration spec (PDF-ready)
          </Link>
        </p>
      ) : null}

      <CardShell hover={false} className="space-y-3 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
          Safety acknowledgment (required to accept)
        </p>
        <p className="text-xs text-text-muted">
          Read the{" "}
          <Link href={SAFETY_DOC_PATH} className="text-accent-soft underline underline-offset-4" target="_blank">
            safety &amp; limitations
          </Link>{" "}
          document before accepting.
        </p>
        <label className="flex cursor-pointer items-start gap-3 text-sm text-text-main">
          <input
            type="checkbox"
            checked={safetyAcknowledged}
            onChange={(e) => setSafetyAcknowledged(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-line accent-accent"
          />
          <span>{SAFETY_ACK_CHECKBOX_LABEL}</span>
        </label>
      </CardShell>

      {isEduOrder ? (
        <CardShell hover={false} className="space-y-3 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
            Education supervision (required)
          </p>
          <label className="block text-xs text-text-muted">
            Primary learner age band
            <select
              value={learnerAgeBand}
              onChange={(e) => setLearnerAgeBand(e.target.value as LearnerAgeBand)}
              className="mt-1 w-full rounded-lg border border-line bg-background px-3 py-2 text-sm text-text-main"
            >
              <option value="under-13">Under 13</option>
              <option value="13-17">13–17</option>
              <option value="18-plus">18 or older</option>
            </select>
          </label>
          {needsSupervisorDetails ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block text-xs text-text-muted">
                Supervisor name
                <input
                  type="text"
                  value={supervisorName}
                  onChange={(e) => setSupervisorName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-line bg-background px-3 py-2 text-sm text-text-main"
                />
              </label>
              <label className="block text-xs text-text-muted">
                Supervisor email
                <input
                  type="email"
                  value={supervisorEmail}
                  onChange={(e) => setSupervisorEmail(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-line bg-background px-3 py-2 text-sm text-text-main"
                />
              </label>
            </div>
          ) : null}
          <label className="flex cursor-pointer items-start gap-3 text-sm text-text-main">
            <input
              type="checkbox"
              checked={eduSupervisionConfirmed}
              onChange={(e) => setEduSupervisionConfirmed(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-line accent-accent"
            />
            <span>{EDU_SUPERVISION_LABEL}</span>
          </label>
        </CardShell>
      ) : null}

      {error ? <p className="text-sm text-warning">{error}</p> : null}

      {showChangeForm ? (
        <CardShell hover={false} className="p-4">
          <label className="block text-xs text-text-muted">
            What would you like changed?
            <textarea
              rows={4}
              value={changeNotes}
              onChange={(e) => setChangeNotes(e.target.value)}
              className="mt-1 w-full rounded-lg border border-line bg-background px-3 py-2 text-sm text-text-main"
            />
          </label>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              disabled={loading}
              onClick={() => void respond("request_changes")}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-background hover:bg-accent-soft disabled:opacity-50"
            >
              Submit change request
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => setShowChangeForm(false)}
              className="rounded-lg border border-line px-4 py-2 text-sm hover:border-accent/40"
            >
              Cancel
            </button>
          </div>
        </CardShell>
      ) : (
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            disabled={loading || !canAccept}
            onClick={() => void respond("accept")}
            className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-background hover:bg-accent-soft disabled:opacity-50"
          >
            Accept quote
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => setShowChangeForm(true)}
            className="rounded-xl border border-line px-5 py-2.5 text-sm font-semibold text-text-main hover:border-accent/40 disabled:opacity-50"
          >
            Request changes
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => void respond("decline")}
            className="rounded-xl border border-line/80 px-5 py-2.5 text-sm text-text-muted hover:border-warning/40 disabled:opacity-50"
          >
            Decline
          </button>
        </div>
      )}
    </div>
  );
}

export function QuoteLineItemsTable({ quote }: { quote: Quote }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-line/70">
      <table className="w-full min-w-[480px] text-left text-sm">
        <thead className="border-b border-line/60 bg-surface-soft/80 text-xs uppercase tracking-wide text-text-muted">
          <tr>
            <th className="px-4 py-3 font-medium">Item</th>
            <th className="px-4 py-3 font-medium text-right">Qty</th>
            <th className="px-4 py-3 font-medium text-right">Unit</th>
            <th className="px-4 py-3 font-medium text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {quote.lineItems.map((item) => (
            <tr key={item.id} className="border-b border-line/40 last:border-0">
              <td className="px-4 py-3">
                <p className="font-medium text-text-main">{item.label}</p>
                {item.description ? (
                  <p className="mt-0.5 text-xs text-text-muted">{item.description}</p>
                ) : null}
              </td>
              <td className="px-4 py-3 text-right text-text-muted">{item.quantity}</td>
              <td className="px-4 py-3 text-right text-text-muted">{formatUsd(item.unitPriceUsd)}</td>
              <td className="px-4 py-3 text-right font-medium text-text-main">
                {formatUsd(item.totalUsd)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-surface-soft/50">
            <td colSpan={3} className="px-4 py-3 text-right font-semibold text-text-main">
              Total
            </td>
            <td className="px-4 py-3 text-right text-lg font-semibold text-text-main">
              {formatUsd(quote.totalUsd)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export { formatDate, formatUsd };
