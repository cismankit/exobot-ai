import { primaryCta, secondaryCta } from "@/lib/ctas";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function CtaPair({
  className,
  primaryClassName,
  secondaryClassName,
}: {
  className?: string;
  primaryClassName?: string;
  secondaryClassName?: string;
}) {
  return (
    <div
      className={cn(
        "flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:justify-center",
        className,
      )}
    >
      <Link
        href={primaryCta.href}
        className={cn(
          "inline-flex w-full items-center justify-center rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-background transition hover:bg-accent-soft sm:w-auto",
          primaryClassName,
        )}
      >
        {primaryCta.label}
      </Link>
      <Link
        href={secondaryCta.href}
        className={cn(
          "inline-flex w-full items-center justify-center rounded-xl border border-line px-6 py-3 text-sm font-semibold text-text-main transition hover:border-accent/50 hover:text-accent-soft sm:w-auto",
          secondaryClassName,
        )}
      >
        {secondaryCta.label}
      </Link>
    </div>
  );
}
