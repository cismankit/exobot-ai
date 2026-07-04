// Vercel project config for apps/web. Set in the Vercel dashboard:
//   Root Directory: apps/web  (Install Command: pnpm install, from repo root)
//   Env: NEXT_PUBLIC_API_URL=https://<your-api-host>
//        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY / CLERK_SECRET_KEY (optional)
import type { VercelConfig } from "@vercel/config/v1";

export const config: VercelConfig = {
  framework: "nextjs",
};

export default config;
