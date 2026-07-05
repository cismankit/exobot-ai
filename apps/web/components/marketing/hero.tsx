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

  // once docked (scrub > .65) the head "wakes": looks at the viewer
  const awake = scrub > 0.7;
  const pan = awake ? Math.sin(scrub * 6) * 18 : 0;
  const tilt = awake ? 6 : -4;

  return (
    <section ref={ref} className="relative h-[135vh]">
      <div className="scanlines sticky top-0 flex h-screen flex-col items-center overflow-hidden">
        {/* robot lives in the lower two-thirds so it never sits behind the
            headline; the face rises to meet the eyeline as you scroll */}
        <HeadScene
          pan={reduced ? 0 : pan}
          tilt={reduced ? 4 : tilt}
          estop={false}
          clampPulse={0}
          thinking={false}
          scrub={reduced ? 1 : scrub}
          className="absolute inset-x-0 bottom-0 top-[22%]"
        />
        {/* legibility scrims: a radial bloom behind the copy + a base fade
            that grounds the body without hiding it */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-bg/50 via-transparent to-bg" />
        <div className="hero-bloom pointer-events-none absolute inset-x-0 top-0 h-[70%]" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 mx-auto mt-[15vh] max-w-4xl px-5 text-center sm:mt-[16vh]"
        >
          <p className="telemetry mb-5 text-[12px] uppercase tracking-[0.3em] text-signal">
            body link: live
          </p>
          <h1 className="display text-[3.25rem] leading-[0.95] sm:text-7xl md:text-8xl">
            Give your phone
            <br />a real body.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-balance text-base text-muted sm:text-lg">
            Your phone is already the smartest thing you own. Exobod is the
            exoskeleton it docks into — arms, a stance, a face, a voice, and
            a spine that says no. The phone stays the CPU; the body obeys.
          </p>
          <div className="pointer-events-auto mt-8 flex flex-wrap items-center justify-center gap-3">
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

        <p className="telemetry absolute bottom-6 z-10 text-[11px] uppercase tracking-[0.25em] text-muted">
          scroll — the phone docks, the body wakes
        </p>
      </div>
    </section>
  );
}
