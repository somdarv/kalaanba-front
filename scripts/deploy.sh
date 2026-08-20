#!/usr/bin/env bash
#
# Build and restart the Next node. Run on the server, from the repo root.
#
# `~/deploy-kalaanba.sh` fetches and resets to origin/main, then delegates
# here. The fetch has to stay out there: a script cannot pull the version of
# itself that is about to run. Everything after the pull lives in git, where it
# is reviewable and changes with the code that needs it.
#
# Every line below was already running on the box. This file is where it lives
# now, not a rewrite of it.

set -euo pipefail

cd "$(dirname "$0")/.."

echo "==> Installing dependencies"
# --legacy-peer-deps is load-bearing: the tree has a peer conflict that stops a
# plain `npm ci` dead. Do not drop it without checking the install still runs.
npm ci --no-audit --no-fund --legacy-peer-deps

echo "==> Building"
# `postbuild` (package.json) clears the Next ISR cache in Redis DB 2. That is
# not decoration: the cache survives both a rebuild and `pm2 reload`, so a
# cached page keeps pointing at the previous build's content-hashed chunks,
# those files are gone, and the page paints from the prerender then dies on
# hydration. It broke /auth/login twice. See scripts/clear-isr-cache.mjs.
npm run build

echo "==> Copying what standalone leaves out"
# `output: standalone` omits public/ and .next/static on purpose (Next assumes
# a CDN). We serve them from the same node process, so copy them in. rm -rf
# first so a rebuild cannot nest public/ inside itself.
rm -rf .next/standalone/public .next/standalone/.next/static
cp -r public .next/standalone/public
mkdir -p .next/standalone/.next
cp -r .next/static .next/standalone/.next/static
cp cache-handler.mjs .next/standalone/cache-handler.mjs
cp .env.local        .next/standalone/.env.local

echo "==> Reloading PM2"
pm2 reload sahara-kalaanba --update-env

echo "==> kalaanba deploy OK: $(date -u)"
