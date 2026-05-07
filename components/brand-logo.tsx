import { cn } from "@/lib/utils";
import Image from "next/image";

const sizes = {
  sm: "size-7",
  md: "h-9 w-9 sm:h-11 sm:w-11",
} as const;

/**
 * Uses the approved brand icon asset directly to avoid style drift.
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
  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center",
        sizes[size],
        className,
      )}
      aria-hidden
      data-logo-id={gradientId}
    >
      <Image
        src="/branding/logo-mark-light.png"
        alt=""
        width={96}
        height={96}
        className="relative z-[1] size-full object-contain [filter:drop-shadow(0_0_0.8px_rgba(255,255,255,0.98))_drop-shadow(0_2px_9px_rgba(0,0,0,0.45))]"
        sizes="(max-width: 640px) 36px, 44px"
        priority
      />
    </span>
  );
}

export function BrandWordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "font-display text-[1.03em] font-bold leading-none tracking-[-0.028em] text-text-main antialiased",
        className,
      )}
    >
      <span className="bg-gradient-to-b from-white via-slate-100 to-slate-300 bg-clip-text text-transparent [text-shadow:0_0_0.8px_rgba(255,255,255,0.92),0_2px_9px_rgba(0,0,0,0.5)]">
        Exobod
      </span>
      <span className="text-accent [text-shadow:0_0_8px_rgba(255,122,26,0.35)]">.ai</span>
    </span>
  );
}
