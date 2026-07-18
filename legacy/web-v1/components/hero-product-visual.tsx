"use client";

import { ExobodVisual } from "@/components/exobod-visual";
import { EXOBOD_HERO_IMAGE } from "@/lib/site-assets";
import Image from "next/image";
import { useCallback, useState } from "react";

/**
 * Framed product visual used by the homepage and Desk One heroes.
 * Defaults to the v4 walker hero; pages can pass their own plate.
 */
export function HeroProductVisual({
  src = EXOBOD_HERO_IMAGE,
  alt = "Exobod walker robot with a smartphone as its face, studio product shot",
  caption = "Concept render · not final production hardware",
}: {
  src?: string;
  alt?: string;
  caption?: string;
}) {
  const [useFallback, setUseFallback] = useState(false);

  const onError = useCallback(() => {
    setUseFallback(true);
  }, []);

  if (useFallback) {
    return <ExobodVisual />;
  }

  return (
    <div className="relative mx-auto w-full max-w-md lg:max-w-lg xl:max-w-xl">
      <div className="pointer-events-none absolute -inset-4 rounded-[32px] bg-[radial-gradient(ellipse_at_50%_18%,rgba(255,122,26,0.18),transparent_52%)]" />
      <div className="pointer-events-none absolute -bottom-8 left-1/2 h-24 w-[min(100%,420px)] -translate-x-1/2 rounded-[100%] bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,122,26,0.22),transparent_70%)] blur-md" />
      <div className="relative overflow-hidden rounded-2xl border border-line/60 bg-[#07090c] shadow-[0_40px_120px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.04)_inset] ring-1 ring-white/[0.06]">
        <Image
          src={src}
          alt={alt}
          width={1024}
          height={1536}
          className="h-auto w-full object-contain object-center"
          priority
          sizes="(max-width: 1024px) 100vw, 560px"
          onError={onError}
        />
      </div>
      <p className="mt-4 text-center font-mono text-[10px] tracking-wide text-text-muted">
        {caption}
      </p>
    </div>
  );
}
