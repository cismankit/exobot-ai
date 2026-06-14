# Exobod.ai 100-Step Roadmap

Complete checklist organized by phase. Each step is one shippable increment.

---

## Phase A: Ops foundation (1–12)

Stop the bleeding — make leads operable.

- [ ] **1.** Wire interest persistence to Postgres (Supabase/Neon) — every submission becomes a durable `lead` record with timestamp + source page.
- [ ] **2.** Send instant transactional email to submitter (Resend/Postmark): "We received your build request" + configuration summary.
- [ ] **3.** Slack/email alert to `#build-desk` on every new lead with deep link to admin record.
- [ ] **4.** Add lead status enum: `new → triaged → qualified → quoted → won → lost → spam`.
- [ ] **5.** Build internal `/admin/leads` MVP — list, filter, assign owner, add internal notes (magic link or Clerk; no fancy RBAC yet).
- [ ] **6.** SLA timer: flag leads not touched in 24h / 72h.
- [ ] **7.** Replace placeholder legal entity in `lib/trust.ts` and `/company` with real registered name, support routes, refund contact.
- [ ] **8.** Add honeypot + rate limiting on `/api/interest` — custom hardware attracts bot spam.
- [ ] **9.** UTM + referrer capture on form submit for attribution.
- [ ] **10.** Duplicate-lead detection by email within 30 days — merge configs instead of creating noise.
- [ ] **11.** Export leads to CSV from admin for weekly ops standup.
- [ ] **12.** Define "Definition of Done" for a lead: assigned owner + feasibility tag + next action date.

---

## Phase B: Catalog & compatibility (13–28)

Product truth — SKUs, BOMs, phone-fit rules.

- [ ] **13.** Create `products` schema: body archetype, tier, finish, accessory, skill pack as first-class entities (not string arrays).
- [ ] **14.** Phone compatibility matrix: model → mount core SKU → cable exit → max thickness/weight.
- [ ] **15.** Start with 10–15 real phone models (top iPhones + Pixels + Samsung) — "Universal mount" becomes fallback, not default.
- [ ] **16.** BOM template per body type — servos, linkages, printed shells, MCU, harness, battery module.
- [ ] **17.** Compatibility rules engine: e.g. Walker + Gripper hand + iPhone SE = `blocked` with human-readable reason.
- [ ] **18.** Torque / DOF bands per tier — store as engineering metadata, surface as "target ranges" in UI.
- [ ] **19.** Accessory port map — which accessories mount to which bodies.
- [ ] **20.** Finish system — Pantone/RAL codes + material (PLA+/PETG/ABS/nylon) per color.
- [ ] **21.** Skill pack → motion table mapping — which MCU profiles each pack enables per body.
- [ ] **22.** Prototype tier definitions locked in CMS: deliverables, acceptance criteria, excluded claims.
- [ ] **23.** EDU vs Prototyping bundle SKUs as separate product families with cohort pricing rules.
- [ ] **24.** Version every catalog change — `catalog_v3` pinned on each quote so old orders don't drift.
- [ ] **25.** Admin UI to edit catalog without redeploying `content.ts`.
- [ ] **26.** Import Walker concept geometry as reference asset IDs tied to catalog entries.
- [ ] **27.** Document "out of scope" list per body (outdoor walking, medical, child unsupervised, etc.) — enforce in configurator warnings.
- [ ] **28.** Publish internal engineering sign-off flag per SKU: `concept | shell | moving_proto | production_candidate`.

---

## Phase C: Configurator 2.0 (29–44)

From chips to conviction — shareable configs and 3D preview.

- [ ] **29.** Persist config in URL + localStorage — shareable `exobod.ai/customize?...` links for sales calls.
- [ ] **30.** Live 3D preview (React Three Fiber or Spline): body swaps, finish color, accessory attachments.
- [ ] **31.** Phone model picker with silhouette in mount — not just "iPhone/Android".
- [ ] **32.** Real-time compatibility warnings as user toggles options (red/yellow/green).
- [ ] **33.** Estimated lead time band per configuration (e.g. "8–14 weeks prototype shell") from rules, not copy.
- [ ] **34.** Estimated price band (low/high) from BOM cost model + margin — label clearly as *indicative*.
- [ ] **35.** Configuration ID (`CFG-2026-0042`) generated on first meaningful selection.
- [ ] **36.** "Save configuration" — email magic link to resume later (requires auth-lite).
- [ ] **37.** PDF spec sheet export — config summary + renders + disclaimers for procurement teams.
- [ ] **38.** Compare two configurations side-by-side for educators/research buyers.
- [ ] **39.** Guided wizard mode for first-time users vs expert mode for makers.
- [ ] **40.** Use-case presets: "STEM classroom rover" auto-selects safe defaults.
- [ ] **41.** Accessibility check on configurator (keyboard, screen reader labels on 3D controls).
- [ ] **42.** Mobile-responsive configurator — many buyers will configure from phone meta-ironically.
- [ ] **43.** A/B test hero visual: static render vs interactive 3D on conversion.
- [ ] **44.** Analytics events: `config_started`, `option_changed`, `incompatible_blocked`, `form_submitted`.

---

## Phase D: Quote pipeline (45–58)

Quote → contract → order → milestone payments.

- [ ] **45.** Promote qualified lead → `opportunity` with linked `configuration_id`.
- [ ] **46.** Internal quote builder — line items from BOM, labor, shipping, NRE, margin, validity date.
- [ ] **47.** Customer quote page (`/quote/[token]`) — read-only, branded, accept/decline/request changes.
- [ ] **48.** Quote revision history — v1, v2 with diff of scope changes.
- [ ] **49.** Statement of Work generator from quote + legal templates (milestones, acceptance tests, change control).
- [ ] **50.** E-sign integration (DocuSign/HelloSign) — signature triggers order creation.
- [ ] **51.** `order` entity with states: `draft → contracted → in_production → qa → shipped → delivered → support`.
- [ ] **52.** Milestone payment schedule attached to order (deposit / mid / final).
- [ ] **53.** Stripe Invoicing or deposit links per milestone — no "blind full pay" checkout.
- [ ] **54.** Escrow option for enterprise deals (document process even if manual at first).
- [ ] **55.** Customer order portal (`/my/order/[id]`) — timeline, docs, messages, payment status.
- [ ] **56.** Change request workflow — customer asks for scope change → engineering impact → revised quote.
- [ ] **57.** Cancellation / refund rules wired to `/legal/refund` with operational triggers.
- [ ] **58.** NPS / satisfaction ping 7 days post-delivery.

---

## Phase E: Manufacturing & fulfillment (59–72)

Work orders, QC, serial registry, ship.

- [ ] **59.** Work order generation from accepted order — BOM explosion + build instructions.
- [ ] **60.** CAD/STL package per configuration — even if v1 is manual assembly from template library.
- [ ] **61.** Print farm routing — internal printers vs partner makerspaces with capacity calendar.
- [ ] **62.** Parts procurement checklist — servos, MCUs, fasteners with vendor SKUs.
- [ ] **63.** Build station checklist app — torque specs, cable routing, estop test, photo capture per step.
- [ ] **64.** QC gate: estop, BLE pair, range-of-motion, phone mount retention test — pass/fail logged.
- [ ] **65.** Serial number + unit registry linked to order + configuration snapshot.
- [ ] **66.** Firmware profile flash per body/tier before ship.
- [ ] **67.** Packaging BOM — foam, mount core, tools, quickstart card with QR to companion app.
- [ ] **68.** Shipping integration (ShipStation/EasyPost) + customs docs for international.
- [ ] **69.** RMA / warranty ticket type in support system from day one.
- [ ] **70.** Spare parts catalog — replacement servos, shells, mounts for existing owners.
- [ ] **71.** Batch planning view — group similar configs for efficient printing.
- [ ] **72.** Supplier scorecard — track defect rate per servo batch.

---

## Phase F: Companion app (73–86)

Phone becomes the robot face after delivery.

- [ ] **73.** Exobod mobile app (iOS + Android) — separate repo or Expo monorepo.
- [ ] **74.** Onboarding flow: scan QR on unit → claim serial → download safety profile.
- [ ] **75.** BLE/USB pairing to onboard MCU with connection troubleshooting UI.
- [ ] **76.** Expressive face UI — eyes, mouth, listening waveform.
- [ ] **77.** Voice pipeline: mic → on-device or cloud STT → intent → motion command queue.
- [ ] **78.** LLM skill layer — ChatGPT/Claude/Gemini as configurable "brain"; Exobod translates to safe motor primitives.
- [ ] **79.** Motion primitive library — wave, nod, patrol segment, estop — mapped per body type.
- [ ] **80.** Safety governor — speed caps, joint limits, geofence for rover, session timeouts.
- [ ] **81.** Manual override / estop big red control always visible.
- [ ] **82.** Skill pack unlock — only motions paid for / engineered for that unit.
- [ ] **83.** Routine editor — "when I say good morning, wave + play chime".
- [ ] **84.** Telemetry dashboard (opt-in) — battery, servo temps, fault codes for support.
- [ ] **85.** OTA firmware updates with rollback.
- [ ] **86.** App Store / Play Store listing tied to hardware serial verification.

---

## Phase G: Trust, safety, compliance (87–93)

- [ ] **87.** Safety acknowledgment flow in app + at order — user signs limitations doc.
- [ ] **88.** Age / supervision gating for EDU orders.
- [ ] **89.** Regional compliance matrix — CE/FCC targets per shipping country (even if phased).
- [ ] **90.** Incident reporting channel in app + web.
- [ ] **91.** Data privacy model for voice/camera — local-first defaults documented in privacy policy.
- [ ] **92.** Insurance / liability framework documented for institutional buyers.
- [ ] **93.** Third-party security review before storing payment + PII at scale.

---

## Phase H: Growth, partners, scale (94–100)

- [ ] **94.** Partner portal for print shops / schools — batch quotes, white-label EDU kits.
- [ ] **95.** Affiliate / creator program — tracked config links for YouTube makers.
- [ ] **96.** Demo booking system — Cal.com + automated prep packet from customer's saved config.
- [ ] **97.** Content CMS — move `lib/content.ts` marketing copy to editable CMS for non-dev updates.
- [ ] **98.** Localization v1 — EN + one pilot market (DE or JP) for institutional sales.
- [ ] **99.** Investor / enterprise data room — order pipeline metrics, unit economics, defect rates.
- [ ] **100.** Annual catalog + firmware release train — predictable upgrades so custom hardware doesn't become orphan SKUs.

---

## Gap vs product concept image

| Concept promise | Required steps |
|-----------------|----------------|
| AI face on phone screen | 73–77 |
| Articulated arms + walking base | 79–81 |
| Modular battery | 16, 65, 84 |
| 3D-printable customizable body | 30, 60 |
| Custom order flow | 45–55 |

---

## First sprint recommendation

**Steps 1–6 + 13–15 + 29:** real lead pipeline, real catalog schema, shareable configs. Turns exobod.ai from brochure into something the team runs every morning.
