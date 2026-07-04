"use client";

import { useEmbodimentBody } from "@/components/embodiment-context";
import type { BodyTypeSlug } from "@/lib/content";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";

const waveformHeights = [10, 16, 8, 20, 12, 18, 9, 22, 11];

export function ExobodVisual({ bodyType: bodyTypeProp }: { bodyType?: BodyTypeSlug }) {
  const fromCtx = useEmbodimentBody();
  const bodyType = bodyTypeProp ?? fromCtx;
  const reduceMotion = useReducedMotion();

  return (
    <div
      className="relative mx-auto aspect-[4/5] w-full max-w-[340px]"
      data-body={bodyType}
      aria-hidden
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-[32px] border border-line/35 bg-[linear-gradient(160deg,rgba(22,29,38,0.92),rgba(5,7,10,0.98))]"
      />
      <motion.div
        className="pointer-events-none absolute inset-3 rounded-[28px] border border-accent/20"
        animate={reduceMotion ? undefined : { opacity: [0.25, 0.45, 0.25] }}
        transition={reduceMotion ? undefined : { duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Shoulder joints */}
      <div
        className={cn(
          "absolute left-[8%] top-[18%] z-[1] h-14 w-11 rounded-lg border border-accent/25 bg-gradient-to-b from-surface-soft to-background/90 shadow-[inset_0_1px_0_rgba(255,122,26,0.12)]",
          bodyType === "desk-assistant" && "opacity-50 scale-95",
        )}
      />
      <div
        className={cn(
          "absolute right-[8%] top-[18%] z-[1] h-14 w-11 rounded-lg border border-accent/25 bg-gradient-to-b from-surface-soft to-background/90 shadow-[inset_0_1px_0_rgba(255,122,26,0.12)]",
          bodyType === "desk-assistant" && "opacity-50 scale-95",
        )}
      />

      {/* Arm hints */}
      <div
        className={cn(
          "absolute left-0 top-[28%] z-0 h-32 w-10 origin-top-right -rotate-[18deg] rounded-md border border-line/50 bg-gradient-to-b from-surface-soft/90 to-transparent",
          bodyType === "walker" || bodyType === "utility-helper" ? "opacity-100" : "opacity-35",
          bodyType === "rover" && "top-[32%] h-24 w-8 -rotate-6 opacity-60",
        )}
      />
      <div
        className={cn(
          "absolute right-0 top-[28%] z-0 h-32 w-10 origin-top-left rotate-[18deg] rounded-md border border-line/50 bg-gradient-to-b from-surface-soft/90 to-transparent",
          bodyType === "walker" || bodyType === "utility-helper" ? "opacity-100" : "opacity-35",
          bodyType === "rover" && "top-[32%] h-24 w-8 rotate-6 opacity-60",
        )}
      />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-5 pb-10 pt-8">
        {/* Phone core */}
        <div className="relative w-[220px] rounded-2xl border border-line/80 bg-[#070a0f] shadow-[0_32px_100px_rgba(0,0,0,0.55)]">
          <div className="flex items-center justify-between border-b border-line/45 px-3 py-1.5 font-mono text-[9px] text-text-muted">
            <span>PHONE CORE</span>
            <span className="text-accent/90">LINK</span>
          </div>
          <div className="relative aspect-[10/19] bg-gradient-to-b from-[#0d1219] to-[#030508] px-3 pb-3 pt-3">
            {/* Orange AI face */}
            <div className="relative mx-auto mt-6 flex h-[104px] w-[104px] items-center justify-center rounded-2xl border border-accent/40 bg-[radial-gradient(circle_at_30%_20%,rgba(255,177,92,0.35),transparent_55%),linear-gradient(145deg,rgba(255,122,26,0.22),rgba(7,10,13,0.9))]">
              <div className="absolute inset-2 rounded-xl border border-accent/25 bg-black/20" />
              <motion.div
                className="relative h-12 w-12 rounded-full bg-gradient-to-br from-accent via-[#ff8c42] to-[#a84300] shadow-[0_0_40px_rgba(255,122,26,0.45)]"
                animate={reduceMotion ? undefined : { scale: [1, 1.06, 1], opacity: [0.85, 1, 0.85] }}
                transition={reduceMotion ? undefined : { duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
              />
              <span className="absolute bottom-2 font-mono text-[8px] font-semibold uppercase tracking-widest text-accent-soft/90">
                AI core
              </span>
            </div>

            {/* Voice waveform */}
            <div className="relative mx-auto mt-4 flex h-9 w-[90%] items-end justify-between gap-0.5 rounded-md border border-line/30 bg-black/35 px-2 py-1.5">
              {waveformHeights.map((h, i) => (
                <motion.span
                  key={i}
                  className="w-1 origin-bottom rounded-[1px] bg-gradient-to-t from-accent to-accent-soft/90"
                  style={{ height: h }}
                  animate={reduceMotion ? undefined : { scaleY: [0.4, 1, 0.55, 0.9, 0.35] }}
                  transition={
                    reduceMotion
                      ? undefined
                      : { duration: 1.35, repeat: Infinity, delay: i * 0.07, ease: "easeInOut" }
                  }
                />
              ))}
            </div>
            <p className="mt-3 text-center font-mono text-[9px] leading-snug text-text-muted">
              Voice + vision on handset
            </p>
          </div>
          <div className="border-t border-line/45 px-3 py-1.5">
            <div className="flex items-center justify-between font-mono text-[8px] text-text-muted">
              <span>VOICE BUS</span>
              <span>MCU → SERVOS</span>
            </div>
            <div className="mt-1 h-1 w-full rounded-sm bg-line/25">
              <motion.div
                className="h-full rounded-sm bg-accent/85"
                initial={{ width: "32%" }}
                animate={reduceMotion ? undefined : { width: ["26%", "74%", "34%", "68%", "30%"] }}
                transition={reduceMotion ? undefined : { duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </div>
        </div>

        {/* Leg / base hints */}
        <LegLayer bodyType={bodyType} />
      </div>
    </div>
  );
}

function LegLayer({ bodyType }: { bodyType: BodyTypeSlug }) {
  if (bodyType === "rover") {
    return (
      <div className="absolute bottom-6 left-1/2 z-[2] flex w-[112%] -translate-x-1/2 items-end justify-between px-1">
        <div className="flex h-12 w-[88%] items-center justify-between rounded-lg border border-line/55 bg-surface/90 px-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-9 w-9 rounded-full border border-line/60 bg-gradient-to-b from-surface-soft to-background shadow-inner"
            />
          ))}
        </div>
      </div>
    );
  }

  if (bodyType === "desk-assistant") {
    return (
      <div className="absolute bottom-8 left-1/2 z-[2] h-16 w-24 -translate-x-1/2 rounded-b-xl border border-line/55 bg-gradient-to-b from-surface-soft to-background" />
    );
  }

  if (bodyType === "utility-helper") {
    return (
      <div className="absolute bottom-5 left-1/2 z-[2] flex w-[124%] -translate-x-1/2 justify-between px-2">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-14 w-5 rounded-sm border border-line/55 bg-gradient-to-b from-surface-soft to-background"
          />
        ))}
      </div>
    );
  }

  /* walker default */
  return (
    <div className="absolute bottom-6 left-1/2 z-[2] flex w-[100%] -translate-x-1/2 justify-between px-6">
      <div className="flex flex-col items-center gap-1">
        <div className="h-8 w-7 rounded-md border border-line/55 bg-gradient-to-b from-surface-soft to-background" />
        <div className="h-10 w-6 rounded-sm border border-line/50 bg-background/80" />
        <div className="h-3 w-12 rounded-full border border-line/60 bg-surface/90" />
      </div>
      <div className="flex flex-col items-center gap-1">
        <div className="h-8 w-7 rounded-md border border-line/55 bg-gradient-to-b from-surface-soft to-background" />
        <div className="h-10 w-6 rounded-sm border border-line/50 bg-background/80" />
        <div className="h-3 w-12 rounded-full border border-line/60 bg-surface/90" />
      </div>
    </div>
  );
}
