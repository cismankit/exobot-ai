# Exobod Release Gate (Preview-First)

Visual and marketing changes are **not done** when the build passes. Production deploys require preview proof and **explicit user approval**. This gate exists to stop autonomous production churn.

Related: [PRODUCT-CONSTITUTION.md](./PRODUCT-CONSTITUTION.md) · [VISUAL-SYSTEM.md](./VISUAL-SYSTEM.md) · [ASSET-REGISTRY.md](./ASSET-REGISTRY.md) · [PAGE-STORYBOARDS.md](./PAGE-STORYBOARDS.md)

---

## 1. Preview-first workflow

1. Implement on a branch; do **not** promote to production.
2. Deploy or run a **preview** (Vercel preview URL or local `:3000` with screenshots).
3. Complete the checklist below.
4. Paste preview URL + screenshots + checklist results for the user.
5. **Wait for explicit approval** (“ship to production” / “promote preview”).
6. Only then promote. If anything visual is wrong, fix on preview — do not “quick fix live.”

**Forbidden:** `vercel --prod` / production promote for marketing/visual work without step 5.

---

## 2. Required screenshots

Capture **before/after** when changing an existing surface; otherwise after is enough.

| Viewport | Width guide | Routes (as applicable) |
|----------|-------------|----------------------|
| Desktop | ≥ 1280px | `/`, changed marketing routes (`/demo`, `/desk-one`, `/customize`, `/trust`, `/pricing`, …) |
| Mobile | ~390px | Same routes, first viewport + primary CTA section |

Name files clearly, e.g. `home-desktop.png`, `home-mobile.png`, `demo-desktop.png`.

---

## 3. Route checklist

For each changed marketing route:

- [ ] Matches storyboard job (or user explicitly waived storyboard)
- [ ] Product hierarchy correct (Walker ≠ Desk One)
- [ ] Concept labels present on concept art
- [ ] No new forbidden claims ([CLAIMS.md](../desk-one/CLAIMS.md) + constitution)
- [ ] Primary CTA works (click → correct target)
- [ ] Secondary CTA works if present
- [ ] No accidental console/auth breakage from shared layout/nav
- [ ] Favicon / OG not accidentally pointing at a wrong or missing file

---

## 4. CTA tests

- [ ] Waitlist / early-access control reachable and labeled honestly
- [ ] Demo CTA opens `/demo` (or agreed target) and controls still drive sim if demo changed
- [ ] No “Buy / Ships today” button unless L4 evidence exists
- [ ] Stripe paths only when intentionally in scope; never fake success

---

## 5. Image duplication / crop checks

Run:

```bash
./scripts/visual-audit.sh
```

Manually verify:

- [ ] Same Walker file not used as multiple “different” products on one page
- [ ] Portrait full-body renders use **contain**, not cover, in product frames
- [ ] No missing `src` / 404 images
- [ ] New assets registered in [ASSET-REGISTRY.md](./ASSET-REGISTRY.md)
- [ ] Poster PNGs with baked copy not introduced as live heroes

---

## 6. Rollback identification

Before promote, record:

| Field | Value |
|-------|--------|
| Preview URL | |
| Git SHA | `git rev-parse HEAD` |
| Previous production SHA | (from Vercel / `git` tag) |
| Rollback action | Redeploy previous SHA / instant rollback in Vercel |

If visual regresses, roll back first; do not layer more experimental heroes on production.

---

## 7. Visual “done” criteria

**Build passing alone is insufficient.** Done means:

1. Preview reviewed at desktop + mobile for affected routes  
2. Constitution + visual system + registry respected  
3. Checklist sections 3–5 complete  
4. User explicitly approved production  
5. Rollback SHA known  

Not done:

- “Tests are green”
- “I improved the hero”
- “Deployed to check”
- “Looks fine on my machine” without mobile shot

---

## 8. Agent behavior

- Read the five `docs/product/*` files before marketing/visual edits.
- Do not change hero, logo, or nav unless the user explicitly asks.
- Do not deploy production from agent initiative.
- Prefer documenting gaps (missing Desk One art) over inventing assets.
