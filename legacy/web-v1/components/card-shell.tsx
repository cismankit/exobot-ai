import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function CardShell({
  className,
  children,
  hover = true,
}: {
  className?: string;
  children: ReactNode;
  hover?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-line/80 bg-surface/80 p-6 shadow-panel backdrop-blur-md transition-transform duration-300",
        hover && "hover:-translate-y-1 hover:border-accent/40 hover:shadow-glow",
        className,
      )}
    >
      {children}
    </div>
  );
}
