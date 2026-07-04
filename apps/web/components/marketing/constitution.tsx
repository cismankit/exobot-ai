"use client";

/**
 * The body has a constitution — the safety story, told with the REAL
 * numbers from ReflexCore/firmware: ±80° pan, -30/+45° tilt, ≤25°/command,
 * heartbeat watchdog, estop only a physical hold releases.
 */

import { Reveal } from "./reveal";

export function Constitution() {
  return (
    <section className="border-y border-line bg-surface/40 py-28">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <p className="telemetry text-[12px] uppercase tracking-[0.3em] text-danger">
            the constitution
          </p>
          <h2 className="display mt-4 max-w-3xl text-4xl sm:text-5xl">
            The brain can never out-argue the body.
          </h2>
          <p className="mt-4 max-w-2xl text-muted">
            Models emit intents. Only the MCU touches motors — and it
            validates every intent against limits burned into its firmware.
            Ask for violence and the body answers with restraint.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-4 md:grid-cols-2">
          <Reveal delay={0.05}>
            <div className="rounded-2xl border border-line bg-bg p-6">
              <p className="telemetry text-[11px] uppercase tracking-widest text-muted">
                a violent request
              </p>
              <p className="telemetry mt-3 text-sm text-fg">
                › whip your head around fast
              </p>
              <div className="telemetry mt-4 space-y-1.5 text-[13px]">
                <p className="text-muted">
                  model → {'{"action":"gaze","params":{"pan":200,"tilt":-90}}'}
                </p>
                <p className="text-danger">
                  body → ✓ <b>clamped</b> pose={"{pan:25.0, tilt:-25.0}"}
                </p>
                <p className="text-muted">
                  joint limits ±80° · −30/+45° &nbsp;·&nbsp; step ≤25°/command
                </p>
              </div>
              <p className="mt-4 text-sm text-muted">
                The request was for 200°. The body gave it 25 — per command,
                toward a limit it will never cross. Whip protection isn&apos;t a
                setting; it&apos;s the physics of the firmware.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="rounded-2xl border border-danger/40 bg-bg p-6">
              <p className="telemetry text-[11px] uppercase tracking-widest text-danger">
                the last word
              </p>
              <p className="telemetry mt-3 text-sm text-fg">› emergency stop</p>
              <div className="telemetry mt-4 space-y-1.5 text-[13px]">
                <p className="text-danger">body → estop latched · motion neutralized</p>
                <p className="text-muted">› look right</p>
                <p className="text-danger">
                  body → ✗ estopped — motion locked
                </p>
              </div>
              <p className="mt-4 text-sm text-muted">
                Software can trigger the stop. Only a physical two-second
                button hold can release it. If the brain goes silent for one
                second, the heartbeat watchdog neutralizes all motion anyway.
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.15}>
          <p className="telemetry mt-10 text-center text-[12px] text-muted">
            identical limits in the simulator and the ESP32 firmware — what you
            validate in sim is what ships in silicon. tested: 20/20.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
