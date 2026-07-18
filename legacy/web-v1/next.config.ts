import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  /** Avoid flaky webpack devtools / client-manifest errors in dev that can yield 500s and unstyled HTML. */
  devIndicators: false,
  eslint: {
    dirs: ["app", "components", "lib"],
  },
  async redirects() {
    return [
      {
        source: "/use-cases",
        destination: "/#use-cases",
        permanent: true,
      },
      {
        source: "/build-system",
        destination: "/#build-system",
        permanent: true,
      },
      {
        source: "/why-exobod",
        destination: "/#why-exobod",
        permanent: true,
      },
      {
        source: "/why",
        destination: "/#why-exobod",
        permanent: true,
      },
      {
        source: "/early-access",
        destination: "/desk-one",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
