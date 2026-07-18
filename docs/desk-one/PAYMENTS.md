# Desk One — Early-access payments (Stripe)

Live site stack: **`legacy/web-v1`** (exobod.ai on Vercel).

## What buyers pay for

| Item | Value |
|------|--------|
| Product | EXB-D1 Desk One founder reservation |
| Default amount | **$99** (`EARLY_ORDER_PRICE_CENTS=9900`) |
| Mode | Stripe Checkout `mode=payment` (one-time deposit) |
| Not included | Guaranteed ship date, finished retail SKU, walker promises |

Copy and legal: reservation / deposit for the EVT program. Link: `/legal/refund`.

## Why Stripe (not Zelle) as primary

- **Receipts, refunds, disputes, and webhooks** are first-class — critical for crowdfund-style deposits.
- Card checkout works for most buyers without sharing bank details in chat.
- Webhook `checkout.session.completed` marks orders paid without faking success in the UI.
- **Zelle has no ecommerce API** — it can only be a manual fallback (human confirmation). Prefer Stripe.

## Environment variables

Set these on the Vercel project **`exobot.ai`** (Production + Preview as needed):

| Variable | Required | Notes |
|----------|----------|--------|
| `STRIPE_SECRET_KEY` | Yes for live checkout | `sk_test_…` or `sk_live_…` (restricted key `rk_` also fine) |
| `STRIPE_WEBHOOK_SECRET` | Yes in production | `whsec_…` from Stripe webhook endpoint |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Optional | Not required for hosted Checkout redirect |
| `NEXT_PUBLIC_SITE_URL` | Recommended | e.g. `https://exobod.ai` (success/cancel URLs) |
| `EARLY_ORDER_PRICE_CENTS` | Optional | Default `9900` ($99) |
| `ZELLE_EMAIL` or `EARLY_ORDER_ZELLE_EMAIL` | Optional | Shows manual Zelle fallback + warning |
| `ADMIN_SECRET` | For admin list | Bearer token for `/admin/early-orders` |

If `STRIPE_SECRET_KEY` is missing, `/desk-one` shows **Payments opening soon** + waitlist (no fake success).

### Vercel dashboard

1. Project → Settings → Environment Variables  
2. Paste Stripe keys for Production (and Preview if you test there)  
3. Redeploy after adding secrets  

### Stripe Dashboard webhook

1. Developers → Webhooks → Add endpoint  
2. URL: `https://exobod.ai/api/webhooks/stripe`  
3. Events: `checkout.session.completed`, `checkout.session.expired`  
4. Copy signing secret → `STRIPE_WEBHOOK_SECRET`

## Routes

| Method | Path | Purpose |
|--------|------|---------|
| GET/POST | `/api/checkout/early-access` | Status / create Checkout Session |
| POST | `/api/webhooks/stripe` | Verify signature, mark order paid |
| GET | `/api/admin/early-orders` | List orders (`Authorization: Bearer ADMIN_SECRET`) |
| Page | `/desk-one` | Product CTA |
| Page | `/early-access` | Redirects to `/desk-one` |
| Page | `/early-access/success` | Thank-you + next steps |
| Admin | `/admin/early-orders` | Paid/pending table |

Store file (gitignored): `legacy/web-v1/data/early-orders.json`.

> **Note:** On Vercel serverless, the local filesystem is ephemeral. Treat the JSON store as best-effort until you move to Blob/KV/Postgres. Stripe remains source of truth for money; export from Stripe Dashboard if the file resets.

## Local test card flow

1. Set `STRIPE_SECRET_KEY=sk_test_…` and `NEXT_PUBLIC_SITE_URL=http://localhost:3000` in `.env.local`.
2. `cd legacy/web-v1 && npm run dev`
3. Open `/desk-one` → Reserve → use Stripe test card `4242 4242 4242 4242`.
4. Forward webhooks: `stripe listen --forward-to localhost:3000/api/webhooks/stripe` and set `STRIPE_WEBHOOK_SECRET` from the CLI.
5. Confirm `/early-access/success` and `/admin/early-orders` show `paid`.

## Enable live payments checklist

- [ ] Stripe account activated for live charges  
- [ ] `STRIPE_SECRET_KEY` (live) on Vercel Production  
- [ ] Webhook endpoint on production URL + `STRIPE_WEBHOOK_SECRET`  
- [ ] `NEXT_PUBLIC_SITE_URL=https://exobod.ai`  
- [ ] Redeploy  
- [ ] One real or live-test purchase + refund smoke test  

## Related docs

- [CLAIMS.md](./CLAIMS.md) — forbidden marketing claims  
- [README.md](./README.md) — what Desk One is / is not  
