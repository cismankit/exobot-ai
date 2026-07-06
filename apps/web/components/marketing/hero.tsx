"use client";

/**
 * Hero — photography-led, Joby-style: one quiet viewport, the real
 * product render carrying the story, minimal copy. The interactive 3D
 * body lives where interactivity matters — the live demo (#live) and
 * the console — not here competing with the render.
 */

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@exobod/ui";

export function Hero() {
  return (
    <section className="scanlines relative flex min-h-screen items-center overflow-hidden">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-5 pb-16 pt-28 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:pb-10 lg:pt-14">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="text-center lg:text-left"
        >
          <p className="telemetry mb-5 text-[12px] uppercase tracking-[0.3em] text-brand">
            smartphone · exoskeleton · motion
          </p>
          <h1 className="display text-[2.75rem] sm:text-6xl xl:text-[4.5rem]">
            <span className="whitespace-nowrap">Give your phone</span>
            <br />a real body.
          </h1>
          <p className="mt-6 max-w-lg text-balance text-base text-muted sm:text-lg lg:mx-0 mx-auto">
            Mount your phone in a removable core. Exobod supplies the limbs,
            mounts, and servo hardware — the handset keeps the camera, mic,
            screen, and the assistant stack you already run.
          </p>
          <p className="mt-4 text-sm font-medium text-fg">
            AI in your phone. Motion in the world.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <Link href="/#waitlist">
              <Button size="lg">Preorder the dev kit</Button>
            </Link>
            <Link href="/#live">
              <Button size="lg" variant="outline">
                Drive it live
              </Button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto w-full max-w-[420px] lg:max-w-none"
        >
          <div className="relative overflow-hidden rounded-3xl border border-line bg-surface">
            <Image
              src="/exobot-hero.png?v=2"
              alt="Exobod exoskeleton concept — a phone docked as the face of an articulated robot body"
              width={559}
              height={872}
              priority
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="h-auto w-full"
            />
            {/* soft edge vignettes blend the studio backdrop into the card */}
            <div className="pointer-events-none absolute left-0 top-0 h-[40%] w-28 bg-gradient-to-r from-surface/70 to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-surface to-transparent" />
          </div>
          <p className="telemetry mt-3 text-center text-[11px] uppercase tracking-[0.2em] text-muted">
            concept render · not final production hardware
          </p>
        </motion.div>
      </div>
    </section>
  );
}
