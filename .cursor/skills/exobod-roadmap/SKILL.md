---
name: exobod-roadmap
description: Master Exobod.ai product roadmap — V1 phases A–H (steps 1–100) and V2 epic sprint plan (steps 101–200). Use when prioritizing sprints, scoping features, mapping work to roadmap steps, or answering what comes next operationally.
---

# Exobod Roadmap

Master reference for the Exobod.ai platform evolution from lead capture through production scale.

## Roadmap versions

| Version | Steps | Structure | Reference |
|---------|-------|-----------|-----------|
| **V1** | 1–100 | Phases A–H (ops → growth) | [reference.md](reference.md) |
| **V2** | 101–200 | 10 EPICS × 10 steps, 2-week sprints | [reference-v2.md](reference-v2.md) |

**Active execution:** Use V2 for current sprint planning. V1 remains the foundation checklist — confirm V1 exit gates before starting V2 Sprint 1.

**Sprint orchestration:** [sprint-coordinator agent](../../agents/sprint-coordinator.md) · **Quality gates:** [exobod-quality-gate](../exobod-quality-gate/SKILL.md)

## North star

Configure → validate → quote → build → ship → run on device.

Phone = brain. Exobod = body. Companion app = face and motion runtime after delivery.

## Current platform phase

**Phase 0 today:** Marketing site + configurator UI + interest form. `persistInterest()` logs only — no DB, CRM, quote, or manufacturing ops.

## Phase overview

| Phase | Steps | Theme | Skill / subagent |
|-------|-------|-------|------------------|
| A | 1–12 | Ops foundation | exobod-lead-ops, build-desk-ops |
| B | 13–28 | Catalog & compatibility | exobod-product-catalog, exobod-catalog |
| C | 29–44 | Configurator 2.0 | exobod-configurator |
| D | 45–58 | Quote pipeline | exobod-order-pipeline, build-desk-ops |
| E | 59–72 | Manufacturing | exobod-manufacturing |
| F | 73–86 | Companion app | exobod-companion-app |
| G | 87–93 | Trust & safety | legal pages, app gating |
| H | 94–100 | Growth & scale | CMS, partners, localization |

## Recommended execution order

Do **not** start with 3D or mobile app. Unblock revenue ops first:

| Week | Focus | Steps |
|------|-------|-------|
| 1 | Leads land somewhere | 1–4, 7–8 |
| 2 | Admin can triage | 5–6, 10–12 |
| 3 | Catalog becomes real data | 13–18, 27 |
| 4 | Configurator earns trust | 29–35, 44 |

**Month 2:** Quote portal (45–55). **Month 3:** Manufacturing MVP (59–67). **Month 4+:** Companion app alpha (73–80).

## Brutal stack rank (PO priority)

1. Lead → CRM → human response < 24h
2. Phone model + compatibility truth
3. Indicative pricing + lead time bands
4. 3D configurator with Walker hero SKU
5. Quote + milestone payment
6. Companion app face + BLE pair
7. Manufacturing work orders

## Architecture flow

```mermaid
flowchart LR
  A[Marketing + Configurator] --> B[Product Catalog + Rules]
  B --> C[Quote + Contract]
  C --> D[Milestone Payments]
  D --> E[Manufacturing Ops]
  E --> F[Ship + Onboard]
  F --> G[Companion App]
  G --> H[Skills + Motion Runtime]
```

## How to use this skill

1. User asks "what's next?" → identify V1 phase or V2 sprint/epic; recommend next 3–5 shippable steps.
2. User scopes a feature → map to step numbers (1–100 or 101–200) and list dependencies.
3. User starts implementation → load phase/epic-specific skill; invoke sprint-coordinator for multi-track work.
4. User needs full checklist → V1: [reference.md](reference.md) · V2: [reference-v2.md](reference-v2.md).
5. Before merge or sprint close → run [exobod-quality-gate](../exobod-quality-gate/SKILL.md).

## V2 epic overview (steps 101–200)

| Epic | Steps | Theme | Sprint |
|------|-------|-------|--------|
| 1 | 101–110 | Companion App Production | 1 |
| 2 | 111–120 | Motion Runtime & MCU Firmware | 2 |
| 3 | 121–130 | 3D/CAD Pipeline & Print Farm | 3 |
| 4 | 131–140 | Commerce & Legal at Scale | 4 |
| 5 | 141–150 | Enterprise & EDU Procurement | 5 |
| 6 | 151–160 | AI Skills & LLM Orchestration | 6 |
| 7 | 161–170 | Global Ops & Fulfillment | 7 |
| 8 | 171–180 | Partner Ecosystem & Marketplace | 8 |
| 9 | 181–190 | Platform Reliability & Security | 9 |
| 10 | 191–200 | Product Line Expansion | 10 |

**Cadence:** 2-week sprints, one epic per sprint (~20 weeks total). See [reference-v2.md](reference-v2.md) for goals, acceptance criteria, dependencies, and per-epic quality gates.

## Phase gate criteria (V1)

**Exit Phase A:** Every lead persisted, alerted, triageable in admin, SLA enforced.

**Exit Phase B:** Configurator reads catalog API; 10+ phone models; rules engine blocks invalid combos.

**Exit Phase C:** Shareable config URLs, indicative price/lead bands, CFG IDs on submissions.

**Exit Phase D:** Signed SOW + deposit creates order; customer portal live.

**Exit Phase E:** Work order → QC → serial → ship for first unit.

**Exit Phase F:** Companion app pairs to shipped serial; face UI + e-stop + one motion primitive.

## Full checklists

- **V1 (steps 1–100):** [reference.md](reference.md) — phases A through H
- **V2 (steps 101–200):** [reference-v2.md](reference-v2.md) — 10 epics with sprint structure
