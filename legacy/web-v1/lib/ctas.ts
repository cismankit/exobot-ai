/** Site-wide CTAs — keep labels and destinations identical everywhere. */
export const primaryCta = {
  href: "/desk-one#reserve",
  label: "Reserve Desk One",
} as const;

export const secondaryCta = {
  href: "/customize",
  label: "Design My Exobod",
} as const;

/** Legacy order-inquiry form (not a nav item). */
export const orderInquiryCta = {
  href: "/preorder",
  label: "Start Order Inquiry",
} as const;

/** Demo / contact — always a working path (Cal when configured, else /demo form). */
export const demoCta = {
  href: "/demo",
  label: "Request a demo",
} as const;
