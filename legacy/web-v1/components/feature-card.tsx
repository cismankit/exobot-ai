import { CardShell } from "@/components/card-shell";

export function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <CardShell>
      <div className="space-y-3">
        <h3 className="text-xl font-semibold text-text-main">{title}</h3>
        <p className="text-sm leading-relaxed text-text-muted">{description}</p>
      </div>
    </CardShell>
  );
}
