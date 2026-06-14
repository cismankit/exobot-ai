---
name: exobod-quality-gate
description: Pre-merge quality gate checklist for Exobod.ai — build, lint, typecheck, smoke routes, secrets scan, and admin auth verification. Use before merging PRs, at epic completion, or when sprint-coordinator requests a quality gate pass.
---

# Exobod Quality Gate

Mandatory pre-merge checklist for all Exobod.ai platform changes. Run before every PR to `main` and at each epic's sprint-end quality gate.

## When to use

- Before merging any PR to `main` or release branches
- At sprint end when sprint-coordinator requests epic quality gate sign-off
- After security-sensitive changes (admin, payments, serial verification, partner API)
- Before App Store / Play Store or production deployments

## Quick pass command sequence

Run from repo root (`exobot.ai`):

```bash
npm run build
npm run lint
npx tsc --noEmit
```

If companion app repo is in scope, run equivalent checks in that workspace.

## Checklist

### Build

- [ ] `npm run build` completes with zero errors
- [ ] No new build warnings introduced (or documented and accepted)
- [ ] Environment variables required for build documented in `.env.example` if added

### Lint

- [ ] `npm run lint` passes with zero errors
- [ ] No disabled lint rules added without justification in PR description

### Typecheck

- [ ] `npx tsc --noEmit` passes with zero errors
- [ ] No `any` casts introduced to silence errors without comment

### Smoke routes

Manually or via script, verify HTTP 200 (or expected redirect) on:

- [ ] `/` — marketing home
- [ ] `/customize` — configurator loads
- [ ] `/api/interest` — POST returns expected validation (not 500)
- [ ] `/admin/leads` — requires auth; returns 401/403 without credentials
- [ ] `/admin/quotes` — requires auth
- [ ] `/admin/work-orders` — requires auth
- [ ] `/api/catalog/products` — returns catalog payload
- [ ] `/quote/[token]` — valid token renders; invalid returns 404

Add route-specific smokes when epic touches:
- `/api/config/save`, `/api/config/pdf` — configurator persistence
- `/api/order/[token]`, `/my/order/[token]` — order portal
- `/api/admin/*` — all admin mutations behind auth

### No secrets in diff

- [ ] `git diff` contains no API keys, tokens, passwords, or private keys
- [ ] No `.env`, `.env.local`, or credential files staged
- [ ] No hardcoded `ADMIN_SECRET`, `STRIPE_SECRET`, or similar in source
- [ ] Logs do not print full PII or payment details

Optional scan (if `gitleaks` or `trufflehog` available):

```bash
gitleaks detect --source . --verbose 2>/dev/null || echo "gitleaks not installed — manual review required"
```

### Admin auth tested

- [ ] Unauthenticated request to `/api/admin/*` returns 401 or 403
- [ ] Authenticated request with valid admin credential succeeds
- [ ] Invalid or expired admin token rejected
- [ ] Admin pages do not leak lead PII in client-side bundles

Test pattern (adjust header/cookie per `lib/admin/auth.ts`):

```bash
# Should fail without auth
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/admin/leads

# Should succeed with valid admin auth (set env ADMIN_SECRET or session per implementation)
```

## Epic quality gate (sprint end)

In addition to the pre-merge checklist above, confirm epic-specific items from [reference-v2.md](../exobod-roadmap/reference-v2.md) — each epic has a **Quality gate checklist** section.

Sprint-coordinator aggregates:
1. All merged PRs for the sprint passed this skill
2. Epic-specific quality gate items checked
3. Blockers documented with owner and ETA

## Failure handling

| Failure | Action |
|---------|--------|
| Build/lint/tsc fail | Fix before merge; do not bypass with `--no-verify` |
| Smoke route 500 | Identify regression; add to sprint blocker log |
| Secret in diff | Remove, rotate credential if ever committed, force-push only if user approves |
| Admin auth gap | Treat as P0 — block merge until fixed |

## Output format (for agents)

When reporting quality gate status:

```
## Quality Gate — [PASS | FAIL]

### Automated
- Build: [pass/fail]
- Lint: [pass/fail]
- Typecheck: [pass/fail]

### Manual
- Smoke routes: [list any failures]
- Secrets scan: [clean/flagged]
- Admin auth: [verified/gap]

### Blockers
- [item] — owner — ETA

### Recommendation
[Merge | Hold]
```

## Related

- [exobod-roadmap](../exobod-roadmap/SKILL.md) — epic quality gate checklists in reference-v2.md
- [sprint-coordinator](../../agents/sprint-coordinator.md) — orchestrates gate at sprint end
