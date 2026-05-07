export function ProcessStep({
  step,
  title,
  detail,
}: {
  step: number;
  title: string;
  detail: string;
}) {
  return (
    <div className="relative flex gap-4 rounded-2xl border border-line/70 bg-surface/70 p-4 backdrop-blur">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-sm font-bold text-accent">
        {step}
      </div>
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-text-main">{title}</h3>
        <p className="text-sm text-text-muted">{detail}</p>
      </div>
    </div>
  );
}
