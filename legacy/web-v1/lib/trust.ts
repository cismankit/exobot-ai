/** Placeholders until legal/onboarding docs are finalized - replace with real entity details. */
export const companyContact = {
  legalName: "Exobod Labs, Inc.",
  supportEmail: "support@exobod.ai",
  /** Full street address is shared during onboarding and on signed agreements. */
  addressSummary: "United States - full address provided with purchase agreements and NDAs.",
} as const;

export const legalNav = [
  { href: "/legal/terms", label: "Terms of service" },
  { href: "/legal/privacy", label: "Privacy policy" },
  { href: "/legal/safety", label: "Safety & limitations" },
  { href: "/legal/warranty", label: "Warranty (prototype)" },
  { href: "/legal/refund", label: "Refunds & milestones" },
] as const;
