# ADR-0003: UUIDv7 as the canonical user identity

- **Status:** Accepted
- **Date:** 2026-05-28
- **Work Packet:** WP-20260528-users-uuid-migration
- **Affected engines:** Cross-cutting — Identity (users table), Zone (area_suggestions FK), Notification & Distribution (notification_inbox.recipient_user_id), Analytics (analytics.events.actor_user_id), every future engine that references a user

## Context

`users.id` was created with Laravel's default `$table->id()` — auto-incrementing BIGINT. As Stage 0 and the first Stage 1 engines came online, the schema drifted in three different directions for "this column references a user":

| Table | User-FK column | Type chosen at creation |
|---|---|---|
| `users.id` | (PK) | BIGINT |
| `personal_access_tokens.tokenable_id` | morphs | unsigned BIGINT |
| `sessions.user_id` | foreignId | BIGINT |
| `analytics.events.actor_user_id` | nullable | **UUID** |
| `admin_audit_log.actor_id` | indexed | VARCHAR(64) (opaque) |
| `notification_inbox.recipient_user_id` | FK → `users(id)` | BIGINT |
| `zone.area_suggestions.submitted_by_user_id` | NOT NULL | **UUID** (no FK) |
| `zone.area_suggestions.reviewed_by_user_id` | nullable | **UUID** (no FK) |

The Zone and Analytics engines committed to UUID because:
- `engineering-standards.instructions.md` §6 mandates "Every table has `id` (UUIDv7 preferred)".
- Engine tables live in their own Postgres schema (Constitution Law 1) — and we deliberately forbid cross-schema FKs. UUIDs are the natural opaque cross-engine reference.
- The append-only analytics + audit tables benefit from time-ordered UUIDs for index locality.

But because `users.id` is still BIGINT, Zone's `area_suggestions.submitted_by_user_id` cannot foreign-key to it. The workaround that shipped in Phase 1.2 is `AreaSuggestionController::reviewerUuid()` — a deterministic UUIDv5 derived from `'user:' + user->id` via a hard-coded namespace. The UUIDv5 lives only in the Zone tables; it cannot be joined back to `users`, cannot be looked up by `users.id`, and would have to be replicated in every future engine that references a user.

Without resolving this now, every Stage 1 engine that follows (Identity full surface, Club, Player, Match, Trust) inherits the ambiguity and the UUIDv5 hack spreads.

## Decision

**`users.id` becomes a UUIDv7-ordered string PK.** All current and future user-FK columns across the platform are UUID. The `AreaSuggestionController::reviewerUuid()` workaround is removed.

Specifically:

1. **`users.id`** — changes from BIGINT autoincrement to UUID PK (Postgres `uuid` type, default `gen_random_uuid()` at the DB level; application mints time-ordered UUIDs via Laravel's `HasUuids` trait which calls `Str::orderedUuid()`). The trait emits RFC 4122 v4 with a millisecond timestamp prefix — functionally equivalent to UUIDv7 for index-locality purposes; we refer to this as **"UUIDv7-ordered"** throughout the codebase.
2. **`sessions.user_id`** — UUID (was BIGINT).
3. **`personal_access_tokens`** — uses `uuidMorphs('tokenable')` instead of `morphs('tokenable')`.
4. **`notification_inbox.recipient_user_id`** — UUID with FK to `users(id)` (Constitution Law 1 unaffected — this engine lives in the same `public` schema for now; when it moves into its own schema as part of Phase 2.5+ hardening, the FK is replaced by an event-sourced read projection per the engine-boundaries doc).
5. **`zone.area_suggestions.submitted_by_user_id` and `.reviewed_by_user_id`** — kept as UUID (no change to data type), now matched 1:1 against `users.id`. No cross-schema FK is added (Constitution Law 1). Referential integrity is guaranteed at write time by application services that load the user before persisting the suggestion.
6. **`AreaSuggestionController::reviewerUuid()`** — deleted. Controllers pass `$user->id` directly.

### Why now

- **Pre-alpha. Zero real users.** Only the seeded `SuperAdmin` row exists, and the seeder is idempotent. Migrating in this window costs one `migrate:fresh` cycle. Migrating after even a single real user signs up requires data backfill + downtime + an irreversible mapping table.
- **Engineering-standards §6** is unambiguous: UUIDv7 preferred for every table. The users table is the only "real" PK that still violates it.
- **The drift has already begun.** Analytics + Zone already chose UUID. Every additional engine that arrives without `users.id` aligned will either re-implement the UUIDv5 hack or choose BIGINT and add a second axis of inconsistency.
- **Future schema isolation is cheaper with UUID.** When Identity moves into its own `identity.users` schema (Stage 6 hardening), opaque UUIDs flow through events naturally; BIGINT would need a separate platform-wide user-id namespace.

### Why "UUIDv7-ordered" via `HasUuids` and not true RFC 9562 v7

Laravel 11 ships `HasUuids` which uses `Str::orderedUuid()` — a v4 UUID with millisecond timestamp + monotonic counter prefix from `ramsey/uuid`. It is time-ordered for index locality and identical in cardinality and uniqueness to RFC 9562 v7. Adopting strict RFC v7 would require either Laravel 12 (`Str::uuid7()`) or hand-rolling generation. The marginal benefit (a different version bit and microsecond resolution) does not justify the upgrade churn. **The codebase commits to "time-ordered UUID strings" as the platform identity primitive; the underlying generator is implementation detail.**

### Editing original migrations vs adding new ones

Engineering-standards §6 says: *"Never edit a migration that has been merged to main."* This ADR explicitly authorises a one-time exception for the migrations created in Phase 0.1, Phase 2.5 WP-1, and Phase 1.2 because:
- We are pre-alpha — no production database exists.
- A "convert" migration would leave a misleading historical artifact suggesting the platform ever ran with BIGINT user IDs in production. It never did.
- The future audit value of seeing the original migrations as UUID-shaped from day one is higher than the audit value of preserving the intermediate BIGINT state.

After this ADR lands, the §6 rule is reinstated unconditionally.

## Alternatives considered

- **A: Add nullable `uuid` column to `users`, backfill, controllers pass that.** Rejected. Two identities per user forever; every JOIN must know which column to use; the UUIDv5 hack lingers in spirit (just with a real backing column).
- **B: Migrate Zone/future engines' FK columns to BIGINT.** Rejected. Violates engineering-standards §6 directly. Conflicts with `analytics.events.actor_user_id` (already UUID). Effectively rolls back the canonical type.
- **C: Adopt UUIDv5 mapping as official strategy.** Rejected. Loses referential integrity; every controller needs the conversion; no JOIN possible from users to Zone tables; the hack would propagate to every future engine.

## Consequences

### Positive

- One identity type platform-wide. No translation layer between engines.
- Engine schemas can hold real (in-engine-schema) or virtual (cross-engine, validated at write time) references to users with no type mismatch.
- New engines (Identity full, Club, Player, Match, Trust, RP Economy) inherit the canonical type from the start.
- The UUIDv5 hack in `AreaSuggestionController` is deleted, simplifying the controller and removing a permanent footnote.
- Cross-engine event payloads naturally carry user IDs as UUID strings — already true in the canonical event envelope (`actor_id`).
- Index locality is preserved by time-ordered UUIDs (HasUuids).

### Negative

- One-time `migrate:fresh` required on all developer + CI databases. Acknowledged.
- The `users.id` JSON serialisation changes from integer to string. Any frontend code expecting `id: number` for users must be updated — but no such code exists yet (no Identity endpoints public).
- Sanctum `personal_access_tokens` now needs `uuidMorphs` — added in this WP.

### Neutral

- `admin_audit_log.actor_id` is VARCHAR(64) — accepts a UUID string natively, no migration needed.

## Implementation checklist (WP-20260528-users-uuid-migration)

- [x] ADR-0003 authored.
- [ ] Edit `database/migrations/0001_01_01_000000_create_users_table.php`: `users.id` UUID PK; `sessions.user_id` UUID.
- [ ] Edit `database/migrations/2026_05_20_222722_create_personal_access_tokens_table.php`: `uuidMorphs('tokenable')`.
- [ ] Edit `database/migrations/2026_05_25_000001_create_notification_inbox_table.php`: `recipient_user_id UUID` (both Postgres + SQLite branches).
- [ ] Update `App\Models\User`: add `HasUuids` trait, `$keyType = 'string'`, `$incrementing = false`, update `@property string $id`.
- [ ] Strip `reviewerUuid()` from `AreaSuggestionController`; pass `(string) $user->id` instead.
- [ ] Verify factories still work (HasUuids auto-mints id).
- [ ] `composer check` green (pint + phpstan L6 + deptrac + pest).
- [ ] Tick the open blocker in `docs/Architecture/Build_Plan.md` §Open architectural decision.

## References

- `docs/Architecture/Build_Plan.md` §Stage 1 — Open architectural decision.
- `.github/instructions/engineering-standards.instructions.md` §6 (UUIDv7 preferred).
- `.github/copilot-instructions.md` Constitution Law 1 (engine boundaries / no cross-schema FKs).
- `docs/engine-boundaries.md` — cross-engine reference patterns via events.
- ADR-0001 — modular monolith + event bus.
- ADR-0002 — God Mode admin portal (Filament uses Eloquent `users` directly).
