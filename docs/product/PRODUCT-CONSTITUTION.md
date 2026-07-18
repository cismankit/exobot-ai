# Exobod Product Constitution

Source of truth for what Exobod is, who it is for, what we may claim, and what we must never invent in marketing or product UI. Read this before changing marketing copy, product hierarchy, CTAs, or commercial flows.

Related: [VISUAL-SYSTEM.md](./VISUAL-SYSTEM.md) · [ASSET-REGISTRY.md](./ASSET-REGISTRY.md) · [PAGE-STORYBOARDS.md](./PAGE-STORYBOARDS.md) · [RELEASE-GATE.md](./RELEASE-GATE.md) · [../desk-one/CLAIMS.md](../desk-one/CLAIMS.md)

---

## 1. Product promise

**Your phone stays the brain. Exobod becomes the body.**

- The **phone** is the face, camera, mic, AI, and connectivity.
- **Exobod** is the physical robotic body around the phone: mounts, limbs, servos, power, and safety-clamped motion.
- We do not replace the phone’s assistant stack; we give it a body that can move in the world under hard joint limits and an e-stop.

One-line commercial promise for early access: *Reserve or inquire about a real desk-mount body (Desk One) while the flagship Walker remains the aspirational vision.*

---

## 2. Audience

Primary (near-term):

1. **Qualified early-access buyers / builders** — makers, engineers, studios who will reserve or deposit for Desk One / dev kit.
2. **Demo requesters** — people who want to feel the control plane (gaze, clamp, e-stop) before buying.
3. **Partners** — print, manufacturing, education, or platform partners evaluating fit.

Secondary (later):

4. Stripe checkout customers once a shippable SKU + QC gate exist.
5. Companion-app users after pairing / claim flows are real.

Not primary: mass-market “toy robot” shoppers, unattended childcare, medical, or military buyers.

---

## 3. Product hierarchy (locked)

| Tier | Name | Role | Status language |
|------|------|------|-----------------|
| Vision flagship | **Walker** | Aspirational / emotional brand hero | Concept render allowed; must be labeled **concept** |
| First manufacturable / reservable | **EXB-D1 Desk One** | Desk mount, 2-DOF path, builder/EVT kit | Prototype / builder kit / early access — not “ships as finished robot” until evidence |
| Future bodies | **Rover**, **Utility**, other configs | Modular family | Concept or roadmap only until assets + BOM exist |
| Software | Control plane, console, demo, companion | Proves motion + safety story | Demo and sim are real; hardware pairing claims follow evidence |

**Non-negotiable distinction:** Walker is not Desk One. Desk One is not “the whole Exobod dream.” Do not use one image or one sentence to imply they are the same product.

---

## 4. Evidence / claims ladder

Climb only with artifacts. Soft claims need a named evidence path; hard claims need legal + QC.

| Level | Allowed when | Examples |
|-------|----------------|----------|
| **L0 — Vision** | Always, if labeled concept | Walker cinematic render; “future body family” |
| **L1 — Working software** | Tests / demo green | Desk One software demo drives sim; clamp + e-stop story |
| **L2 — Builder / EVT** | BOM + wiring + firmware docs | Order parts, print mount, USB-CDC nod |
| **L3 — Validated hardware** | Logged tests on named serial / EVT id | Joint limits, e-stop timing, phone retention |
| **L4 — Sellable SKU** | Manufacturing + serial registry + QC ship gate + checkout | “Buy / ships / available for purchase” |

Desk One marketing must stay at **L0–L2** until L3+ evidence exists. See [../desk-one/CLAIMS.md](../desk-one/CLAIMS.md).

---

## 5. Commercial goals (priority order)

1. **Qualified early-access inquiries and reservations** (waitlist + clear Desk One path).
2. **Demo requests / completed demos** (prove clamp + e-stop credibility).
3. **Partner conversations** (manufacturing, education, platforms).
4. **Stripe checkout** for deposits / kits when SKU readiness matches L4 (or explicit refundable deposit language at L2 with honesty).

Success is not pageviews of Walker art alone. Every marketing surface should answer: *what can I reserve or request today, and what is still concept?*

---

## 6. Forbidden claims

Do not use these without the matching evidence level (and for Desk One, without updating CLAIMS.md):

- “Ships today,” “order now — delivered,” “buy Desk One” as a fulfilled finished robot.
- “Available for purchase” for finished hardware before L4.
- “Safe for kids,” “unattended,” “inherently safe.”
- “Production-ready” / “customer-ready hardware” for EVT / clone-servo paths.
- “BLE out of the box” while firmware is USB-CDC only.
- “Same as the configurator build” before catalog ↔ BOM ↔ work-order closure.
- Certification claims (CE / FCC / UL) without certificates.
- Implying Desk One **walks**, manipulates like Walker, or is military / medical / childcare grade.
- Using Walker visuals to sell Desk One without an explicit concept / different-product label.

---

## 7. Non-negotiables

1. **Phone = brain/face.** Copy and visuals must keep that split clear.
2. **Safety truth lives in the body.** Joint limits, step clamp, heartbeat, e-stop latch — MCU / ReflexCore only. Marketing may *show* this; it must not invent softer limits.
3. **No autonomous production visual churn.** Agents do not redesign heroes, logos, nav, or swap flagship art without an explicit user request + [RELEASE-GATE.md](./RELEASE-GATE.md).
4. **Preview before production.** No Vercel production deploy of marketing/visual changes without preview URL + user approval.
5. **Honesty over hype.** If removing “concept / prototype / builder / EVT” breaks the sentence, the claim is illegal.
6. **One commercial primary CTA per storyboard section** — waitlist, demo, or partner — not a pile of competing pills.

---

## 8. Change control

- Product hierarchy and forbidden claims change only via explicit user approval.
- Visual placement of assets: [ASSET-REGISTRY.md](./ASSET-REGISTRY.md).
- Page structure intent: [PAGE-STORYBOARDS.md](./PAGE-STORYBOARDS.md).
- Ship checklist: [RELEASE-GATE.md](./RELEASE-GATE.md).
