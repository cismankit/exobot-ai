"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import { Button } from "@exobod/ui";
import { HeadScene } from "@/components/head-scene";

/**
 * Hero — scroll-scrubbed sequence: the phone flies in and docks into the
 * frame, then the head wakes and looks at you. Built in R3F (no video
 * asset needed); reduced-motion gets the final docked state + fades only.
 */
export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const [scrub, setScrub] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setScrub(v * 2.2));

  // once docked (scrub > .65) the head "wakes": meets the viewer's eye
  // with only a subtle sway — it should hold your gaze, not wander off
  const awake = scrub > 0.7;
  const pan = awake ? Math.sin(scrub * 3) * 7 : 0;
  const tilt = awake ? 2 : -4;

  return (
    <section ref={ref} className="relative h-[135vh]">
      <div className="scanlines sticky top-0 h-screen overflow-hidden">
        {/* split composition — the robot owns the right half on desktop and
            the lower half on mobile. Copy and body NEVER share pixels. */}
        <HeadScene
          pan={reduced ? 0 : pan}
          tilt={reduced ? 4 : tilt}
          estop={false}
          clampPulse={0}
          thinking={false}
          scrub={reduced ? 1 : scrub}
          className="absolute inset-x-0 bottom-0 top-[52%] lg:inset-y-0 lg:left-auto lg:right-0 lg:top-0 lg:w-[52%]"
        />
        {/* light vignette only — nothing to hide anymore */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent" />

        <div className="relative z-10 mx-auto flex h-full max-w-6xl items-start px-5 pt-[13vh] lg:items-center lg:pt-0">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-xl text-center lg:max-w-[48%] lg:text-left"
          >
            <p className="telemetry mb-5 text-[12px] uppercase tracking-[0.3em] text-signal">
              body link: live
            </p>
            <h1 className="display text-[2.75rem] sm:text-6xl xl:text-[4.5rem]">
              <span className="whitespace-nowrap">Give your phone</span>
              <br />a real body.
            </h1>
            <p className="mt-6 max-w-lg text-balance text-base text-muted sm:text-lg">
              Your phone is already the smartest thing you own. Exobod is the
              exoskeleton it docks into — arms, a stance, a face, a voice,
              and a spine that says no. The phone stays the CPU; the body
              obeys.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <Link href="/#waitlist">
                <Button size="lg">Join the waitlist</Button>
              </Link>
              <Link href="/#live">
                <Button size="lg" variant="outline">
                  Watch it move
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        <p className="telemetry absolute inset-x-0 bottom-5 z-10 hidden text-center text-[11px] uppercase tracking-[0.25em] text-muted sm:block">
          scroll — the phone docks, the body wakes
        </p>
      </div>
    </section>
  );
}
