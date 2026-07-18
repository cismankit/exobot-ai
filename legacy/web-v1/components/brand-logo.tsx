import { cn } from "@/lib/utils";
import Image from "next/image";

/** 944×358 lockup: robot on the left, wordmark on the right (same file). */
const LOCKUP_SRC = "/branding/logo-mark-light.png";

/**
 * Robot-only slice from the light lockup (matches the “figure” look on dark UI).
 * Uses object-cover + object-left so we never squash the full horizontal art into a square.
 */
export function BrandFigure({
  size = "md",
  className,
  priority = false,
}: {
  size?: "sm" | "md";
  className?: string;
  priority?: boolean;
}) {
  const box =
    size === "sm"
      ? "h-7 w-[1.75rem] sm:h-8 sm:w-[2rem]"
      : "h-8 w-[2rem] sm:h-9 sm:w-[2.35rem] md:h-10 md:w-[2.65rem]";
  return (
    <span className={cn("relative inline-block shrink-0 overflow-hidden", box, className)} aria-hidden>
      <Image
        src={LOCKUP_SRC}
        alt=""
        fill
        priority={priority}
        className="object-cover object-left"
        sizes={size === "sm" ? "48px" : "64px"}
      />
    </span>
  );
}

export function BrandWordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-block font-display text-[1.03em] font-bold leading-none tracking-[-0.02em] antialiased",
        className,
      )}
    >
      <span className="text-text-main">Exobod</span>
      <span className="text-accent">.ai</span>
    </span>
  );
}
