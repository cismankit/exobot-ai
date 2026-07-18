"use client";

import { ExobodVisual } from "@/components/exobod-visual";
import { EXOBOD_HERO_IMAGE, EXOBOD_HERO_PRODUCT } from "@/lib/site-assets";
import Image from "next/image";
import { useCallback, useState } from "react";

/**
 * Original phone-as-body concept render — large, no card chrome.
 * Falls back to full poster, then CSS silhouette.
 */
export function HeroProductVisual() {
  const [src, setSrc] = useState(EXOBOD_HERO_PRODUCT);

  const onError = useCallback(() => {
    setSrc((current) =>
      current === EXOBOD_HERO_PRODUCT ? EXOBOD_HERO_IMAGE : "",
    );
  }, []);

  if (!src) {
    return <ExobodVisual />;
  }

  return (
    <div className="relative mx-auto w-full max-w-xl lg:max-w-2xl xl:max-w-3xl">
      {/* Orange rim / ember ground light — ATLAS-style separation from dark field */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-[8%] rounded-[40%] bg-[radial-gradient(ellipse_at_50%_42%,rgba(255,122,26,0.28),transparent_58%)] blur-2xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-[6%] left-1/2 h-28 w-[85%] -translate-x-1/2 rounded-[100%] bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,122,26,0.35),transparent_72%)] blur-xl"
      />
      <div className="relative">
        <Image
          src={src}
          alt="Exobod phone-as-body walker concept: smartphone core with articulated industrial limbs"
          width={476}
          height={983}
          className="relative z-[1] h-auto w-full object-contain drop-shadow-[0_0_40px_rgba(255,122,26,0.22)] [filter:contrast(1.14)_saturate(1.1)_brightness(0.94)]"
          priority
          sizes="(max-width: 1024px) 92vw, 720px"
          onError={onError}
        />
      </div>
      <p className="mt-3 text-center font-mono text-[10px] tracking-[0.18em] text-text-muted/80">
        Concept render · phone core · modular body
      </p>
    </div>
  );
}
