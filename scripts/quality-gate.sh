#!/usr/bin/env bash
# Exobod local/CI quality gate: lint, production build, optional smoke HTTP checks.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "==> npm run lint"
npm run lint

echo "==> npm run build"
export ADMIN_SECRET="${ADMIN_SECRET:-quality-gate-secret}"
npm run build

# Smoke tests require a running dev/prod server on BASE_URL (default http://127.0.0.1:3000).
if [[ "${SKIP_SMOKE:-}" == "1" ]]; then
  echo "==> SKIP_SMOKE=1 — skipping HTTP smoke tests"
  exit 0
fi

BASE_URL="${BASE_URL:-http://127.0.0.1:3000}"
ADMIN_SECRET="${ADMIN_SECRET:-demo-secret}"
AUTH_HEADER="Authorization: Bearer ${ADMIN_SECRET}"

smoke() {
  local path="$1"
  local extra_args=("${@:2}")
  local code
  code=$(curl -s -o /dev/null -w "%{http_code}" "${extra_args[@]}" "${BASE_URL}${path}" || echo "000")
  if [[ "$code" != "200" && "$code" != "307" && "$code" != "308" ]]; then
    echo "FAIL ${path} → HTTP ${code}"
    return 1
  fi
  echo "OK   ${path} → HTTP ${code}"
}

echo "==> Smoke tests against ${BASE_URL}"
echo "    Routes: /, /customize, /api/catalog/products, /admin/leads (Bearer ADMIN_SECRET)"
smoke "/"
smoke "/customize"
smoke "/api/catalog/products"
smoke "/admin/leads" -H "$AUTH_HEADER"

echo "==> Quality gate passed"
