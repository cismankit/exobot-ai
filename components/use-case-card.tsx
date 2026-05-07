import { CardShell } from "@/components/card-shell";
import Link from "next/link";

export function UseCaseCard({
  title,
  problem,
  role,
  example,
  cta,
}: {
  title: string;
  problem: string;
  role: string;
  example: string;
  cta: { href: string; label: string };
}) {
  return (
    <CardShell className="flex h-full flex-col gap-4">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-accent">Use case</p>
        <h3 className="text-2xl font-semibold text-text-main">{title}</h3>
      </div>
      <div className="space-y-3 text-sm text-text-muted">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-text-main">Problem</p>
          <p className="mt-1 leading-relaxed">{problem}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-text-main">
            Exobod role
          </p>
          <p className="mt-1 leading-relaxed">{role}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-text-main">
            Example activity
          </p>
          <p className="mt-1 leading-relaxed">{example}</p>
        </div>
      </div>
      <div className="mt-auto">
        <Link
          href={cta.href}
          className="inline-flex w-full items-center justify-center rounded-xl border border-line bg-surface-soft px-4 py-3 text-sm font-semibold text-text-main transition hover:border-accent/50 hover:text-accent-soft"
        >
          {cta.label}
        </Link>
      </div>
    </CardShell>
  );
}
