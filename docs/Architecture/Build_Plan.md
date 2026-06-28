# Kalaanba — Build Plan & Progress Tracker

**Status:** Living document — update as we go
**Started:** 2026-05-12
**Last updated:** 2026-05-26 ✅ Phase 1.2 (Zone Engine) shipped — area-suggestions endpoints + Next.js Admin Portal slice (configs + Zone approvals) live. Stage 1 blocker **resolved** via ADR-0003 — `users.id` migrated to UUIDv7-ordered (`HasUuids` / `Str::orderedUuid()`); UUIDv5 reviewer-mapping hack removed; NotificationDistribution module migrated string-typed; 120 feature + 24 architecture pest tests green.
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

**Legend**

- 🎯 Stage goal
- ✅ Exit criteria
- 📌 Tasks (checklist)
- 🔗 Brief reference

---

## Progress Snapshot

| Stage | Title                                | Status         | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ----- | ------------------------------------ | -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0     | Foundations                          | 🟡 Almost done | 0.1–0.6, 0.7, 0.7.5, 0.8 shipped. Remaining: Horizon dashboard mount (Phase 0.8) + UptimeRobot wiring (external, pending DSN). 55 backend tests + 18/18 architecture tests pass, all quality gates green. Sentry SDK wired both sides (Laravel + Next.js) gated on DSN env so dev/test stays silent. RequestId middleware + `/api/v1/health` (DB+Redis checks) live. JSON stderr logs ready. Frontend UI rebuild WP-20260524 still in progress (Phase 1 token rename pending).                                                                                  |
| 1     | Identity Spine                       | 🟡 In progress | Phase 1.2 (Zone Engine) shipped: countries/regions/city_hubs/zones/belts/areas tables + area_suggestions queue + admin approve/reject endpoints (idempotent) + Next.js Admin Portal slice at `/admin` (configs read-only + Zone area-suggestions). ✅ **BIGINT↔UUID blocker resolved** via ADR-0003 (Option D — `users.id` is now UUIDv7-ordered via Laravel `HasUuids` / `Str::orderedUuid()`). UUIDv5 reviewer-mapping hack removed. NotificationDistribution module fully migrated. 120 feature + 24 architecture pest tests green. Phases 1.1, 1.3, 1.4, 1.5, 1.6 not started. |
| 2     | The Match                            | ⬜ Not started |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
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
- [ ] Provision minimal infra: 1 LB, 1 Next node, 1 Laravel node, 1 worker node, 1 Postgres, 1 Redis, 1 Meilisearch, R2 buckets
- [ ] Cloudflare in front (DNS, TLS, WAF baseline)
- [ ] Private network / WireGuard between nodes; no public DB/Redis ports
- [ ] Domain + subdomain plan (`app.`, `api.`, `admin.`, `ws.`)
- [ ] Deploy tooling (Deployer or equivalent) — zero-downtime symlink swap

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
- [ ] **Next**: Phase 1 — token rename + `@theme inline` registration so utilities resolve.

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

### Phase 1.1 — Season Engine

- [ ] `seasons` table (id, name, starts_at, ends_at, status, key dates JSON)
- [ ] Seed seasons (April 1 → Feb 28/29), phase definitions (high activity, final run-in, transition, archive)
- [ ] `Season::current()` cached helper
- [ ] Scheduler with leader-election Redis lock
- [ ] Phase transition jobs emitting `season.phase_changed`, `season.cutoff_passed`, `season.rp_reset_due`
- [ ] Configurable cutoffs read from Admin Config

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
- [x] User profile (name, phone hash, area, optional avatar in R2) — _WP-20260529: `GET/PATCH /users/me`, avatar driver (local + Cloudinary), public `GET /users/{id}`._
- [ ] Role assignment + admin promotion flow — _deferred to WP-20260531 (third Identity backend WP). `user` is now the universal default role (Role enum + engine doc §9)._
- [x] Admin Users section (pre-alpha tester support) — _WP-20260624-admin-users (ADR-0005): `/api/v1/admin/users` list + actions (resend OTP, set password, force-verify, edit phone/email, enable/disable, clear lockout); `disabled_at` + `admin_access_codes` (seeded `023050`, hashed) schema; destructive actions gated by the access code; auto-audited + redacted; real wired `/admin/governance/users` UI. 8 feature + 28 arch tests green; front 35 green. Deferred: one-time login link, temp single-use code, dependency-checked delete._
- [ ] Scope middleware applied to protected routes
- [~] Frontend: signup, login, profile screens — _auth UI (`/auth/login`, `/auth/signup`), dashboard/protected stubs, `src/lib/api/auth.ts` + `use-auth.ts` shipped (front commit `a069795`). Post-signup area onboarding shipped (WP-20260625, below); full profile/avatar screen still pending._
- [x] Post-signup area onboarding — _WP-20260625-onboarding-area: skippable City Hub → Area picker after signup (`/onboarding/area`), suggest-a-missing-area, persists via `PATCH /users/me`. Contract-first: 3 Zone read OAS (`get-hubs`, `get-areas`, `post-area-suggestions`). Backend shipped in **WP-20260625a-zone-public-read** (`GET /zone/hubs`, `GET /zone/areas`, `POST /zone/area-suggestions` + fix for the unauthenticated-API 500 → 401 JSON). Live-verified end-to-end. Front: lint + new-file typecheck + 4 onboarding tests green; back: Pint + PHPStan + Deptrac + 9 feature tests green._
- [x] Identifier-first progressive auth — _WP-20260624 (ADR-0004): single neutral entry, `POST /auth/lookup` branch signal (read-only, throttled, no PII), `<AuthFlow>` orchestrator + spec copy/error/resend/back-paths; `/auth/signup` redirects to the unified entry. Backend: 9 feature tests + phpstan + 28 architecture tests green; front: 6 flow tests + client tests green. Fixed the api-client envelope-unwrap mismatch in `auth.ts`/`use-auth.ts` (schemas now describe inner `data`)._

### Phase 1.4 — Club Engine

- [ ] Clubs table with maturity levels (Informal/Structured/Verified/Registered)
- [ ] Club types (community, school, academy, corporate, religious, institution, facility-based, registered)
- [ ] Roles: Owner, Co-founder, Admin, Manager, Captain, Scorer, Media Manager, Member/Viewer
- [ ] Verified Club badge storage (no judgement UI yet)
- [ ] Inactive (3mo) / Dormant (6mo) state transitions on cron
- [ ] Archive / merge primitives with redirect records
- [ ] Related-club detection on `integrity` queue (writes signals only; doesn't block actions yet)
- [ ] "Formerly…" notice retention (90 days)
- [ ] Frontend: club creation, members management, club profile

### Phase 1.5 — Player & Affiliation Engine

- [ ] Players table (claimed + ghost)
- [ ] Affiliations table (versioned: joined/transferred/loaned/left, start/end)
- [ ] Ghost player creation in lineups
- [ ] Claim flow via OTP linking ghost row to a user
- [ ] Minor-protected flag + restricted visibility query layer
- [ ] Free agent player support
- [ ] Frontend: player profile (basic card), ghost claim screen

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
