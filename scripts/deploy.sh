#!/usr/bin/env bash
#
# Build and restart the Next node. Run from the repo root on the server.
#
#   ./scripts/deploy.sh
#
# Lives in the repo, not in ~/deploy-kalaanba.sh, so the deploy steps are
# reviewable in git and change with the code that needs them. Point the
# server's forced-command script at this file and it stops drifting.

set -euo pipefail

cd "$(dirname "$0")/.."

echo "==> Installing dependencies"
npm ci

echo "==> Building"
npm run build

# `output: "standalone"` bundles the server and its node_modules and NOTHING
# else. Next deliberately omits these four, and every one of them has broken a
# deploy on this box before: no public/ means 404ing images, no .next/static
# means an unstyled page, no cache-handler.mjs means the ISR handler fails to
# resolve at boot, no .env.local means the runtime env is empty.
echo "==> Copying what standalone leaves out"
cp -r public .next/standalone/public
cp -r .next/static .next/standalone/.next/static
cp cache-handler.mjs .next/standalone/cache-handler.mjs
[ -f .env.local ] && cp .env.local .next/standalone/.env.local

# THE STEP THAT IS EASY TO SKIP AND BREAKS PAGES.
#
# DB 2 holds the Next ISR cache (`kx:next:*`) and it survives both `pm2 reload`
# and a fresh build. Once a rebuild changes a content-hashed chunk name, a
# cached page keeps pointing at the PREVIOUS build's chunks. Those files no
# longer exist, the browser 404s on them, and Next renders "This page could not
# load": the page paints from the prerender and then dies on hydration.
# Re-running the deploy does not fix it, because the rebuild is correct and the
# cache is not. This happened on /auth/login on 2026-08-19.
#
# `flushdb` on DB 2 only. NEVER `flushall`: DB 0 holds the outbox event streams,
# which have no TTL, and dropping one breaks the event spine (Constitution
# Law 6).
echo "==> Clearing the ISR cache (DB 2 only)"
if command -v redis-cli >/dev/null 2>&1; then
  redis-cli -n 2 flushdb
else
  echo "    redis-cli not found. The ISR cache was NOT cleared." >&2
  echo "    Expect stale chunk 404s on already-cached routes." >&2
fi

echo "==> Reloading PM2"
pm2 reload sahara-kalaanba --update-env

echo "==> Done."
