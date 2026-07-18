import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Visual system preview (v2 vs v3) | Exobod.ai",
  description: "Internal preview comparing draft Exobod v2 and v3 product assets. Not for public navigation.",
  robots: { index: false, follow: false },
};

type AssetStatus = "Concept" | "Draft EVT" | "Draft documentary" | "Concept UI mock" | "Draft concept";

type PreviewAsset = {
  file: string;
  label: string;
  shotId: string;
  status: AssetStatus;
  ar: string;
  notes: string;
};

const V3_ASSETS: PreviewAsset[] = [
  {
    file: "walker-hero-front.png",
    label: "Walker hero — front",
    shotId: "S1/S2",
    status: "Concept",
    ar: "3:4",
    notes:
      "Symmetrical full-body hero, phone head obviously removable, dark clean studio. Candidate to replace v2 walker-fullbody.",
  },
  {
    file: "walker-rear-threequarter.png",
    label: "Walker — rear engineering view",
    shotId: "S2",
    status: "Concept",
    ar: "3:4",
    notes:
      "Service panels, orange-sleeved cable routing, phone-mount cradle architecture from behind. New angle — v2 had no rear view.",
  },
  {
    file: "walker-mechanical-detail.png",
    label: "Walker — mechanical detail",
    shotId: "S3",
    status: "Concept",
    ar: "3:2",
    notes:
      "Phone cradle + harmonic-drive shoulder + printed/machined hybrid structure. Replaces v2 walker-detail.",
  },
  {
    file: "walker-cinematic.png",
    label: "Walker — test bay cinematic",
    shotId: "S1 alt",
    status: "Concept",
    ar: "3:2",
    notes:
      "Controlled orange-lit industrial test bay — launch-documentary mood, no battlefield. First landscape Walker plate.",
  },
  {
    file: "desk-one-hero-v3.png",
    label: "Desk One hero v3",
    shotId: "S4",
    status: "Draft EVT",
    ar: "3:4",
    notes:
      "Plausible 2-axis dock: weighted base, pan bearing seam, tilt cradle, sealed enclosure with vent + status LED. Replaces v2 desk-one-hero.",
  },
  {
    file: "desk-one-exploded.png",
    label: "Desk One — exploded view",
    shotId: "S7",
    status: "Draft documentary",
    ar: "3:2",
    notes:
      "Base, ballast, yaw bearing, servos, round PCB (ESP32/PCA9685 cues), tilt bracket, phone clamp. Geometry only — no bitmap labels.",
  },
  {
    file: "exobod-family.png",
    label: "Family lineup",
    shotId: "S5/S6 family",
    status: "Draft concept",
    ar: "3:2",
    notes:
      "Desk One foreground (real EVT path); Walker / Rover / Utility behind as concepts. One design DNA — labels live in HTML, not the bitmap.",
  },
];

const V2_ASSETS: PreviewAsset[] = [
  {
    file: "desk-one-hero.png",
    label: "Desk One hero",
    shotId: "S4",
    status: "Draft EVT",
    ar: "3:4",
    notes: "Stationary 2-axis dock — superseded by v3 desk-one-hero-v3.",
  },
  {
    file: "walker-fullbody.png",
    label: "Walker full body",
    shotId: "S2",
    status: "Concept",
    ar: "3:4",
    notes: "Vision plate only — superseded by v3 walker-hero-front.",
  },
  {
    file: "walker-detail.png",
    label: "Walker mechanical detail",
    shotId: "S3",
    status: "Concept",
    ar: "1:1",
    notes: "Superseded by v3 walker-mechanical-detail.",
  },
  {
    file: "rover.png",
    label: "Rover",
    shotId: "S5",
    status: "Concept",
    ar: "3:4",
    notes: "Still current for the Rover tile; v3 family plate shows the lineup context.",
  },
  {
    file: "utility.png",
    label: "Utility",
    shotId: "S6",
    status: "Concept",
    ar: "3:4",
    notes: "Still current for the Utility tile; v3 family plate shows the lineup context.",
  },
  {
    file: "build-cad.png",
    label: "Build / CAD / BOM",
    shotId: "S7",
    status: "Draft documentary",
    ar: "3:2",
    notes: "Parts aesthetic — v3 adds a cleaner label-free exploded view.",
  },
  {
    file: "companion-app.png",
    label: "Companion app",
    shotId: "S8",
    status: "Concept UI mock",
    ar: "3:4",
    notes: "No v3 replacement yet — still the current S8 draft.",
  },
  {
    file: "prototype-proof.png",
    label: "Prototype proof",
    shotId: "S9",
    status: "Draft EVT",
    ar: "3:2",
    notes: "No v3 replacement — prefer a real bench photo when available.",
  },
];

type ComparisonRow = {
  file: string;
  role: string;
  improved: string;
  concern: string;
};

const APPROVAL_ROWS: ComparisonRow[] = [
  {
    file: "v3/walker-hero-front.png",
    role: "Walker vision hero (S1/S2 candidate)",
    improved:
      "Symmetrical, full body with margin; graphite/black + controlled #ff7a1a accents; phone reads as removable head, not a helmet.",
    concern: "1024×1536 draft res — regenerate/upscale to ≥1600×2133 before any live hero use.",
  },
  {
    file: "v3/walker-rear-threequarter.png",
    role: "Engineering credibility angle",
    improved: "First rear view: service panels, cable routing, battery latch, phone-cradle arm architecture.",
    concern: "Open-panel internals are plausible but not CAD-accurate — keep labeled concept.",
  },
  {
    file: "v3/walker-mechanical-detail.png",
    role: "Industrial detail / trust section",
    improved:
      "Harmonic-drive fastener circle, machined linkage, printed shell + heat-set inserts — manufacturable Stark-lab restraint vs v2's vaguer joint.",
    concern: "Landscape 3:2 (16:9 was requested); crop-safe but note the AR in layouts.",
  },
  {
    file: "v3/walker-cinematic.png",
    role: "Cinematic / manifesto plate",
    improved: "Launch-documentary test bay, controlled orange practicals, no battlefield or fire.",
    concern: "Robot is small in frame; fine for wide banners, weak as a primary hero.",
  },
  {
    file: "v3/desk-one-hero-v3.png",
    role: "Desk One commercial hero (S4)",
    improved:
      "Genuinely buildable: weighted base, visible pan seam, tilt pivot with servo cues, sealed enclosure, USB-C — reads like a real product, not a render mash.",
    concern: "Cradle arm is more single-arm than the current printed EVT bracket — confirm vs real BOM before claiming EVT-accurate.",
  },
  {
    file: "v3/desk-one-exploded.png",
    role: "Engineering / what's-inside story",
    improved: "Clean label-free exploded stack: ballast, bearing, servos, ESP32/PCA9685-style PCB, tilt bracket, clamp.",
    concern: "Part order is plausible but not the literal BOM; verify against docs/desk-one/BOM.md before trust-page use.",
  },
  {
    file: "v3/exobod-family.png",
    role: "Body family lineup",
    improved:
      "One design DNA across Desk One (foreground, real) and Walker/Rover/Utility (behind, concept) — fixes v2's disjointed per-tile styles.",
    concern: "Background concepts must never be cropped out as standalone product shots.",
  },
];

function AssetCard({ asset, version }: { asset: PreviewAsset; version: "v2" | "v3" }) {
  return (
    <figure className="flex flex-col overflow-hidden rounded-xl border border-line/70 bg-surface/50">
      <div className="relative flex aspect-[3/4] items-center justify-center bg-[#050709] p-3">
        <Image
          src={`/exobod/${version}/${asset.file}`}
          alt={`${asset.label} — ${asset.status} (${version})`}
          width={asset.ar === "3:4" ? 1024 : asset.ar === "1:1" ? 1024 : 1536}
          height={asset.ar === "3:4" ? 1536 : 1024}
          className="h-full w-full object-contain"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
      <figcaption className="space-y-2 border-t border-line/50 p-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="text-base font-semibold text-text-main">{asset.label}</h3>
          <span className="font-mono text-[10px] uppercase tracking-wider text-text-muted">
            {asset.shotId} · {asset.ar}
          </span>
        </div>
        <p className="font-mono text-[11px] uppercase tracking-wide text-accent">{asset.status}</p>
        <p className="text-xs leading-relaxed text-text-muted">{asset.notes}</p>
        <p className="font-mono text-[10px] text-text-muted/80">
          exobod/{version}/{asset.file}
        </p>
      </figcaption>
    </figure>
  );
}

export default function VisualSystemPreviewPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-8 sm:px-6 sm:py-10">
      <header className="space-y-3 border-b border-line/60 pb-6">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-accent">
          Preview only · noindex
        </p>
        <h1 className="font-display text-3xl font-semibold text-text-main sm:text-4xl">
          Exobod visual system — draft v3 vs v2
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-text-muted sm:text-base">
          v3 assets under <code className="text-accent-soft">/exobod/v3/</code> push the SpaceX/Tesla
          engineering-credibility direction: dark graphite + controlled <span className="text-accent">#ff7a1a</span>,
          manufacturable mechanisms, phone always readable as the removable brain/face. Nothing here is wired to
          production. Crop rule: <strong className="text-text-main">object-contain</strong> + dark stage padding.
        </p>
      </header>

      <section className="space-y-4">
        <div className="flex flex-wrap items-baseline gap-3">
          <h2 className="font-display text-2xl font-semibold text-text-main">Draft v3 — new iteration</h2>
          <span className="rounded-full border border-accent/50 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-accent">
            Awaiting approval
          </span>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {V3_ASSETS.map((asset) => (
            <AssetCard key={asset.file} asset={asset} version="v3" />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-baseline gap-3">
          <h2 className="font-display text-2xl font-semibold text-text-main">Draft v2 — previous iteration</h2>
          <span className="rounded-full border border-line/70 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-text-muted">
            Reference
          </span>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {V2_ASSETS.map((asset) => (
            <AssetCard key={asset.file} asset={asset} version="v2" />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-2xl font-semibold text-text-main">v3 approval table</h2>
        <p className="max-w-2xl text-sm text-text-muted">
          Per-asset review sheet. Approving a row means it may be wired to its approved placements per{" "}
          <code className="text-accent-soft">ASSET-REGISTRY.md</code> — the live homepage hero, logo, and nav stay
          frozen regardless.
        </p>
        <div className="overflow-x-auto rounded-xl border border-line/60">
          <table className="w-full min-w-[720px] border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-line/60 bg-surface/60 font-mono text-[10px] uppercase tracking-wider text-text-muted">
                <th className="px-3 py-2.5">File</th>
                <th className="px-3 py-2.5">Role</th>
                <th className="px-3 py-2.5">What improved vs v2</th>
                <th className="px-3 py-2.5">Remaining concern</th>
              </tr>
            </thead>
            <tbody>
              {APPROVAL_ROWS.map((row) => (
                <tr key={row.file} className="border-b border-line/40 align-top last:border-b-0">
                  <td className="whitespace-nowrap px-3 py-3 font-mono text-[11px] text-accent-soft">{row.file}</td>
                  <td className="px-3 py-3 text-text-main">{row.role}</td>
                  <td className="px-3 py-3 leading-relaxed text-text-muted">{row.improved}</td>
                  <td className="px-3 py-3 leading-relaxed text-text-muted">{row.concern}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <aside className="rounded-xl border border-line/60 bg-surface-soft/40 p-4 text-sm text-text-muted">
        <p className="font-semibold text-text-main">Approval gate</p>
        <p className="mt-2 leading-relaxed">
          Live homepage hero, logo, and nav stay frozen. All v3 plates are drafts at ~1–1.5K resolution and need
          per-asset user approval (plus upscaling to registry minimums) before Desk One pages, body-family grids, or
          any production marketing surface. Walker remains <strong className="text-text-main">concept</strong>; Desk
          One is the EVT/reservable path.
        </p>
      </aside>
    </div>
  );
}
