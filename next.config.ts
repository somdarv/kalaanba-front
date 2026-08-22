import type { NextConfig } from "next";
import path from "node:path";

/**
 * Hosts `next/image` is allowed to fetch from.
 *
 * Derived from the env rather than hardcoded, because the answer changes per
 * environment and getting it wrong is invisible until a real image exists. A
 * player photo is served from wherever the API's media driver put it: the API's
 * own origin under the `local` driver, and the R2 bucket's public domain under
 * `r2`. Listing literal hostnames here would mean every environment that stores
 * a photo somewhere new needs a code change, and the symptom of forgetting is a
 * runtime error on the one screen a player came to see.
 *
 * `next.config.ts` is one of the two files allowed to read `process.env`
 * directly (engineering-standards §9). Note these are read at BUILD time, so
 * changing either variable needs a rebuild, not a restart.
 */
function imageHost(raw: string | undefined) {
  if (!raw) return null;

  try {
    const url = new URL(raw);
    const protocol = url.protocol.replace(":", "");
    if (protocol !== "http" && protocol !== "https") return null;

    return {
      protocol,
      hostname: url.hostname,
      // Omitted rather than sent empty: `port: ""` matches only the default
      // port, so a blank string would silently exclude `localhost:8000`.
      ...(url.port ? { port: url.port } : {}),
      pathname: "/**",
    } as const;
  } catch {
    // A malformed URL is a misconfiguration, not a reason to fail the build.
    // Next reports the unconfigured host clearly if an image then needs it.
    return null;
  }
}

const remotePatterns = [
  // Faces in the archived showcase. Kept while /legacy/showcase still builds.
  { protocol: "https", hostname: "i.pravatar.cc" } as const,

  // Player media under the API's `local` driver, served through Laravel's
  // storage symlink at {API_ORIGIN}/storage/player-media/...
  imageHost(process.env.NEXT_PUBLIC_API_URL),

  // Player media under the `r2` driver: the bucket's r2.dev address or its
  // custom domain. Must match `R2_PUBLIC_URL` on the API side.
  imageHost(process.env.NEXT_PUBLIC_MEDIA_URL),
].filter((pattern) => pattern !== null);

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
  images: { remotePatterns },
};

export default nextConfig;
