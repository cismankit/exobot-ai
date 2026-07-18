# Exobod Visual System

Source of truth for brand look, logo freeze, color/type/motion, heroes, product visualization, crops, concept labels, accessibility, and forbidden patterns. Read with [PRODUCT-CONSTITUTION.md](./PRODUCT-CONSTITUTION.md) and [ASSET-REGISTRY.md](./ASSET-REGISTRY.md) before changing marketing visuals.

Also see legacy notes in [../BRAND.md](../BRAND.md) — this file supersedes conflicting marketing guidance.

---

## 1. Brand principles

1. **Premium industrial robotics** — cinematic but readable; heavy, functional, manufacturable feel.
2. **Phone as face** — the handset is always readable as the brain/face, not a sticker.
3. **Dark stage, orange signal** — black / near-black, white/off-white, exo-orange. Not purple AI, not cream-serif brochure, not toy pastels.
4. **Concept honesty** — aspirational Walker art is allowed; unlabeled concept art is not.
5. **One composition** — first viewport is brand + one headline + one supporting line + one CTA group + one dominant product image. No dashboard clutter in the hero.
6. **Freeze over churn** — do not regenerate logos, heroes, or nav chrome to “improve” them without an explicit user request.

---

## 2. Original logo freeze

**Frozen until the user explicitly requests a change:**

| Element | Canonical use |
|---------|----------------|
| Live site mark | `apps/web/components/marketing/logo.tsx` → `LogoMark` / `BrandLockup` / `BrandWordmark` |
| Wordmark | `Exobod` + orange `.ai` — capital **E** |
| Raster fallbacks | `apps/web/public/branding/*.png` — OG / legacy only, not nav |

Rules:

- Do not stretch the mark. Size by height; keep aspect.
- Prefer vector React mark over raster lockups in header/footer.
- Do not invent a new glyph, purple mark, or wordmark treatment.
- `docs/BRAND.md` may mention SVG paths that are not present; **do not recreate missing SVGs ad hoc** — ask before adding logo files.

---

## 3. Color, type, motion

### Color (from `packages/ui/src/tokens.css`)

| Token | Hex | Use |
|-------|-----|-----|
| `--bg` | `#0a0b0d` | Page background |
| `--surface` | `#111317` | Panels |
| `--fg` | `#edeff2` | Primary text |
| `--muted` | `#8a9099` | Secondary text |
| `--brand` | `#f26a1b` | Accent, CTAs, wordmark `.ai` |
| `--brand-2` | `#ff8a3d` | Hover / highlight |
| `--signal` | `#3df5a0` | **Live body link / telemetry only** — not marketing hero fill |
| `--danger` | `#ff5a47` | E-stop / errors |

### Type

- Display / body: project Inter / Inter Display stack already in tokens.
- Telemetry / instrument labels: JetBrains Mono via `.telemetry`.
- Do not switch marketing to Inter-on-cream, broadsheet serif, or random Google font pairs.

### Motion

- 2–3 intentional motions max on a marketing viewport (fade/rise of hero copy, gentle image settle).
- Respect `prefers-reduced-motion` (already in tokens).
- Motion explains hierarchy; it does not decorate every card.

---

## 4. Hero rules

1. **Full-bleed or dominant product plane** — product visual carries the story; no inset collage of competing robots.
2. **Budget:** brand lockup (nav), one headline, one short supporting sentence, one CTA group, one dominant image.
3. **No hero overlays:** no floating badges, promo stickers, or stat chips on the product render.
4. **Concept label** required under/near Walker (or any non-shipping body): e.g. `concept render · not final production hardware`.
5. **Do not use baked-in marketing poster images** (copy + icons burned into the PNG) as the live HTML hero — those belong in decks or archive only.
6. **Freeze:** do not swap `/exobot-hero.png` or rewrite hero layout unless the user asks.

---

## 5. Product visualization rules

| Subject | How to show |
|---------|-------------|
| Walker | Concept cinematic; label concept; never imply Desk One |
| Desk One | Desk-scale mount / 2-DOF; real photo or purpose-built render when available; never bipedal Walker art standing in |
| Rover / Utility | Separate assets or clear labeled callouts; no one image for all body types |
| Software demo | Live UI / phone face / telemetry — not a fake hardware photo |
| Prototype proof | Real bench / print / wiring photos; ugly is OK if honest |

---

## 6. Crop and aspect-ratio rules

| Asset class | Framing | Fit mode |
|-------------|---------|----------|
| Full-body Walker (portrait ~0.5–0.7) | Show full body + feet; pad stage if needed | **`object-contain`** |
| Mechanical closeup | Tight on joint / mount; intentional crop OK | contain or cover if purpose-shot for that crop |
| Landscape hero plate (future 16:9 / 3:2) | Edge-to-edge product plane | cover only if shot for that AR |
| Logo mark | Never squash | height-driven `w-auto` |
| Infographic posters | Do not crop into “product photo” slots | avoid in live product frames |

**Hard rule:** Do not apply `object-cover` to registered **portrait full-body product renders** in product/hero slots — it clips limbs and invents a fake crop. Prefer contain + dark stage padding.

---

## 7. Concept labels

Required whenever the asset is not production / EVT photography:

- Visible label near the image: `Concept` or `Concept render · not final production hardware`.
- Alt text must not claim “shipping Exobod” or “Desk One” for Walker art.
- Infographics that say “PREORDER / SHIPS SOON” inside the bitmap are **not** proof of commercial status — treat as concept collateral only.

---

## 8. Accessibility

- Meaningful `alt` that names product + concept/status.
- Contrast: white/orange on dark; do not place muted gray on dark for primary CTA labels.
- Do not rely on color alone for e-stop / danger.
- Decorative gradients must not reduce text contrast.
- Keyboard-reachable CTAs; no image-only “buttons” without accessible names.

---

## 9. Forbidden patterns

- Purple / indigo AI gradients; glow soup; glassmorphism SaaS kits.
- Toy / cartoon robots; cute mascot redesigns without request.
- Wireframe / placeholder robots in production marketing.
- Replacing Desk One with Walker silently.
- Regenerating the same Walker pose “because we need a new hero.”
- Baking headlines into PNGs for the live site when HTML can carry copy.
- Multi-card hero dashboards, pill clusters, stat strips on first viewport.
- Autonomous logo / nav / hero redesigns.
- Deploying visual changes straight to production (see [RELEASE-GATE.md](./RELEASE-GATE.md)).
