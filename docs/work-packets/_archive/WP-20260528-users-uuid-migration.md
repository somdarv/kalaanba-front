# WP-20260528-users-uuid-migration

> **Work Packet** tracking sheet. Updated as each pipeline stage clears.
> One source of truth for: scope, contracts, config keys, engines, owners, open questions, stage progress.

| Field                | Value                                                                                                       |
| -------------------- | ----------------------------------------------------------------------------------------------------------- |
| **ID**               | `WP-20260528-users-uuid-migration`                                                                          |
| **Title**            | Migrate `users.id` from BIGINT to UUIDv7-ordered (HasUuids) — Stage 1 blocker resolution                    |
| **Opened**           | 2026-05-26                                                                                                  |
| **Closed**           | 2026-05-26                                                                                                  |
| **Owner**            | Sole developer / product owner                                                                              |
| **ADR**              | [ADR-0003](../adr/0003-uuidv7-user-identity.md) — UUIDv7 as the canonical user identity                     |
| **Build Plan phase** | [Stage 1 — Open architectural decision](../Architecture/Build_Plan.md)                                       |
| **Repo(s)**          | `kalaanba-api` (primary), `kalaanba-front` (docs only)                                                       |
| **Status**           | ✅ **Closed — all pipeline gates green**                                                                     |

---

## Stage 1 — Intake ✅

### Problem

`users.id` was created with Laravel's default `$table->id()` (BIGINT autoincrement). Subsequent engines (Zone, Analytics) committed to UUID for their user-FK columns because cross-schema FKs are forbidden (Constitution Law 1) and engineering-standards §6 mandates UUIDv7. The result was four incompatible representations of "user" across the platform: BIGINT (`users.id`, `sessions.user_id`, `personal_access_tokens.tokenable_id`, `notification_inbox.recipient_user_id`), UUID (Zone area_suggestions, Analytics events), and VARCHAR(64) (admin_audit_log).

`AreaSuggestionController` papered over the mismatch with `reviewerUuid()` — a deterministic UUIDv5 derived from `'user:' + user->id`. That hack would have to be replicated in every future engine.

### Goal

`users.id` becomes a UUIDv7-ordered string PK. The UUIDv5 mapping is deleted. Every Stage 1+ engine references users by a single canonical UUID. No cross-engine FKs are introduced — engines still store user IDs as opaque UUID strings.

### Non-goals

- Migrating `admin_audit_log.actor_id` from VARCHAR(64) — already accepts UUID strings; no change required.
- Cross-schema FKs from engine tables to `users` — explicitly forbidden by Constitution Law 1.
- Backfilling production data — pre-alpha; only a seeded SuperAdmin exists.

### Affected engines

- **Identity** — `users.id`, `sessions.user_id`, `personal_access_tokens.tokenable_id` migrated to UUID.
- **Notification & Distribution** — `notification_inbox.recipient_user_id` migrated to UUID; module DTOs/services/repository/controller migrated from `int $recipientUserId` to `string $recipientUserId` throughout.
- **Zone** — `AreaSuggestionController::reviewerUuid()` + `REVIEWER_UUID_NAMESPACE` const + `Ramsey\Uuid` import removed; controllers now pass `(string) $user->getAuthIdentifier()` directly.

## Stage 4 — Architecture Check ✅

**Engineering-standards §6 exception authorised by ADR-0003.** The rule "Never edit a migration that has been merged to main" is suspended for the four migrations touched here because we are pre-alpha, only a seeded SuperAdmin exists in any environment, and the alternative (a forward migration that drops + recreates `users` with all dependent FKs in one go) would be strictly more risky and harder to read.

## Stage 5 — Contract Design ✅

No public API contracts touched. Internal DTO contracts in `NotificationDistribution` module updated from `int` to `string` for `recipientUserId` — purely a type rename across DTOs, repository interface, services, and Postgres implementation.

## Stage 6 — Implementation ✅

### Files touched

| File | Change |
|---|---|
| `kalaanba-front/docs/adr/0003-uuidv7-user-identity.md` | **New ADR**; status Accepted, dated 2026-05-28 |
| `kalaanba-api/database/migrations/0001_01_01_000000_create_users_table.php` | `$table->id()` → `$table->uuid('id')->primary()`; `sessions.user_id` → `foreignUuid` |
| `kalaanba-api/database/migrations/2026_05_20_222722_create_personal_access_tokens_table.php` | `$table->morphs('tokenable')` → `$table->uuidMorphs('tokenable')` |
| `kalaanba-api/database/migrations/2026_05_25_000001_create_notification_inbox_table.php` | `recipient_user_id` BIGINT → UUID (both PG SQL branch + SQLite branch) |
| `kalaanba-api/app/Models/User.php` | `use HasUuids;`; `@property int $id` → `@property string $id` |
| `kalaanba-api/app/Http/Controllers/Admin/Zone/AreaSuggestionController.php` | Removed `Ramsey\Uuid\Uuid` import, `REVIEWER_UUID_NAMESPACE` const, `reviewerUuid()` method; 2 call sites use `(string) $user->getAuthIdentifier()` |
| `kalaanba-api/app/Modules/NotificationDistribution/Domain/NewInboxItem.php` | `public int $recipientUserId` → `public string $recipientUserId` |
| `kalaanba-api/app/Modules/NotificationDistribution/Domain/InboxItem.php` | `public int $recipientUserId` → `public string $recipientUserId` |
| `kalaanba-api/app/Modules/NotificationDistribution/Domain/InboxRepository.php` | All 4 `int $recipientUserId` parameters → `string $recipientUserId` |
| `kalaanba-api/app/Modules/NotificationDistribution/Application/MarkInboxItemSeenService.php` | `int` → `string` |
| `kalaanba-api/app/Modules/NotificationDistribution/Application/MarkInboxItemActedOnService.php` | `int` → `string` |
| `kalaanba-api/app/Modules/NotificationDistribution/Application/ListMyNotificationsService.php` | `int` → `string` |
| `kalaanba-api/app/Modules/NotificationDistribution/Application/CountMyUnreadNotificationsService.php` | `int` → `string` |
| `kalaanba-api/app/Modules/NotificationDistribution/Infrastructure/Eloquent/PostgresInboxRepository.php` | All 4 `int $recipientUserId` parameters → `string`; hydrate cast `(int)` → `(string)` |
| `kalaanba-api/app/Http/Controllers/Notifications/MyInboxController.php` | All `(int) $user->getKey()` call sites → `(string) $user->getKey()`; `ensureOwned()` signature `int` → `string` |
| `kalaanba-api/tests/Feature/NotificationDistribution/InboxTest.php` | Helper cast `(int) $user->getKey()` → `(string) $user->getKey()` |
| `kalaanba-front/docs/Architecture/Build_Plan.md` | Header note updated, Stage 1 progress snapshot updated, blocker ticked, ADR-0003 reference recorded |

### What was NOT changed

- `admin_audit_log.actor_id` (VARCHAR(64)) — UUID strings fit; no migration needed.
- `analytics.events.actor_user_id` — already UUID.
- `outbox_events`, `event_dedupe`, `admin_config` — no user-FK columns.

## Stage 7 — Security Review ✅

No new attack surface. UUIDv7-ordered identifiers are non-enumerable (vs BIGINT autoincrement) which is a security improvement: user IDs no longer leak via timing or ordering of `/api/v1/users` style endpoints (when they arrive). Sanctum token issuance unchanged. Phone-hash privacy unchanged. Admin audit middleware continues to capture `actor_id` as opaque string.

## Stage 8 — QA Plan + Tests ✅

| Gate | Result |
|---|---|
| `./vendor/bin/pint --test` | ✅ 266 files clean |
| `./vendor/bin/phpstan analyse --memory-limit=2G` | ✅ No errors |
| `./vendor/bin/deptrac analyse` | ✅ 0 violations / 261 allowed / 18 uncovered |
| `./vendor/bin/pest --testsuite=Feature` | ✅ **120 passed** (310 assertions) |
| `php -d memory_limit=1G ./vendor/bin/pest --testsuite=Architecture` | ✅ **24 passed** (76 assertions) |

Special verification: re-ran `InboxTest` after the int→string migration — all 10 tests passing (was 9 failing pre-fix). `AreaSuggestionLifecycleTest` continues to pass — confirms `(string) $user->getAuthIdentifier()` returns a real UUID after `HasUuids` was added to `User`.

## Stage 9 — Docs Update ✅

- ADR-0003 written and accepted (`docs/adr/0003-uuidv7-user-identity.md`).
- `docs/Architecture/Build_Plan.md` header + Stage 1 progress snapshot + open-architectural-decision section all updated to reflect resolution.
- `docs/JOURNAL.md` — Sankofa subagent will append the decision entry post-WP-close.

## Stage 10 — Release Packet ✅

Pre-alpha; no release artifact. Local environment migrations re-run via `php artisan migrate:fresh --seed`. Production has no data; first deploy will use the new schema directly.

---

## Pipeline checklist

- [x] Stage 1 — Intake
- [x] Stage 2 — Impact Map
- [x] Stage 3 — Rules Review
- [x] Stage 4 — Architecture Check (engineering-standards §6 exception via ADR-0003)
- [x] Stage 5 — Contract Design
- [x] Stage 6 — Implementation
- [x] Stage 7 — Security Review
- [x] Stage 8 — QA Plan + Tests (144 tests green)
- [x] Stage 9 — Docs Update
- [x] Stage 10 — Release Packet (pre-alpha — no artifact)
