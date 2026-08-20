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

// The DB the cache handler writes to. Keep in step with cache-handler.mjs and
// with the `-n 2` in scripts/deploy.sh.
const ISR_CACHE_DB = 2;

async function main() {
  const redisUrl = process.env.REDIS_URL;

  if (!redisUrl) {
    // Local build, or an environment with no Redis. Nothing is cached, so
    // there is nothing to clear.
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
