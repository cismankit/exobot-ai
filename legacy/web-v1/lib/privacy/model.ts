/** Privacy model reference — wired into /legal/privacy. */

export const privacyModel = {
  lastUpdated: "June 14, 2026",
  voiceAndCamera: {
    heading: "Voice & camera — local-first defaults",
    summary:
      "The Exobod companion app is designed so expressive voice and vision processing stay on the paired phone by default. Cloud transcription or remote inference is opt-in where offered, never required for core motion or safety controls.",
    bullets: [
      "On-device wake word and short command buffers are processed locally when the companion app is in standard mode.",
      "Camera frames used for expression or gesture features are not uploaded unless you enable a cloud skill that explicitly requires it.",
      "Session logs for debugging can be exported by you; they are not sold or used for advertising.",
      "Institutional buyers may request data processing addenda aligned with GDPR / UK GDPR (see regional compliance notes).",
    ],
  },
  dataCategories: [
    "Contact and configuration details from forms and quotes.",
    "Order, milestone, and manufacturing traceability records.",
    "Optional companion telemetry when you enable diagnostics.",
  ],
  retention:
    "Records are kept as needed for agreements, accounting, safety traceability, and incident follow-up, then deleted or archived per policy.",
  contactEmail: "support@exobod.ai",
} as const;
