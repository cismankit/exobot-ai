#!/usr/bin/env bash
# visual-audit.sh — read-only checks for Exobod marketing image hygiene.
# Does not modify files or deploy anything.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
WEB_PUBLIC="$ROOT/apps/web/public"
LEGACY_PUBLIC="$ROOT/legacy/web-v1/public"
WEB_APP="$ROOT/apps/web"
FAIL=0

echo "=== Exobod visual audit (read-only) ==="
echo "root: $ROOT"
echo

# --- 1) Missing image files referenced in apps/web ---
echo "--- Missing image references (apps/web) ---"
MISSING=0
while IFS= read -r ref; do
  # strip query string
  clean="${ref%%\?*}"
  # only public-root absolute paths
  case "$clean" in
    /*)
      candidate="$WEB_PUBLIC$clean"
      if [[ ! -f "$candidate" ]]; then
        echo "MISSING: $clean (expected $candidate)"
        MISSING=$((MISSING + 1))
        FAIL=1
      fi
      ;;
  esac
done < <(
  # paths like "/foo.png" or '/foo.webp'
  rg -oN --no-filename -e '["'\''](/[^"'\'']+\.(png|jpg|jpeg|webp|gif|avif|svg))(\?[^"'\'']*)?["'\'']' \
    "$WEB_APP" \
    -g '!**/node_modules/**' -g '!**/test-results/**' -g '!**/.next/**' 2>/dev/null \
    | sed -E 's/^["'\'']//; s/["'\'']$//' | sed -E 's/\?.*$//' | sort -u || true
)

if [[ "$MISSING" -eq 0 ]]; then
  echo "OK: no missing public image files from absolute refs"
fi
echo

# --- 2) Duplicate asset content (public trees) ---
echo "--- Duplicate file content (sha256) ---"
if command -v shasum >/dev/null 2>&1; then
  HASH_CMD=(shasum -a 256)
elif command -v sha256sum >/dev/null 2>&1; then
  HASH_CMD=(sha256sum)
else
  HASH_CMD=()
fi

if [[ ${#HASH_CMD[@]} -gt 0 ]]; then
  TMP="$(mktemp)"
  while IFS= read -r f; do
    "${HASH_CMD[@]}" "$f"
  done < <(
    find "$WEB_PUBLIC" "$LEGACY_PUBLIC" -type f \( \
      -iname '*.png' -o -iname '*.jpg' -o -iname '*.jpeg' -o \
      -iname '*.webp' -o -iname '*.gif' -o -iname '*.avif' \
    \) 2>/dev/null | sort
  ) | awk '{print $1, $2}' >"$TMP"

  # group by hash
  DUP_OUT="$(awk '{
    h=$1; $1=""; sub(/^ /,""); path=$0
    if (seen[h]) { print h, seen[h], "≡", path; dups=1 }
    else { seen[h]=path }
  } END { if (!dups) exit 1 }' "$TMP" || true)"

  if [[ -n "${DUP_OUT:-}" ]]; then
    echo "$DUP_OUT"
    echo "(Duplicates are expected across legacy/apps copies; flag new same-subject reuse in pages.)"
  else
    echo "OK: no duplicate binary content found"
  fi
  rm -f "$TMP"
else
  echo "SKIP: no shasum/sha256sum available"
fi
echo

# --- 3) Same path basename used many times in source (repeated robot risk) ---
echo "--- Repeated image basename references (apps/web + legacy components) ---"
rg -oN --no-filename -e '/(exobot-hero|hero|hero-robot|story/step-[0-9]+)\.png' \
  "$WEB_APP" "$ROOT/legacy/web-v1" \
  -g '*.tsx' -g '*.ts' -g '*.jsx' -g '*.js' \
  -g '!**/node_modules/**' -g '!**/test-results/**' 2>/dev/null \
  | sort | uniq -c | sort -rn || true
echo "(High counts on one Walker file across many components = churn risk.)"
echo

# --- 4) object-cover near registered portrait product renders ---
echo "--- object-cover near portrait product renders ---"
PORTRAIT_HINTS='exobot-hero|hero-robot|/exobod/hero'
COVER_HITS="$(rg -n -e 'object-cover' -g '*.tsx' -g '*.jsx' \
  "$WEB_APP" "$ROOT/legacy/web-v1" \
  -g '!**/node_modules/**' 2>/dev/null || true)"

if [[ -z "$COVER_HITS" ]]; then
  echo "OK: no object-cover usages found"
else
  echo "Found object-cover usages (review manually for portrait product frames):"
  echo "$COVER_HITS"
  # flag if same file also references portrait product assets nearby
  while IFS= read -r line; do
    file="${line%%:*}"
    if [[ -f "$file" ]] && rg -q -e "$PORTRAIT_HINTS" "$file" 2>/dev/null; then
      if rg -q -e 'object-cover' "$file" && rg -q -e "$PORTRAIT_HINTS" "$file"; then
        echo "REVIEW: $file uses object-cover and references a portrait product render"
        # logo lockups are OK; product frames are not
        if ! rg -q -e 'logo-mark|LOCKUP|BrandLockup|branding/' "$file"; then
          echo "  ^ likely product frame — prefer object-contain (see VISUAL-SYSTEM.md)"
          FAIL=1
        fi
      fi
    fi
  done <<<"$COVER_HITS"
fi
echo

# --- 5) Route review checklist (printed, not enforced) ---
echo "=== Route review checklist (manual) ==="
cat <<'EOF'
[ ] Desktop screenshot ≥1280px for each changed marketing route
[ ] Mobile screenshot ~390px for same routes
[ ] Walker concept labeled; not used as Desk One
[ ] Primary + secondary CTAs click through
[ ] No new forbidden claims (docs/product/PRODUCT-CONSTITUTION.md + docs/desk-one/CLAIMS.md)
[ ] Assets registered / shot-list gaps noted (docs/product/ASSET-REGISTRY.md)
[ ] Preview URL ready; user approval before production
[ ] Rollback SHA identified

Routes to spot-check when relevant:
  /  /demo  /desk-one  /customize  /trust  /pricing  /manifesto
EOF
echo

if [[ "$FAIL" -ne 0 ]]; then
  echo "RESULT: issues flagged (exit 1)"
  exit 1
fi
echo "RESULT: automated checks clean (still complete manual checklist before production)"
exit 0
