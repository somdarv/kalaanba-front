/**
 * Drop the Next ISR cache after a build.
 *
 * WHY THIS RUNS FROM `postbuild` AND NOT FROM A DEPLOY SCRIPT.
 * The ISR cache lives in Redis and survives both `pm2 reload` and a fresh
 * build. The moment a rebuild changes a content-hashed chunk name, a cached
 * page keeps pointing at the PREVIOUS build's chunks. Those files are gone, the
 * browser 404s on them, and the page paints from the prerender and then dies on
 * hydration. It looks fine to curl: the HTML is 200, the chunks inside it are
 * not. Re-running the deploy does not fix it, because the build is correct and
 * the cache is not.
 *
 * The obvious home for the fix is the deploy script. On this box that script
 * lives in the server's home directory behind a forced SSH command, outside
 * this repo, and it has now shipped two deploys without the step. `postbuild`
 * is in the repo, is version-controlled, and runs wherever the build runs, so
 * the fix travels with the code that needs it.
 *
 * SAFETY. This flushes DB 2 and only DB 2. Never `flushall`: DB 0 holds the
 * outbox event streams, which carry no TTL, and dropping one breaks the event
 * spine (Constitution Law 6).
 *
 * It is a no-op unless a Redis URL is configured, so a local `npm run build`
 * does nothing, and any failure is logged and swallowed. A cache that could not
 * be cleared is a stale page; a build that dies here is no deploy at all, and
 * the first is much the smaller problem.
 */

import { readFileSync } from "node:fs";

// The DB the cache handler writes to. Keep in step with cache-handler.mjs and
// with the `-n 2` in scripts/deploy.sh.
const ISR_CACHE_DB = 2;

// Where Next keeps the runtime env, most specific first.
const ENV_FILES = [".env.local", ".env.production", ".env"];

/**
 * Find REDIS_URL, falling back to the env files by hand.
 *
 * Next loads `.env.local` for its own build, but this is a separate `node`
 * process and inherits nothing from that. The first version of this script read
 * `process.env` alone, ran on the server, found nothing, and silently took the
 * no-op path — so the deploy reported success and the cache was never touched.
 * A no-op that looks identical to a success is worse than a failure.
 */
function resolveRedisUrl() {
  if (process.env.REDIS_URL) return process.env.REDIS_URL;

  for (const file of ENV_FILES) {
    let contents;
    try {
      contents = readFileSync(new URL(`../${file}`, import.meta.url), "utf8");
    } catch {
      continue; // Not present in this environment. Try the next.
    }
    const match = contents.match(/^\s*REDIS_URL\s*=\s*(.+)$/m);
    if (match) {
      // Strip surrounding quotes and any trailing comment.
      return match[1].trim().replace(/^["']|["']$/g, "");
    }
  }

  return null;
}

async function main() {
  const redisUrl = resolveRedisUrl();

  if (!redisUrl) {
    // Local build, or an environment with no Redis. Nothing is cached, so
    // there is nothing to clear. Said out loud, so this is never again
    // mistaken for a successful flush in a deploy log.
    console.log("[isr-cache] no REDIS_URL found, skipping (nothing is cached)");
    return;
  }

  const { createClient } = await import("redis");
  const client = createClient({ url: redisUrl, database: ISR_CACHE_DB });

  client.on("error", () => {
    // Swallowed on purpose. The catch below reports it once; the `error`
    // listener only exists because node-redis throws unhandled otherwise.
  });

  await client.connect();
  await client.flushDb();
  await client.quit();

  console.log(`[isr-cache] flushed Redis DB ${ISR_CACHE_DB}`);
}

main().catch((error) => {
  console.warn(
    `[isr-cache] could not clear the ISR cache: ${error?.message ?? error}`,
  );
  console.warn(
    "[isr-cache] the build is fine, but already-cached routes may serve stale chunk references and fail on hydration.",
  );
  console.warn(
    `[isr-cache] clear it by hand with: redis-cli -n ${ISR_CACHE_DB} flushdb`,
  );
});
