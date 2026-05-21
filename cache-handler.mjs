// Production-only ISR cache handler. Wires Next's incremental cache through
// @neshca/cache-handler backed by plain Redis. Disabled in development (Next
// falls back to the in-memory + filesystem handler).
import { CacheHandler } from "@neshca/cache-handler";
import createLruHandler from "@neshca/cache-handler/local-lru";
import createRedisHandler from "@neshca/cache-handler/redis-strings";
import { createClient } from "redis";

CacheHandler.onCreation(async () => {
    const redisUrl = process.env.REDIS_URL ?? "redis://localhost:6379";
    const client = createClient({ url: redisUrl });
    client.on("error", (err) => {
        console.error("[cache-handler] redis error", err);
    });
    await client.connect();

    return {
        handlers: [
            await createRedisHandler({
                client,
                keyPrefix: "kx:next:",
                timeoutMs: 1000,
            }),
            createLruHandler(),
        ],
    };
});

export default CacheHandler;
