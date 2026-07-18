# Desk One — Early-access payments (Stripe)

Live site stack: **`legacy/web-v1`** (exobod.ai on Vercel).

## Current status

**Stripe is OFF** on production until `STRIPE_SECRET_KEY` is set. Sitewide CTAs say **Join early access** and land on `/desk-one#reserve` with the interest form (no fake $99 checkout).

When Stripe keys are added and the app is redeployed, `isStripeConfigured()` flips on and the same `#reserve` section becomes Stripe Checkout automatically.

## Turn Stripe ON — 3 steps

1. **Add secrets on Vercel** (project `exobot.ai` → Settings → Environment Variables → Production):
   - `STRIPE_SECRET_KEY` = `sk_live_…` (or `sk_test_…` for Preview)
   - `STRIPE_WEBHOOK_SECRET` = `whsec_…` (required in production)
   - Confirm `NEXT_PUBLIC_SITE_URL` = `https://www.exobod.ai` (or `https://exobod.ai`)

2. **Register the webhook in Stripe Dashboard**  
   Developers → Webhooks → Add endpoint  
   - URL: `https://www.exobod.ai/api/webhooks/stripe`  
   - Events: `checkout.session.completed`, `checkout.session.expired`  
   - Copy signing secret → `STRIPE_WEBHOOK_SECRET`

3. **Redeploy** from `legacy/web-v1` (`vercel --prod`).  
   Smoke-test: open `/desk-one#reserve` → checkout should open (not the interest-only waitlist).

## What buyers pay for (when ON)

| Item | Value |
|------|--------|
| Product | EXB-D1 Desk One founder reservation |
| Default amount | **$99** (`EARLY_ORDER_PRICE_CENTS=9900`) |
| Mode | Stripe Checkout `mode=payment` (one-time deposit) |
| Not included | Guaranteed ship date, finished retail SKU, walker promises |

Copy and legal: reservation / deposit for the EVT program. Link: `/legal/refund`.

## Environment variables

| Variable | Required | Notes |
|----------|----------|--------|
| `STRIPE_SECRET_KEY` | Yes for live checkout | `sk_test_…` or `sk_live_…` |
| `STRIPE_WEBHOOK_SECRET` | Yes in production | `whsec_…` from Stripe webhook endpoint |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Success/cancel redirect base |
| `EARLY_ORDER_PRICE_CENTS` | Optional | Default `9900` ($99) |
| `ZELLE_EMAIL` or `EARLY_ORDER_ZELLE_EMAIL` | Optional | Manual Zelle fallback + warning |
| `ADMIN_SECRET` | For admin list | Bearer token for `/admin/early-orders` |

If `STRIPE_SECRET_KEY` is missing, `/desk-one#reserve` shows **early access interest** (working form) — never a broken checkout.

## Routes

| Method | Path | Purpose |
|--------|------|---------|
| GET/POST | `/api/checkout/early-access` | Status / create Checkout Session |
| POST | `/api/webhooks/stripe` | Verify signature, mark order paid |
| GET | `/api/admin/early-orders` | List orders (`Authorization: Bearer ADMIN_SECRET`) |
| Page | `/desk-one#reserve` | Product CTA (form or Stripe) |
| Page | `/early-access` | Redirects to `/desk-one` |
| Page | `/early-access/success` | Thank-you + next steps |
| Admin | `/admin/early-orders` | Paid/pending table |

Store file (gitignored): `legacy/web-v1/data/early-orders.json`.

> **Note:** On Vercel serverless, the local filesystem is ephemeral. Treat the JSON store as best-effort until you move to Blob/KV/Postgres. Stripe remains source of truth for money.

## Local test card flow

1. Set `STRIPE_SECRET_KEY=sk_test_…` and `NEXT_PUBLIC_SITE_URL=http://localhost:3000` in `.env.local`.
2. `cd legacy/web-v1 && npm run dev`
3. Open `/desk-one` → Reserve → use Stripe test card `4242 4242 4242 4242`.
4. Forward webhooks: `stripe listen --forward-to localhost:3000/api/webhooks/stripe` and set `STRIPE_WEBHOOK_SECRET` from the CLI.
5. Confirm `/early-access/success` and `/admin/early-orders` show `paid`.

## Related docs

- [CLAIMS.md](./CLAIMS.md) — forbidden marketing claims  
- [README.md](./README.md) — what Desk One is / is not  
