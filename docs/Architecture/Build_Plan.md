# Kalaanba — Build Plan & Progress Tracker

**Status:** Living document — update as we go
**Started:** 2026-05-12
**Last updated:** 2026-08-23 — **full reconciliation against both repositories.** This file had been three months behind: it was last touched on 2026-05-26 and its change log stopped on 2026-05-22, while work shipped continuously through 2026-08-22. It reported Phase 1.1 (Season Engine) as not started when the engine was complete and ticking, and carried none of identity registration, identifier-first auth, admin users, area onboarding, the home rewire, player profiles, clubs and affiliations, the OKLCH token migration, the player-setup wizard, the whole player-card line, the site nav, the live VPS deploy, the BMS OTP provider, player media upload, or the `/me` surface. Every box below now reflects what is on disk. Where a box stays unticked, that was verified in the code, not assumed from the previous state of this file.
**Source spec:** [Full Kalaanba Brief](../Full%20Kalaanba%20Brief.md)
**Architecture:** [System Architecture](System_Architecture.md)

---

## How to use this file

- Each **Stage** has a goal, exit criteria, and a checklist of **targeted build phases** with concrete tasks.
- Update task status as you go: `[ ]` not started · `[~]` in progress · `[x]` done · `[!]` blocked · `[-]` dropped
- When a stage's exit criteria are met, mark the stage **DONE** and update the _Last updated_ date at the top.
- New tasks discovered mid-stage are added under the relevant phase. Don't silently skip — mark `[-]` with a one-line reason.
- The order matters. Don't start Stage N+1 until Stage N's exit criteria are met. The brief's discipline (Trust before official, gates before publishing, etc.) depends on this ordering.
- The **Discipline Rules** at the bottom apply across every stage and every task. They are not optional.
- **Update this file in the same commit as the work, not later.** It fell three months behind once (2026-05-26 → 2026-08-23) and told anyone reading it — including a fresh agent session — to go and build a Season Engine that had been running since May. A tracker that is wrong is worse than no tracker, because it gets believed. `REBUILD_PLAN.md` drifted the same way and had to be reconciled on 2026-08-12; the ADR index had 6 of 16 rows. The failure mode is always the same: the work ships, the packet closes, nobody walks back up to the tracker.
- **A box only gets ticked against code you have opened.** When reconciling, an unticked box is not evidence of anything — re-verify it before leaving it unticked, and say in the note that you did.

**Legend**

- 🎯 Stage goal
- ✅ Exit criteria
- 📌 Tasks (checklist)
- 🔗 Brief reference

---

## Progress Snapshot

| Stage | Title                                | Status         | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ----- | ------------------------------------ | -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0     | Foundations                          | 🟡 Almost done | 0.2–0.6, 0.7, 0.7.5, 0.8 shipped. **0.1 partially met by the real deploy** (2026-08-19): both repos run on one VPS behind Cloudflare, deployed by `scripts/deploy.sh` in each repo (git reset → build → reload), Postgres + Redis local to the box and not publicly bound. The multi-node topology, Meilisearch, WireGuard and zero-downtime symlink swap are all still unbuilt and are Stage 8 concerns, not blockers. Remaining in 0.8: Horizon dashboard mount + uptime monitoring. Frontend UI rebuild WP-20260524 is at Phases 0–5 + 8 + 9 complete; Phase 6 (theme switcher v3) and Phase 7 (site shell) open. |
| 1     | Identity Spine                       | 🟡 In progress | **1.1 Season ✅** (was wrongly logged as not started — the engine, the ticker, the Redis leader lock and all three events have been live since 2026-05-25). **1.2 Zone ✅** + Ghana's regions and localities seeded on deploy. **1.3 Identity** ~ — registration, identifier-first auth, email verify, channel binding, profile, avatar, admin Users section and live BMS OTP all shipped; role assignment/promotion and scope-middleware application are the two open items. **1.4 Club** ~ — create, discover, join-request accept/decline shipped; verified badge, dormancy, archive/merge, related-club detection and club profile UI open. **1.5 Player** ~ — profile, `/meta`, `GET /players/me`, media upload, photo crop, the player card and its share graphic, and the `/me` surface all shipped; **ghost players, claim-by-OTP and the minor-protected flag are the Stage 1 exit blockers.** **1.6 Trust stub ⬜** not started. |
| 2     | The Match                            | ⬜ Not started | One exception: 2.5's in-app inbox table and its four endpoints shipped 2026-05-25 (WP-20260525-notif-inbox-v1). No frontend client for it yet. |
| 3     | Competitions                         | ⬜ Not started |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| 4     | Distribution                         | ⬜ Not started |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| 5     | Drama Layer (RP + Challenges + Buzz) | ⬜ Not started |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| 6     | Operations & Revenue                 | ⬜ Not started |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| 7     | Recognition & Governance UI          | ⬜ Not started |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| 8     | Hardening for 500K DAU               | ⬜ Not started |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |

Stage status options: ⬜ Not started · 🟡 In progress · ✅ Done · ⏸ Paused · ❌ Blocked

---

## Stage 0 — Foundations

🎯 **Goal:** Build the invisible plumbing once, properly. Nothing user-facing. If we skip any of this, we rewrite it under pressure later.

✅ **Exit criteria:** A developer can hit `/api/health`, the request flows through middleware, emits an analytics event, writes an outbox row, and a worker picks it up. All visible in dashboards. The architecture lint blocks cross-module reach-ins in CI.

🔗 **Brief refs:** §2.2 (principles), §6.2 (engine map), §11 (NFRs), §15 (open questions — all answered in System_Architecture.md §14)

### Phase 0.1 — Repos, CI, infra spine

- [x] Confirm repo strategy (two repos: `kalaanba-api`, `kalaanba-front`) — current state in workspace
- [-] Wire CI pipelines (GitHub Actions): lint, test, build for both repos _(deferred per user — agent-level post-flight gates only for now)_
- [~] Provision minimal infra — _2026-08-19: both apps run on **one VPS**, not the seven-node spread this line describes. Postgres and Redis are local to that box (so "no public DB/Redis ports" holds by construction, not by WireGuard). **Redis is mandatory, not optional**: the Next node routes its ISR cache through it. Meilisearch is not installed and nothing needs it yet. R2 bucket `kalaanba-dev-storage` is wired and credentialed._
- [~] Cloudflare in front (DNS, TLS) — _a production origin is live and pinned in the API's CORS config (`Pin CORS origin and add deploy workflow`). WAF baseline not configured._
- [-] Private network / WireGuard between nodes — _not applicable while everything is one box. Re-opens the moment a second node appears._
- [ ] Domain + subdomain plan (`app.`, `api.`, `admin.`, `ws.`)
- [~] Deploy tooling — _`scripts/deploy.sh` in **both** repos, committed 2026-08-19/20. A thin `~/deploy-kalaanba*.sh` on the box fetches and resets to `origin/main`, then delegates into the repo so every step after the pull is reviewable. Front: `npm ci --legacy-peer-deps` (load-bearing, a peer conflict stops plain `ci` dead) → build → **postbuild flushes the ISR cache in Redis DB 2** (it survives both rebuild and `pm2 reload`, so a cached page keeps pointing at the previous build's content-hashed chunks; it broke `/auth/login` twice) → copy what `output: standalone` omits (`public/`, `.next/static`, cache handler, env) → reload. API: `composer install --no-dev` → `migrate --force` → seed config (adds missing keys only) → restart, pinned to `php8.4` because the box has more than one PHP and the default is not this one. **This is a reload, not the zero-downtime symlink swap this line specifies** — that stays open._

### Phase 0.2 — Laravel module scaffold

- [x] Install Laravel 11.53.1, PHP 8.4.16, Composer 2.9.5 _(local; FrankenPHP worker mode deferred to infra stage)_
- [x] Create `app/Modules/` with one folder per engine (17 modules) — `AdminGovernance`, `Analytics`, `AwardsRecognition`, `Challenge`, `Club`, `CompetitionRules`, `FanBuzz`, `MatchFixture`, `ModerationSafety`, `NotificationDistribution`, `PlayerAffiliation`, `RefereeOfficiator`, `RpEconomy`, `Season`, `TrustVerification`, `VenueSurfaceBooking`, `Zone`, each with `Domain/Application/Infrastructure/Http/` layers (`Listeners/Jobs/Contracts/Policies/Config/Tests` to be added per-WP as needed)
- [x] Per-module service providers wired in `bootstrap/providers.php` (17 providers, one per engine)
- [ ] Per-module route registration pattern _(provider `boot()` placeholder ready; real `Http/routes.php` lands with first engine WP)_
- [x] **Deptrac** (deptrac/deptrac 3.x) configured to forbid cross-module reach-ins — `composer deptrac` 0 violations
- [x] **Pest Architecture** tests bootstrapped — `tests/Architecture/ArchitectureTest.php` with no-debug + strict_types rules (6/6 passing)
- [x] Composer scripts: `lint` (pint --test + larastan), `test` (pest), `deptrac`, `check` (lint + deptrac + test)
- [x] Larastan/PHPStan baseline at level 6 (level 8 target for `Domain`/`Application` deferred to follow-up ADR)
- [x] Pint configured (Laravel preset)
- [~] **Schema-per-module migration convention** with namespaced migrations _(config/database.php updated with per-engine search_path; namespaced migration folders land per-WP)_
- [ ] Architectural lint: no foreign keys across module schemas — fails CI
- [x] `Model::preventLazyLoading()` + `preventAccessingMissingAttributes()` + `preventSilentlyDiscardingAttributes()` enabled outside production

### Phase 0.3 — Event bus + outbox ✅ 2026-05-21

- [x] `outbox_events` table (id, event_id, event_name, schema_version, payload, occurred_at, delivered_at, attempts, last_error)
- [x] OutboxRelay worker — `php artisan outbox:relay` (polls pending → publishes → marks delivered, max 5 attempts)
- [x] Redis Streams as transport (`predis/predis` v3; `REDIS_CLIENT=predis`; stream key `kalaanba.events.<engine>`)
- [x] Idempotent listener pattern: `event_dedupe` table, `(event_id, listener_name)` PK, `DedupeStore` helper
- [x] Event naming convention enforced: `engine.action` regex in `OutboxEnvelope` constructor + 8 unit tests
- [x] `config/eventbus.php` — configurable `stream_prefix` and `max_relay_attempts`
- [x] **`health.ping` event end-to-end confirmed** — outbox write → relay → Redis XADD → `delivered_at` set

### Phase 0.4 — Analytics envelope ✅ 2026-05-22

- [x] `analytics.events` table, daily partitioned — Postgres native `PARTITION BY RANGE (occurred_at)`, parent + default catch-all + 7 forward-day partitions seeded at install
- [x] Standard payload shape — `event_id, event_name, schema_version, occurred_at, actor_user_id, actor_role, source, session_id, device_id, route, context (jsonb), properties (jsonb), received_at`
- [x] Schema registry in code (`app/Modules/Analytics/Schemas/`), versioned — `EventSchema` value object + `EventSchemaRegistry` singleton populated from `SchemaCatalogue::all()`; first schema is `health.ping@v1`
- [x] Emit helper that validates against registry — `AnalyticsEmitter` resolves schema by `(event_name, schema_version)`, rejects unknown schemas + unknown/missing properties before writing via `DatabaseAnalyticsEventWriter`
- [x] Schema-validation test that fails CI if event shape drifts — `tests/Architecture/ArchitectureTest.php` guards catalogue integrity + key uniqueness + Domain framework-purity
- [x] `analytics:ensure-partitions` console command — idempotent daily roll-forward of partitions

### Phase 0.5 — Admin Config registry ✅ 2026-05-22

- [x] `admin_config` table (key, scope, scope_id, value, effective_from, version, approved_by) — `string(36)` for nullable scope_id, UNIQUE constraint on (key, scope, COALESCE(scope_id, ''), effective_from)
- [x] Redis cache layer with TTL + bust-on-write — `kx:config:v1:<key>:<scope>:<scopeId>:<timestamp>` pattern, 5-min TTL, invalidated on set()
- [x] `Config::get(key, scope, scopeId?, at?)` helper with effective-dated reads — `ORDER BY effective_from DESC, version DESC` for time-travel queries
- [x] Seed defaults from brief (RP win/draw/loss, challenge windows, season dates, etc.) — 14 platform defaults seeded in `AdminConfigSeeder`
- [x] Approval workflow stub (Low/Med/High/Critical) — metadata (approvedBy, approvalLevel, changeReason) stored; enforcement deferred to Stage 6

### Phase 0.6 — Auth + authorization

Phase 0.6 is delivered as three sequential Work Packets so each can clear the full 10-stage pipeline independently.

#### WP-A — Identity foundation ✅ (WP-20260522-identity-foundation)

- [x] Sanctum installed, token issuance endpoint — `POST /api/v1/auth/sessions`, `DELETE /api/v1/auth/sessions/current`; 30-day token TTL; `Idempotency-Key` required; 5/min throttle by email+IP
- [x] User model + role enum (Fan, Player, ClubRep, ClubAdmin, CompOrg, Referee, Officiator, FacilityMgr, HubAdmin, KalaanbaAdmin, SuperAdmin) — `Kalaanba\Support\Auth\Role` backed enum with snake_case internal keys; users table extended with `role`, `phone_e164_hash`, `phone_e164_last4`, `archived_at`, `last_seen_at`; Postgres CHECK constraint enforces the 11 roles
- [x] `Kalaanba\Support\Http\Middleware\IdempotencyKeyMiddleware` — `kx:idem:v1:` prefix, 24h TTL, replay on duplicate key (`meta.idempotent_replay`), error code `auth.idempotency_key_required` on missing header
- [x] OpenAPI 3.1 contracts: `contracts/api/auth/post-sessions.v1.yaml`, `contracts/api/auth/delete-sessions-current.v1.yaml`
- [x] Architecture tests pin: Role enum no framework deps, IdempotencyKey middleware confined to Support, engine modules do not depend on `App\Models\User` directly (Support port enforced)
- [x] Pipeline gates: pint, phpstan L6, deptrac (0 violations), pest (all green)

#### WP-B — OTP login + authorization scaffolding ✅ (WP-20260522-otp-and-policies)

- [x] OTP issuance endpoint — `POST /api/v1/auth/otp/request` (issues 6-digit OTP bound to E.164 phone, 5-min TTL, rate-limited 5/min by phone+IP); mock provider behind `auth.otp_provider` config key (WhatsApp arrives in Phase 4)
- [x] OTP verification endpoint — `POST /api/v1/auth/otp/verify` (consumes OTP, issues Sanctum token, identical envelope to WP-A `sessions.store`); single-use OTPs with attempt counter
- [x] `Kalaanba\Support\Auth\Otp\OtpService` + `OtpStore` (cache-backed via `CacheOtpStore`; in-memory `ArrayStore` for tests); `CodeGenerator` seam introduced because `Random\Randomizer` is final (production binding: `RandomCodeGenerator`)
- [x] Config keys: `auth.otp_ttl_seconds` (default 300), `auth.otp_max_attempts` (default 5), `auth.otp_length` (default 6), `auth.otp_provider` (default `mock`), `auth.allow_password_login` (default true) — registered under `contracts/config/auth/`
- [x] Policy base — `App\Policies\BasePolicy` with `before()` that short-circuits for platform admins; one policy per engine resource as engines arrive
- [x] Scope middleware: `scope:hub|club|competition|venue` — `Kalaanba\Support\Http\Middleware\ScopeMiddleware` resolves via `ScopeResolver` port; default `DenyAllScopeResolver` allows only platform admins until engines bind concrete resolvers; deny → 403 with code `auth.out_of_scope`
- [x] Phone privacy enforced: only `phone_e164_hash` + `phone_e164_last4` stored, never the raw E.164; logs scrub OTP values; `PhoneHash` HMAC-SHA256 with `app.key` as secret
- [x] OpenAPI contracts: `contracts/api/auth/post-otp-request.v1.yaml`, `contracts/api/auth/post-otp-verify.v1.yaml`
- [x] Architecture tests pin: OTP machinery confined to Support+App; scope resolver confined to Support+App; `PhoneHash` only consumed by Support, App, and Database\Factories
- [x] Pipeline gates: pint, phpstan L6, deptrac (0 violations), pest green (85 tests, 195 assertions)

#### WP-C — Admin audit log ✅ (WP-20260522-admin-audit-log)

- [x] `admin_audit_log` table — append-only, partitioned monthly by `occurred_at` on Postgres with a default partition; ops cron pre-creates monthly partitions and detaches old ones for archive; no UPDATE/DELETE grant for app role (to be applied in `scripts/setup-postgres.sql` at deploy)
- [x] `Kalaanba\Support\Http\Middleware\AdminAuditMiddleware` auto-logs every authenticated mutating request (POST/PUT/PATCH/DELETE) where the actor role `isPlatformAdmin()` is true; appended globally to the `api` middleware group
- [x] Audit row: `actor_id`, `actor_role`, `request_id`, `route`, `method`, `path`, `payload_redacted` (via `PayloadRedactor` — strips password / token / secret / otp / authorization / cookie / api_key / pin / cvv / phone_e164), `response_status`, `occurred_at`
- [x] No domain code writes to the audit log directly — only the middleware (Constitution Law 5)
- [x] `Kalaanba\Support\Audit\AdminAuditEntry` (readonly value object), `AdminAuditWriter` interface, `DatabaseAdminAuditWriter` impl, `PayloadRedactor` service; DI bindings in `AppServiceProvider`
- [x] `GET /api/v1/admin/audit-log` reader endpoint — `App\Http\Controllers\Admin\AuditLogController`, cursor pagination (default 25, max 100), gated by new `super_admin` middleware (`RequireSuperAdminMiddleware`) using new `Role::isSuperAdmin()` helper
- [x] OpenAPI contract `contracts/api/admin/get-audit-log.v1.yaml` (Super Admin only, cursor pagination, redacted payload schema)
- [x] Config contract `contracts/config/admin/admin.audit_log_retention_days.yaml` (default 2555 ≈ 7 years, critical approval tier)
- [x] Architecture tests pin: audit machinery confined to Support+App; `AdminAuditEntry` is readonly
- [x] Audit-write failures NEVER break the user request (try/catch around writer.write)
- [x] Pipeline gates: pint, phpstan L6, deptrac (0 violations), pest green (98 tests, 237 assertions)

### Phase 0.7 — Frontend skeleton

- [x] Next.js 16 with App Router, TypeScript strict (+ `noUncheckedIndexedAccess`), Tailwind, shadcn/ui — legacy showcase archived under `src/app/(legacy)/showcase` + `src/components/_archive/`
- [x] TanStack Query, React Hook Form, Zod, MapLibre GL, Lucide
- [x] OpenAPI codegen pipeline (`scripts/codegen-api.mjs` walks `contracts/api/<engine>/*.yaml` → `src/lib/api/generated/<engine>.ts`)
- [x] `src/lib/api/` client with bearer token (`kalaanba-auth-token` from localStorage), envelope + `ApiError` (stable `engine.code`), automatic `Idempotency-Key` on POST/PUT/PATCH/DELETE, Zod-validated response data
- [x] `laravel-echo` + `pusher-js` lazy stub (`src/lib/realtime/echo.ts`) — wiring deferred to Stage 4 Reverb
- [x] PM2 `ecosystem.config.cjs` (cluster, 512M restart), `output: "standalone"` next.config
- [x] Custom cache handler `cache-handler.mjs` (@neshca/cache-handler + `redis-strings` adapter, `kx:next:` prefix, 1s timeout, LRU fallback) — production-only
- [x] Pipeline gates: eslint, tsc --noEmit (TS strict + noUncheckedIndexedAccess), vitest green (1 file, 8 tests), `next build` standalone OK

### WP-20260522-theme-rebuild — Theme system v2 ❌ Reversed 2026-05-24

- [x] Legacy routing fixed: `(legacy)` route group → real `/legacy/*` segment; index at `/legacy`, original landing recovered from git `ecc7aec` at `/legacy/landing`, prototype showcase at `/legacy/showcase`
- [x] `globals.css` v2 rewrite: dropped `kx-` prefix for clean semantic names (kept in place — still the basis of the new design language)
- [-] Runtime `ThemeProvider` + bootstrap script + `ThemeToggle` — **removed 2026-05-24** because the switcher stuttered and felt cheap. CSS light/dark token blocks preserved. New switcher (cookie-based, SSR-stable, settings-only segmented control) will be built in Phase 6 of the UI rebuild — see [docs/design-system/REBUILD_PLAN.md](../design-system/REBUILD_PLAN.md).

### WP-20260524-ui-rebuild — UI Foundation rebuild (live)

🔗 Canonical docs: [docs/design-system/README.md](../design-system/README.md)

- [x] Old theme system fully excised (provider, test, toggle, bootstrap script, barrel export, archive shim).
- [x] Design language spec authored — `docs/design-system/DESIGN_LANGUAGE.md` (solid · proactive · premium).
- [x] Phase-by-phase rebuild plan authored — `docs/design-system/REBUILD_PLAN.md`.
- [x] `src/components/ui/` cleared. Legacy showcase preserved under `_archive/` for visual reference only.
- [x] **Phase 1 — Tokens** (2026-05-24), then **replaced wholesale by the OKLCH v3 layer** (2026-08-12, ADR-0006). The audit in `docs/design-system/token-audit.html` scored v2 at 11/20: four of five filled buttons failed WCAG AA for their own labels, the focus ring measured 1.00:1 against the button it marked, and the "raised" elevation step was ΔL 0.022. Fixed at the token source rather than per-component.
- [x] **Phase 2 — Primitives** (Pressable, Button/IconButton, Card, TextField/SearchField, Badge/Avatar). Two unit-test boxes remain open in `REBUILD_PLAN.md` §2.1/§2.2 (hit-area-survives-override, keyboard/disabled/loading).
- [x] **Phase 2.5 — Mobile chrome** (Overlay, BottomSheet, BottomNav, KeyboardFooter, Toast, viewport meta, `min-h-dvh`, theme-color pair).
- [x] **Phase 3 — Overlays** (Tooltip, Dialog) and **Phase 4 — Form & navigation** (Select, Checkbox/Radio/Switch, Tabs, Skeleton, RHF helpers).
- [x] **Phase 5 — Living surfaces** (`<LiveSurface>`).
- [x] **Phase 8 — Football primitives** (2026-08-12): `Eyebrow`, `StatValue`/`StatBlock`, `Crest`, `LiveIndicator`, `ScoreLine`, `FixtureRow`. `StandingsTable` is the one still open, and it is blocked on Stage 3 standings existing at all.
- [x] **Phase 9 — Suite-wide v3 migration** (2026-08-12): 45 files swept. Brand-as-text → `-ink` roles (57 occurrences, a live contrast regression), `bg-surface-2` → `bg-surface-elev`, `rounded-full` → `rounded-pill`, hardcoded durations → motion tokens.
- [ ] **Phase 6 — Theme switcher v3**: cookie-based, SSR-stable, settings-only. ADR not yet drafted. Note the app is currently **locked to light** (WP-20260819).
- [ ] **Phase 7 — Composed site shell**: `<SiteFooter>` and the decommissioning of `/legacy/showcase` are open. `<SiteHeader>` effectively shipped as the site nav (WP-20260820) — menu right, account in the sheet, real logo, live ticker.
- [ ] **Debt**: the home still renders `_archive/*` through the `/legacy/landing` route. The redirect keeps it out of new-code imports but the page itself is legacy. A DESIGN_LANGUAGE-compliant home is owed.
- [ ] **Debt**: three surfaces still render "Kalaanba" as display text instead of `<Wordmark>` — `src/components/ui/app-shell.tsx`, `src/app/admin/_components/admin-nav.tsx`, `src/app/showcase/showcase-client.tsx`.

> Full per-phase detail and the per-component definition of done live in [docs/design-system/REBUILD_PLAN.md](../design-system/REBUILD_PLAN.md), which was itself reconciled on 2026-08-12 after its boxes had drifted the same way this file's did.

### Phase 0.7.5 — God Mode developer admin portal (Filament v3) ✅ 2026-05-25

🔗 Canonical decision: [ADR-0002](../adr/0002-filament-godmode-admin-portal.md)

> Two-admin mental model: **God Mode `/admin` (Filament, dev-only, internal)** is distinct from the future **Public Admin Portal (Next.js, Stage 6+, brand-fit, scoped per role)**.

- [x] Install `filament/filament` v3 in `kalaanba-api`; configure panel at `/admin` route prefix
- [x] Wire `RequireSuperAdminMiddleware` (WP-C) onto the Filament panel
- [x] Light brand theming: Kalaanba palette (primary + danger + success), Inter font, replace default logo with Kalaanba wordmark
- [x] Auto-discovery configured for `app/Modules/<Engine>/Filament/Resources/` so engine WPs can drop in their own resources
- [x] **Resource: `UserResource`** — list/edit/archive users, change role, impersonate, reset password (dev only)
- [x] **Resource: `OutboxEventResource`** — list `outbox_events`, view payload, re-emit action, mark delivered
- [x] **Resource: `AdminAuditLogResource`** — read-only viewer, filters by actor/route/method/status, payload pretty-print
- [x] **Resource: `AdminConfigResource`** — CRUD over `admin_config`; effective-dated reads + write-with-version
- [x] **Resource: `AnalyticsEventResource`** — read-only, filters by event_name/actor/date
- [x] **Custom page: User Inspector** — pick a user, tabbed view (profile, audit-log entries, outbox events emitted, active Sanctum tokens, recent OTP requests)
- [x] **Custom page: Event Replayer** — re-emit any `outbox_events` row
- [x] **Custom page: Data Injector v0** — one-click "create mock user with phone 0244000001", "create mock outbox event"
- [x] Every Filament action passes through existing `AdminAuditMiddleware` (Constitution Law 5)
- [x] No domain logic inside Filament resources — call into module Application services only (admin Eloquent models are read-only per ADR-0002)
- [x] `GodModeBootstrapCommand` + `SuperAdminSeeder` + `TouchLastSeenAt` middleware (49 admin tests)
- [x] Pipeline gates: pint, phpstan L6, deptrac (0 violations), pest green

> **Forward-compatibility rule (binding from Phase 1.1 onwards):** every engine Work Packet must list `app/Modules/<Engine>/Filament/Resources/*.php` deliverables in its definition-of-done.

### Phase 0.8 — Observability (Lite) ✅ 2026-05-25 (Horizon deferred)

> Pre-alpha scope: ship the bare minimum to catch real errors and stay informed. The full stack (Prometheus / Grafana / Loki / Tempo / Telescope) is deferred to **Phase 9 — Pre-launch hardening** because it pays off only with real production traffic + an on-call rotation.

- [x] Sentry on Laravel (`sentry/sentry-laravel`) — DSN via env (`SENTRY_LARAVEL_DSN`), sample rate 100% during alpha; `Integration::handles($exceptions)` wired in `bootstrap/app.php`; graceful no-op when DSN unset
- [x] Sentry on Next.js (`@sentry/nextjs ^10.53.1`) — `instrumentation.ts` + `instrumentation-client.ts` + `sentry.server.config.ts` + `sentry.edge.config.ts`, all gated on `NEXT_PUBLIC_SENTRY_DSN`
- [x] `RequestIdMiddleware` (`Kalaanba\Support\Http\Middleware\RequestIdMiddleware`) — propagates `X-Request-Id` (incoming or UUIDv4), tags Sentry scope, shares Log context (4 tests)
- [x] `GET /api/v1/health` endpoint (`App\Http\Controllers\HealthController`) — DB + Redis liveness, 200 ok / 503 degraded, request-id echoed (2 tests)
- [ ] Horizon dashboard mounted (read-only on `/admin/horizon`, gated by `RequireSuperAdminMiddleware`) — **deferred to follow-up WP**
- [x] JSON-format logs to stdout (`LOG_STDERR_FORMATTER=Monolog\Formatter\JsonFormatter` documented in `.env.example`)
- [ ] UptimeRobot (or BetterStack) on `GET /api/v1/health` (Laravel) + Next.js root — **external; pending production DSN**
- [x] Pipeline gates: pint, phpstan L6, deptrac (0 violations), pest green (55 tests + 18/18 architecture)

### Phase 9 — Pre-launch hardening (deferred observability + security)

> Opened pre-beta, before public marketing. Out-of-scope for pre-alpha + alpha.

- [ ] Laravel Pulse + Telescope (Telescope sampled in prod)
- [ ] Prometheus + Grafana stack
- [ ] Loki + Promtail; JSON logs already to stdout from Phase 0.8
- [ ] OpenTelemetry → Tempo
- [ ] Baseline alerts: p95 latency, 5xx rate, queue depth, replication lag, Redis memory, disk %
- [ ] 2FA enforcement on `SuperAdmin` role (TOTP + recovery codes)
- [ ] Optional: relocate `/admin` behind IP allowlist + signed cookie
- [ ] Filament resource audit — confirm no unintended write paths leaked into public surfaces

---

## Stage 1 — Identity Spine

🎯 **Goal:** Stand up the entities everything else depends on — time, place, people, teams.

✅ **Exit criteria:** A Hub Admin can create their hub's zones; a user can sign up; a club can be created; a player can be added as a ghost and later claimed via OTP. All events emit to analytics. Trust module is stubbed and always clears.

🔗 **Brief refs:** §4 (geography), §5 (calendar/season), §6.1 (engines 1, 2, 3), §7.1 (clubs), §7.2 (players), §10.1 (V1 must-haves)

### Phase 1.1 — Season Engine ✅ 2026-05-25

> **Reconciled 2026-08-23.** Every box below was already true and this file said the phase had not started. The engine shipped alongside the notification inbox and was never logged.

- [x] `seasons` table — `2026_05_25_000002_create_seasons_table.php`
- [x] Season windows + phase definitions — `SeasonCalendar` computes the window and the phase from config; `SeasonPhase` and `SeasonWindow` are the domain types. Rows are upserted from the computed window rather than seeded by hand, so a season cannot drift from its own definition.
- [x] `Season::current()` cached helper — `CurrentSeason::at()`, 5-minute TTL on `kx:season:current:v1:<Ymd>`, with `forget()` called by the tick command after writes. Documented as **the single public read port**: no other engine may query the `seasons` table (Law 1).
- [x] Scheduler with leader-election Redis lock — `SeasonTickCommand` takes `Cache::lock('kx:season:scheduler:v1', 90)`; the schedule entry adds `withoutOverlapping()`.
- [x] Phase transition jobs emitting `season.phase_changed`, `season.cutoff_passed`, `season.rp_reset_due` — all three go through the outbox. Event ids are deterministic UUIDv5 over season + boundary + target instant, so a re-run cannot double-emit (Law 14).
- [x] Configurable cutoffs read from Admin Config — 13 `season.*` keys seeded in `AdminConfigSeeder` and loaded through `AdminConfigSeasonConfigLoader`. No date is a literal in domain code.

### Phase 1.2 — Geography / Zone Engine ✅ 2026-05-26

- [x] Tables: countries, regions, city_hubs, zones, belts, areas (UUID PKs, versioned per season)
- [x] `area_suggestions` queue table (status: pending / approved / rejected, reviewer_id UUID, review_note, decided_at)
- [x] Area → Zone/Belt mapping (admin-managed via approve flow)
- [x] Submit suggestion flow (`SubmitAreaSuggestion` Application service) + repository (`AreaSuggestionRepository`)
- [x] Approve / reject Application services (`ApproveAreaSuggestion`, `RejectAreaSuggestion`) — approval mints a verified `areas` row inside target zone
- [x] `GeographyReader` query layer (city hubs, zones, areas, suggestions)
- [x] Admin HTTP endpoints (super_admin scoped):
  - `GET  /admin/zone/area-suggestions` (filter by status)
  - `POST /admin/zone/area-suggestions/{id}/approve` (idempotent — `Idempotency-Key` required)
  - `POST /admin/zone/area-suggestions/{id}/reject` (idempotent — `Idempotency-Key` required)
- [x] Seed Tamale City Hub with realistic areas/zones (test fixtures)
- [x] Pest: 61 feature tests pass (Admin + Zone) · PHPStan 0 errors (213 files) · Deptrac 0 violations · Pint clean
- [x] Contracts (kalaanba-front/contracts/api/admin/zone/): `get-area-suggestions.v1.yaml`, `post-area-suggestion-approve.v1.yaml`, `post-area-suggestion-reject.v1.yaml`
- [ ] Hub Admin policy gates (currently super_admin only — Hub Admin scope deferred until Phase 1.3 Identity)
- [ ] Public read endpoints for area/zone pickers (deferred — admin-only flows shipped first)

#### Phase 1.2.5 — Next.js Public Admin Portal — Zone slice ✅ 2026-05-26

> Distinct from God Mode `/admin` Filament panel in `kalaanba-api` (dev-only, internal). This is the **brand-fit, scoped-per-role public admin** originally planned for Stage 6+, pulled forward to unblock Zone approvals.

- [x] Admin shell at `/admin` in `kalaanba-front` (Next.js App Router, native — NOT Filament)
- [x] `layout.tsx` with sidebar (`AdminNav`) + main content area
- [x] `/admin` overview landing
- [x] `/admin/configs` — read-only `admin_config` viewer; filters by engine prefix + approval level; columns: key / scope / value / version / approval / effective
- [x] `/admin/zone/area-suggestions` — pending / approved / rejected tabs + Approve/Reject dialog (final_name + review_note inputs)
- [x] Idempotency: client generates `crypto.randomUUID()` per write, sent via API client's `Idempotency-Key` header
- [x] Error surfacing: `ApiError.code` rendered inline with message
- [x] Zod schemas + TanStack Query hooks (`src/lib/api/admin.ts`, `src/lib/api/hooks/use-admin.ts`)
- [x] Contracts: `contracts/api/admin/get-configs.v1.yaml`
- [x] Frontend gates: vitest 24/24 ✅ · typecheck clean for admin code · lint clean for admin code (pre-existing `ui/*` errors unrelated)
- [ ] Admin config WRITE flow (propose → approve → effective) — deferred
- [ ] Migrate admin pages from raw Tailwind tokens to design-system primitives (Card/Stack/Dialog) — deferred follow-up

#### Open architectural decision (blocking future engines)

- [x] ~~**users.id BIGINT ↔ Zone UUID FK mismatch.**~~ Resolved via **Option D — migrate `users.id` to UUIDv7-ordered** (Laravel `HasUuids` trait, `Str::orderedUuid()`). Pre-alpha one-time edit to merged migrations (engineering-standards §6 exception, authorised by ADR-0003). UUIDv5 reviewer-mapping hack removed from `AreaSuggestionController`.
- [x] **ADR-0003** captured the decision (`docs/adr/0003-uuidv7-user-identity.md`, WP-20260528-users-uuid-migration). All gates green: pint ✅, phpstan ✅, deptrac ✅, pest 120 feature + 24 architecture ✅.

### Phase 1.3 — Identity / Users

- [x] Full OTP registration flow (mock provider) — _WP-20260530: phone+OTP signup, email+password signup, email-verify, channel binding. All gates green (pest 260, phpstan L6 0, deptrac 0, pint clean)._
- [x] **Live OTP delivery over SMS** — _WP-20260819-otp-sms-provider then WP-20260819-bms-otp-provider. SMSOnlineGH landed first (ADR-0008) and was replaced by **BMS / Bulk Messaging Solutions** (ADR-0009) within the same day, on one ground: the sender ID is actually approved there. ADR-0008 is superseded on the vendor choice only; every structural decision in it stands. Selected through the existing `auth.otp_provider` config key, so the swap needed no code change at the call site. **This supersedes Phase 0.6 WP-B's note that WhatsApp arrives in Phase 4** — phone login runs on SMS today and WhatsApp is no longer on the critical path._
- [x] User profile (name, phone hash, area, optional avatar in R2) — _WP-20260529: `GET/PATCH /users/me`, avatar driver (local + Cloudinary), public `GET /users/{id}`._
- [ ] Role assignment + admin promotion flow — _still open, re-verified 2026-08-23: no `changeRole` / promotion path exists anywhere in `app/`. `user` is the universal default role (Role enum + engine doc §9). WP-20260531 was never opened._
- [x] Admin Users section (pre-alpha tester support) — _WP-20260624-admin-users (ADR-0005): `/api/v1/admin/users` list + actions (resend OTP, set password, force-verify, edit phone/email, enable/disable, clear lockout); `disabled_at` + `admin_access_codes` (seeded `023050`, hashed) schema; destructive actions gated by the access code; auto-audited + redacted; real wired `/admin/governance/users` UI. 8 feature + 28 arch tests green; front 35 green. Deferred: one-time login link, temp single-use code, dependency-checked delete._
- [ ] Scope middleware applied to protected routes — _re-verified 2026-08-23: `ScopeMiddleware` is registered as the `scope` alias in `bootstrap/app.php` and applied to **zero** routes, and `ScopeResolver` is still bound to `DenyAllScopeResolver`. The machinery is fail-safe and inert. Every engine that grows a scoped surface has to bind its own resolver._
- [x] Frontend: signup, login, profile screens — _auth UI (`/auth/login`, `/auth/signup`), `src/lib/api/auth.ts` + `use-auth.ts` (front commit `a069795`), then reworked into the identifier-first split-screen entry (WP-20260819-auth-split-screen). Post-signup area onboarding shipped (WP-20260625, below). **Closed 2026-08-23**: the profile screen this line was waiting on is `/me`, shipped in WP-20260821-me-surface, and avatar editing shipped with the photo crop flow in WP-20260822-player-card-artefact. `/dashboard` was retired into `/`._
- [x] Post-signup area onboarding — _WP-20260625-onboarding-area: skippable City Hub → Area picker after signup (`/onboarding/area`), suggest-a-missing-area, persists via `PATCH /users/me`. Contract-first: 3 Zone read OAS (`get-hubs`, `get-areas`, `post-area-suggestions`). Backend shipped in **WP-20260625a-zone-public-read** (`GET /zone/hubs`, `GET /zone/areas`, `POST /zone/area-suggestions` + fix for the unauthenticated-API 500 → 401 JSON). Live-verified end-to-end. Front: lint + new-file typecheck + 4 onboarding tests green; back: Pint + PHPStan + Deptrac + 9 feature tests green._
- [x] Identifier-first progressive auth — _WP-20260624 (ADR-0004): single neutral entry, `POST /auth/lookup` branch signal (read-only, throttled, no PII), `<AuthFlow>` orchestrator + spec copy/error/resend/back-paths; `/auth/signup` redirects to the unified entry. Backend: 9 feature tests + phpstan + 28 architecture tests green; front: 6 flow tests + client tests green. Fixed the api-client envelope-unwrap mismatch in `auth.ts`/`use-auth.ts` (schemas now describe inner `data`)._
- [x] Home rewire — _WP-20260702-home-rewire (front only, no backend/contract): `/` now redirects to the interim live-activity home (legacy landing reused as-is); post-auth tail (`/onboarding/area → /`) and the retired `/dashboard` stub both land on `/`. Added `<HomeCtaPrompts>` (`src/components/site/`) — two optional soft prompts ("Set up your player profile" → `/player/setup`, "Join a club near you" → `/clubs/near-you`); "Create a club" omitted in V1; both CTAs route to coming-soon stubs until WP-B/WP-C. First of the 3-WP onboarding split (A home, B player profile, C club finder+join). Front: 3 CTA tests + 4 onboarding tests green, WP-A files typecheck clean. **Debt:** the home still imports `_archive/*` via the legacy route — rebuild a design-system-compliant home in a follow-up WP._

### Phase 1.4 — Club Engine

- [~] Clubs table with maturity levels (Informal/Structured/Verified/Registered) — _WP-20260702-club-finder-join (WP-C1): `clubs` table (maturity `ClubMaturity` enum, default informal) + `club_memberships` (creator → Owner) + `archived_at`; no cross-schema FK to Zone/Identity (Law 1). `POST /api/v1/clubs` (create → Owner membership, emits `club.created` v1 via outbox) + `GET /api/v1/clubs?area_id=` discovery. Club module vertical (Domain Club/ClubMembership + ClubMaturity/ClubRole enums + ClubRepository/ClubReader ports, `CreateClub` app service validating location via Zone `GeographyReader`, `EloquentClubStore`). Contracts `{post,get}-clubs.v1.yaml` + `club.created` event + 4 config keys. Back: 8 feature tests + PHPStan + Pint + Deptrac (0 violations) green. Front: `/clubs/near-you` finder (lists by area; join button disabled until WP-C2), `src/lib/api/club.ts` + `use-clubs`, 2 tests + typecheck + lint green. **Deferred to WP-C2:** affiliation join request → accept._
- [~] Club types (community, school, academy, corporate, religious, institution, facility-based, registered) — _WP-C1: validated at create against the `club.types` config set (stable keys, configurable labels)._
- [~] Roles: Owner, Co-founder, Admin, Manager, Captain, Scorer, Media Manager, Member/Viewer — _WP-C1: `ClubRole` enum defined (full §7 set); only Owner assigned so far (on club creation). Role management UI pending. Ownership still starts and stays with the creator; transfer is Admin-reviewed per §11 and needs its own packet._
- [~] Verified Club badge storage (no judgement UI yet) — _WP-20260823-club-creation: `clubs.verification_state` (`not_required` | `pending` | `cleared` | `rejected`) + `verification_source` (the exact three keys §4's locked rule names) now exist and are set at creation. The badge itself, the document upload and the admin decision that moves the state are WP-20260823-club-verification._
- [ ] Inactive (3mo) / Dormant (6mo) state transitions on cron
- [ ] Archive / merge primitives with redirect records
- [ ] Related-club detection on `integrity` queue (writes signals only; doesn't block actions yet)
- [ ] "Formerly…" notice retention (90 days)

> **Re-verified 2026-08-23, then partly superseded the same day.** The five boxes above were
> genuinely untouched at the time of the check: nothing in `app/Modules/Club` or the `clubs`
> migration mentioned verification, dormancy, merge, related-club signals or a "formerly"
> record, and nothing had landed in the Club engine since WP-C1/WP-C2 (2026-07-02).
>
> WP-20260823-club-creation then moved the **first** of them: `verification_state` and
> `verification_source` are real columns, written at creation, and read by the discovery
> filter. The other four are still untouched. `archived_at` still exists on the table with no
> archive *flow* using it.
- [~] Frontend: club creation, members management, club profile — _WP-C1 shipped the "clubs near you" finder. **Creation shipped 2026-08-23 (WP-20260823-club-creation)**: `/clubs/create`, a six-step guided flow (tier → type → name → hub → area → review) reusing the wizard chrome promoted out of `player/setup/` into `components/ui/wizard/`. Entry points added on the home CTA rail, the finder's empty state and `/clubs/manage`. Members mgmt + club profile still pending (planned as WP-20260823-club-home)._
- [x] **Club tier + reserved-name policy** — _WP-20260823-club-creation (ADR-0017). Tier is the first question and gates everything after it: which club types are offered (`club.types.tier`), whether a name belonging to a real club is refused or routed to review, and whether the club goes live on submit. `local` is refused a name matching `club.name.reserved_terms`; `official` may claim one and is created `verification_state = pending`, hidden from every public read. Matching is **canonical-anywhere, aliases-exact** — "Tamale Manchester United" is refused, "Kotoko Boys" is not, because Kotoko is an ordinary Twi word and the false positive lands on exactly the grassroots teams this platform is for. `ClubNamePolicy` is pure domain (no config, no framework, no `ext-intl`); `ClubVocabulary` resolves the terms from config. The pending filter lives in ONE query builder inside `EloquentClubStore` that every read routes through, with `listAdminClubsForUser` the single deliberate exception so an Owner sees their own claim._
- [x] **`GET /api/v1/clubs/meta`** — _WP-20260823-club-creation, second implementation of ADR-0007. Serves tiers, club types with their tier, labels and name bounds from Admin Config; public, ETagged, `Vary: Accept-Language`. Kills `CLUB_TYPE_LABELS`, the hardcoded mirror of the `club.types` default that five surfaces were reading, replaced by one `useClubTypeLabel()` hook. The ETag/revalidation/cache logic moved to `app/Support/Http/MetaResponse.php` and `PlayerMetaController` was refactored onto it. **The reserved-name list is deliberately NOT served**: the verdict is backend truth, a client copy is stale by construction, and publishing the list publishes the map for routing around it._
- [x] **Club crest upload** — _WP-20260823-club-creation. `POST /api/v1/clubs/{id}/crest`, Owner/Admin only, emits `club.crest_updated` so Moderation decides publicly-showable (Law 6). Works on a club still `pending`, so an Owner can finish setting up while an admin checks the claim. Backed by a NEW shared `app/Support/Media/` image store (`ImageStore` port, Local + R2, content-addressed paths) rather than a fourth copy of the same plumbing: Identity's `AvatarDriver` and Player's `PlayerMediaDriver` predate it and were deliberately left alone, but new callers use the shared one and those two should fold into it when something next touches them. Front: an optional badge step in the wizard reusing the player photo cropper (promoted to `components/ui/image-crop/`), previewed from a local Blob on the review step and uploaded straight after creation — a failed upload leaves a live club without a badge rather than failing the creation._
- [x] Tamale areas 17 → 44 — _WP-20260823. A player creating a club could not find their own area, which is the launch market failing at the question that matters. Google was NOT re-attempted: `GhanaGeographySeeder`'s docblock already records that Places holds none of Tamale's neighbourhoods and returns the landmarks inside them instead. The additions are curated (Zogbeli, Dungu, Jisonayili, Education Ridge, Kpalsi, Changli, Moshie Zongo and the rest) and **need a local review** before they are trusted._
- [x] 17 new club config keys seeded — _`club.tiers{,.labels,.descriptions}` (labels **Amateur** / **Professional**), `club.media.*` (driver, r2 public url, size ceiling, extension allow-list, throttle),, `club.types{.tier,.labels,.descriptions}`, `club.name.{reserved_terms,ignored_tokens}`, `club.profile.name_{min,max}_length`, `club.meta.cache_ttl_seconds`. The Club engine had **no** seeded config before this; every reader was running on its hardcoded fallback._

### Phase 1.5 — Player & Affiliation Engine

- [~] Players table (claimed + ghost) — _WP-20260702-player-profile: `players` table (claimed free-agent V1; ghost deferred), one-per-user, `archived_at` (no cross-schema FK to `users`). `POST /api/v1/players` creates a CLAIMED FREE-AGENT player; PlayerAffiliation module vertical (Domain enums + entity + repo port, `CreatePlayerProfile` app service emitting `player.profile_created` v1 via outbox, Eloquent adapter). Contract `contracts/api/player/post-players.v1.yaml` + event schema + 7 config keys (`player.profile.*`, `player.positions`, `player.availability.default`, throttle). Back: 7 feature tests + PHPStan + Pint + Deptrac (0 violations) green. Front: `/player/setup` RHF+Zod wizard (prefills name split from account), `src/lib/api/player.ts` + `use-player`, 3 tests + typecheck + lint green. **Deferred:** headshot upload UI (backend accepts `headshot_url`), `GET /players/me`, ghost players._
- [~] Affiliations table (versioned: joined/transferred/loaned/left, start/end) — _WP-20260702-club-finder-join (WP-C2): `affiliations` table (player_id same-engine FK; club_id no cross-schema FK; unique per player+club; `AffiliationState` enum full §8 set). Request→accept lifecycle: `POST /clubs/{club}/join-requests` (player → `requested`, idempotent), `GET` (admin lists pending + requesting player), `.../{id}/accept|decline` (club Owner/Admin only, authorised via Club `userIsClubAdmin` read port). Emits `affiliation.requested` + `affiliation.activated`/`declined` v1 (deterministic UUIDv5 event ids). Back: 7 feature tests + PHPStan + Pint + Deptrac (0) green. Front: "Request to join" wired in the finder (reflects Requested; nudges to `/player/setup` if no player yet), `requestToJoinClub` client + `useRequestToJoin`, 3 tests green. Club-admin accept UI shipped: `GET /clubs/mine` (clubs the caller administers) + `/clubs/manage` page + `<ClubRequestsManager>` (accept/decline pending requests); `listMyClubs`/`listJoinRequests`/`decideJoinRequest` clients + hooks; 9 backend + 5 front club tests green. `ClubDemoSeeder` seeds demo clubs per area for alpha. **Deferred:** transfers/loans/versioned affiliation history._
- [ ] **Ghost player creation in lineups** — _Stage 1 exit blocker. The shape is half-present: `PlayerClaimStatus` is a real domain enum, but `CreatePlayerProfile` only ever writes `Claimed`, and there is no lineup to create a ghost from until Phase 2.1 exists. Re-verified 2026-08-23._
- [ ] **Claim flow via OTP linking ghost row to a user** — _Stage 1 exit blocker. Nothing built. The OTP machinery it would reuse is live (Phase 1.3)._
- [ ] **Minor-protected flag + restricted visibility query layer** — _Stage 1 exit blocker, and the thing gating the PUBLIC player card page. Re-verified 2026-08-23: there is **no `date_of_birth` and no `is_minor` field anywhere**, which is why ADR-0015 records an age gate as unbuildable today rather than merely deferred. The §16 privacy matrix packet has to land this before any public player surface ships._
- [x] Free agent player support — _shipped in WP-20260702-player-profile (above): every self-service player is created CLAIMED + FREE-AGENT (engine doc §4/§22)._
- [~] Frontend: player profile (basic card), ghost claim screen — _creation flow shipped (WP-20260702, reworked WP-20260819); the standalone owner-facing profile shipped in **WP-20260821-me-surface** (below). Ghost claim and the PUBLIC shareable card page still pending._
- [x] Frontend: `/me`, the player's own record — _WP-20260821-me-surface (front only, contract-first). Eight blocks in one column on a phone, splitting at `lg` into a sticky identity rail (card, confidence, availability) beside a scrolling column (record, club, details, account, coming). Deliberately NOT a dashboard: Match/Fixture, Competition, RP and Awards have no endpoints, so a league-dashboard layout would have to invent four engines' worth of football (Law 3). Card confidence (§14) stands in for a numeric rating; the empty record names the §13 gate instead of showing six zeros; availability is the one one-tap write (§12, optimistic with rollback); unbuilt surfaces render dimmed and inert, the `nav-items.ts` pattern. `/me` absorbs the account links, so `ACCOUNT_LINKS` drops from three entries to two — "Player profile" used to point at `/player/setup`, which sent a player who already had a card back into the wizard that creates one.
  New contracts: `get-players-me.v1.yaml`, `patch-players-id.v1.yaml`, config keys `player.card_confidence.tiers` + `.labels`. Frontend consumes all four ahead of the backend, per the 2026-06-25 contract-first precedent; `PlayerMetaSchema` gains an OPTIONAL `card_confidence` label map so a client on this build works against an API that predates it.
  Seeded-data gate: new `src/lib/env.ts` exposes `IS_SEED_ENABLED` (`NEXT_PUBLIC_KX_SEED`, default OFF) and `src/lib/api/seed/player-store.ts` backs the record with a localStorage-persisted seed (PRODUCT.md §3.2). The stat block stamps a visible "Demo data" badge whenever the seed is in play — §13 forbids claimed stats in profile totals, and this is the page a player screenshots for a club.
  Gates: 8 new `/me` tests + full suite (140) + ESLint clean on every touched file + `tsc` clean on all new files + production build green (`/me` prerenders). **Deferred by design:** share and the public card page (needs `GET /players/{id}` + a public route + the §16 privacy matrix), headshot upload, leave-club / withdraw-request (no endpoints), notification inbox client, change phone / change email flows (endpoints exist, screens do not)._
- [x] Frontend: card composition, position-aware stats — _WP-20260821-player-card-stats (front only). Ghost name centred and growing outward so a long name loses the same at each edge; identity row centred on the avatar rather than baseline-aligned; card confidence badge removed from the card (it read as a caveat on figures that carry none — every stat on the platform comes from a confirmed match, §13 — and the tier stays in its own block where it measures how much record stands behind the card, not whether it is verified); lead stats centred, smaller, bolder, at normal tracking (letterspaced uppercase under a number pulls the word wider than the figure and the pair stops reading as one unit); yellows and reds collapsed into one `Cards 3Y, 1R` line; player of the match promoted to a full-width squared band rather than a pill, since a pill reads as a status chip and this is the one line a player earned; availability dropped from the card on `/me` only, where `<AvailabilityBlock>` restates it as a one-tap control six inches lower (the setup reveal keeps it, where nothing else confirms the choice).
  **Position-aware lead stats.** New config key `player.card.featured_stats` maps position key to the three counters the card leads with, served through `/players/meta` and additive on the contract. A centre-back is not judged on goals and a keeper is not judged on assists, so one fixed trio misrepresents most of the pitch; which counters matter is also a football-culture judgement that will be revised, which makes it configuration rather than code (Law 2). Featuring decides billing, never visibility — everything the record holds still appears, in the strip underneath. `clean_sheets` added to `VerifiedRecord` (§13 names it), additive and optional. Fallback when config is silent is the three §15 names, and it falls back whole rather than partially so an edited-down list surfaces as a mistake instead of being quietly patched.
  **Desktop stops scrolling the page.** `/me` at `lg` pins to the viewport and scrolls its two columns independently. Sticky was the first attempt and was wrong: a sticky rail taller than the viewport makes its own bottom unreachable, and giving it a scroll then nested a second scrollbar inside the page's. New `.kx-scroll-none` utility hides both bars, scoped to panes whose scrollability is evident from clipped content. Record band extracted to `player-card-record.tsx` — the two files answer different questions and together they cleared the 400-line limit.
  **Contract written, UI not built:** `POST /api/v1/players/{id}/media` (`contracts/api/player/post-players-id-media.v1.yaml`) for player media upload, with §7's three kinds. Deliberately separate from `POST /users/me/avatar`: §7 splits account avatar from football media, a player profile can be claimed or transferred without touching the account picture, and a ghost has media before it has an account. Avatar editing in the profile is blocked on this endpoint existing, not on frontend work.
  Gates: 167 tests (3 new on the card composition and position-aware featuring) + ESLint clean on every touched file + `tsc` clean on all touched files + production build green._
- [x] Frontend: card surface, length and the portrait slot — _WP-20260821-player-card-surface (front only). The card becomes `aspect-[4/5]` in a column flex context, so the ratio sets the height and content can push past it rather than overflow. Tall is load-bearing twice over: it is the only shape with room for a standing figure beside the record (§7 reserves the half-body portrait for "player card front"), and it is the shape a share still wants.
  New `player-card-patterns.ts`: the supplied football folk-art artwork (balls, nets, florals, birds, towers) plus film grain, with three seamless geometric tiles held in reserve. Patterns carry `size`/`repeat`/`blend`, so a pattern is either a tiled motif or one `cover` artwork. The artwork is laid down as `cover` rather than tiled because the source measured seamless left-to-right (1.3 of 255) but not top-to-bottom (51.6), so tiling would have printed a line across every card; `cover` also makes seamlessness irrelevant for allover art. It blends `soft-light` at the 0.12 cap so a third-coverage drawing lifts the gradient instead of laying flat white over it. Three artworks landed the same evening and patterns are now **paired to gradients by hand** rather than hashed on their own salt: flare wears shards, dusk wears a hatched zigzag, deep wears folk. A drawing that sings on the pink is not automatically right on the blue, and a hash can only guarantee the pairing is arbitrary. The zigzag keeps 12 alpha levels rather than 8 because fine regular hatching is what moires, and banded hatching reads as a compression artefact. Every ground now has its own artwork; the geometry stays as reserve.
  **Contrast regression found and fixed the same evening (ADR-0014 amended).** White at `soft-light` lightens what it crosses, so the first artwork at 0.16 took the card to 4.19:1 while the token test stayed green — it measured the bare gradient, and the bare gradient was never what a reader saw. The rule now recorded: a decorative layer that changes luminance is part of the ground, and the ground is what has to clear AA. Grounds dropped to L 0.576 / 0.564 / 0.545, pattern opacity capped at `MAX_PATTERN_OPACITY` 0.12, and the test measures the composite for every pattern. Two findings fell out: CSS composites blend modes in gamma-encoded sRGB rather than linear light (doing it in linear overstates the headroom), and `normal` blend is unusable for a white pattern here because it costs more contrast per unit of visible texture than `soft-light` — the reserve geometry failed AA at 0.07 on `normal` and passes at the same opacity on `soft-light`. Asset re-encoded from 1.7MB RGBA to an 89KB 8-level indexed PNG with no visible loss (a mask needs one channel, and this one is mostly flat) — these players pay for their data and a card background is decoration (§9.6). Only the artwork is in the rotation: mixing it with geometry would hand three players in four a crosshatch while their neighbour got the full drawing. Patterns are SVG data URIs used as `mask-image` with the colour from `currentColor`, the same move `<Wordmark>` makes — a `var()` inside a data URI does not resolve, so a baked fill would have been a colour literal. Grain is `feTurbulence` desaturated and `mix-blend-overlay` so it modulates the ground rather than veiling it, rendered into a 140px tile rather than across the panel (§9.6). Pattern is hashed on a separate salt from the gradient so the two vary independently: three cards today, nine the moment a second and third artwork land, with no other change. Reserve geometry is deliberately abstract, not kente: the strips carry names and meaning, and a plausible-looking invented one reads as careless to the people it is for.
  The card now owns the full record, so `RecordBlock` is deleted and `/me` no longer repeats six counters below the card. `starts` and `player_of_the_match` added to `VerifiedRecord` — both named by §13, both additive and absent from `required` so a client on this build keeps working against an API that predates them (§7). Contract `get-players-me.v1.yaml` and the Zod mirror updated together. Player of the match renders as the §15 badge; it is a Trust-cleared match award, never a Fan Buzz signal (Law 8/9). Seed bumped from five matches to a full season so the long card is exercised at the length it has to hold.
  `portraitUrl` slot added and left unwired: it is an absolutely positioned masked layer, never a column, so the content layout is identical with and without it. `headshot_url` is deliberately NOT plugged into it — §7 assigns the headshot to "small avatars, lineups, team sheets", and a face crop in a slot shaped for a standing figure reads as a mistake. A dev placeholder figure (`public/images/dev/portrait-placeholder.png`, generated, not artwork) demonstrates the slot on `/design`.
  Gates: full suite (157) + ESLint clean on every touched file + `tsc` clean on all touched files + production build green. **Not done:** still no browser in this workspace, so none of this has been eyeballed. **Open:** the share graphic. `next/og` (Satori) supports neither `mask-image`, CSS filters, `color-mix()` nor `display: grid`, so it cannot render this card as drawn — the fork is a headless-browser screenshot (pixel-identical, heavier runtime) versus a flattened Satori twin (cheap, drifts from the live card). Needs deciding with the §16 privacy matrix, which gates minors' images either way._
- [x] Frontend: the player card as an artefact — _WP-20260821-player-card-hero (front only). `<PlayerCard>` rebuilt from a name on a gradient into a four-band composition: mark and shirt number, identity over a ghost name at poster scale, the three counters §15 names (games, goals, assists), and a meta bar carrying position, market status and availability. Record and confidence are optional props, so setup still reveals identity alone and `/me` renders the card at its fullest; both are backend values passed straight through (Law 3) with the tier's label resolved from the config map at the call site (ADR-0007). Record band and `RecordBlock` run the same emptiness test, so neither ever shows a row of zeros (§13). The seed's "Demo data" stamp now appears on the card too, since the card is the object that gets screenshotted. `<Avatar>` gains `2xl` (96px); `RecordBlock` moves to `--radius-row` tiles.
  Folded in **ADR-0014**: theme-stable `--card-*` tokens. The old card mixed `--primary`/`--accent`, which inherited ADR-0012's accepted sub-AA deviation — argued for a one-word button label, and wrong for a surface now carrying a name, a stat row and a meta bar at 11-14px. The new grounds clear 4.5:1 against white and are defined once in `:root`, never overridden in the light block, on the `--pitch-*` precedent (ADR-0011): a card lands in a WhatsApp thread as an image and must not depend on the sender's theme. DESIGN_LANGUAGE §2.2 updated (the "full set" predated the pitch tokens, and its worst-case rule still described ADR-0010's dark labels).
  Gates: 4 new `/me` tests (12 total) + 3 new token guarantees + full suite (157) + ESLint clean on every touched file + `tsc` clean on all touched files + production build green (`/me`, `/design`, `/player/setup` prerender). **Not done:** no browser is installed in this workspace, so the composition has not been eyeballed at 360px — only reasoned from the box model. **Deferred by design:** the half-body portrait §7 reserves for the card front (needs an upload and crop path; the card is avatar-only until then), share, and the public card page._
- [x] Frontend: guided player-profile setup — _WP-20260819-player-setup-wizard (front only): `/player/setup` rebuilt from a six-field stacked form into a five-step flow — identity → football name → number → position → availability → reveal. One question per viewport at display scale, direction-aware Framer transitions (lazy-loaded per route, transform/opacity only, reduced-motion honoured), single-tap steps auto-advance after a confirm beat, position picked on a pitch (radio group underneath), sticky CTA in `<KeyboardFooter>`, draft persisted per step, and 422s routed back to the field that owns them. Ends on the saved player rendered from the API response plus a first player card (identity only — no stats or rating, per engine doc §13/§14).
  Folded in **ADR-0007**: config-derived option sets move behind a per-engine `/meta` endpoint. New contract `contracts/api/player/get-players-meta.v1.yaml` + 5 config keys (`player.positions.labels`, `player.availability.labels`, `player.availability.descriptions`, `player.market_status.labels`, `player.profile.preferred_number_quick_picks`); the hardcoded `PLAYER_POSITIONS`/`PLAYER_AVAILABILITY` mirrors and the literal `1..99` bound are deleted from the frontend. Front: 7 wizard tests + full suite (107) + lint + new-file typecheck green.
  Backend shipped in the same packet: `GET /api/v1/players/meta` (public, throttled `player-read`, ETag + `Cache-Control` + `Vary: Accept-Language`, 304 on `If-None-Match`) backed by `PlayerProfileVocabulary` — one resolver now feeding both the meta endpoint and `CreatePlayerRequest`, so a set can no longer be accepted by the validator and never offered by the form. Label maps support locale-suffixed variants narrowing `fr-FR` → `.fr` → default. All 14 player config keys are seeded in `AdminConfigSeeder` for the first time (they had only ever existed as code fallbacks, so no admin could edit them). Back: 22 player feature tests + Pint + Deptrac (0 violations) green; live-verified against the dev DB. **Pre-existing, untouched:** 4 `OtpServiceTest` failures (`app()->environment()` outside a booted app) and 1 PHPStan `env()` finding in `AdminAccessCodeSeeder`._

- [x] `GET /players/me` + `PATCH /players/{id}` — _WP-20260821a-player-me (kalaanba-api). Closes the read endpoint deferred from WP-20260702-player-profile; the frontend had been consuming both contracts ahead of the backend under the 2026-06-25 contract-first precedent._
- [x] **Player media upload** — _`POST /api/v1/players/{playerId}/media`, shipped 2026-08-22. New PlayerAffiliation surface: `PlayerMediaKind` enum carrying §7's three kinds, `PlayerMediaDriver` port + `StoredPlayerMedia` + `UploadPlayerMedia` use case, local and R2 drivers behind `PlayerMediaDriverFactory`, `config/player.php`, an `r2` disk, a `player-media-upload` limiter, and 10 feature tests. `league/flysystem-aws-s3-v3` installed. Gates: 379/379 Pest including architecture, Deptrac 0, PHPStan clean on every new file.
  **Deliberately NOT a reuse of Identity's `AvatarDriver`**: §7 splits account avatar from football media, a player profile can be claimed, transferred or archived without touching the account picture, a ghost player has media before it has an account (§5), and sharing a driver would put a Player concern inside the Identity module (Law 1).
  **One contract change against the written spec**: the endpoint writes `players.headshot_url` **itself** for `kind=headshot`, inside the same transaction as the outbox event, instead of leaving a follow-up PATCH to the client. On a Ghanaian mobile connection the gap between two calls is exactly where the network drops, and that failure is the worst kind — the bytes are in the bucket, the player paid for the upload, and their card still shows initials.
  Three config keys in `contracts/config/player/`: `player.media.max_bytes` (4 MiB, low), `player.media.allowed_mime` (jpeg/png/webp, **medium** because widening it is a security decision), `player.media.throttle.per_minute` (10, low). **`image/svg+xml` must never be added** — SVG carries script and this is served on the product's origin family._
- [ ] **Flip player media to R2** — _open, and it is one environment variable. `R2_PUBLIC_URL` is still empty so `player.media.driver` stays `local`. Enable the bucket's r2.dev managed domain or attach a custom domain (R2 → `kalaanba-dev-storage` → Settings → Public access), set `R2_PUBLIC_URL`, then flip `PLAYER_MEDIA_DRIVER=r2`. Nothing else is needed; the wiring is verified end to end._
- [x] Frontend: photo framing and the signed empty card — _WP-20260822-player-card-artefact. Tapping the photo opens options (camera, library, remove) and a picked file goes through a real crop step with drag, pinch and a zoom slider before it uploads (`photo-sheet.tsx`, `photo-cropper.tsx`, `use-photo-crop.ts`, `lib/images/prepare-photo.ts`). The crop replaces a heuristic that centre-cropped with a bias a sixth down, on the theory that people frame their faces in the upper half of a portrait — right often enough to be worse than nothing, because when it was wrong it silently put a player's chest on a team sheet with no way to correct it. The camera badge came off the card: the card is what a player screenshots, and a control drawn onto it travels into every copy as a button nobody can press.
  A card with no confirmed match now carries the position written out, the market status, and **the player's own name signed across it** (ADR-0016, a third typeface). Every tagline that fit the slot was either hype (banned by §8), false for a free agent, or a caption apologising for the space; a signature is true by construction._
- [x] Frontend: the share graphic — _WP-20260821-me-surface, ADR-0015. A **canvas-drawn 1080×1350 PNG**, not a DOM screenshot, delivered through the Web Share API with a file and falling back to download. The card uses `mask-image`, `mix-blend-mode`, `color-mix()` and OKLCH, which are the four things every DOM-to-image library gets wrong; `next/og` (Satori) supports none of them plus no `display: grid`. Both the DOM card and the canvas image derive from one shared `buildPlayerCardModel`, so §15's two artefacts cannot disagree. This resolved the screenshot-versus-Satori-twin fork with a third option.
  **ADR-0015 fences this narrowly**: the graphic is drawn client-side in the owner's own browser from the record that browser already holds and handed to the OS share sheet, so nothing is published, indexed or served to a stranger. A player pressing share is the same act as the screenshot they can already take. **The PUBLIC card page stays fenced** behind Player & Affiliation §16 and the minor-protected flag above._
- [~] Frontend: `/me/v2`, the workspace shape — _unlabelled commit `fc37c3b` (2026-08-22), no Work Packet ID. `/me` and `/me/v2` are **both live on purpose**: two routes rather than one flag, because a flag makes the two shapes impossible to hold side by side on two screens, which is the only way a layout decision actually gets made. v2 is an index-and-pane workspace (`me-workspace.tsx`, `me-rail.tsx`, `me-index.tsx`, `record-feature.tsx`, `playing-control.tsx`) against v1's single scrolling column. **Open decision: pick one and delete the other.** Until then the `/me` surface has two maintenance costs._

> **Stage 1 exit criteria status (2026-08-23).** "A Hub Admin can create their hub's zones" ✅, "a user can sign up" ✅, "a club can be created" ✅. **"A player can be added as a ghost and later claimed via OTP" ✗** — this is the one unmet clause, and with Phase 1.6 it is the whole of what stands between here and Stage 2.

### Phase 1.6 — Trust stub

- [ ] Trust module emits `trust.match_cleared` immediately on `matches.result_confirmed` (stub passthrough)
- [ ] Clearance flag table exists with proper shape so Stage 2 can swap in real rules without consumers changing

---

## Stage 2 — The Match (the heart of the product)

🎯 **Goal:** Make the football loop work end-to-end. Until this works, nothing else matters.

✅ **Exit criteria:** A club creates a friendly match, both reps confirm the result, Trust clears it, stats appear on the player's profile, and the public match card is live on the web. Public match/club/player pages are ISR with on-demand revalidation. **This is the demo-able product.**

🔗 **Brief refs:** §7.3 (matches), §7.8 (trust), §8.1 (football loop), §10.1

### Phase 2.1 — Match / Fixture Engine

- [ ] Matches table with state-machine column
- [ ] States: Draft → Scheduled → Confirmed → Live → Awaiting Result → Verification Pending → Result Confirmed → Archived + side states (Postponed, Cancelled, Walkover, Abandoned, Disputed, Void)
- [ ] `match_events` append-only (goals, cards, subs, key incidents) with `client_event_id` idempotency
- [ ] Configurable match duration (read from Admin Config)
- [ ] Five match types: Friendly, Competition fixture, Challenge match, Internal match, Training event
- [ ] Walkover/Postpone/Cancel/Abandoned flows with their stats implications

### Phase 2.2 — Confirmation gate

- [ ] Per-type confirmation models (Friendly = both reps; Internal = club admin; Competition = organizer; Challenge = 2-of-3; Referee-officiated = referee strongest weight)
- [ ] `result_confirmed` boolean is the explicit hard gate
- [ ] Eligibility flags exposed on match record: `verified`, `rpEligible`, `statsEligible`, `standingsEligible`, `zoneEligible`, `challengeLinked`, `competitionLinked`

### Phase 2.3 — Trust & Verification V1

- [ ] Replace Stage 1 stub with real rule engine
- [ ] Rule inputs: confirmation parties, referee type weight, evidence presence, repeat-pairing signal, related-club signal, caution levels
- [ ] Stored clearance outputs: `verificationStatus`, `trustLevel`, `cautionLevel`, `rpClearance`, `statsClearance`, `standingsClearance`, `archiveClearance`, `reviewFlag`
- [ ] Decision Trace JSON attached to each clearance record
- [ ] Super Admin override endpoint with reason + previous/new status + audit log
- [ ] Trust emits `trust.match_cleared`, `trust.stats_cleared`, `trust.requires_review`

### Phase 2.4 — Stats projection

- [ ] Listener on `trust.stats_cleared` writes player/club aggregate stats
- [ ] Player career table (per season + lifetime)
- [ ] Club aggregate table (per season)
- [ ] Backfill job for any reprocessing

### Phase 2.5 — Notifications V1 (in-app only)

- [x] In-app inbox table + endpoints _(WP-20260525-notif-inbox-v1 — `notification_inbox` table, GET /me/notifications, GET /me/notifications/unread-count, POST /me/notifications/{id}/seen, POST /me/notifications/{id}/acted-on; contracts in `contracts/api/notification-distribution/` + 3 config keys; module bound in `NotificationDistributionServiceProvider`)_
- [ ] Outbox-driven worker delivery to in-app inbox
- [ ] Delivery audit log
- [ ] Notification preferences + quiet hours scaffolding (WhatsApp arrives Stage 4)

### Phase 2.6 — Frontend public surfaces

- [ ] Public match page (ISR, revalidate-on-result-confirmed via webhook from Laravel)
- [ ] Public club page
- [ ] Public player page (respecting minor-protected flag)
- [ ] Organizer match-entry flow (create → schedule → live entry → submit result)
- [ ] Both-reps confirmation UI for friendlies
- [ ] Super Admin minimal override UI

---

## Stage 3 — Competitions

🎯 **Goal:** Give matches a container so they aggregate into standings.

✅ **Exit criteria:** The "Tamale Premier League" demo dataset runs as a real competition with real fixtures, real results, real standings, real top-scorer table — all on a public URL.

🔗 **Brief refs:** §7.4 (competitions), §10.1

### Phase 3.1 — Competition & Rules Engine

- [ ] Competitions table (type: League | Knockout, scope: Internal | Open | Invitational | Official)
- [ ] Versioned rules JSON (points, tiebreakers, match duration, squad cap, walkover default)
- [ ] **Rules lock on first confirmed result** — subsequent edits require Critical approval + effective-dated version
- [ ] Public / unlisted / private visibility

### Phase 3.2 — Manual fixtures

- [ ] Organizer adds each fixture (no auto-generation in V1)
- [ ] Team registration into competition
- [ ] Fixture ↔ Match linkage

### Phase 3.3 — Standings projection

- [ ] Materialized standings table (one row per (competition, team))
- [ ] Job refreshes on `matches.result_confirmed` filtered to the competition
- [ ] Tiebreaker calculation per competition rules

### Phase 3.4 — Public competition page

- [ ] ISR rendered Next.js page at `/competitions/[slug]`
- [ ] Tag-based revalidation on every standings update (webhook from Laravel)
- [ ] Visibility enforcement (public / unlisted / private)

### Phase 3.5 — Per-competition Top Scorer / Assist (minimum Awards integration)

- [ ] Per-competition stats aggregation
- [ ] Top scorer + top assist leaderboards on competition page
- [ ] Listener-driven, refreshed on stats clearance

---

## Stage 4 — Distribution (let the world see it)

🎯 **Goal:** Push verified moments out of the platform and into the WhatsApp groups where grassroots football already lives.

✅ **Exit criteria:** A confirmed match generates a moderated share card pushed into a WhatsApp group within minutes. Live score updates show on the public match page in real time.

🔗 **Brief refs:** §7.12 (moderation), §7.13 (notification & distribution), §7.11 (awards — matchday only)

### Phase 4.1 — Notification & Distribution Engine full V1

- [ ] Meta WhatsApp Cloud API integration live
- [ ] Template message approval pipeline
- [ ] Quiet hours + per-user preferences enforced
- [ ] Channel fallback (WhatsApp → in-app)
- [ ] Reminders with idempotency
- [ ] Delivery audit log + provider error capture
- [ ] Public vs targeted distribution split

### Phase 4.2 — Reverb realtime

- [ ] Reverb deployed on 2 nodes behind HAProxy (sticky for WS only)
- [ ] Sanctum-backed broadcasting auth
- [ ] Channels: `private-match.{id}`, `private-user.{id}`
- [ ] Public match page subscribes for live score / event updates
- [ ] Reverb metrics in Grafana

### Phase 4.3 — Moderation & Safety Engine

- [ ] Rule-based auto-screening (regex + lists)
- [ ] Admin review queue with priority
- [ ] States: submitted, auto_screened, clean, watch, held_for_review, restricted, hidden, escalated, approved, edit_requested, removed, restored, sanction_recommended
- [ ] **Safe default copy library** keyed by context — business flows never stall
- [ ] Restriction levels on user/club/venue
- [ ] Public distribution checks Moderation clearance at send time

### Phase 4.4 — Matchday share cards

- [ ] Card renderer (Puppeteer / chrome-php)
- [ ] Card templates: goal scorer, hat-trick, clean sheet, final score
- [ ] Render → R2 (public bucket) → distribute
- [ ] Trust + Moderation gates before publish
- [ ] WhatsApp template message linking to the card

---

## Stage 5 — The Drama Layer (RP + Challenges + Buzz)

🎯 **Goal:** Give the platform its public personality. This is where Kalaanba stops being a record-keeper and becomes a stage.

✅ **Exit criteria:** Club A issues a Ranked Challenge, fans react and share, Club B accepts, the match is played and verified, RP transfers, the result card distributes via WhatsApp, the Challenge Wall shows the resolved card with engagement counts.

🔗 **Brief refs:** §7.5 (challenges), §7.6 (RP), §7.10 (fan buzz), §6.2 (boundaries — Buzz NEVER mints RP)

### Phase 5.1 — RP Economy Engine

- [ ] `rp_ledger` table — source of truth (entity_type, entity_id, amount, reason, source_event_id, balance_before, balance_after, season_id, occurred_at)
- [ ] Wallet projections (available season, locked season, lifetime, season snapshot)
- [ ] Win/Draw/Loss minting listener on `trust.rp_cleared` (configurable values)
- [ ] One-time bonuses (profile complete, first verified match)
- [ ] Tier system (Unranked → Crowned), tier transitions audit-logged
- [ ] Atomic transfer pattern (advisory lock + ledger entry in one tx)
- [ ] Anti-farming listeners:
  - [ ] Repeat-pairing decay (30-day window, full RP only first 2 matches)
  - [ ] Related-club RP-transfer block
  - [ ] New-club gating (min verification + 3 verified matches before ranked RP transfer)
- [ ] Off-season earnings queued, applied on April 1 transition
- [ ] Season RP reset job (April 1) preserving lifetime RP

### Phase 5.2 — Challenge Engine

- [ ] Challenges table with full lifecycle state machine
- [ ] States: Drafted → Issued → Seen → Countered/Accepted/Declined/Ignored → Scheduling → Scheduled → Prediction Open → Live → Verification Pending → Resolved/Disputed/Forfeited → Archived
- [ ] 50 Season RP unlock check
- [ ] Stake calculation: `max(tier_floor, %_stake)` bounded by tier cap
- [ ] One counter offer per side
- [ ] 72h response window + 4-day scheduling window jobs
- [ ] Open Call-out Windows + Inter-Zone Leader Duels admin toggles
- [ ] 2-of-3 verification table + evaluator job
- [ ] Outcomes: winner takes stake, draw = stood-ground cost to respondent (defaults from Admin Config)
- [ ] Challenge → Match linkage on schedule
- [ ] Public challenge card flow (gated by Moderation)
- [ ] Frontend: challenge issue flow, accept/counter UI, Challenge Wall, prediction UI

### Phase 5.3 — Fan Buzz, Feed & Discovery V1

- [ ] Reactions, shares, tracks, follows, predictions
- [ ] Redis sorted sets per (surface, context) for incremental Buzz scoring
- [ ] Periodic reconciliation to Postgres
- [ ] Feed generation job per (user_segment, surface)
- [ ] Soft-follow inference nightly job
- [ ] Surfaces: Home, City Hub, Zone, Challenge Wall, Fixture/Club/Venue/Competition discovery, Player Moment feed
- [ ] UI kit: Buzz badge, Heat meter, Engagement bar, Reaction picker, Track/Follow/Predict/Share buttons, Feed filter tabs
- [ ] **Architectural enforcement: Buzz module has no write access to RP/Match/Competition schemas (Deptrac rule)**
- [ ] Anti-manipulation basics (rate limits, dedupe by device, no-self-reaction)

### Phase 5.4 — Zone Engine inter-zone records

- [ ] Inter-zone match aggregation table
- [ ] Zone leaderboards derived from RP outputs
- [ ] Zone Pulse feed surface
- [ ] Frontend zone pages

---

## Stage 6 — Operations & Revenue

🎯 **Goal:** Let venues onboard, let clubs book, take money, record commission. The platform now pays for itself.

✅ **Exit criteria:** A club discovers a venue, books a slot online via Paystack, the booking links to a fixture, the surface calendar reflects it, commission is recorded, settlement is tracked. A referee can be assigned and submits a post-match report.

🔗 **Brief refs:** §7.7 (venues/surfaces/bookings), §7.9 (referees), §10.1

### Phase 6.1 — Venue & Surface Engine

- [ ] Venues + surfaces tables (one venue, many surfaces)
- [ ] Four location modes: bookable platform venue, listed venue, open/community venue, manual venue text
- [ ] Facility manager portal scaffold
- [ ] Manager roles: Owner, Manager, Booking Attendant, Media Manager, Finance Viewer
- [ ] Surface calendar (the bookable resource)
- [ ] Offline blocks (phone, WhatsApp, walk-in, private events, maintenance) — first-class on the calendar
- [ ] Rich media capture (daytime, nighttime, drone, GPS pin)
- [ ] Venue verification queue (admin)

### Phase 6.2 — Booking Engine (pre-payment)

- [ ] Bookings table with state machine: draft → slot_selected → hold_created → approval_pending|payment_pending → confirmed → linked_to_fixture → completed|cancelled|refunded|no_show|disputed
- [ ] Hold expiry job (configurable TTL)
- [ ] Conflict prevention against surface calendar + offline blocks + other holds
- [ ] Fixture linkage
- [ ] Notification triggers to club, referee, manager

### Phase 6.3 — Booking payments

- [ ] `PaymentProvider` interface
- [ ] Paystack implementation (Ghana)
- [ ] Webhook verification (idempotent)
- [ ] Payment capture → booking confirmed transition (atomic)
- [ ] Commission recording on `bookings.settlement`
- [ ] Refund / cancellation / no-show / disputed flows with admin queues
- [ ] Manual settlement support (until clean splits available)
- [ ] Monetary amounts in integer minor units (pesewas) — enforced by lint or value object

### Phase 6.4 — Referee & Officiator Engine V1

- [ ] Referees table with kind discriminator (community officiator, split community, verified referee, organizer-appointed, Kalaanba-appointed)
- [ ] Trust weights stored in Admin Config, consumed by Trust engine
- [ ] Acceptance flow
- [ ] Calendar conflict prevention
- [ ] Light V1 report: completed, score, no-show/walkover/abandoned flag, cards, key incidents, optional photo/video
- [ ] Split officiating restricted for high-RP challenges and finals
- [ ] No marketplace / payments / public ratings (deferred per brief §10.2)

---

## Stage 7 — Recognition & Governance UI

🎯 **Goal:** Continuous recognition cadence + the admin tooling to run all of it without code changes.

✅ **Exit criteria:** An admin can change the RP win value for next season without touching code, approve a venue verification, resolve a disputed challenge with full audit trail, and review every weekly recognition card before it publishes.

🔗 **Brief refs:** §7.11 (awards), §7.15 (admin config & governance), §11.6 (observability), §10.1

### Phase 7.1 — Awards & Recognition full

- [ ] Cadence schedulers: matchday (after each confirmed match), weekly (Sun night), monthly (1st), season-end (closing window)
- [ ] Candidate generation reads Trust + stats clearance
- [ ] Weekly: Goals of the Week, Assists of the Week, Club of the Week, Challenge of the Week, Hat-trick Hero, Zone Pulse
- [ ] Monthly + season snapshots
- [ ] Card render → R2 → distribution (Moderation-gated)
- [ ] Corrections preserve history (revoked_at + compensating record)
- [ ] Admin review queue before publish
- [ ] Profile badges updated on award

### Phase 7.2 — Admin Configuration & Governance UI

- [ ] Config registry browser (all keys, all scopes, all values)
- [ ] Effective-dated editing UI
- [ ] Version history per key
- [ ] Approval workflows (Low immediate / Medium admin confirm / High senior approval / Critical Super Admin + dual)
- [ ] Preset library (competition presets, RP config presets, season presets)
- [ ] Scope picker (platform / season / hub / zone / competition / entity)

### Phase 7.3 — Dispute & evidence handling

- [ ] Dispute queue with priority
- [ ] Evidence upload to private R2 (`kalaanba-evidence`)
- [ ] Signed URLs (5-min TTL), audit-logged access
- [ ] Decision Trace surfacing in admin UI
- [ ] Super Admin override capture (previous/new status, reason, affected systems, evidence ref, timestamp)
- [ ] Compensating ledger entries on RP corrections
- [ ] Dispute SLA tracking

### Phase 7.4 — V1 dashboards

- [ ] Platform dashboard (active clubs, verified matches, RP-eligible matches, hot fixtures, DAU)
- [ ] Club dashboard (their matches, RP, challenges, awards)
- [ ] Venue dashboard (bookings, occupancy, revenue, commission, no-shows)
- [ ] Competition dashboard (standings, top scorers, fixture progress)
- [ ] Trust dashboard (clearance throughput, override frequency, dispute SLA)
- [ ] Moderation dashboard (queue depth, decision times, restriction trends)
- [ ] Notification dashboard (delivery rate, latency, channel split, failures)

---

## Stage 8 — Hardening for 500K DAU

🎯 **Goal:** Stretch from minimal infra to the §11 capacity baseline. Prove it holds under load and under failure.

✅ **Exit criteria:** Documented headroom of at least 2× projected peak. Restored DB inside SLA. No single-node failure causes user-visible outage longer than 60s. Cache hit rates and queue depths within healthy ranges under load.

🔗 **Brief refs:** §11 (NFRs), Architecture §11 (capacity), §12 (scaling path)

### Phase 8.1 — Scale out

- [ ] Scale to: 2 LB, 4 Next.js, 6 Laravel/FrankenPHP, 2 worker, 2 Reverb, 1 Postgres primary + 2 replicas, 3 Redis Sentinel, 2 Meilisearch, 1 observability
- [ ] PgBouncer in front of every Postgres node
- [ ] HAProxy floating IP active/passive

### Phase 8.2 — Read-write split + caching

- [ ] Laravel `read`/`write` connection split active
- [ ] Read-heavy routes verified to hit replicas
- [ ] Cloudflare edge cache rules per public surface (matches, competitions, clubs, venues, feeds)
- [ ] Redis hit rates measured per cache namespace
- [ ] Materialized projections covering all hot reads (standings, leaderboards, feeds, dashboards)

### Phase 8.3 — Load testing

- [ ] k6 scripts for: signup flow, match entry, public match read, competition page read, challenge issue, booking, feed scroll
- [ ] Sustain 1,500 rps on public read path
- [ ] Sustain 500 rps on writes
- [ ] Reverb test: 50K concurrent connections
- [ ] Soak test: 6h sustained load, no memory leak / connection drift

### Phase 8.4 — DR & game-day

- [ ] Full Postgres PITR rehearsal in side environment
- [ ] Restore inside documented RTO/RPO
- [ ] Game-day failure injection: kill a Laravel node, kill Postgres primary, fill Redis, saturate `default` queue
- [ ] All failure modes recover within 60s of user-visible impact
- [ ] Runbook documented for each failure mode

---

## Discipline Rules (apply across every stage)

These are not optional. They are the spine of the brief and the architecture. If a task seems to require violating one, **the task is wrong, not the rule.**

1. **Every stage emits analytics events.** No "we'll add tracking later." Day-one capture is mandated by the brief.
2. **Every stage reads from Admin Config** for any business value. No hardcoded RP/threshold/window/label values, ever.
3. **Every record-affecting flow goes through Trust clearance.** Trust outputs are **stored, not recomputed** per page load.
4. **Every public output passes Moderation** before distribution. Including admin-generated content.
5. **Every stage's tests include the architecture lint.** Cross-module reach-ins and cross-schema foreign keys fail CI.
6. **Every irreversible action has a Super Admin override path and an audit log entry** with reason capture.
7. **Every user-triggered write is idempotent.** Mobile networks retry; we will double-write without `Idempotency-Key` discipline.
8. **No FanBuzz writes touch RP, Match, or Competition schemas.** Deptrac-enforced.
9. **RP is mutated only via ledger entries.** Wallet balances are projections, never directly updated.
10. **Money is integer minor units.** Never floats. Booking commission, settlement, refunds all in pesewas.
11. **Archive, don't delete.** Clubs, players, matches, awards, challenges — all preserve history. Corrections via compensating entries.
12. **The football loop (Stage 2) must be solid before the drama layer (Stage 5).** Drama only works if Trust is real.
13. **Revenue (Stage 6) is the last thing before scale-out, not the first.** Don't let monetization pressure jump the queue.

---

## Out of Scope (deferred — brief §10.2)

Do not let any of these slip into the V1 stages above under any pressure:

- Promotion / relegation
- Group + knockout combined formats
- Auto fixture generation
- Paid competitions, prize pools, entry fees
- Referee marketplace, referee payments, public referee ratings
- Full comment system, fan voting, fan reputation
- AI-driven trust/moderation decisions
- Offline-first live match entry
- Advanced public trust scores and automated punishments
- Subscriptions, sponsorships, promoted listings
- Self-hosted SLM, AI dashboard queries, advanced personalization
- Bulk tournament booking automation
- All-time / cross-season advanced analytics

---

## Change Log

| Date       | Change                                                                                                                                                                                                                                                                                                                                                                                                                                                       | By      |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------- |
| 2026-05-12 | Initial build plan derived from System_Architecture.md §13 + brief §14                                                                                                                                                                                                                                                                                                                                                                                       | initial |
| 2026-05-20 | Phase 0.2 complete: Postgres bootstrapped, `kalaanba` app role (md5 auth, pg_hba.conf patched for PG18 scram compat), `kalaanba_dev` migrations green, `Model::preventLazyLoading()` enabled, `composer check` exit 0                                                                                                                                                                                                                                        | agent   |
| 2026-05-21 | Phase 0.3 complete: `outbox_events` + `event_dedupe` migrations, `OutboxEnvelope` (event name enforced), `OutboxWriter`, `RedisStreamPublisher` (predis v3), `DedupeStore`, `outbox:relay`, `health:ping`; `health.ping` end-to-end confirmed; `predis/predis` v3 added (phpredis ext absent on Windows dev); 17 tests, `composer check` exit 0                                                                                                              | agent   |
| 2026-05-22 | Phase 0.4 complete: `analytics.events` daily-partitioned table (Postgres native partitioning, 7 forward days + DEFAULT catch-all), `analytics:ensure-partitions` roll-forward command, `EventSchema` + `EventSchemaRegistry` + `SchemaCatalogue` (`health.ping@v1`), `AnalyticsEmitter` validating before write, `DatabaseAnalyticsEventWriter` adapter, arch test guards schema-key uniqueness + Domain framework-purity; 38 tests, `composer check` exit 0 | agent   |
| 2026-05-25 | Phase 0.7.5 + 0.8 complete: Filament v3 God Mode portal at `/admin` (ADR-0002) with 5 resources + 3 custom pages, gated by `RequireSuperAdminMiddleware`; Sentry both sides gated on DSN, `RequestIdMiddleware`, `GET /api/v1/health`, JSON stderr logs. Horizon mount deferred. | agent   |
| 2026-05-25 | **Phase 1.1 Season Engine complete** — `seasons` table, `SeasonCalendar`/`SeasonPhase`/`SeasonWindow` domain, `CurrentSeason` cached read port (5-min TTL), `SeasonTicker` emitting all three season events with deterministic UUIDv5 ids, `season:tick` under a Redis leader lock, 13 `season.*` config keys. **Never logged at the time — recovered in the 2026-08-23 reconciliation.** | agent   |
| 2026-05-25 | Phase 2.5 partial: notification inbox (WP-20260525-notif-inbox-v1) — `notification_inbox` table + 4 endpoints + 3 config keys. Still no frontend client. | agent   |
| 2026-05-26 | Phase 1.2 Zone Engine complete: geography tables, `area_suggestions` queue, admin approve/reject, `/admin` Next.js portal slice. | agent   |
| 2026-05-28 | **ADR-0003**: `users.id` migrated to UUIDv7-ordered; the BIGINT↔UUID Stage 1 blocker cleared and the UUIDv5 reviewer-mapping hack removed. | agent   |
| 2026-05-30 | Identity backend: profile + avatar (WP-20260529), then full registration — phone+OTP signup, email+password signup, email verification, channel binding (WP-20260530). | agent   |
| 2026-06-24 | **ADR-0004** identifier-first progressive auth (`POST /auth/lookup` + `<AuthFlow>`); **ADR-0005** admin access code gating destructive Users-section actions, plus the wired `/admin/governance/users` UI. | agent   |
| 2026-06-25 | Post-signup area onboarding (WP-20260625) + its backend (WP-20260625a-zone-public-read): `GET /zone/hubs`, `GET /zone/areas`, `POST /zone/area-suggestions`. Live-verified end to end. Established the **contract-first precedent**: the frontend may consume an OpenAPI contract before the endpoint exists. | agent   |
| 2026-07-02 | Signup→club split into three WPs, all shipped: **A** home rewire, **B** player profile create (`POST /players`, `/player/setup`), **C1** club identity (`clubs` + `club_memberships`, create + discover) and **C2** affiliation join (request → accept/decline, `affiliation.*` events, `/clubs/manage`). | agent   |
| 2026-08-12 | **Token layer v3 (OKLCH), ADR-0006.** The audit scored v2 at 11/20: four of five filled buttons failed AA for their own labels, the focus ring measured 1.00:1 against the button it marked, the raised elevation step was ΔL 0.022, brand and danger sat 25° apart, and 36/28px touch targets were shipping in feature code. Fixed at the token source. Added Phase 8 football primitives (`Eyebrow`, `StatValue`, `Crest`, `LiveIndicator`, `ScoreLine`, `FixtureRow`) and swept 45 files onto v3 (Phase 9). `REBUILD_PLAN.md` reconciled the same day after its boxes had drifted. | agent   |
| 2026-08-19 | **Went live on a VPS.** `scripts/deploy.sh` committed into both repos; the ISR cache in Redis DB 2 outlives a rebuild and a reload, so a postbuild flush is load-bearing (it broke `/auth/login` twice). CORS origin pinned. | agent   |
| 2026-08-19 | **Live SMS OTP**: SMSOnlineGH (**ADR-0008**) replaced the same day by **BMS** (**ADR-0009**) because the sender ID is approved there. Vendor swap only, via the existing `auth.otp_provider` config key. | agent   |
| 2026-08-19 | Auth split-screen rework + app locked to light (**ADR-0010** bright fills with dark labels, **ADR-0011** pitch turf tokens, **ADR-0012** white labels below AA knowingly, superseding 0010 on the label colour). Player setup rebuilt as a five-step guided wizard behind **ADR-0007** (config-derived option sets via `GET /players/meta`), deleting the hardcoded position/availability mirrors from the frontend. | agent   |
| 2026-08-20 | **ADR-0013** brand-tinted secondary hover. Home rebuilt and the site nav shipped (real logo, live ticker, menu right, account in the sheet). | agent   |
| 2026-08-21 | Ghana's regional capitals and localities sourced and seeded on deploy. `GET /players/me` + `PATCH /players/{id}` shipped. The player card line: hero composition (**ADR-0014** theme-stable `--card-*` tokens), position-aware lead stats from `player.card.featured_stats` config, and the card surface with its folk-art pattern layer — where a contrast regression was found and fixed the same evening, establishing the rule that **a decorative layer changing luminance is part of the ground, and the ground is what has to clear AA**. | agent   |
| 2026-08-22 | `POST /api/v1/players/{playerId}/media` shipped, writing `headshot_url` itself rather than leaving a second call to a mobile client. Frontend photo framing (camera/library/remove → drag, pinch, zoom crop) replaced a centre-crop heuristic. **ADR-0015**: the owner-rendered share graphic ships now; the public card page stays fenced behind §16. **ADR-0016**: a third typeface, for the signature on an empty card. `/me/v2` workspace shape landed unlabelled alongside `/me` — both live until one is chosen. | agent   |
| 2026-08-23 | **Full reconciliation of this file and `docs/adr/README.md` against both repositories.** This tracker was last updated 2026-05-26 with a change log stopping 2026-05-22, while work shipped through 2026-08-22 — it reported Phase 1.1 as not started when the Season Engine was complete. The ADR index listed 6 of 16 ADRs on disk. Every box was re-verified in code; the unticked ones were confirmed unbuilt rather than assumed. **No code changed.** | agent   |
