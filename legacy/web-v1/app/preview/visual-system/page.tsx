import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Visual system preview (draft v2) | Exobod.ai",
  description: "Internal preview of draft Exobod v2 product assets. Not for public navigation.",
  robots: { index: false, follow: false },
};

type V2Asset = {
  file: string;
  label: string;
  shotId: string;
  status: "Concept" | "Draft EVT" | "Draft documentary" | "Concept UI mock";
  ar: string;
  notes: string;
};

const ASSETS: V2Asset[] = [
  {
    file: "desk-one-hero.png",
    label: "Desk One hero",
    shotId: "S4",
    status: "Draft EVT",
    ar: "3:4",
    notes: "Stationary 2-axis dock — not biped. Needs approval before /desk-one wiring.",
  },
  {
    file: "walker-fullbody.png",
    label: "Walker full body",
    shotId: "S2",
    status: "Concept",
    ar: "3:4",
    notes: "Vision plate only. Never stand in for Desk One.",
  },
  {
    file: "walker-detail.png",
    label: "Walker mechanical detail",
    shotId: "S3",
    status: "Concept",
    ar: "1:1",
    notes: "Shoulders / joints / phone mount closeup.",
  },
  {
    file: "rover.png",
    label: "Rover",
    shotId: "S5",
    status: "Concept",
    ar: "3:4",
    notes: "Wheeled body family — distinct from Desk / Walker / Utility.",
  },
  {
    file: "utility.png",
    label: "Utility",
    shotId: "S6",
    status: "Concept",
    ar: "3:4",
    notes: "Payload / helper frame — distinct from Rover.",
  },
  {
    file: "build-cad.png",
    label: "Build / CAD / BOM",
    shotId: "S7",
    status: "Draft documentary",
    ar: "3:2",
    notes: "Parts aesthetic — not certification. Bitmap labels OK for review only.",
  },
  {
    file: "companion-app.png",
    label: "Companion app",
    shotId: "S8",
    status: "Concept UI mock",
    ar: "3:4",
    notes: "Phone face + listening waveform. No fake store ratings.",
  },
  {
    file: "prototype-proof.png",
    label: "Prototype proof",
    shotId: "S9",
    status: "Draft EVT",
    ar: "3:2",
    notes: "Bench honesty. Prefer real photo when available.",
  },
];

export default function VisualSystemPreviewPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 sm:py-10">
      <header className="space-y-3 border-b border-line/60 pb-6">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-accent">
          Preview only · noindex
        </p>
        <h1 className="font-display text-3xl font-semibold text-text-main sm:text-4xl">
          Exobod visual system — draft v2
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-text-muted sm:text-base">
          Purpose-built assets under <code className="text-accent-soft">/exobod/v2/</code>. Not linked from
          public nav. Do not wire to the live homepage until each plate is explicitly approved. Crop rule:{" "}
          <strong className="text-text-main">object-contain</strong> + dark stage padding.
        </p>
      </header>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {ASSETS.map((asset) => (
          <figure
            key={asset.file}
            className="flex flex-col overflow-hidden rounded-xl border border-line/70 bg-surface/50"
          >
            <div className="relative flex aspect-[3/4] items-center justify-center bg-[#050709] p-3">
              <Image
                src={`/exobod/v2/${asset.file}`}
                alt={`${asset.label} — ${asset.status}`}
                width={asset.ar === "1:1" ? 1024 : asset.ar === "3:2" ? 1536 : 1024}
                height={asset.ar === "1:1" ? 1024 : asset.ar === "3:2" ? 1024 : 1536}
                className="h-full w-full object-contain"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
            <figcaption className="space-y-2 border-t border-line/50 p-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-base font-semibold text-text-main">{asset.label}</h2>
                <span className="font-mono text-[10px] uppercase tracking-wider text-text-muted">
                  {asset.shotId} · {asset.ar}
                </span>
              </div>
              <p className="font-mono text-[11px] uppercase tracking-wide text-accent">{asset.status}</p>
              <p className="text-xs leading-relaxed text-text-muted">{asset.notes}</p>
              <p className="font-mono text-[10px] text-text-muted/80">exobod/v2/{asset.file}</p>
            </figcaption>
          </figure>
        ))}
      </div>

      <aside className="rounded-xl border border-line/60 bg-surface-soft/40 p-4 text-sm text-text-muted">
        <p className="font-semibold text-text-main">Approval gate</p>
        <p className="mt-2 leading-relaxed">
          Live homepage hero, logo, and nav stay frozen. These drafts need per-asset user approval before
          Desk One pages, body-family grids, or any production marketing surface.
        </p>
      </aside>
    </div>
  );
}
