"use client";

import { useEffect, useRef } from "react";

type Ember = {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  a: number;
  life: number;
};

/**
 * Subtle floating ember/spark particles for cinematic hero atmosphere.
 * Respects prefers-reduced-motion.
 */
export function HeroEmbers() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let embers: Ember[] = [];
    let w = 0;
    let h = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(48, Math.floor((w * h) / 28000));
      embers = Array.from({ length: count }, () => spawn(true));
    };

    const spawn = (randomY = false): Ember => ({
      x: Math.random() * w,
      y: randomY ? Math.random() * h : h + Math.random() * 40,
      r: 0.6 + Math.random() * 1.8,
      vx: (Math.random() - 0.5) * 0.35,
      vy: -(0.25 + Math.random() * 0.7),
      a: 0.25 + Math.random() * 0.55,
      life: 0.5 + Math.random() * 0.5,
    });

    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < embers.length; i++) {
        const e = embers[i];
        e.x += e.vx + Math.sin(e.y * 0.01) * 0.08;
        e.y += e.vy;
        e.life -= 0.0015;
        if (e.y < -10 || e.life <= 0) {
          embers[i] = spawn(false);
          continue;
        }
        const alpha = e.a * Math.max(0, e.life);
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 122, 26, ${alpha})`;
        ctx.shadowColor = "rgba(255, 122, 26, 0.85)";
        ctx.shadowBlur = 6;
        ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
        ctx.fill();
        if (e.r > 1.2) {
          ctx.beginPath();
          ctx.fillStyle = `rgba(255, 200, 120, ${alpha * 0.55})`;
          ctx.shadowBlur = 0;
          ctx.arc(e.x, e.y, e.r * 0.35, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      raf = requestAnimationFrame(tick);
    };

    resize();
    raf = requestAnimationFrame(tick);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[2] h-full w-full opacity-80"
    />
  );
}
