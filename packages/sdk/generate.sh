#!/bin/sh
# Regenerate the typed client from the API's live OpenAPI schema.
#   pnpm --filter @exobod/sdk generate
set -e
cd "$(dirname "$0")"
../../.venv/bin/python -c "
import sys, json
sys.path.insert(0, '../../apps/api')
from main import app
print(json.dumps(app.openapi(), indent=1))
" > openapi.json
pnpm exec openapi-typescript openapi.json -o src/schema.gen.ts
echo "regenerated src/schema.gen.ts from live OpenAPI"
