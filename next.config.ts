import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  /** Avoid flaky webpack devtools / client-manifest errors in dev that can yield 500s and unstyled HTML. */
  devIndicators: false,
  eslint: {
    dirs: ["app", "components", "lib"],
  },
};

export default nextConfig;
