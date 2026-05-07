import { buildControlPath, buildMechanicalStack } from "@/lib/content";

export function ArchitectureDiagram() {
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Control plane</p>
        <p className="text-sm text-text-muted">
          Command direction: handset → transport → MCU → servos. This is the actual electrical/software
          chain for prototype builds - not a marketing diagram.
        </p>
        <ol className="space-y-0 rounded-2xl border border-line/70 bg-surface/60 p-1">
          {buildControlPath.map((item, index) => (
            <li
              key={item.title}
              className="border-b border-line/50 px-4 py-3 last:border-b-0"
            >
              <div className="flex gap-3">
                <span className="mt-0.5 font-mono text-xs text-accent">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="text-sm font-semibold text-text-main">{item.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-text-muted sm:text-sm">{item.description}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Mechanics + power</p>
        <p className="text-sm text-text-muted">
          Load path: mount locks the phone into the printed/metal chassis, joints reactuate limbs, ports
          carry payloads, battery feeds bursts through fused feeds.
        </p>
        <ol className="space-y-0 rounded-2xl border border-line/70 bg-surface/60 p-1">
          {buildMechanicalStack.map((item, index) => (
            <li
              key={item.title}
              className="border-b border-line/50 px-4 py-3 last:border-b-0"
            >
              <div className="flex gap-3">
                <span className="mt-0.5 font-mono text-xs text-accent-soft">
                  M{index + 1}
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-text-main">{item.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-text-muted sm:text-sm">{item.description}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="lg:col-span-2 rounded-2xl border border-dashed border-line/80 bg-surface-soft/40 p-4 text-xs leading-relaxed text-text-muted sm:text-sm">
        <span className="font-semibold text-text-main">Integration note: </span>
        The MCU mounts inside the base or torso pack; servo harnesses exit through strain-relief glands;
        handset cables route through the removable mount so you can pull the brain without disassembling
        limbs. Final harness lengths and connector grades are frozen only after a signed prototype review.
      </div>
    </div>
  );
}
