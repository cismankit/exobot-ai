#!/bin/sh
# Dev API without docker — in-process body sim, sqlite, dev auth.
cd "$(dirname "$0")/.." || exit 1
exec .venv/bin/uvicorn main:app --app-dir apps/api --reload --port 8000
