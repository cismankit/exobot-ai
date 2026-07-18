import { cn } from "@/lib/utils";
import Image from "next/image";

const story = [
  {
    step: "01",
    title: "Choose your body",
    copy: "Start with Desk One, the stationary pan/tilt EVT path, or brief us on a Walker, Rover, or Utility concept. The body choice determines the frame, actuator plan, safety limits, and what we can honestly prototype.",
    image: "/exobod/story/step-1.png",
    detail: "Desk One available · other bodies by engineering review",
  },
  {
    step: "02",
    title: "Mount your phone core",
    copy: "Your iPhone or Android stays visible and removable. It supplies the screen, camera, microphone, connectivity, and assistant stack while a fitted core secures it to the motion hardware.",
    image: "/exobod/story/step-2.png",
    detail: "Removable core · cable routing confirmed at intake",
  },
  {
    step: "03",
    title: "Tune motion behavior",
    copy: "Desk One supports calibrated two-axis pan and tilt today, with speed limits and a manual stop in the control loop. Gaits, wheels, arms, and broader skill packs remain configuration-specific engineering work—not implied features.",
    image: "/exobod/hero-robot.png",
    detail: "Desk One: 2-axis pan/tilt · broader motion is concept scope",
  },
  {
    step: "04",
    title: "Order with confidence",
    copy: "Reserve Desk One interest or submit a guided build request. We review phone fit, use case, timeline, milestones, and acceptance criteria in writing before major funds move.",
    image: "/exobod/story/step-4.png",
    detail: "Human review · written scope · milestone plan",
  },
];

export function AppleScrollShowcase() {
  return (
    <section className="relative overflow-hidden border-y border-line/40 bg-[#050709] py-14 sm:py-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_75%_15%,rgba(255,122,26,0.09),transparent_42%)]" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-9 max-w-2xl sm:mb-12">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.28em] text-accent">How it works</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-text-main sm:text-5xl">
            From the phone you own to motion you can verify.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-text-muted sm:text-lg">
            Four concrete decisions turn a handset into a scoped Exobod build. Every step shows what exists now and what still requires engineering.
          </p>
        </div>

        <div className="space-y-6 sm:space-y-8">
          {story.map((item, idx) => (
            <article
              key={item.step}
              className="grid overflow-hidden rounded-3xl border border-white/[0.09] bg-[#0a0e13] shadow-[0_28px_90px_rgba(0,0,0,0.38)] lg:grid-cols-2"
            >
              <div
                className={cn(
                  "relative aspect-[3/4] min-h-[360px] sm:min-h-[480px] lg:aspect-auto lg:min-h-[520px]",
                  idx % 2 === 1 && "lg:order-2",
                )}
              >
                <div className="absolute inset-0 p-5 sm:p-8">
                  <div className="relative h-full w-full">
                    <Image
                      src={item.image}
                      alt={`Exobod concept visual for ${item.title}`}
                      fill
                      className="object-contain object-center"
                      sizes="(max-width: 1024px) 100vw, 576px"
                      priority={idx === 0}
                    />
                  </div>
                </div>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050709]/80 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#0a0e13]/25" />
                <span className="absolute bottom-4 left-4 rounded-full border border-white/15 bg-black/65 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-white/75 backdrop-blur">
                  Concept visualization · geometry may differ
                </span>
              </div>
              <div className="flex min-h-[300px] flex-col justify-center p-6 sm:p-10 lg:p-12">
                <p className="font-mono text-xs font-semibold tracking-[0.28em] text-accent">{item.step}</p>
                <h3 className="mt-4 font-display text-3xl font-semibold tracking-tight text-text-main sm:text-4xl">
                  {item.title}
                </h3>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-text-muted">{item.copy}</p>
                <div className="mt-7 border-t border-white/10 pt-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.17em] text-accent-soft">{item.detail}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
