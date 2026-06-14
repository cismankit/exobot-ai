---
name: exobod-product-catalog
description: Defines Exobod product catalog schema, phone compatibility matrix, BOM templates, and compatibility rules engine. Use when migrating options from lib/content.ts, adding SKUs, phone models, or Phase B roadmap steps 13-28.
---

# Exobod Product Catalog

Product truth layer — SKUs, BOMs, compatibility rules, and versioned catalog. Covers roadmap **Phase B (steps 13–28)**.

## Current state

Options are string arrays and objects in `lib/content.ts`:
- `bodyTypes`, `customizationOptions`, `skillsEngineNames`
- Not SKUs, not BOMs, not phone-fit geometry

Target: first-class entities in database with admin UI and rules engine feeding the configurator.

## Phase B checklist

```
Phase B — Catalog (13–28):
- [ ] 13. products schema: body, tier, finish, accessory, skill pack as entities
- [ ] 14. Phone compatibility matrix (model → mount SKU → cable → thickness/weight)
- [ ] 15. 10–15 real phone models (top iPhone, Pixel, Samsung)
- [ ] 16. BOM template per body type
- [ ] 17. Compatibility rules engine with human-readable blocks
- [ ] 18. Torque/DOF bands per tier (engineering metadata)
- [ ] 19. Accessory port map per body
- [ ] 20. Finish system (Pantone/RAL + material)
- [ ] 21. Skill pack → motion table mapping
- [ ] 22. Prototype tier definitions in CMS
- [ ] 23. EDU vs Prototyping bundle SKUs
- [ ] 24. Version every catalog change (catalog_vN on quotes)
- [ ] 25. Admin UI to edit catalog without redeploy
- [ ] 26. Walker concept geometry as reference asset IDs
- [ ] 27. Out-of-scope list per body + configurator warnings
- [ ] 28. Engineering sign-off flag per SKU
```

## Entity relationships

```
PhoneModel ──► MountCoreSKU ──► CompatibilityMatrix
Product (body/tier/finish/accessory/skill) ──► BOMTemplate
CompatibilityRule ──► evaluates (body + phone + accessory + tier)
CatalogVersion ──► pins snapshot on quotes/orders
```

## Compatibility rules engine

Evaluate deterministically:

1. Hard blocks (prevent submit)
2. Warnings (allow with acknowledgment)
3. Allowed

Example rule:

```
IF body=Walker AND accessory=Gripper AND phone=iPhone SE
THEN blocked — "Gripper torque exceeds safe envelope for iPhone SE mount retention."
```

Expose `reason` string for configurator UI and PDF export.

## BOM template structure

Per body archetype (Walker, Desk Assistant, Rover, Utility Helper):

| Category | Examples |
|----------|----------|
| Actuation | Servos, linkages, end effectors |
| Structure | Printed shells, brackets, battery module |
| Electronics | MCU, harness, connectors |
| Mount | Removable core, cable exit, fasteners |

Attach torque/DOF bands per tier as metadata — surface as "target ranges" in UI.

## Phone compatibility matrix

Start with 10–15 models. Fields:

- `manufacturer`, `model_name`, `release_year`
- `mount_core_sku`
- `cable_exit` (bottom, side, angled)
- `max_thickness_mm`, `max_weight_g`
- `status`: supported | fallback_universal | blocked

"Universal mount" is explicit fallback — not default for qualified leads.

## Catalog versioning

- Increment `catalog_version` on any SKU/rule/BOM change
- Quotes and orders pin version at creation — old orders never drift
- Admin shows diff between versions for engineering review

## Migration from lib/content.ts

1. Extract enums and option lists into seed migration
2. Point configurator at catalog API instead of static imports
3. Keep `lib/content.ts` for marketing copy until CMS (step 97)
4. Map `InterestBodyType` in `lib/types/interest.ts` to catalog body IDs

## Out-of-scope enforcement (step 27)

Per body, document and warn:
- Outdoor walking, medical claims, unsupervised child use, etc.
- Configurator shows yellow/red banner — quote team sees same flags

## Engineering sign-off (step 28)

| Flag | Meaning |
|------|---------|
| concept | Marketing only, may not build |
| shell | Static prototype |
| moving_proto | Motion within lab limits |
| production_candidate | Repeatable manufacturing path |

## Additional reference

Full roadmap: [exobod-roadmap/reference.md](../exobod-roadmap/reference.md) Phase B.

Subagent: **exobod-catalog** for deep catalog design work.
