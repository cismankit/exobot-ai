import { cn } from "@exobod/ui";

/**
 * Exobod brand mark — geometric phone-as-body + industrial limb brackets.
 * Prefer this over raster lockups. See docs/BRAND.md.
 */

const ACCENT = "var(--brand, #ff7a1a)";

/** Icon-only mark. Nav optical size: h-6 to h-8. Do not stretch. */
export function LogoMark({
  className,
  title,
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 40 48"
      fill="none"
      className={cn("shrink-0 text-fg", className)}
      role={title ? "img" : "presentation"}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
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
      <rect x="9.2" y="10.6" width="3.8" height="2.4" rx="0.7" fill={ACCENT} />
      <rect x="27" y="10.6" width="3.8" height="2.4" rx="0.7" fill={ACCENT} />
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

export function BrandWordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "display inline-block leading-none tracking-[-0.02em] antialiased",
        className,
      )}
    >
      <span className="text-fg">Exobod</span>
      <span className="text-brand">.ai</span>
    </span>
  );
}

/** Mark + wordmark. Maintain aspect; do not stretch. */
export function BrandLockup({
  className,
  markClassName,
  wordmarkClassName,
}: {
  className?: string;
  markClassName?: string;
  wordmarkClassName?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className={cn("h-7 w-auto", markClassName)} />
      <BrandWordmark className={cn("text-[17px]", wordmarkClassName)} />
    </span>
  );
}
