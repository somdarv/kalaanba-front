# WP-20260525-godmode-admin-foundation

> **Work Packet** tracking sheet. Updated as each pipeline stage clears.
> One source of truth for: scope, contracts, config keys, engines, owners, open questions, stage progress.

| Field                | Value                                                                                                         |
| -------------------- | ------------------------------------------------------------------------------------------------------------- |
| **ID**               | `WP-20260525-godmode-admin-foundation`                                                                        |
| **Title**            | God Mode developer admin portal — foundation slice (Filament v3)                                              |
| **Opened**           | 2026-05-25                                                                                                    |
| **Owner**            | Sole developer / product owner                                                                                |
| **ADR**              | [ADR-0002](../adr/0002-filament-godmode-admin-portal.md) — Filament v3 as the God Mode developer admin portal |
| **Build Plan phase** | [Phase 0.7.5](../Architecture/Build_Plan.md)                                                                  |
| **Repo(s)**          | `kalaanba-api` (primary), `kalaanba-front` (none in this WP)                                                  |
| **Current stage**    | **Stage 5 — Contract Design** ✅ → Stage 6 — Implementation                                                   |

---

## Stage 1 — Intake ✅

### Problem

The sole developer is not SQL-fluent and needs UI-level God Mode access to every Eloquent table for pre-alpha + alpha testing. Currently the only tools are `artisan tinker` and `psql` — both slow, error-prone, and bypass `AdminAuditMiddleware`.

### Goal

Ship a working Filament v3 admin panel at `kalaanba-api`'s `/admin` route that:

1. Is gated by the existing `RequireSuperAdminMiddleware` (WP-C of Phase 0.6).
2. Exposes auto-CRUD over **every currently-existing table** in the database: `users`, `personal_access_tokens`, `outbox_events`, `event_dedupe`, `admin_config`, `admin_audit_log`, `analytics_events` (read-only).
3. Provides three custom power-tool pages: **User Inspector**, **Event Replayer**, **Data Injector v0**.
4. Routes every mutation through the existing `AdminAuditMiddleware` so every God Mode action is auditable.
5. Carries a lightly-themed brand surface (Kalaanba palette + Inter font + Kalaanba wordmark) — but **does not** attempt to replicate the Kalaanba design system.

### Non-goals (this WP)

- Public-facing admin portal (Stage 6+, Next.js, Admin Governance engine — **NOT** Filament).
- 2FA / hardware-key enforcement on `SuperAdmin` (deferred to Phase 9).
- IP allowlist or signed-cookie gating (deferred to Phase 9).
- Filament resources for engines that don't yet exist (Season, Club, Player, Match, etc.) — those ship with their respective engine WPs as a definition-of-done line item.
- Replacing existing CLI scripts (`php artisan outbox:relay`, `analytics:ensure-partitions`) — Filament wraps the data, not the workers.

### Affected engines

- **Cross-cutting** — touches `kalaanba-api`'s root Laravel app (route registration, middleware wiring, dependency install).
- **Admin Governance** (forthcoming Stage 6 engine) — this WP is its first concrete deliverable in pre-alpha form, even though the public Admin Governance engine itself ships later. No domain logic added; only an introspection surface.
- **Support layer** — `RequireSuperAdminMiddleware` (existing), `AdminAuditMiddleware` (existing). No changes to either; only new mount points.

### Out of pipeline scope (rule-references only)

- **Constitution Law 5** (every meaningful action audited) — Filament mutations MUST flow through `AdminAuditMiddleware`. Non-negotiable.
- **Constitution Law 11** (RP mutated only via ledger) — Filament resources for `rp_ledger` (when it ships) MUST NOT allow direct in-place balance edits. Read-only viewer + compensating-entry button only.
- **Engineering standards** — file size cap 400 LOC applies to Filament resource files; if a resource grows past 400 lines (rare), split into pages + actions.

### Risks

| Risk                                                                      | Mitigation                                                                                                  |
| ------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Filament's UI confuses developer when looking at Kalaanba design surfaces | Mounted at `/admin` only, never linked from product navigation. Brand theming makes intent visually clear.  |
| SuperAdmin compromise = total platform compromise                         | Acknowledged, time-boxed to pre-alpha + alpha. Phase 9 adds 2FA + IP allowlist before public beta.          |
| Filament resources become a parallel domain-logic path                    | Constitution Law: resources call into module Application services only. PR review enforces.                 |
| Adding Filament's dependencies bloats `composer.lock`                     | One-time ~30 MB increase; all dependencies are mainstream Laravel ecosystem (Livewire, Alpine). Acceptable. |

### Definition of Done

- [ ] Filament v3 installed in `kalaanba-api`; panel mounted at `/admin`.
- [ ] `RequireSuperAdminMiddleware` gates the panel; 403 returned for any non-SuperAdmin.
- [ ] Brand theme applied: Kalaanba primary colour, Inter font, custom logo.
- [ ] Auto-discovery configured for `app/Modules/<Engine>/Filament/Resources/`.
- [ ] Resources shipped: `UserResource`, `OutboxEventResource`, `AdminAuditLogResource` (read-only), `AdminConfigResource`, `AnalyticsEventResource` (read-only), `PersonalAccessTokenResource`, `EventDedupeResource` (read-only).
- [ ] Custom pages shipped: User Inspector, Event Replayer, Data Injector v0.
- [ ] Every mutation produces a row in `admin_audit_log` (verified by feature test).
- [ ] No domain logic inside any resource file (verified by code review + future Pest architecture test).
- [ ] Pipeline gates green: `pint`, `phpstan` (level 6), `deptrac` (0 violations), `pest` (all tests pass).
- [ ] `docs/JOURNAL.md` updated with completion entry.
- [ ] `Build_Plan.md` Phase 0.7.5 checklist all ticked.

### Open questions

1. **Brand colour mapping** — ✅ **Resolved 2026-05-25**: Map Kalaanba primary → Filament `primary`. Both light + dark mode palettes derived from `--primary` / `--primary-fg` tokens via a Tailwind preset.
2. **Impersonation strategy** — ✅ **Resolved 2026-05-25**: Install [`stechstudio/filament-impersonate`](https://github.com/STS-Studio/filament-impersonate) (community-standard, ~5k installs, last released 2025, MIT). Less code to maintain; matches the "best practice / high fidelity" mandate.
3. **Resource discovery path** — ✅ **Resolved 2026-05-25**: Dual-path discovery confirmed. `app/Filament/Resources/` for cross-cutting (User, OutboxEvent, AdminAuditLog, AdminConfig, AnalyticsEvent, PersonalAccessToken, EventDedupe). `app/Modules/<Engine>/Filament/Resources/` for engine-specific resources shipped from Phase 1.1 onwards.
4. **Mobile responsiveness** — ✅ **Resolved 2026-05-25**: Must be mobile-responsive (per user mandate). Filament v3 is responsive out of the box; explicit QA stage 8 acceptance criterion: open `/admin` on a 375px viewport, confirm sidebar collapses to drawer, tables are horizontally scrollable, forms stack vertically. **All custom pages MUST be tested on mobile before WP closes.**

---

## Stage 2 — Impact Map ✅

### Surface area

**New code (all in `kalaanba-api`)**:

| Path                                                                | Purpose                                                                                                 | LOC budget |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ---------- |
| `app/Providers/Filament/AdminPanelProvider.php`                     | Panel registration: brand, theme, middleware, auto-discovery paths                                      | ~120       |
| `app/Filament/Resources/UserResource.php` (+ Pages/)                | User auto-CRUD + impersonation trigger                                                                  | ~250       |
| `app/Filament/Resources/OutboxEventResource.php` (+ Pages/)         | Outbox CRUD + re-emit action                                                                            | ~200       |
| `app/Filament/Resources/AdminAuditLogResource.php` (+ Pages/)       | Read-only audit viewer                                                                                  | ~150       |
| `app/Filament/Resources/AdminConfigResource.php` (+ Pages/)         | Effective-dated CRUD                                                                                    | ~220       |
| `app/Filament/Resources/AnalyticsEventResource.php` (+ Pages/)      | Read-only analytics viewer                                                                              | ~150       |
| `app/Filament/Resources/PersonalAccessTokenResource.php` (+ Pages/) | Token revocation                                                                                        | ~120       |
| `app/Filament/Resources/EventDedupeResource.php` (+ Pages/)         | Read-only dedupe viewer                                                                                 | ~100       |
| `app/Filament/Pages/UserInspector.php` (+ view)                     | Tabbed user deep-dive                                                                                   | ~250       |
| `app/Filament/Pages/EventReplayer.php` (+ view)                     | Pick + re-emit outbox row                                                                               | ~150       |
| `app/Filament/Pages/DataInjector.php` (+ view)                      | One-click mock data                                                                                     | ~200       |
| `app/Filament/Themes/KalaanbaTheme.php` (or CSS file)               | Brand palette + Inter font + logo                                                                       | ~80 + CSS  |
| `app/Models/User.php`                                               | Add `FilamentUser` interface implementation → `canAccessPanel()` returns `Role::SUPER_ADMIN` check only | +15        |
| `tests/Feature/Filament/*.php`                                      | Auth gate, audit-log verification, mobile responsiveness                                                | ~400       |
| `composer.json`                                                     | Add `filament/filament: ^3.2`, `stechstudio/filament-impersonate: ^4.0`                                 | 2 lines    |

**Total estimated LOC**: ~2400 (test + production), all in `kalaanba-api`. Every file under the 400 LOC cap.

**No code touched in `kalaanba-front`** — this WP is API-side only.

### Touched contracts

- **API contracts** (`contracts/api/`): **none.** Filament is a Livewire/internal surface. No new external API endpoints.
- **Event contracts** (`contracts/events/`): **none.** Existing event names re-emitted via the Event Replayer page; no new events defined.
- **Config contracts** (`contracts/config/`): **two new keys** (proposed below at Stage 5 for sign-off):
  - `admin.godmode_impersonation_enabled` (default `true` in `local`/`testing`, `false` in `production` — flips on for ops, off by default per least-privilege).
  - `admin.godmode_data_injector_enabled` (default `true` in `local`/`testing`, `false` in `production`).

### Touched config keys

Both via `Config::get('admin.godmode_*')` — defaulted in `admin_config` seeder; toggleable via the `AdminConfigResource` itself (meta-circular, intentional).

### Routes added

- `GET /admin` and all `/admin/*` sub-routes via Filament panel registration.
- `GET /admin/horizon` (mounted in Phase 0.8 Lite; namespaced under the same auth gate).

### Middleware touched

- **No changes** to `RequireSuperAdminMiddleware` or `AdminAuditMiddleware`.
- Filament's panel registration applies `['web', 'auth', RequireSuperAdminMiddleware::class]` as the `authMiddleware` config.
- `AdminAuditMiddleware` already auto-fires on all authenticated mutating routes globally — Filament's mutations pass through it transparently.

### Database

- **No schema changes.** Filament reads existing tables via existing Eloquent models.
- **No new migrations.**
- Two new seeded rows in `admin_config` for the toggles above.

### Dependencies (composer)

- `filament/filament: ^3.2` (~30 MB transitive: Livewire 3, Alpine.js, Blade Heroicons, etc.)
- `stechstudio/filament-impersonate: ^4.0` (~50 KB)

### Frontend assets

- Filament publishes its own CSS/JS via `php artisan filament:assets`. Added to `.gitignore` as build output.
- One custom CSS file `resources/css/filament/admin/theme.css` for the Kalaanba brand pass.

### Performance

- Filament uses Livewire (server-side state). One additional process per request when `/admin` is hit. Negligible — only ~1 concurrent admin user.
- Filament queries are auto-Eloquent — N+1 risk on heavy tables. Mitigated via `getEloquentQuery()` eager-loading per resource.

### Backward compatibility

- **None broken.** All new code, all additive. Removing this WP later (e.g. if we migrate to Next.js admin) is a `composer remove filament/filament` + delete the `app/Filament/` tree + delete the WP's tests. No data migration needed.

### Risk register (updated from Stage 1)

| Risk                                                    | Likelihood | Impact | Mitigation                                                                                                                                       |
| ------------------------------------------------------- | ---------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Composer dep conflict with Laravel 11 / Sanctum 4       | Low        | Medium | Filament v3.2+ explicitly supports Laravel 11. Local CI catches before merge.                                                                    |
| Livewire 3 + Sanctum session conflict on `/admin`       | Low        | Medium | Filament panels use `web` guard with session; Sanctum's stateless API tokens are unaffected. Verified by Filament v3 docs.                       |
| Audit log volume explosion if developer browses heavily | Low        | Low    | `AdminAuditMiddleware` only fires on **mutating** methods (POST/PUT/PATCH/DELETE). Read-heavy browsing won't bloat the log.                      |
| Mobile Filament panel UX poor at 375px                  | Medium     | Low    | Filament v3 is responsive by spec; explicit QA criterion at stage 8. If poor, add custom mobile-pinned navigation.                               |
| Brand theme drifts from `globals.css` tokens            | Low        | Low    | Theme CSS reads from a small set of duplicated Kalaanba colour values (manually synced once). Acceptable — Filament theme isn't a brand surface. |

---

## Stage 3 — Rules Review ✅

This WP is cross-cutting (Support layer + future Admin Governance engine). No single engine owner. The review is therefore against the **Constitution** + **Engineering Standards** directly.

### Constitution check

| Law                                                    | Applies?    | How this WP respects it                                                                                                                                                                                                                                                                                                                                                           |
| ------------------------------------------------------ | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **L1 — Engine boundaries sacred**                      | ✅          | Filament resources are read/write surfaces on existing Eloquent models. They call into module Application services for any non-trivial action; never reach into another engine's schema. Cross-engine effects (e.g. Event Replayer re-emitting an outbox event) flow through the existing outbox + relay path, not via direct cross-schema writes.                                |
| **L2 — Configurability over constants**                | ✅          | Two new config keys (`admin.godmode_impersonation_enabled`, `admin.godmode_data_injector_enabled`) registered in `admin_config`. No magic numbers in resource files. Per-resource pagination defaults loaded from `Config::get('admin.godmode_page_size', 25)`.                                                                                                                   |
| **L3 — Backend owns truth**                            | ✅          | N/A in a hostile sense — Filament IS the backend. No frontend computation.                                                                                                                                                                                                                                                                                                        |
| **L4 — Stable internal keys, configurable labels**     | ✅          | Filament tables filter by enum keys (`Role::SUPER_ADMIN->value`), not display strings. Resource navigation labels are i18n-ready via Filament's built-in translation system.                                                                                                                                                                                                      |
| **L5 — Every meaningful action audited**               | ✅          | `AdminAuditMiddleware` (already wired globally) fires on every POST/PUT/PATCH/DELETE through `/admin/*`. Verified via Stage 8 feature test.                                                                                                                                                                                                                                       |
| **L6 — Event-first**                                   | ✅          | Event Replayer page emits via the existing `OutboxEvent` + relay path, not in-process. Data Injector creates rows via module Application services that fire their own domain events.                                                                                                                                                                                              |
| **L7 — Trust gates downstream effects**                | ✅          | N/A — no RP/standings/awards UI in this WP.                                                                                                                                                                                                                                                                                                                                       |
| **L8 — Buzz drives visibility, Results drive respect** | ✅          | N/A.                                                                                                                                                                                                                                                                                                                                                                              |
| **L9 — Recognition uses verified records only**        | ✅          | N/A.                                                                                                                                                                                                                                                                                                                                                                              |
| **L10 — Public vs private respected**                  | ✅          | Entire panel is SuperAdmin-only. Phone numbers shown unmasked **only** in God Mode (acknowledged dev-grade trade-off; user explicitly accepted). Production-bound config flags can disable Data Injector + Impersonation.                                                                                                                                                         |
| **L11 — RP mutated only via ledger**                   | ✅          | When `rp_ledger` ships (Stage 3 Phase 3.x), its Filament resource will be **read-only** + a "compensating entry" action that calls into `RpEconomy\Application\Commands\PostCompensatingEntry`. Captured as a forward rule in the engine WP definition-of-done.                                                                                                                   |
| **L12 — Money is integer minor units**                 | ✅          | N/A in this slice (no money models exist yet). When booking commission ships, its Filament resource will display minor units only, with a derived "display" computed column.                                                                                                                                                                                                      |
| **L13 — Archive, don't delete**                        | ⚠️ **Note** | Filament's default `DeleteAction` does a hard `DELETE`. **Override**: replace `DeleteAction` with a custom `ArchiveAction` on `UserResource`, `ClubResource` (future), etc., that sets `archived_at = now()` instead of deleting. Hard-delete reserved for genuinely transient rows (`event_dedupe`, expired `personal_access_tokens`). Captured in Stage 6 implementation notes. |
| **L14 — Every user-triggered write idempotent**        | ✅          | Filament's Livewire actions are CSRF-protected and single-fire. Custom actions (Event Replayer) generate a fresh `event_id` per replay (re-emit ≠ duplicate); Data Injector mock creators use `Str::uuid()` for `idempotency_key` derivation.                                                                                                                                     |

### Engineering Standards check

| Standard                                                                 | Compliance                                                                                                                                                                                                                                    |
| ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **File size ≤ 400 LOC**                                                  | All planned files within budget per Stage 2 estimates. Largest is `UserResource.php` at ~250.                                                                                                                                                 |
| **Naming**: snake_case migrations, PascalCase classes, kebab-case routes | All Filament conventions match (PascalCase resources, kebab-case auto-generated route slugs).                                                                                                                                                 |
| **Layering**: Http → Application → Domain → Infrastructure               | Filament resources sit at the **Http** layer. They call into existing module Application services. They DO NOT import from `Domain` directly except for shared value objects + enums. **Pest architecture test added in Stage 8** to enforce. |
| **DB indexing**                                                          | No new tables, no new indexes.                                                                                                                                                                                                                |
| **API versioning**                                                       | N/A (no API contracts).                                                                                                                                                                                                                       |
| **Error handling at boundaries**                                         | Filament's `Notification` system surfaces exceptions to the user with structured messages. No silent swallows.                                                                                                                                |
| **Observability**                                                        | Filament's Livewire requests show up in Sentry once Phase 0.8 ships. No special instrumentation needed.                                                                                                                                       |

### Outcome

✅ **Approved**. One implementation note carried forward: **L13 archive-don't-delete** requires custom `ArchiveAction` overrides in Stage 6. Logged in implementation checklist.

---

## Stage 4 — Architecture Check ✅

### Decision reference

[ADR-0002 — Filament v3 as the God Mode developer admin portal](../adr/0002-filament-godmode-admin-portal.md), accepted 2026-05-25.

### Architecture invariants confirmed

| Invariant (from ADR-0001 + ADR-0002)              | This WP respects it?                                                                                                                                                                                                       |
| ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Modular monolith, one schema per engine           | ✅ Filament reads existing schemas via Eloquent; never cross-joins.                                                                                                                                                        |
| Outbox + relay for cross-engine effects           | ✅ Event Replayer uses existing outbox. Data Injector's mock creators go through module Application commands that emit via outbox.                                                                                         |
| Append-only audit log                             | ✅ `AdminAuditLogResource` is **read-only**; no UPDATE/DELETE actions available.                                                                                                                                           |
| Two-admin mental model                            | ✅ This panel is the God Mode dev tool; explicitly **not** the future Public Admin Portal.                                                                                                                                 |
| No domain logic in Filament resources             | ✅ Resources call into module services; Stage 8 includes a Pest architecture test pinning `App\Filament\*` cannot directly use `Illuminate\Database\Eloquent\Model::*` mutation methods outside of an Application command. |
| Filament resource per engine ships with engine WP | ✅ Build Plan updated, rule added to Stage 0.7.5 doc, ADR-0002 captures it.                                                                                                                                                |

### Open architectural questions

**None.** All open questions from Stage 1 were resolved by user direction. The two implementation notes carried forward are:

1. **`ArchiveAction` override** for L13 compliance (Stage 6).
2. **Pest architecture test** for "no domain mutation in resources" (Stage 8).

### Outcome

✅ **Approved**. No new architectural decisions required. Proceed to Stage 5.

---

## Stage 5 — Contract Design ✅

### API contracts

**None.** Filament panels are Livewire/internal surfaces. No new external HTTP endpoints.

### Event contracts

**None.** Event Replayer re-emits existing event names; no new event schemas.

### Config contracts shipped

Two new YAML descriptors under [`contracts/config/admin/`](../../contracts/config/admin/):

1. **[`admin.godmode_impersonation_enabled.yaml`](../../contracts/config/admin/admin.godmode_impersonation_enabled.yaml)** — boolean, defaults `true` in local/testing, `false` in production. Approval tier: medium. Gates the "Impersonate user" action.
2. **[`admin.godmode_data_injector_enabled.yaml`](../../contracts/config/admin/admin.godmode_data_injector_enabled.yaml)** — boolean, defaults `true` in local/testing, `false` in production. Approval tier: medium. Gates the Data Injector custom page.

Both flags follow the **principle of least privilege**: even with a SuperAdmin session compromised, a separate audit-logged config flip is required before destructive dev-only features become available in production.

### Database contracts

No schema changes. No new migrations.

### Outcome

✅ **Approved**. Contracts complete. Proceed to Stage 6.

---

## Stage 6 — Implementation 🔨 (next)

### Implementation order (each step ships independently green)

1. **Install dependencies** — `composer require filament/filament:^3.2 stechstudio/filament-impersonate:^4.0`
2. **Publish + register panel** — `php artisan filament:install --panels` → creates `app/Providers/Filament/AdminPanelProvider.php`. Configure:
   - panel id `admin`, path `/admin`
   - auth guard `web`, with `RequireSuperAdminMiddleware` added to `authMiddleware`
   - auto-discover resources from both `app/Filament/Resources/` AND `app/Modules/*/Filament/Resources/`
   - brand colour → Kalaanba primary; default font Inter; replace logo
3. **Wire User model** — implement `FilamentUser::canAccessPanel(Panel $panel): bool` → `return Role::SUPER_ADMIN === $this->role;`
4. **Seed 2 new config keys** in `AdminConfigSeeder` (or new migration-style seeder).
5. **Resources** (ship one at a time, run feature test per resource):
   - `UserResource` (full CRUD + `ArchiveAction` overriding `DeleteAction` + Impersonate action via plugin + Reset Password action)
   - `OutboxEventResource` (CRUD + Re-emit action)
   - `AdminAuditLogResource` (read-only viewer with filters)
   - `AdminConfigResource` (effective-dated CRUD; version-incrementing save logic)
   - `AnalyticsEventResource` (read-only with date/event_name filters)
   - `PersonalAccessTokenResource` (list + revoke action)
   - `EventDedupeResource` (read-only)
6. **Custom pages** (ship one at a time):
   - `UserInspector` (`/admin/user-inspector?user=X` with tabs)
   - `EventReplayer` (`/admin/event-replayer`)
   - `DataInjector` (`/admin/data-injector`, gated by `admin.godmode_data_injector_enabled`)
7. **Brand theme pass** — register custom CSS, publish Filament assets, verify dark mode.
8. **Pest architecture test** — pin `App\Filament\*` cannot directly mutate Eloquent models outside Application commands.
9. **Pipeline gates** — `composer check` (pint + phpstan + deptrac + pest) green.

### Implementation notes carried forward

- **Constitution L13** — override `DeleteAction` with `ArchiveAction` on User-type resources.
- **Constitution L2** — pagination defaults from `Config::get('admin.godmode_page_size', 25)` (add a 3rd config key if more granular control needed).
- **Constitution L10** — phone numbers shown unmasked in God Mode (dev-grade trade-off, explicitly accepted by user).
- **Mobile responsiveness** — every page tested at 375px before stage closes.

### Open implementation questions

**None at this point.** Ready to execute on the user's go-ahead.

---

## Stage 7 — Security Review ⏳

## Stage 8 — QA Plan + Tests ⏳

## Stage 9 — Docs Update ⏳

## Stage 10 — Release Packet ⏳
