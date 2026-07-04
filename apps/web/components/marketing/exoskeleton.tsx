"use client";

/**
 * The exoskeleton — what the platform actually sells: a modular body for
 * the phone, and the app/console that operates it. Copy stays inside what
 * the stack really does: intents the firmware accepts (gaze, nod, shake,
 * wave, point, drive, face, led, speak), the companion app's BLE pairing +
 * estop, the USB-C/serial + WiFi transports, and on-device AI via Ollama.
 */

import { Cable, Cpu, Hand, Move3d, ScanFace, Smartphone } from "lucide-react";
import { Reveal } from "./reveal";

const PARTS = [
  {
    icon: ScanFace,
    title: "AI-powered face",
    d: "Your phone's screen is the face — eyes, expressions, and speech driven by the persona. Real-time camera + mic feed the perception loop.",
  },
  {
    icon: Move3d,
    title: "Articulated frame",
    d: "3D-printable chassis: gimbal for gaze, nod and shake; arm joints for wave and point. Every joint obeys the firmware's limits, not the model's mood.",
  },
  {
    icon: Hand,
    title: "Gesture set, growing",
    d: "gaze · nod · shake · wave · point · drive · face · led · speak — the intent vocabulary the MCU validates today. New parts extend it.",
  },
  {
    icon: Cable,
    title: "Plug and play",
    d: "Dock the phone on USB-C and it drives the body over serial; or pair over BLE/WiFi with the companion app. Same NDJSON protocol either way.",
  },
  {
    icon: Cpu,
    title: "Phone as the CPU",
    d: "AI runs on the phone — local models via Ollama work fully offline; cloud minds join in when you add keys. No compute subscription required.",
  },
  {
    icon: Smartphone,
    title: "The app is the cockpit",
    d: "Pairing, connectivity, estop, and per-body function configuration live in the app and this console. You decide what the body may do.",
  },
];

export function ExoskeletonSection() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-28">
      <Reveal>
        <p className="telemetry text-[12px] uppercase tracking-[0.3em] text-signal">
          the exoskeleton
        </p>
        <h2 className="display mt-4 max-w-3xl text-4xl sm:text-5xl">
          A modular body. Your phone is the brain.
        </h2>
        <p className="mt-4 max-w-2xl text-muted">
          We build the body parts and the platform that operates them. You
          dock the phone, pick the functions, and drive it by voice, by text,
          or by what the camera sees.
        </p>
      </Reveal>

      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PARTS.map((p, i) => (
          <Reveal key={p.title} delay={i * 0.05}>
            <div className="h-full rounded-2xl border border-line bg-surface p-6">
              <p.icon className="h-5 w-5 text-signal" aria-hidden />
              <h3 className="display mt-4 text-xl">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{p.d}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
