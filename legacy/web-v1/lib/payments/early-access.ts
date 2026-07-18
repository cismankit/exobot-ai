/** Desk One founder reservation — crowdfund-style deposit config. */

export const EARLY_ACCESS_PRODUCT = "desk-one" as const;
export const EARLY_ACCESS_SKU = "EXB-D1" as const;

/** Default $99 founder reservation deposit (cents). Override with EARLY_ORDER_PRICE_CENTS. */
export const DEFAULT_EARLY_ORDER_PRICE_CENTS = 9900;

export function earlyOrderPriceCents(): number {
  const raw = process.env.EARLY_ORDER_PRICE_CENTS?.trim();
  if (!raw) return DEFAULT_EARLY_ORDER_PRICE_CENTS;
  const n = Number.parseInt(raw, 10);
  if (!Number.isFinite(n) || n < 50) return DEFAULT_EARLY_ORDER_PRICE_CENTS;
  return n;
}

export function earlyOrderPriceUsd(): number {
  return earlyOrderPriceCents() / 100;
}

export function formatUsdFromCents(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
}

export function siteBaseUrl(request?: Request): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (request) return new URL(request.url).origin;
  return "https://exobod.ai";
}

/** Optional manual Zelle fallback — never treated as confirmed payment. */
export function zelleInstructions(): { email: string; note: string } | null {
  const email =
    process.env.ZELLE_EMAIL?.trim() ||
    process.env.EARLY_ORDER_ZELLE_EMAIL?.trim() ||
    "";
  if (!email) return null;
  return {
    email,
    note: "Manual confirmation required — Zelle is not an automated ecommerce payment. Email support after sending with your name and reservation intent.",
  };
}

export const EARLY_ACCESS_COPY = {
  productName: "Exobod Desk One — Founder reservation",
  productDescription:
    "Refundable $99 reservation deposit for the EXB-D1 Desk One EVT / early-access program. Not a guaranteed ship date. Not a walker or walking robot. See refund & milestone terms.",
  shortLabel: "Founder reservation",
} as const;
