import { cn } from "@/lib/utils";

/**
 * Exobod brand lockup — geometric phone-as-body mark + wordmark.
 * Prefer these components over stretching PNGs. See docs/BRAND.md.
 */

const ACCENT = "var(--accent, #ff7a1a)";

/** Icon-only mark. Sized for nav (~28–40px tall). Do not stretch non-uniformly. */
export function BrandMark({
  className,
  title,
}: {
  className?: string;
  /** Accessible name when used alone (omit when decorative beside wordmark). */
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 40 48"
      fill="none"
      className={cn("shrink-0 text-text-main", className)}
      role={title ? "img" : "presentation"}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {/* Phone chassis — the body */}
      <rect
        x="13"
        y="4"
        width="14"
        height="24"
        rx="2.8"
        stroke="currentColor"
        strokeWidth="2.25"
      />
      <rect x="17" y="7.2" width="6" height="1.5" rx="0.75" fill="currentColor" />

      {/* Shoulder servo capsules */}
      <rect x="9.2" y="10.6" width="3.8" height="2.4" rx="0.7" fill={ACCENT} />
      <rect x="27" y="10.6" width="3.8" height="2.4" rx="0.7" fill={ACCENT} />

      {/* Arm brackets — industrial, not cartoon limbs */}
      <path
        d="M9.2 11.8H6.2V19.2H4"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      <path
        d="M30.8 11.8H33.8V19.2H36"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />

      {/* Mount plate + stance rail */}
      <rect x="15.5" y="28.6" width="9" height="2.2" rx="0.4" fill="currentColor" />
      <path
        d="M17.5 30.8V38.2M22.5 30.8V38.2"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="square"
      />
      <path
        d="M13.5 38.2H26.5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** @deprecated Prefer BrandMark — kept for existing imports. */
export function BrandFigure({
  size = "md",
  className,
}: {
  size?: "sm" | "md";
  className?: string;
  priority?: boolean;
}) {
  const box = size === "sm" ? "h-7 w-auto sm:h-8" : "h-8 w-auto sm:h-9 md:h-10";
  return <BrandMark className={cn(box, className)} />;
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

/** Mark + wordmark for headers/footers. Maintain aspect; do not stretch. */
export function BrandLockup({
  size = "md",
  className,
}: {
  size?: "sm" | "md";
  className?: string;
}) {
  const mark = size === "sm" ? "h-7 w-auto sm:h-8" : "h-8 w-auto sm:h-9 md:h-10";
  const type = size === "sm" ? "text-base" : "text-base sm:text-lg";
  return (
    <span className={cn("inline-flex items-center gap-2.5 sm:gap-3", className)}>
      <BrandMark className={mark} />
      <BrandWordmark className={type} />
    </span>
  );
}
