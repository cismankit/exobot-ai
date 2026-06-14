---
name: exobod-order-pipeline
description: Implements Exobod quote builder, customer quote portal, SOW generation, e-sign, order entity, milestone payments, and customer order portal. Use for Phase D roadmap steps 45-58 or promoting qualified leads to revenue.
---

# Exobod Order Pipeline

Quote → contract → order → milestone payments. Covers roadmap **Phase D (steps 45–58)**.

## Prerequisites

Before Phase D:
- Phase A: leads persisted and triaged (**exobod-lead-ops**)
- Phase B: catalog + BOM for line items (**exobod-product-catalog**)
- Phase C: configuration ID and snapshot (**exobod-configurator**)

## Entity progression

```
Lead (qualified)
  → Opportunity (+ configuration_id)
  → Quote (v1, v2, … with revision history)
  → Order (on e-sign + deposit)
  → Milestone payments
  → Manufacturing handoff (Phase E)
```

## Phase D checklist

```
Phase D — Quote pipeline (45–58):
- [ ] 45. Promote qualified lead → opportunity with configuration_id
- [ ] 46. Internal quote builder (BOM, labor, shipping, NRE, margin, validity)
- [ ] 47. Customer quote page /quote/[token] (read-only, accept/decline/changes)
- [ ] 48. Quote revision history with scope diff
- [ ] 49. SOW generator from quote + legal templates
- [ ] 50. E-sign (DocuSign/HelloSign) → triggers order creation
- [ ] 51. order entity with lifecycle states
- [ ] 52. Milestone payment schedule on order
- [ ] 53. Stripe Invoicing or deposit links per milestone
- [ ] 54. Escrow option documented for enterprise
- [ ] 55. Customer order portal /my/order/[id]
- [ ] 56. Change request workflow
- [ ] 57. Cancellation/refund rules wired to /legal/refund
- [ ] 58. NPS ping 7 days post-delivery
```

## Order lifecycle states

```
draft → contracted → in_production → qa → shipped → delivered → support
```

Only `contracted` orders with signed SOW and deposit trigger manufacturing (Phase E).

## Quote builder (internal)

Line item sources:
- BOM explosion from configuration + pinned `catalog_version`
- Labor by body type and tier
- Shipping estimate by region
- NRE for custom geometry or new phone mount
- Margin and validity date (e.g. 30 days)

Output: customer-facing quote token + internal cost breakdown.

## Customer quote page

Route: `/quote/[token]`

- Branded, read-only scope summary
- Actions: Accept, Decline, Request changes
- Link to PDF spec from configurator
- Clear "indicative → binding on acceptance" language

## Milestone payments

Typical schedule for custom hardware:

| Milestone | Trigger | % |
|-----------|---------|---|
| Deposit | SOW signed | 30–40% |
| Mid | Build start / parts ordered | 30–40% |
| Final | Pre-ship QC pass | 20–30% |

Use Stripe Invoicing or payment links — **no blind full-pay checkout**.

## SOW generator (step 49)

Merge from templates:
- Scope from quote line items
- Milestones and acceptance tests
- Change control process
- Excluded claims (from catalog out-of-scope)
- Safety acknowledgments (Phase G)

## Change request workflow (step 56)

```
Customer request → engineering impact assessment → revised quote vN → customer re-accept
```

Never mutate contracted scope without new quote revision.

## Customer order portal (step 55)

Route: `/my/order/[id]`

Show: timeline, documents (SOW, invoices), messages, payment status, shipment tracking when available.

## Integration points

| System | Purpose |
|--------|---------|
| Stripe | Invoicing, deposit links |
| DocuSign/HelloSign | E-sign triggers order |
| Email | Quote sent, milestone due, ship notice |
| Manufacturing | Work order on deposit + contracted state |

## Legal alignment

Wire cancellation/refund operational triggers to `/legal/refund` copy. Milestone billing promises in marketing must match implemented payment flow.

## Additional reference

Full roadmap: [exobod-roadmap/reference.md](../exobod-roadmap/reference.md) Phase D.

Subagents: **build-desk-ops** (lead promotion), **exobod-manufacturing** (post-contract fulfillment).
