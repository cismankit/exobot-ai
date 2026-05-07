import Link from "next/link";

export function CTASection({
  eyebrow,
  title,
  description,
  primary,
  secondary,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  primary: { readonly href: string; readonly label: string };
  secondary?: { readonly href: string; readonly label: string };
}) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-line/80 bg-gradient-to-br from-surface via-surface-soft to-background p-10 shadow-panel">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,122,26,0.12),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(255,177,92,0.08),transparent_40%)]" />
      <div className="relative mx-auto max-w-3xl space-y-6 text-center">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">{eyebrow}</p>
        ) : null}
        <div className="space-y-3">
          <h2 className="text-3xl font-semibold text-text-main sm:text-4xl">{title}</h2>
          <p className="text-base text-text-muted sm:text-lg">{description}</p>
        </div>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href={primary.href}
            className="inline-flex w-full items-center justify-center rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-background transition hover:bg-accent-soft sm:w-auto"
          >
            {primary.label}
          </Link>
          {secondary ? (
            <Link
              href={secondary.href}
              className="inline-flex w-full items-center justify-center rounded-xl border border-line px-6 py-3 text-sm font-semibold text-text-main transition hover:border-accent/50 hover:text-accent-soft sm:w-auto"
            >
              {secondary.label}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
