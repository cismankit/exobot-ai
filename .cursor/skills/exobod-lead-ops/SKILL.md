---
name: exobod-lead-ops
description: Operates Exobod lead intake, SLA timers, triage statuses, and admin workflow for build desk. Use when implementing interest persistence, /admin/leads, lead alerts, duplicate detection, or Phase A roadmap steps 1-12.
---

# Exobod Lead Ops

Build desk workflow for turning interest submissions into qualified opportunities. Covers roadmap **Phase A (steps 1–12)**.

## Current codebase

| Path | Role |
|------|------|
| `app/api/interest/route.ts` | POST handler |
| `lib/adapters/interestStore.ts` | Persistence boundary (TODO: DB + email) |
| `lib/schema/interest.ts` | Zod validation |
| `lib/types/interest.ts` | Payload types |
| `components/interest-form.tsx` | Public intake UI |
| `lib/trust.ts` | Legal entity (replace placeholder) |

## Lead status enum

```
new → triaged → qualified → quoted → won → lost → spam
```

Implement as DB enum or typed string. Every transition logs actor, timestamp, note.

## Phase A checklist

Copy and track when implementing ops foundation:

```
Phase A — Ops foundation (1–12):
- [ ] 1. Wire interest persistence to Postgres (Supabase/Neon)
- [ ] 2. Transactional email to submitter (Resend/Postmark)
- [ ] 3. Slack/email alert to #build-desk with admin deep link
- [ ] 4. Lead status enum (see above)
- [ ] 5. Internal /admin/leads MVP (list, filter, assign, notes)
- [ ] 6. SLA timer: flag untouched 24h / 72h
- [ ] 7. Replace placeholder legal entity in lib/trust.ts + /company
- [ ] 8. Honeypot + rate limiting on /api/interest
- [ ] 9. UTM + referrer capture on submit
- [ ] 10. Duplicate-lead detection by email (30 days, merge configs)
- [ ] 11. Export leads CSV from admin
- [ ] 12. Definition of Done: owner + feasibility tag + next action date
```

## SLA rules

| Window | Requirement |
|--------|-------------|
| 0–24h | First human touch |
| 24–72h | Escalate to build desk lead |
| 72h+ | Dashboard flag + weekly standup |

Store `first_touched_at`, `assigned_owner_id`, `next_action_date` on lead record.

## Admin MVP scope

**In scope:** magic link or Clerk auth, lead list with filters (status, body type, SLA breach), assign owner, internal notes, CSV export.

**Out of scope (later):** full RBAC, quote builder, manufacturing views.

Route target: `/admin/leads` with server actions or API routes behind auth.

## Lead record schema (target)

```typescript
interface Lead {
  id: string;
  created_at: string;
  source_page: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  referrer?: string;
  status: LeadStatus;
  assigned_owner_id?: string;
  feasibility_tag?: "concept" | "shell" | "moving_proto" | "production_candidate";
  next_action_date?: string;
  first_touched_at?: string;
  configuration_summary?: string;
  payload: InterestPayload; // from lib/types/interest.ts
  internal_notes: { author: string; at: string; body: string }[];
}
```

## Implementation order (first 2 weeks)

**Week 1:** Steps 1–4, 7–8 — persistence, email, alerts, status enum, legal entity, spam protection.

**Week 2:** Steps 5–6, 10–12 — admin UI, SLA, dedup, CSV, DoD enforcement.

## persistInterest boundary

Keep `lib/adapters/interestStore.ts` as the single swap point:

1. Insert lead row
2. Send submitter email
3. Fire build-desk alert
4. Return `{ ok: true }` to API route

Do not scatter persistence logic across components.

## Feasibility tags

Align with catalog engineering sign-off (Phase B step 28):
- `concept` — exploratory, may decline
- `shell` — static prototype viable
- `moving_proto` — motion within safety limits
- `production_candidate` — repeatable build path

## Handoff to quote pipeline

Promote `qualified` leads to `opportunity` with linked `configuration_id` when configurator persistence exists (Phase D step 45). See **exobod-order-pipeline** skill.

## Additional reference

Full roadmap context: [exobod-roadmap/reference.md](../exobod-roadmap/reference.md) Phase A.

Subagent: **build-desk-ops** for daily triage operations.
