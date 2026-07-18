import { cn } from "@/lib/utils";
import Image from "next/image";

/**
 * Canonical brand mark: standalone Exobod robot (phone face, orange smile)
 * on a transparent background. Square asset, full figure — never cropped.
 * Source of truth: /public/branding/mark-robot-transparent.png
 */
const MARK_SRC = "/branding/mark-robot-transparent.png";

export function BrandFigure({
  size = "md",
  className,
  priority = false,
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
  priority?: boolean;
}) {
  const box =
    size === "sm"
      ? "h-7 w-7 sm:h-8 sm:w-8"
      : size === "lg"
        ? "h-12 w-12 sm:h-14 sm:w-14"
        : "h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10";
  return (
    <span className={cn("relative inline-block shrink-0", box, className)} aria-hidden>
      <Image
        src={MARK_SRC}
        alt=""
        fill
        priority={priority}
        className="object-contain"
        sizes={size === "sm" ? "32px" : size === "lg" ? "56px" : "40px"}
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
