/** Site-wide CTAs — keep labels identical everywhere they appear.
 *  When Stripe is live, desk-one#reserve flips to Checkout; these labels stay
 *  honest ("early access") so we never advertise a fake $99 checkout sitewide.
 */
export const primaryCta = {
  href: "/desk-one#reserve",
  label: "Join early access",
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
