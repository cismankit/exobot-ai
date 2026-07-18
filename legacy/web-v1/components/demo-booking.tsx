"use client";

import { InterestForm } from "@/components/interest-form";
import { MotionReveal } from "@/components/motion-reveal";
import { buildCalBookingUrl, calComConfig } from "@/lib/demo/cal";
import { loadConfigFromLocalStorage } from "@/lib/config/state";
import { demoPageCopy } from "@/lib/content";
import { companyContact } from "@/lib/trust";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";

type PrepPacket = {
  configId: string | null;
  summary: string | null;
  source: "url" | "localStorage" | "saved" | "none";
};

function DemoBookingContent({ calConfigured }: { calConfigured: boolean }) {
  const searchParams = useSearchParams();
  const cfgParam = searchParams.get("cfg");
  const [prep, setPrep] = useState<PrepPacket>({
    configId: cfgParam,
    summary: null,
    source: cfgParam ? "url" : "none",
  });

  useEffect(() => {
    async function hydrate() {
      if (cfgParam) {
        try {
          const res = await fetch(`/api/config/save?id=${encodeURIComponent(cfgParam)}`);
          if (res.ok) {
            const data = (await res.json()) as { summary?: string; configId?: string };
            setPrep({
              configId: data.configId ?? cfgParam,
              summary: data.summary ?? null,
              source: "saved",
            });
            return;
          }
        } catch {
          // fall through to localStorage
        }
      }

      const stored = loadConfigFromLocalStorage();
      if (stored) {
        setPrep({
          configId: stored.configId ?? cfgParam,
          summary: null,
          source: "localStorage",
        });
        return;
      }

      if (cfgParam) {
        setPrep({ configId: cfgParam, summary: null, source: "url" });
      }
    }

    void hydrate();
  }, [cfgParam]);

  const bookingUrl = useMemo(
    () => (calConfigured ? buildCalBookingUrl({ configId: prep.configId }) : null),
    [calConfigured, prep.configId],
  );

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8 sm:space-y-8 sm:px-6 sm:py-10">
      <MotionReveal>
        <div className="space-y-4 text-center">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-accent">
            {demoPageCopy.subhead}
          </p>
          <h1 className="text-4xl font-semibold leading-tight text-text-main sm:text-5xl">
            {demoPageCopy.headline}
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-text-muted sm:text-lg">
            {demoPageCopy.intro}
          </p>
        </div>
      </MotionReveal>

      <MotionReveal>
        <div className="rounded-2xl border border-line/70 bg-surface/70 p-5 shadow-panel sm:p-6">
          <h2 className="text-lg font-semibold text-text-main">Demo prep packet</h2>
          {prep.configId ? (
            <div className="mt-4 space-y-3">
              <p className="font-mono text-xs text-accent">{prep.configId}</p>
              {prep.summary ? (
                <pre className="max-h-48 overflow-auto whitespace-pre-wrap rounded-xl border border-line/60 bg-background/70 p-4 font-mono text-[11px] leading-relaxed text-text-muted">
                  {prep.summary}
                </pre>
              ) : (
                <p className="text-sm text-text-muted">
                  Configuration loaded from {prep.source}. Full summary will be attached when saved
                  by email from the configurator.
                </p>
              )}
              <p className="text-xs text-text-muted">
                Include this ID in your demo request so the build desk opens with your options.
              </p>
            </div>
          ) : (
            <p className="mt-3 text-sm leading-relaxed text-text-muted">
              {demoPageCopy.noConfigHint}{" "}
              <Link href="/customize" className="font-semibold text-accent-soft underline-offset-4 hover:underline">
                Open configurator
              </Link>
            </p>
          )}
        </div>
      </MotionReveal>

      <MotionReveal delay={0.04}>
        {bookingUrl ? (
          <div className="rounded-2xl border border-accent/30 bg-accent/5 p-5 shadow-panel sm:p-6">
            <h2 className="text-lg font-semibold text-text-main">{calComConfig.eventName}</h2>
            <p className="mt-2 text-sm text-text-muted">
              {calComConfig.durationMinutes}-minute session with the Exobod build desk. Pick a time
              that works — we will open with your prep packet when available.
            </p>
            <a
              href={bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-background transition hover:bg-accent-soft sm:w-auto"
            >
              Pick a time
            </a>
          </div>
        ) : (
          <div className="space-y-5 rounded-2xl border border-accent/30 bg-accent/5 p-5 shadow-panel sm:p-6">
            <div>
              <h2 className="text-lg font-semibold text-text-main">Request a demo</h2>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">
                Scheduling calendar is not online yet. Send a demo request below and we will follow
                up by email — or write us directly at{" "}
                <a
                  href={`mailto:${companyContact.supportEmail}?subject=Exobod%20demo%20request`}
                  className="font-semibold text-accent-soft underline-offset-2 hover:underline"
                >
                  {companyContact.supportEmail}
                </a>
                .
              </p>
            </div>
            <InterestForm
              defaultBodyType="Desk Assistant"
              submitLabel="Request a demo"
              configurationSummary={
                prep.configId
                  ? `Demo request — config ${prep.configId}${prep.summary ? `\n${prep.summary}` : ""}`
                  : "Demo request — no saved configuration"
              }
              configurationId={prep.configId}
            />
            <p className="text-center text-xs text-text-muted">
              Prefer the early-access list?{" "}
              <Link href="/desk-one#reserve" className="font-semibold text-accent-soft underline-offset-2 hover:underline">
                Join early access
              </Link>{" "}
              or{" "}
              <Link href="/preorder" className="font-semibold text-accent-soft underline-offset-2 hover:underline">
                start an order inquiry
              </Link>
              .
            </p>
          </div>
        )}
      </MotionReveal>
    </div>
  );
}

export function DemoBookingPage({ calConfigured }: { calConfigured: boolean }) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-3xl px-4 py-16 text-center text-sm text-text-muted">
          Loading demo booking…
        </div>
      }
    >
      <DemoBookingContent calConfigured={calConfigured} />
    </Suspense>
  );
}
