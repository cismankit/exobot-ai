import { defineConfig } from "@playwright/test";

/** Smoke suite — expects the api (:8000) and web (:3000) dev servers.
 * `pnpm --filter @exobod/web test` boots both via webServer below. */
export default defineConfig({
  testDir: "./tests",
  timeout: 45_000,
  retries: 1,
  use: {
    baseURL: "http://localhost:3000",
  },
  webServer: [
    {
      command:
        "cd ../.. && .venv/bin/uvicorn main:app --app-dir apps/api --port 8000",
      url: "http://localhost:8000/health",
      reuseExistingServer: true,
      timeout: 30_000,
    },
    {
      command: "pnpm dev",
      url: "http://localhost:3000",
      reuseExistingServer: true,
      timeout: 60_000,
    },
  ],
});
