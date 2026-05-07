import { cn } from "@/lib/utils";

const sizes = {
  sm: "size-6",
  md: "size-7 sm:size-8",
} as const;

/**
 * Stick-figure robot: handset as the head (your product story), simple limbs—readable at favicon scale.
 */
export function BrandMark({
  size = "md",
  gradientId = "exobod-mark-grad",
  className,
}: {
  size?: keyof typeof sizes;
  gradientId?: string;
  className?: string;
}) {
  const limb = {
    stroke: "#9aa5b8",
    strokeWidth: 1.35,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    fill: "none",
  };

  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center",
        sizes[size],
        className,
      )}
      aria-hidden
    >
      <span className="pointer-events-none absolute left-1/2 top-[52%] h-[100%] w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/28 opacity-65 blur-[11px] transition duration-300 group-hover:opacity-95" />
      <svg
        viewBox="0 0 32 32"
        className="relative size-full overflow-visible drop-shadow-[0_2px_12px_rgba(255,122,26,0.28)] transition duration-300 group-hover:drop-shadow-[0_3px_18px_rgba(255,122,26,0.42)]"
        role="img"
        aria-hidden
      >
        <defs>
          <linearGradient id={gradientId} x1="11" y1="3" x2="21" y2="14" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ffb15c" />
            <stop offset="0.45" stopColor="#ff7a1a" />
            <stop offset="1" stopColor="#c95500" />
          </linearGradient>
        </defs>
        {/* limbs first — phone head paints on top */}
        <path d="M16 13.8v7.4" {...limb} />
        <path d="M16 21.2l-4.2 7.6M16 21.2l4.2 7.6" {...limb} />
        <path d="M11.4 11.8L7 17.2M20.6 11.8L25 17.2" {...limb} />
        {/* handset “head” */}
        <rect x="11.5" y="3" width="9" height="10.8" rx="2.35" fill={`url(#${gradientId})`} />
        <rect x="14.15" y="4.55" width="3.7" height="1.2" rx="0.4" fill="rgba(7,10,13,0.45)" />
      </svg>
    </span>
  );
}

export function BrandWordmark({ className }: { className?: string }) {
  return (
    <span className={cn("font-display", className)}>
      <span className="text-text-main">Exobod</span>
      <span className="text-accent">.ai</span>
    </span>
  );
}
