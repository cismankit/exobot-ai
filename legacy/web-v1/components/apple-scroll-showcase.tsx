"use client";

import { EXOBOD_HERO_IMAGE } from "@/lib/site-assets";
import { cn } from "@/lib/utils";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Cpu, Gauge, ShieldCheck, SlidersHorizontal } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

const story = [
  {
    step: "01",
    title: "Choose your body",
    copy: "Select Walker, Desk, Rover, or Utility based on how you want Exobod to move.",
    icon: SlidersHorizontal,
    image: "/exobod/story/step-1.png",
  },
  {
    step: "02",
    title: "Mount your phone core",
    copy: "Your iPhone or Android remains the brain, interface, voice, and camera stack.",
    icon: Cpu,
    image: "/exobod/story/step-2.png",
  },
  {
    step: "03",
    title: "Tune motion behavior",
    copy: "Pick motion profile, accessories, and performance preference for your workflow.",
    icon: Gauge,
    image: "/exobod/story/step-3.png",
  },
  {
    step: "04",
    title: "Order with confidence",
    copy: "Confirm configuration and timeline through a guided order inquiry - no confusion.",
    icon: ShieldCheck,
    image: "/exobod/story/step-4.png",
  },
];

export function AppleScrollShowcase() {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const [activeIdx, setActiveIdx] = useState(0);

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.93, 1, 1.04]);
  const y = useTransform(scrollYProgress, [0, 1], [16, -10]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-2, 2]);
  const glow = useTransform(scrollYProgress, [0, 0.45, 1], [0.25, 0.5, 0.35]);
  const layerBackY = useTransform(scrollYProgress, [0, 1], [-18, 18]);
  const layerMidY = useTransform(scrollYProgress, [0, 1], [8, -8]);
  const activeStep = story[activeIdx];

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = Math.min(story.length - 1, Math.floor(v * story.length));
    setActiveIdx(next);
  });

  return (
    <section ref={sectionRef} className="relative border-y border-line/50 bg-background/90">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 md:grid-cols-2 md:gap-10 md:px-6">
        <div className="space-y-4 md:space-y-6">
          {story.map((item, idx) => {
            const Icon = item.icon;
            return (
              <article
                key={item.step}
                data-active={idx === activeIdx}
                className={cn(
                  "min-h-[46vh] rounded-2xl border p-5 backdrop-blur-sm transition md:min-h-[56vh] md:p-6",
                  idx <= activeIdx
                    ? "border-accent/35 bg-surface-soft/55"
                    : "border-line/60 bg-surface/35",
                )}
              >
                <p className="font-mono text-xs font-semibold tracking-[0.28em] text-accent">{item.step}</p>
                <div className="mt-3 inline-flex size-9 items-center justify-center rounded-lg border border-accent/40 bg-accent/10 text-accent">
                  <motion.div
                    animate={
                      reduceMotion
                        ? undefined
                        : idx === activeIdx
                          ? { scale: [1, 1.12, 1], rotate: [0, -2, 0] }
                          : { scale: 1, rotate: 0 }
                    }
                    transition={{ duration: 0.55, ease: "easeOut" }}
                  >
                    <Icon className="size-4.5" />
                  </motion.div>
                </div>
                <h3 className="mt-4 text-2xl font-semibold text-text-main md:text-3xl">{item.title}</h3>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-text-muted md:text-base">{item.copy}</p>
              </article>
            );
          })}
        </div>

        <div className="md:sticky md:top-20 md:h-[78vh]">
          <div className="relative flex h-full items-center justify-center">
            <motion.div
              style={{ opacity: glow }}
              className="pointer-events-none absolute inset-x-10 bottom-10 h-28 rounded-[999px] bg-[radial-gradient(ellipse_at_center,rgba(255,122,26,0.45),transparent_70%)] blur-xl"
            />
            <motion.div
              style={{ scale, y, rotate }}
              className={cn(
                "relative w-full max-w-[460px] overflow-hidden rounded-3xl border border-line/60",
                "bg-gradient-to-b from-surface/60 to-background shadow-[0_40px_120px_rgba(0,0,0,0.55)]",
              )}
            >
              <div className="relative aspect-[3/4] w-full">
                <motion.div className="pointer-events-none absolute right-3 top-3 z-20 rounded-full border border-line/60 bg-background/60 px-2 py-1 backdrop-blur">
                  <div className="flex items-center gap-1.5">
                    {story.map((item, idx) => (
                      <span
                        key={item.step}
                        className={cn(
                          "block h-1.5 rounded-full transition-all",
                          idx === activeIdx ? "w-5 bg-accent" : "w-1.5 bg-white/45",
                        )}
                      />
                    ))}
                  </div>
                </motion.div>

                {!reduceMotion ? (
                  <>
                    <motion.div
                      key={`${activeStep.step}-bg`}
                      style={{ y: layerBackY }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.35 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={activeStep.image ?? EXOBOD_HERO_IMAGE}
                        alt=""
                        fill
                        className="object-cover blur-[7px] saturate-150"
                        sizes="(max-width: 1024px) 100vw, 480px"
                      />
                    </motion.div>
                    <motion.div
                      key={`${activeStep.step}-mid`}
                      style={{ y: layerMidY }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.5 }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={activeStep.image ?? EXOBOD_HERO_IMAGE}
                        alt=""
                        fill
                        className="object-cover opacity-90"
                        sizes="(max-width: 1024px) 100vw, 480px"
                      />
                    </motion.div>
                  </>
                ) : null}

                {story.map((item, idx) => (
                  <Image
                    key={item.step}
                    src={item.image ?? EXOBOD_HERO_IMAGE}
                    alt={`Exobod step ${item.step} render`}
                    fill
                    className={cn(
                      "absolute inset-0 z-10 object-cover transition-opacity duration-500",
                      idx === activeIdx ? "opacity-100" : "opacity-0",
                    )}
                    sizes="(max-width: 1024px) 100vw, 480px"
                    priority={idx === 0}
                  />
                ))}
                <motion.div
                  key={`pulse-${activeStep.step}`}
                  initial={{ opacity: 0.55 }}
                  animate={{ opacity: [0.35, 0.6, 0.35] }}
                  transition={{ duration: 1.1, ease: "easeInOut" }}
                  className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_70%_35%,rgba(255,122,26,0.2),transparent_55%)]"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
