import { CardShell } from "@/components/card-shell";
import { cn } from "@/lib/utils";

export function SkillCard({ name, blurb, className }: { name: string; blurb: string; className?: string }) {
  return (
    <CardShell className={cn("h-full border-l-2 border-l-accent/50 p-4 sm:p-5", className)} hover>
      <div className="space-y-1">
        <p className="font-mono text-[10px] uppercase tracking-wider text-accent/90">Motion skill</p>
        <h3 className="text-base font-semibold text-text-main sm:text-lg">{name}</h3>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-text-muted sm:text-sm">{blurb}</p>
    </CardShell>
  );
}
