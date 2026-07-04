import { CardShell } from "@/components/card-shell";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export function InfographicStrip({
  items,
  columns = 4,
  className,
}: {
  items: { title: string; caption: string; icon: LucideIcon }[];
  columns?: 3 | 4 | 5;
  className?: string;
}) {
  const gridCols =
    columns === 3 ? "md:grid-cols-3" : columns === 5 ? "md:grid-cols-3 xl:grid-cols-5" : "md:grid-cols-2 xl:grid-cols-4";

  return (
    <div className={cn("grid gap-3 sm:gap-4", gridCols, className)}>
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <CardShell key={item.title} className="h-full p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-accent/35 bg-accent/10 text-accent">
                <Icon className="size-4.5" />
              </span>
              <div className="space-y-1.5">
                <h3 className="text-sm font-semibold text-text-main sm:text-base">{item.title}</h3>
                <p className="text-xs leading-relaxed text-text-muted sm:text-sm">{item.caption}</p>
              </div>
            </div>
          </CardShell>
        );
      })}
    </div>
  );
}
