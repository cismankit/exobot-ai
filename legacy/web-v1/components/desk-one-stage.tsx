"use client";

import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";

type DeskOneStageProps = {
  className?: string;
  /** Compact for secondary placements (Desk One page side panels). */
  compact?: boolean;
  caption?: string;
};

/**
 * Premium procedural Desk One product stage — industrial metal + orange accents.
 * No walker fantasy; honest phone-in-dock silhouette for EVT framing.
 */
export function DeskOneStage({
  className,
  compact = false,
  caption = "EXB-D1 Desk One · concept geometry · EVT path",
}: DeskOneStageProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div className={cn("relative w-full", className)} aria-hidden>
      {/* Atmospheric field */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_18%,rgba(255,122,26,0.22),transparent_52%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_70%,rgba(255,122,26,0.06),transparent_45%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_90%,rgba(80,100,130,0.12),transparent_40%)]" />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)",
            backgroundSize: "48px 48px",
            maskImage: "radial-gradient(ellipse at 50% 45%, black 20%, transparent 72%)",
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background via-background/40 to-transparent" />
      </div>

      <div
        className={cn(
          "relative mx-auto flex items-end justify-center",
          compact ? "aspect-[5/4] max-w-md px-6 pb-4 pt-8" : "aspect-[4/5] max-w-lg px-4 pb-6 pt-10 sm:px-8 sm:pb-8 sm:pt-14",
        )}
      >
        {/* Ground plane / contact shadow */}
        <div className="pointer-events-none absolute bottom-[8%] left-1/2 h-8 w-[72%] -translate-x-1/2 rounded-[100%] bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.75),transparent_70%)] blur-md" />
        <div className="pointer-events-none absolute bottom-[10%] left-1/2 h-3 w-[48%] -translate-x-1/2 rounded-[100%] bg-[radial-gradient(ellipse_at_center,rgba(255,122,26,0.35),transparent_72%)] blur-sm" />

        <div className={cn("relative", compact ? "w-[78%]" : "w-[86%] sm:w-[80%]")}>
          {/* Base plinth */}
          <div className="relative mx-auto w-[88%]">
            <div className="h-3 rounded-t-[4px] bg-gradient-to-b from-[#3a424d] via-[#1c222b] to-[#0c1016] shadow-[0_-1px_0_rgba(255,255,255,0.08)_inset]" />
            <div className="relative h-7 rounded-b-xl border border-white/[0.06] bg-gradient-to-b from-[#161b22] via-[#0d1117] to-[#070a0d] shadow-[0_20px_40px_rgba(0,0,0,0.55)]">
              <div className="absolute inset-x-4 top-1.5 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
              <div className="absolute bottom-1.5 left-1/2 flex -translate-x-1/2 items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_8px_rgba(255,122,26,0.8)]" />
                <span className="font-mono text-[7px] uppercase tracking-[0.28em] text-text-muted/80">
                  USB-C · e-stop
                </span>
              </div>
            </div>
          </div>

          {/* Yaw column */}
          <div className="relative mx-auto -mt-1 w-[18%]">
            <div className="mx-auto h-8 w-[55%] rounded-sm bg-gradient-to-b from-[#4a5564] via-[#2a313c] to-[#14191f] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]" />
            <div className="mx-auto -mt-px h-2.5 w-[70%] rounded-full border border-white/[0.08] bg-gradient-to-b from-[#2c333e] to-[#12161c]" />
          </div>

          {/* Pan / tilt head + phone cradle — intentional motion */}
          <motion.div
            className="relative mx-auto origin-bottom"
            style={{ transformStyle: "preserve-3d" }}
            animate={
              reduceMotion
                ? undefined
                : {
                    rotateZ: [-6, 6, -6],
                    rotateX: [4, -3, 4],
                  }
            }
            transition={
              reduceMotion
                ? undefined
                : { duration: 7.5, repeat: Infinity, ease: "easeInOut" }
            }
          >
            {/* Pitch hinge */}
            <div className="relative mx-auto w-[42%]">
              <div className="mx-auto h-3 w-full rounded-md border border-white/[0.08] bg-gradient-to-b from-[#3d4654] to-[#1a1f27] shadow-[0_4px_12px_rgba(0,0,0,0.4)]" />
              <div className="absolute -left-1 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full border border-accent/40 bg-[#1a1f27]" />
              <div className="absolute -right-1 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full border border-accent/40 bg-[#1a1f27]" />
            </div>

            {/* Cradle frame */}
            <div className="relative mx-auto mt-1 w-[72%]">
              <div className="absolute -inset-2 rounded-2xl bg-[radial-gradient(ellipse_at_50%_30%,rgba(255,122,26,0.18),transparent_65%)] blur-md" />
              <div className="relative overflow-hidden rounded-[1.15rem] border border-accent/35 bg-gradient-to-b from-[#2a2018] via-[#14181f] to-[#0a0d12] p-[5px] shadow-[0_28px_60px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,122,26,0.12)_inset]">
                {/* Orange chassis rails */}
                <div className="absolute inset-y-3 left-0 w-1 rounded-r-sm bg-gradient-to-b from-accent-soft via-accent to-[#a84300]" />
                <div className="absolute inset-y-3 right-0 w-1 rounded-l-sm bg-gradient-to-b from-accent-soft via-accent to-[#a84300]" />

                {/* Phone body */}
                <div className="relative aspect-[9/19] overflow-hidden rounded-[0.95rem] border border-white/[0.08] bg-[#05070a]">
                  <div className="absolute inset-x-[28%] top-2 h-1 rounded-full bg-white/10" />
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,rgba(255,122,26,0.12),transparent_55%)]" />

                  {/* Face — sparse, industrial */}
                  <div className="absolute inset-x-0 top-[28%] flex flex-col items-center gap-3 px-4">
                    <motion.div
                      className="flex items-center gap-5"
                      animate={reduceMotion ? undefined : { opacity: [0.75, 1, 0.75] }}
                      transition={
                        reduceMotion
                          ? undefined
                          : { duration: 3.2, repeat: Infinity, ease: "easeInOut" }
                      }
                    >
                      <span className="h-2.5 w-2.5 rounded-full bg-accent shadow-[0_0_12px_rgba(255,122,26,0.7)]" />
                      <span className="h-2.5 w-2.5 rounded-full bg-accent shadow-[0_0_12px_rgba(255,122,26,0.7)]" />
                    </motion.div>
                    <div className="h-px w-10 bg-gradient-to-r from-transparent via-accent/70 to-transparent" />
                    <p className="font-mono text-[8px] uppercase tracking-[0.32em] text-accent/80">
                      phone core
                    </p>
                  </div>

                  <div className="absolute inset-x-3 bottom-3 rounded-md border border-white/[0.06] bg-black/50 px-2 py-1.5">
                    <div className="flex items-end justify-between gap-0.5">
                      {[8, 14, 10, 18, 12, 16, 9].map((h, i) => (
                        <motion.span
                          key={i}
                          className="w-[3px] origin-bottom rounded-[1px] bg-gradient-to-t from-accent/70 to-accent-soft"
                          style={{ height: h }}
                          animate={
                            reduceMotion ? undefined : { scaleY: [0.45, 1, 0.55, 0.9, 0.4] }
                          }
                          transition={
                            reduceMotion
                              ? undefined
                              : {
                                  duration: 1.6,
                                  repeat: Infinity,
                                  delay: i * 0.08,
                                  ease: "easeInOut",
                                }
                          }
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <p className="relative mt-1 text-center font-mono text-[10px] tracking-wide text-text-muted">
        {caption}
      </p>
    </div>
  );
}
