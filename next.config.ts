import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  reactStrictMode: true,
  // Build runs Next's own typecheck which doesn't honor tsconfig "exclude"
  // for archived legacy files. We run `npm run typecheck` (tsc) separately
  // in CI to gate strict type safety on live code only.
  typescript: { ignoreBuildErrors: true },
  cacheHandler:
    process.env.NODE_ENV === "production"
      ? path.resolve(process.cwd(), "cache-handler.mjs")
      : undefined,
  cacheMaxMemorySize: 0,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "i.pravatar.cc" }],
  },
};

export default nextConfig;
