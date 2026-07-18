/** Honest Desk One (EXB-D1) marketing copy — sourced from docs/desk-one/. */

export const deskOne = {
  sku: "EXB-D1",
  name: "Desk One",
  status: "EVT / early-builder access",
  tagline: "A stationary 2-axis phone dock. Your phone stays the brain.",
  summary:
    "Desk One is a desk-scale pan/tilt phone mount body: ESP32-S3, PCA9685, two metal-gear servos, USB-C power, and a hardware e-stop. It is a builder kit for early engineering units — not a finished retail robot you can buy off a shelf today.",
} as const;

export const deskOneWhatItIs = [
  "Stationary 2-DOF phone dock (pan / yaw + tilt / pitch)",
  "Phone (or laptop REPL) is the brain; this kit is only the body",
  "USB serial NDJSON reflex path shared with the software sim",
  "Hardware e-stop that cuts / latches motion — software cannot clear it",
  "Printed base + cradle geometry for EVT fixtures",
] as const;

export const deskOneWhatItIsNot = [
  "Not a walker, biped, or mobile companion",
  "Not battery-powered in v1 — desk USB-C / 5V PSU power",
  "Not a shipping finished SKU with fulfillment promises",
  "Not BLE out of the box — v0.1 is USB-CDC only",
  "Not certified (CE / FCC / UL) and not “safe for kids / unattended”",
] as const;

export const deskOneSpecs: { label: string; value: string }[] = [
  { label: "SKU", value: "EXB-D1 · Desk One" },
  { label: "Motion", value: "2-axis pan + tilt (metal-gear micro servos)" },
  { label: "MCU", value: "ESP32-S3 DevKit + PCA9685 PWM driver" },
  { label: "Link", value: "USB serial @ 115200 (NDJSON intents)" },
  { label: "Power", value: "USB-C / fixed 5V desk PSU (servo rail)" },
  { label: "Safety", value: "Panel e-stop on servo V+ + software latch sense" },
  { label: "Base target", value: "≈170 × 120 mm printed base, ballasted ≥400 g" },
  { label: "EVT path", value: "MG90S-class servos OK for engineering units" },
  { label: "Planning cost", value: "~$140 for a 1× builder unit (parts, approx.)" },
  { label: "Status", value: "Invent / buy / build — early access, not retail inventory" },
];

export const deskOneFaq: { q: string; a: string }[] = [
  {
    q: "Can I buy a finished Desk One today?",
    a: "No. Desk One is an EVT / early-builder kit path, not a fulfilled retail SKU. You can reserve or inquire for early access; there is no fake inventory or “ships today” promise.",
  },
  {
    q: "Is Desk One a walking robot?",
    a: "No. It is a stationary desk mount with two degrees of freedom (pan and tilt). It is not a walker, biped, rover, or battery-powered mobile body.",
  },
  {
    q: "Where does the AI run?",
    a: "On your phone (or a laptop REPL during bench work). Desk One is the body and USB reflex path only — not a Jetson or Pi brain on the desk.",
  },
  {
    q: "Does it pair over Bluetooth?",
    a: "Not in v0.1. Early firmware is USB-CDC only. BLE pairing is a later milestone, not something we claim out of the box.",
  },
  {
    q: "What does early access mean?",
    a: "Join the early-access interest list today. When card checkout is live, a refundable founder reservation deposit will be available via Stripe. Either path is for the builder / EVT program — not a ship date. Production work orders, serial registry, and companion-app claim flows are not promised until those systems exist and pass QC.",
  },
  {
    q: "How do I configure a desk build?",
    a: "Use Customize with the Desk Assistant body type for configuration and order inquiry, or start an early-access inquiry from this page. Scope locks only after human review — not checkout.",
  },
];
