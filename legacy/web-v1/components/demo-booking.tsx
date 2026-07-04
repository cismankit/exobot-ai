"use client";

import { MotionReveal } from "@/components/motion-reveal";
import { buildCalBookingUrl, calComConfig } from "@/lib/demo/cal";
import { loadConfigFromLocalStorage } from "@/lib/config/state";
import { demoPageCopy } from "@/lib/content";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";

type PrepPacket = {
  configId: string | null;
  summary: string | null;
  source: "url" | "localStorage" | "saved" | "none";
};

function DemoBookingContent() {
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
    () => buildCalBookingUrl({ configId: prep.configId }),
    [prep.configId],
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
                This ID is passed to Cal.com as metadata so the build desk opens with your options.
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
        <div className="rounded-2xl border border-accent/30 bg-accent/5 p-5 shadow-panel sm:p-6">
          <h2 className="text-lg font-semibold text-text-main">{calComConfig.eventName}</h2>
          <p className="mt-2 text-sm text-text-muted">
            {calComConfig.durationMinutes}-minute session with the Exobod build desk. Configure{" "}
            <code className="rounded bg-background/60 px-1 py-0.5 font-mono text-xs">
              NEXT_PUBLIC_CALCOM_LINK
            </code>{" "}
            for your production Cal.com event.
          </p>
          <a
            href={bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-background transition hover:bg-accent-soft sm:w-auto"
          >
            Pick a time on Cal.com
          </a>
        </div>
      </MotionReveal>
    </div>
  );
}

export function DemoBookingPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-3xl px-4 py-16 text-center text-sm text-text-muted">
          Loading demo booking…
        </div>
      }
    >
      <DemoBookingContent />
    </Suspense>
  );
}
