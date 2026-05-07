import { site } from "@/lib/content";
import { cn } from "@/lib/utils";
import Image from "next/image";

/** Source asset is 944×358: robot mark + wordmark in one file. Never crop to a square. */
const LOCKUP = {
  src: "/branding/logo-mark-light.png",
  width: 944,
  height: 358,
} as const;

export function BrandLockup({
  className,
  priority = false,
  size = "md",
}: {
  className?: string;
  priority?: boolean;
  size?: "sm" | "md";
}) {
  const heightClass =
    size === "sm" ? "h-7 sm:h-8" : "h-8 w-auto sm:h-9 md:h-10";
  return (
    <Image
      src={LOCKUP.src}
      alt={site.name}
      width={LOCKUP.width}
      height={LOCKUP.height}
      priority={priority}
      className={cn("w-auto shrink-0 object-contain object-left", heightClass, className)}
      sizes={size === "sm" ? "180px" : "(max-width: 768px) 240px, 280px"}
    />
  );
}
