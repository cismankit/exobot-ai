# Exobod Asset Registry

Inventory of current image assets, duplicate detection, placement rules, and the missing purpose-built shot list. Inspected from `legacy/web-v1/public` and `apps/web/public` (2026-07-18). Update this file when adding or retiring assets.

Related: [VISUAL-SYSTEM.md](./VISUAL-SYSTEM.md) · [PRODUCT-CONSTITUTION.md](./PRODUCT-CONSTITUTION.md)

---

## 1. Registry table

Dimensions from file headers. Quality is editorial judgment for marketing reuse.

| Asset path | W×H / AR | Subject | Quality | Approved placements | Prohibited placements | Crop rule | Concept status |
|------------|----------|---------|---------|---------------------|------------------------|-----------|----------------|
| `apps/web/public/exobot-hero.png` | 559×872 / **0.641** | Walker full-body, clean studio, no poster copy | Best current live hero | Homepage hero (labeled concept); vision sections | Desk One product proof; “ships now”; OG if copy needs landscape | Full body visible; **contain**; no `object-cover` | **Concept** |
| `apps/web/public/hero.png` | 819×1024 / **0.800** | Walker + baked marketing poster (copy/icons) | Poster / deck only | OG fallback temporary; archive | Live HTML hero; Desk One; body-type cards | Do not crop into product slot | **Concept** (baked copy) |
| `legacy/web-v1/public/exobod/hero.png` | 819×1024 / **0.800** | Same bytes as `apps/web/public/hero.png` | Duplicate poster | Legacy site only | New apps/web surfaces | Same as hero.png | **Concept** |
| `legacy/web-v1/public/exobod/hero-robot.png` | 476×983 / **0.484** | Walker full-body, tall crop; partial poster remnants | Strong tall product plate | Legacy product hub; story steps needing body | Desk One; landscape banners; cover-crop squares | Full body; **contain**; pad sides | **Concept** |
| `legacy/web-v1/public/exobod/story/step-1.png` | 819×1024 / **0.800** | **Byte-identical** to `hero.png` | Duplicate of poster | None new — retire reference | Any “new” story beat | n/a | **Concept** duplicate |
| `legacy/web-v1/public/exobod/story/step-2.png` | 819×1024 / **0.800** | Alternate Walker Mk1 poster + modular kit strip | Deck / archive | Legacy scroll story only | Live hero; Desk One; as unique body types | Do not use as photo | **Concept** poster |
| `legacy/web-v1/public/exobod/story/step-3.png` | 819×1024 / **0.800** | Family poster: Walker + desk + rover thumbnails + app UI + “PREORDER” | Useful as **family roadmap reference**, not live CTA art | Internal storyboards / pitch | Live preorder proof; hero | Do not crop out unlabeled Desk/Rover thumbs as “product photos” | **Concept** poster |
| `legacy/web-v1/public/exobod/story/step-4.png` | 819×1024 / **0.800** | Spec-sheet poster: Walker + anatomy insets | Deck / trust education (concept) | Legacy story; pitch | Live Desk One evidence; certification | Insets not separable assets | **Concept** poster |
| `apps/web/public/branding/logo-mark.png` | 546×766 / **0.713** | Raster mark / lockup art | Legacy raster | Avoid in UI; archive | Nav (use React vector) | No stretch | Brand |
| `apps/web/public/branding/logo-mark-light.png` | 944×358 / **2.637** | Horizontal lockup (robot + wordmark) | Legacy / OG | OG / external embeds if needed | Square favicon slots; stretched nav | Cover-left only in wide lockup slots | Brand |
| `apps/web/public/branding/logo-mark-transparent.png` | 944×358 / **2.637** | **Byte-identical** to logo-mark-light | Duplicate filename | None — prefer one path | Treating as different asset | Same | Brand duplicate |
| `apps/web/public/branding/wordmark-art-light.png` | 329×80 / **4.112** | Wordmark art | Fallback | Rare embeds | Replacing live wordmark component | No stretch | Brand |
| `legacy/web-v1/public/branding/*` | same as apps/web | Copies of branding set | Duplicated tree | Legacy only | New work should use `apps/web` or React logo | Same | Brand duplicates |

**Live site usage note (apps/web):** hero uses `/exobot-hero.png`; Open Graph uses `/hero.png` (poster). That OG choice should be revisited when a clean landscape plate exists — do not “fix” by regenerating Walker in-session without request.

---

## 2. Duplicates and repeated robot image

### Exact byte duplicates (SHA-256)

| Hash prefix | Paths |
|-------------|-------|
| `0d5ae1ba10a7` | `legacy/.../exobod/hero.png` ≡ `legacy/.../story/step-1.png` ≡ `apps/web/public/hero.png` |
| `307c28c59c3c` | `logo-mark-light.png` ≡ `logo-mark-transparent.png` (both trees) |
| `bdd8f73db0bf` | `logo-mark.png` (legacy ≡ apps/web) |
| `335651eccce4` | `wordmark-art-light.png` (legacy ≡ apps/web) |

### Same subject, different files (visual churn risk)

All of the following are **Walker / Phone ExoBot concept** variants of one idea:

- `exobot-hero.png` (clean)
- `hero-robot.png` (taller crop)
- `hero.png` / `step-1.png` (poster)
- `step-2.png`, `step-3.png`, `step-4.png` (poster variants)

**Problem:** Story, body-type selector, and hub sections in legacy reuse `hero-robot` and the same Walker for multiple “different” body types (e.g. step-3 reused for multiple selector entries). That trains agents to treat one robot as every SKU.

**Rule:** One Walker plate may appear once per page as vision; Desk / Rover / Utility need distinct assets or labeled placeholders — never silent reuse.

---

## 3. Current asset problems (summary)

1. **No Desk One purpose-built render or photo** in public assets.
2. **Walker overused** as stand-in for the whole product line.
3. **Poster PNGs bake copy** (including aggressive commercial lines) — unsafe for live HTML and claims control.
4. **Duplicate trees** between `legacy/web-v1/public` and `apps/web/public`.
5. **Identical light/transparent logo files** — naming lie.
6. **Portrait heroes in cover-prone layouts** historically risk limb clipping (`object-cover` must not return on full-body plates).
7. **BRAND.md references SVG mark/lockup files** that are not present under public branding folders — do not invent replacements silently.
8. **No Rover, Utility, CAD, companion-app, or prototype-proof** dedicated stills in repo public dirs.

---

## 4. Missing purpose-built shot list

Produce these before major marketing redesigns. Until then, do not fake them with Walker crops.

| ID | Shot | Purpose | Target AR | Min dimensions | Notes |
|----|------|---------|-----------|----------------|-------|
| S1 | **Homepage hero** | Clean product plane for `/` | **3:4** portrait or **4:5**; optional alt **16:9** landscape plate | Portrait ≥ **1600×2133**; landscape ≥ **2400×1350** | Full Walker or approved hero subject; **no baked copy**; dark studio; concept label in HTML |
| S2 | **Full Walker** | Vision / trust / manifesto | **2:3** or **9:16** full body | ≥ **1600×2400** | Feet visible; transparent or seamless dark ground |
| S3 | **Mechanical closeup** | Credibility / industrial detail | **1:1** and **3:2** | ≥ **1600×1600** and ≥ **1800×1200** | Joint, fasteners, phone cradle — not a face crop of Walker only |
| S4 | **Desk One real render** | `/desk-one`, customize, commercial | **4:3** desk scene + **1:1** product | ≥ **2000×1500** and ≥ **1600×1600** | Desk mount scale obvious; **not bipedal**; EVT-honest materials OK |
| S5 | **Rover** | Body family | **4:3** | ≥ **1800×1350** | Distinct wheeled base; labeled concept until real |
| S6 | **Utility** | Body family | **4:3** | ≥ **1800×1350** | Distinct payload / helper config |
| S7 | **Build / CAD** | Trust / manufacturing | **16:9** | ≥ **1920×1080** | CAD or print farm / assembly — documentary |
| S8 | **Companion app** | Product software story | **9:19.5** phone UI ± device frame **3:4** | UI ≥ **1170×2532**; framed ≥ **1200×1600** | Real UI or approved mock; no fake store ratings |
| S9 | **Prototype proof** | Trust / Desk One honesty | **3:2** photo | ≥ **1800×1200** | Real bench, wiring, print — may be imperfect |

Register new files in this table when they land under `apps/web/public/` (prefer a single tree; avoid re-copying into legacy).

---

## 5. Draft v2 asset package (2026-07-18)

Purpose-built plates under `legacy/web-v1/public/exobod/v2/`. **Status: draft — user approval required before any homepage / live marketing wiring.** Preview-only review surface: `/preview/visual-system` (not in public nav; `noindex`).

Crop default for all product-body plates: **`object-contain`** on dark stage (`#0a0b0d` / `#050709`) with padding so limbs/feet/wheels stay visible. Do **not** use `object-cover` on full-body or Desk One plates.

| File | W×H / AR | Shot ID | Subject | Concept status | Approved placements (after user OK) | Prohibited until approved | Crop / padding |
|------|----------|---------|---------|----------------|-------------------------------------|---------------------------|----------------|
| `exobod/v2/desk-one-hero.png` | 1024×1536 / **3:4** | S4 | Stationary 2-axis phone dock; desk-scale; phone as face | **Draft concept / EVT-honest render** — not shipping photo | `/desk-one` hero; customize Desk One; body family Desk tile | Homepage Walker hero; biped slots; unlabeled “ships now” | Full mount + clamp visible; **contain**; pad sides |
| `exobod/v2/walker-fullbody.png` | 1024×1536 / **3:4** | S2 | Full biped Walker, head-to-feet | **Concept** | Vision / manifesto / trust concept plate; optional future S1 if approved | Desk One commercial; body-type stand-in for Desk/Rover/Utility | Full body + feet; **contain**; pad stage |
| `exobod/v2/walker-detail.png` | 1024×1024 / **1:1** | S3 | Shoulder / joint / phone-mount closeup | **Concept** | Credibility / industrial detail sections | As full product hero; as Desk One | Intentional tight crop OK; contain in square frame |
| `exobod/v2/rover.png` | 1024×1536 / **3:4** | S5 | Wheeled / tracked phone embodiment | **Concept** | Body family Rover tile only | Desk One; Walker hero | Full chassis + wheels; **contain** |
| `exobod/v2/utility.png` | 1024×1536 / **3:4** | S6 | Utility / payload frame concept | **Concept** | Body family Utility tile only | Desk One; Walker hero | Full frame + payload; **contain** |
| `exobod/v2/build-cad.png` | 1536×1024 / **3:2** | S7 | Parts / PCB / servos BOM aesthetic | **Draft documentary** (has part labels in bitmap — not certification) | Trust / manufacturing / Desk One “what’s included” | Fake cert badges; live hero; “UL/CE approved” claims | Landscape contain; do not crop out honesty of parts layout |
| `exobod/v2/companion-app.png` | 1024×1536 / **3:4** | S8 | Phone face UI + listening waveform | **Concept UI mock** | Software / companion / demo story | Fake store ratings; hardware proof | Phone + UI readable; **contain** |
| `exobod/v2/prototype-proof.png` | 1536×1024 / **3:2** | S9 | Bench prototype (ESP32 / servos / dock) | **Draft EVT honesty** (generated documentary look — prefer real photo when available) | Trust / Desk One honesty sections | Polished “finished product” hero | Landscape contain; imperfect bench OK |

**Resolution note:** Current files are draft resolution (~1K–1.5K). Registry min targets (e.g. 1600×2133) are not yet met — upscale or regenerate before production marketing if approved.

**Hard separation:** Never reuse `walker-fullbody` / `walker-detail` for Desk One. Never reuse `desk-one-hero` as Walker vision. Rover ≠ Utility ≠ Desk One.

**Missing-shot checklist status:** S2–S9 have draft v2 plates; S1 homepage hero remains frozen on live `exobot-hero.png` until explicit user request.

---

## 6. Placement quick reference

| Need | Use now | Do not use |
|------|---------|------------|
| Live homepage hero | `exobot-hero.png` + concept caption | `hero.png` poster; **v2 drafts until approved** |
| Desk One commercial | Placeholder / demo UI; **or** `v2/desk-one-hero.png` only after user approval | Walker full-body |
| Body family grid | `v2` Desk / Rover / Utility / Walker after approval; else labeled placeholders | Same `hero-robot` four times |
| Logo in nav | React `BrandLockup` | Raster `logo-mark*.png` squashed |
| OG image | Temporary `hero.png` or future S1 landscape | Unlabeled concept as “product photo” |
| Asset review | `/preview/visual-system` (legacy web-v1) | Linking preview from public nav |

---

## 7. Audit helper

Run read-only checks:

```bash
./scripts/visual-audit.sh
```
