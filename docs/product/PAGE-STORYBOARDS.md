# Exobod Page Storyboards

Intentional section plans for key marketing routes. **Do not implement or redesign pages from this file alone** — this is the future-state brief so agents stop inventing sections. Align builds with [PRODUCT-CONSTITUTION.md](./PRODUCT-CONSTITUTION.md), [VISUAL-SYSTEM.md](./VISUAL-SYSTEM.md), and [ASSET-REGISTRY.md](./ASSET-REGISTRY.md), then pass [RELEASE-GATE.md](./RELEASE-GATE.md).

Routes that do not exist yet (`/desk-one`, `/customize`, `/trust`) are planned here; ship only when requested.

---

## Global rules for all pages

- One job per section: visitor question → evidence → asset role → one CTA → copy objective.
- Walker art = vision / emotion only, always labeled concept.
- Desk One = reservable / demoable near-term product story.
- Remove from future plans: multi-stat hero strips, fake testimonials, certification badges without certificates, “ships soon” baked into images, duplicate Walker grids posing as body types, purple AI decoration, wireframe placeholders as final art.

---

## `/` — Homepage

**Job:** Make the promise clear in one viewport, then route to demo or early access without selling Walker as Desk One.

| Section | Visitor question | Required evidence | Approved asset role | CTA | Copy objective |
|---------|------------------|-------------------|---------------------|-----|----------------|
| **Hero** | What is Exobod? | Clear phone=brain / body=Exobod split | S1 or current `exobot-hero.png` as **concept Walker** | Primary: waitlist / early access · Secondary: Desk One demo | Brand-first; one headline; concept labeled |
| **Product hierarchy** | What can I get now vs later? | Explicit Desk One vs Walker | Text + optional family diagram; **no** Walker-as-Desk photo | Link to `/desk-one` (when live) | Name EXB-D1 as first reservable body |
| **Proof of motion** | Does anything actually move safely? | Demo / clamp / e-stop story | Live demo embed or link; telemetry aesthetic | Drive demo `/demo` | Software truth without fake hardware claims |
| **Early access** | How do I raise my hand? | Waitlist / deposit honesty | Form UI only | Submit waitlist / deposit | Qualified inquiry, not fake “buy robot” |

**Do not plan on `/`:** long feature icon grids, four identical Walkers as “configurations,” manifesto essays above the fold, partner logo walls without partners.

---

## `/desk-one` — EXB-D1

**Job:** Convert builders/buyers who want the first manufacturable desk product.

| Section | Visitor question | Required evidence | Approved asset role | CTA | Copy objective |
|---------|------------------|-------------------|---------------------|-----|----------------|
| **Hero** | What is Desk One physically? | Desk-scale mount, 2-DOF honesty | **S4 Desk One render/photo only** | Reserve / waitlist | Not a walker; builder/EVT-accurate |
| **What’s included** | What am I actually getting? | BOM-aligned list | Simple diagram or CAD still (S7) | Download BOM / docs | Kit vs finished SKU clarity |
| **Safety story** | Will it whip / hurt? | Clamp + e-stop + limits language | Demo clip or console still | Try `/demo` | Constitution in plain words |
| **Compatibility** | Will my phone fit? | Matrix when evidenced; else “validating” | Text table; no fake checkmarks | Inquire / waitlist | No unverified model claims |
| **Commercial** | How do I reserve? | Waitlist / Stripe deposit rules | Form | Reserve | Match [CLAIMS.md](../desk-one/CLAIMS.md) |

**Do not plan:** bipedal hero, “ships tomorrow,” BLE pairing screenshots if USB-only, certification marks.

---

## `/customize` — Configurator

**Job:** Let visitors express a build intent that feeds waitlist / quote — not a closed-loop factory promise until pipeline is real.

| Section | Visitor question | Required evidence | Approved asset role | CTA | Copy objective |
|---------|------------------|-------------------|---------------------|-----|----------------|
| **Canvas** | What am I configuring? | Live preview of **selected** body | Desk One first; Walker only if labeled concept option | — | Preview ≠ manufactured twin |
| **Options** | What choices matter? | Body / finish / accessories that exist in catalog rules | UI controls; S4–S6 when ready | — | Disable or mark “concept” for unavailable SKUs |
| **Warnings** | Will this build ship as shown? | Honesty banner | Text | — | Configurator ≠ work order until linked |
| **Capture** | How do I save this? | Lead payload / waitlist with config id | Form | Join waitlist with this build | Qualified config-backed inquiry |

**Do not plan:** silent default to Walker, “add to cart ships in 2 weeks,” fake AR without assets.

---

## `/demo` — Desk One software demo

**Job:** Prove the control plane: gaze / nod / wave / clamp / e-stop on the real sim path.

| Section | Visitor question | Required evidence | Approved asset role | CTA | Copy objective |
|---------|------------------|-------------------|---------------------|-----|----------------|
| **Intro** | What am I driving? | Desk One software demo framing | Phone-face UI / sim viz — not Walker hero | — | This is motion software + safety |
| **Controls** | Can I feel clamp + e-stop? | Working buttons → sim | Interactive demo component | Run actions | Credibility through action |
| **Readout** | Did the body refuse unsafe motion? | Telemetry / clamp feedback | Instrument UI | — | Safety is in the body |
| **Next step** | What do I do after? | Path to waitlist or Desk One | Link buttons | Waitlist · Desk One · Pricing | Convert belief → inquiry |

**Do not plan:** claiming BLE hardware in the room, “1:1 with your serial” without hash evidence, replacing demo with a marketing video loop only.

---

## `/trust` — Evidence & honesty

**Job:** Earn skepticism: what is real, what is concept, what is forbidden until proven.

| Section | Visitor question | Required evidence | Approved asset role | CTA | Copy objective |
|---------|------------------|-------------------|---------------------|-----|----------------|
| **Split reality** | What is vision vs product? | Walker concept vs Desk One EVT | S2 labeled + S4 / S9 | — | Hierarchy in one glance |
| **Software proof** | What is tested? | Test counts / demo link | Console / CI summary as text | Open demo | Working control plane |
| **Hardware proof** | What exists on the bench? | Photos, BOM, wiring, firmware docs | **S9 prototype proof**, S7 CAD | Read Desk One docs | Builder honesty |
| **Claims ledger** | What won’t you say? | Forbidden list | Link CLAIMS.md summary | Contact / partner | Trust through restraint |
| **Partner / press** | How do we talk? | Contact path | — | Partner inquiry | No fake logos |

**Do not plan:** award badges, fake SOC2, stock “happy customer” photos, unlabeled concept as “our shipping robot.”

---

## Section backlog — explicitly dropped

Do not add these in future marketing passes unless the user reopens them with evidence:

- Hero stat strips (“20 DOF”, “AI-powered”, fake metrics)
- Body-type carousels that reuse one Walker image
- Baked-in poster CTAs (“PREORDER NOW / SHIPS SOON”) as page content
- Multi-model federation deep-dives above commercial clarity
- Decorative 3D wireframes as final product art
- Kids / unattended safety narratives
