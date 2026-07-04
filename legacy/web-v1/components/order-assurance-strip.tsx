import { BadgeCheck, Globe2, ShieldCheck } from "lucide-react";

const items = [
  { icon: BadgeCheck, text: "Configuration reviewed by real engineers" },
  { icon: ShieldCheck, text: "Safety and scope confirmation before build" },
  { icon: Globe2, text: "Global order inquiry and team procurement support" },
] as const;

export function OrderAssuranceStrip() {
  return (
    <section className="border-y border-line/50 bg-surface/20">
      <div className="mx-auto grid max-w-6xl gap-2 px-4 py-3 sm:grid-cols-3 sm:gap-3 sm:px-6">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.text}
              className="inline-flex items-center gap-2 rounded-lg border border-line/50 bg-background/40 px-3 py-2 text-xs text-text-main/90"
            >
              <Icon className="size-3.5 shrink-0 text-accent" />
              <span>{item.text}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
