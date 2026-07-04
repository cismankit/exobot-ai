import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@exobod/ui", "@exobod/sdk"],
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
