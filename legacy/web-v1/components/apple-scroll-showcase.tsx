"use client";

import { EXOBOD_HERO_IMAGE } from "@/lib/site-assets";
import { cn } from "@/lib/utils";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef, useState } from "react";

const story = [
  {
    step: "01",
    title: "Choose your body",
    copy: "Start with Desk One for honest EVT motion — or explore Walker, Rover, and Utility as concept paths.",
    image: "/exobod/story/step-1.png",
  },
  {
    step: "02",
    title: "Mount your phone core",
    copy: "Your iPhone or Android remains the brain — interface, voice, camera, and the assistant stack you already trust.",
    image: "/exobod/story/step-2.png",
  },
  {
    step: "03",
    title: "Tune motion behavior",
    copy: "Pan/tilt profiles for Desk One today. Broader motion packs stay engineering targets until scope is locked.",
    image: "/exobod/story/step-3.png",
  },
  {
    step: "04",
    title: "Order with confidence",
    copy: "Reserve Desk One interest or file a guided build request — written scope before major funds move.",
    image: "/exobod/story/step-4.png",
  },
];

/**
 * Crop baked-in infographic text from concept renders — show product photography zone only.
 */
const PRODUCT_OBJECT =
  "object-cover object-[72%_42%] scale-[1.35] sm:object-[74%_40%] sm:scale-[1.4]";

export function AppleScrollShowcase() {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const [activeIdx, setActiveIdx] = useState(0);

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.96, 1, 1.03]);
  const y = useTransform(scrollYProgress, [0, 1], [12, -8]);
  const glow = useTransform(scrollYProgress, [0, 0.45, 1], [0.2, 0.45, 0.3]);
  const activeStep = story[activeIdx];

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = Math.min(story.length - 1, Math.floor(v * story.length));
    setActiveIdx(next);
  });

  return (
    <section ref={sectionRef} className="relative border-y border-line/40 bg-[#050709]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,rgba(255,122,26,0.07),transparent_50%)]" />
      <div className="relative mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-2 md:gap-12 md:px-6 md:py-14">
        <div className="space-y-3 md:space-y-4">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-accent">
            How it works
          </p>
          {story.map((item, idx) => (
            <article
              key={item.step}
              data-active={idx === activeIdx}
              className={cn(
                "min-h-[42vh] border-l-2 py-5 pl-5 transition md:min-h-[52vh]",
                idx === activeIdx
                  ? "border-accent bg-gradient-to-r from-accent/[0.07] to-transparent"
                  : "border-line/50 opacity-55",
              )}
            >
              <p className="font-mono text-xs font-semibold tracking-[0.28em] text-accent">
                {item.step}
              </p>
              <h3 className="mt-4 font-display text-2xl font-semibold tracking-tight text-text-main md:text-3xl">
                {item.title}
              </h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-text-muted md:text-base">
                {item.copy}
              </p>
            </article>
          ))}
        </div>

        <div className="md:sticky md:top-20 md:h-[78vh]">
          <div className="relative flex h-full items-center justify-center">
            <motion.div
              style={{ opacity: glow }}
              className="pointer-events-none absolute inset-x-8 bottom-12 h-24 rounded-[999px] bg-[radial-gradient(ellipse_at_center,rgba(255,122,26,0.4),transparent_70%)] blur-2xl"
            />
            <motion.div
              style={reduceMotion ? undefined : { scale, y }}
              className="relative w-full max-w-[440px] overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a0e14] shadow-[0_40px_120px_rgba(0,0,0,0.6)]"
            >
              <div className="relative aspect-[3/4] w-full">
                <div className="pointer-events-none absolute right-3 top-3 z-20 flex items-center gap-1.5 rounded-full border border-white/10 bg-black/50 px-2.5 py-1 backdrop-blur-md">
                  {story.map((item, idx) => (
                    <span
                      key={item.step}
                      className={cn(
                        "block h-1 rounded-full transition-all",
                        idx === activeIdx ? "w-4 bg-accent" : "w-1 bg-white/35",
                      )}
                    />
                  ))}
                </div>

                {story.map((item, idx) => (
                  <Image
                    key={item.step}
                    src={item.image ?? EXOBOD_HERO_IMAGE}
                    alt=""
                    fill
                    className={cn(
                      "absolute inset-0 z-10 transition-opacity duration-500",
                      PRODUCT_OBJECT,
                      idx === activeIdx ? "opacity-100" : "opacity-0",
                    )}
                    sizes="(max-width: 1024px) 100vw, 440px"
                    priority={idx === 0}
                  />
                ))}

                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-[#050709]/90 via-[#050709]/40 to-transparent px-4 pb-4 pt-16">
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-muted">
                    {activeStep.step} · concept render · not production hardware
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
