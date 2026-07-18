"use client";

import { useEmbodimentBody } from "@/components/embodiment-context";
import type { BodyTypeSlug } from "@/lib/content";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Refined body-concept silhouettes for the embodiment selector.
 * Industrial metal + orange — not clipart UI chrome.
 */
export function ExobodVisual({ bodyType: bodyTypeProp }: { bodyType?: BodyTypeSlug }) {
  const fromCtx = useEmbodimentBody();
  const bodyType = bodyTypeProp ?? fromCtx;
  const reduceMotion = useReducedMotion();

  return (
    <div
      className="relative mx-auto aspect-[4/5] w-full max-w-[300px]"
      data-body={bodyType}
      aria-hidden
    >
      <div className="pointer-events-none absolute inset-0 rounded-[28px] bg-[radial-gradient(ellipse_at_50%_20%,rgba(255,122,26,0.14),transparent_55%),linear-gradient(165deg,#121820_0%,#070a0d_100%)]" />
      <div className="pointer-events-none absolute inset-0 rounded-[28px] border border-white/[0.06]" />
      <div
        className="pointer-events-none absolute inset-0 rounded-[28px] opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)",
          backgroundSize: "28px 28px",
          maskImage: "radial-gradient(ellipse at 50% 40%, black 30%, transparent 75%)",
        }}
      />

      <motion.div
        className="pointer-events-none absolute inset-4 rounded-[22px] border border-accent/15"
        animate={reduceMotion ? undefined : { opacity: [0.2, 0.4, 0.2] }}
        transition={reduceMotion ? undefined : { duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Shoulder / frame hints */}
      <div
        className={cn(
          "absolute left-[10%] top-[20%] z-[1] h-12 w-9 rounded-md border border-white/[0.08] bg-gradient-to-b from-[#3a424d] to-[#14191f]",
          bodyType === "desk-assistant" && "opacity-40 scale-90",
        )}
      />
      <div
        className={cn(
          "absolute right-[10%] top-[20%] z-[1] h-12 w-9 rounded-md border border-white/[0.08] bg-gradient-to-b from-[#3a424d] to-[#14191f]",
          bodyType === "desk-assistant" && "opacity-40 scale-90",
        )}
      />

      <div
        className={cn(
          "absolute left-[2%] top-[30%] z-0 h-28 w-8 origin-top-right -rotate-[16deg] rounded-md border border-white/[0.06] bg-gradient-to-b from-[#2a313c] to-transparent",
          bodyType === "walker" || bodyType === "utility-helper" ? "opacity-90" : "opacity-30",
          bodyType === "rover" && "top-[34%] h-20 w-6 -rotate-6 opacity-55",
        )}
      />
      <div
        className={cn(
          "absolute right-[2%] top-[30%] z-0 h-28 w-8 origin-top-left rotate-[16deg] rounded-md border border-white/[0.06] bg-gradient-to-b from-[#2a313c] to-transparent",
          bodyType === "walker" || bodyType === "utility-helper" ? "opacity-90" : "opacity-30",
          bodyType === "rover" && "top-[34%] h-20 w-6 rotate-6 opacity-55",
        )}
      />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-5 pb-10 pt-8">
        <div className="relative w-[200px] overflow-hidden rounded-2xl border border-accent/30 bg-[#05070a] shadow-[0_28px_80px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,122,26,0.1)_inset]">
          <div className="absolute inset-y-4 left-0 w-0.5 bg-gradient-to-b from-accent-soft via-accent to-[#a84300]" />
          <div className="absolute inset-y-4 right-0 w-0.5 bg-gradient-to-b from-accent-soft via-accent to-[#a84300]" />

          <div className="relative aspect-[10/19] px-3 pb-3 pt-4">
            <div className="mx-auto mt-8 flex h-[88px] w-[88px] items-center justify-center rounded-xl border border-accent/30 bg-[radial-gradient(circle_at_30%_20%,rgba(255,177,92,0.28),transparent_55%),linear-gradient(145deg,rgba(255,122,26,0.18),rgba(7,10,13,0.95))]">
              <motion.div
                className="h-10 w-10 rounded-full bg-gradient-to-br from-accent via-[#ff8c42] to-[#a84300] shadow-[0_0_32px_rgba(255,122,26,0.4)]"
                animate={reduceMotion ? undefined : { scale: [1, 1.05, 1], opacity: [0.85, 1, 0.85] }}
                transition={
                  reduceMotion ? undefined : { duration: 2.8, repeat: Infinity, ease: "easeInOut" }
                }
              />
            </div>
            <p className="mt-4 text-center font-mono text-[9px] uppercase tracking-[0.28em] text-accent/75">
              phone core
            </p>
          </div>
        </div>

        <LegLayer bodyType={bodyType} />
      </div>

      <p className="absolute bottom-3 left-0 right-0 text-center font-mono text-[8px] uppercase tracking-[0.2em] text-text-muted/70">
        {bodyType === "desk-assistant" ? "Desk path · EVT" : "Concept body"}
      </p>
    </div>
  );
}

function LegLayer({ bodyType }: { bodyType: BodyTypeSlug }) {
  if (bodyType === "rover") {
    return (
      <div className="absolute bottom-7 left-1/2 z-[2] flex w-[108%] -translate-x-1/2 items-end justify-center px-1">
        <div className="flex h-11 w-[86%] items-center justify-between rounded-lg border border-white/[0.08] bg-gradient-to-b from-[#1c222b] to-[#0c1016] px-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-8 w-8 rounded-full border border-white/[0.1] bg-gradient-to-b from-[#3a424d] to-[#12161c]"
            />
          ))}
        </div>
      </div>
    );
  }

  if (bodyType === "desk-assistant") {
    return (
      <div className="absolute bottom-8 left-1/2 z-[2] w-28 -translate-x-1/2">
        <div className="mx-auto h-2 w-8 rounded-sm bg-gradient-to-b from-[#4a5564] to-[#1a1f27]" />
        <div className="mt-0.5 h-4 rounded-b-lg border border-white/[0.08] bg-gradient-to-b from-[#1c222b] to-[#0a0d12]" />
        <div className="mx-auto mt-1 h-2.5 w-[92%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,122,26,0.25),transparent_70%)]" />
      </div>
    );
  }

  if (bodyType === "utility-helper") {
    return (
      <div className="absolute bottom-6 left-1/2 z-[2] flex w-[118%] -translate-x-1/2 justify-between px-2">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-12 w-4 rounded-sm border border-white/[0.08] bg-gradient-to-b from-[#2a313c] to-[#0c1016]"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="absolute bottom-7 left-1/2 z-[2] flex w-full -translate-x-1/2 justify-between px-7">
      {[0, 1].map((side) => (
        <div key={side} className="flex flex-col items-center gap-1">
          <div className="h-7 w-6 rounded-md border border-white/[0.08] bg-gradient-to-b from-[#2a313c] to-[#12161c]" />
          <div className="h-9 w-5 rounded-sm border border-white/[0.06] bg-[#0a0d12]" />
          <div className="h-2.5 w-11 rounded-full border border-white/[0.08] bg-[#161b22]" />
        </div>
      ))}
    </div>
  );
}
