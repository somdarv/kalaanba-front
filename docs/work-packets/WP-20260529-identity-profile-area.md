# WP-20260529-identity-profile-area

> **Work Packet** tracking sheet. Updated as each pipeline stage clears.
> One source of truth for: scope, contracts, config keys, engines, owners, open questions, stage progress.

| Field                | Value                                                                                                                                 |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| **ID**               | `WP-20260529-identity-profile-area`                                                                                                   |
| **Title**            | Identity Engine — Profile surface, `area_id` requirement, avatar driver abstraction, `GET/PATCH /users/me`                            |
| **Opened**           | 2026-05-26                                                                                                                            |
| **Closed**           | 2026-05-29                                                                                                                            |
| **Owner**            | Sole developer / product owner                                                                                                        |
| **Canonical doc**    | [Identity Engine System Document](../engines/identity/Identity_Engine_System_Document.md) — §2 (user fields), §8 (profile surface)    |
| **Build Plan phase** | Phase 1.3 — Identity Engine (Backend WP 1 of 3)                                                                                       |
| **Repo(s)**          | `kalaanba-api` (primary), `kalaanba-front` (OAS contracts + docs only)                                                                |
| **Status**           | � **Closed — all 10 stages green**                                                                                                   |

---

## Pipeline Progress

- [x] Stage 1 — Intake (this doc)
- [x] Stage 2 — Impact Map
- [x] Stage 3 — Rules Review
- [x] Stage 4 — Architecture Check
- [x] Stage 5 — Contract Design — **accepted 2026-05-26**
- [x] Stage 6 — Implementation — Batches A / B / C complete
- [x] Stage 7 — Security Review — Pint / PHPStan L6 / Deptrac all green
- [x] Stage 8 — QA Plan + Tests — Feature **142 passed (383 assertions)**, Architecture **28 passed (87 assertions)** including 4 Identity arch tests
- [x] Stage 9 — Docs Update — engine doc + this WP
- [x] Stage 10 — Release Packet — see closing note below

---

## Closing Note (2026-05-29)

### Gates

| Gate | Result |
| ---- | ------ |
| Pint | PASS (269 files) |
| PHPStan L6 | 0 errors |
| Deptrac | 0 violations / 290 allowed / 20 uncovered |
| Pest Feature | 142 passed (383 assertions) — incl. 22 new Identity tests |
| Pest Architecture | 28 passed (87 assertions) — incl. 4 new Identity arch tests |

### Architectural decision recorded

**Adapter placement** — `EloquentUserProfileRepository` is placed under `app/Infrastructure/Identity/` with namespace `App\Infrastructure\Identity` (not `Kalaanba\Modules\Identity\Infrastructure`). Reason: `App\Models\User` is consumed by global infra (Sanctum, Filament, Laravel Auth) and cannot be re-namespaced into a module. Deptrac rule "Engine modules do not depend on `App\Models\User` directly" stays intact; the adapter sits outside the module boundary and bridges the two worlds. This is the canonical pattern for any engine that needs read/write access to the User model.

**Arch test fix** — `AvatarDriver` interface initially had `use` imports of three Infrastructure classes purely for `@see` docblock links. Pest's `arch()->not->toUse()` treats `use` statements as dependencies regardless of runtime use, so those were converted to plain prose references. Lesson: arch tests forbid even unused namespace imports across layer boundaries.

### Files created / modified (final list)

**Migrations**: `2026_05_29_000001_add_profile_fields_to_users.php`

**Domain** (`app/Modules/Identity/Domain/`): `ProfileUpdate.php`, `PublicProfile.php`, `UserProfileSnapshot.php`

**Application** (`app/Modules/Identity/Application/`): `AvatarDriver.php`, `GetPublicProfileQuery.php`, `UpdateProfileService.php`, `UploadAvatarService.php`, `UserProfileRepository.php`

**Infrastructure (module)** (`app/Modules/Identity/Infrastructure/Avatar/`): `AvatarDriverFactory.php`, `LocalAvatarDriver.php`, `CloudinaryAvatarDriver.php`

**Infrastructure (adapter)** (`app/Infrastructure/Identity/`): `EloquentUserProfileRepository.php`

**Http** (`app/Http/Controllers/Identity/`): `MeController.php`, `AvatarController.php`, `PublicUserController.php` + FormRequests + Resources (`PublicUserResource.php`, `MeResource.php`)

**Provider**: `app/Modules/Identity/IdentityServiceProvider.php`

**Routes**: `routes/api.php` (4 new endpoints under `/api/v1/users/...`)

**Tests**: `tests/Feature/Identity/MeTest.php`, `tests/Feature/Identity/AvatarUploadTest.php`, `tests/Feature/Identity/PublicUserTest.php`, `tests/Architecture/ArchitectureTest.php` (appended Identity block)

**Config**: `config/users.php`, `database/seeders/AdminConfigSeeder.php` (7 new Identity rows)

**Contracts**: `contracts/api/identity/users-me-get.yaml`, `users-me-patch.yaml`, `users-me-avatar-upload.yaml`, `users-show.yaml`

---

## Stage 1 — Intake

### Problem

The `users` table currently has the minimum viable shape for the seeded Super Admin and basic OTP login: `id`, `name`, `email`, `password`, `phone_e164_hash`, `phone_e164_last4`, `role`, `archived_at`, `last_seen_at`. There is no place to:

1. Store the user's **area** (suburb/quarter inside a Kalaanba City Hub) — a hard requirement of the Identity engine doc §2 and a prerequisite for the Zone Engine's hub-rollup work.
2. Store an **avatar URL** — needed by every list/detail/feed UI surface in V1.
3. Edit any of the above from a public API — there is no `/users/me` endpoint yet.

The avatar story has a wrinkle: we have a local-disk environment (dev/test/CI) and a Cloudinary-backed production environment (alpha+). Hard-coding either is wrong; the choice must be a config-keyed driver per Constitution Law 2 (configurability over constants).

### Goal

After this WP closes:

- `users.area_id` exists (UUID, **opaque reference** to `zone.areas.id`, no FK per Constitution Law 1), nullable for now since existing rows have no area.
- `users.avatar_url` exists (string, nullable).
3. An **avatar driver abstraction** lets the same upload endpoint persist to local disk (dev) or **Cloudinary** (alpha+) based on the `users.avatar.driver` config key. Switching environments requires zero code change.
- `GET /api/v1/users/me` returns the authenticated user's full profile shape.
- `PATCH /api/v1/users/me` updates `name`, `area_id`, `avatar_url` (and nothing else).
- `POST /api/v1/users/me/avatar` accepts a multipart upload and returns the new `avatar_url`.
- `GET /api/v1/users/{id}` returns the public-safe projection: `id`, `name`, `area_name` (resolved from Zone), `avatar_url`, public role badges. **No** phone fields, **no** email, **no** archive flags.

### Non-goals

- **No registration changes.** Phone OTP signup and email+password signup are owned by WP-20260530.
- **No channel-binding endpoints.** Owned by WP-20260530.
- **No role management.** Owned by WP-20260531.
- **No `users.area_id` FK to `zone.areas.id`** — Constitution Law 1 forbids cross-engine FKs. `area_id` is validated by a service call to the Zone Engine's existence check at write time.
- **No backfill of `area_id` for the seeded Super Admin** — `area_id` is nullable; admin accounts may legitimately have no area. Real users will set it at registration (WP-20260530).
- **No avatar moderation / virus scan.** Moderation Engine handles that out-of-band.

### Affected engines

- **Identity** (primary) — schema change, profile endpoints, avatar driver.
- **Zone** (consumer) — Identity calls a Zone Engine read-only existence check (`Zone\Application\AreaExistsQuery`) when validating `area_id`. No data flows the other way.
- **Admin Configuration** (consumer) — 4 new config keys registered.

### Configuration keys touched

| Key                              | Type   | Default                                          | Purpose                                                       |
| -------------------------------- | ------ | ------------------------------------------------ | ------------------------------------------------------------- |
| `users.profile.name_min`         | int    | `2`                                              | Minimum display name length.                                  |
| `users.profile.name_max`         | int    | `60`                                             | Maximum display name length.                                  |
| `users.avatar.driver`            | string | `local`                                          | Avatar media driver: `local` or `cloudinary`.                 |
| `users.avatar.max_bytes`         | int    | `2097152` (2 MiB)                                | Maximum upload size for avatar.                               |
| `users.avatar.allowed_mime`      | string[] | `["image/jpeg","image/png","image/webp"]`      | Accepted MIME types.                                          |
| `users.avatar.cloudinary.folder` | string | `kalaanba-{env}/avatars`                         | Cloudinary folder prefix; namespaces by env.                  |
| `users.avatar.cloudinary.upload_preset` | string | `kalaanba_avatars`                       | Unsigned preset for future direct browser uploads.            |
| `identity.public_profile.throttle.anonymous_per_minute` | int | `60`                       | Per-IP rate limit on anonymous `GET /users/{id}`.             |

Existing keys re-used: none.

### Contracts touched

- New OAS file: `contracts/api/identity/users-me-get.yaml`
- New OAS file: `contracts/api/identity/users-me-patch.yaml`
- New OAS file: `contracts/api/identity/users-me-avatar-upload.yaml`
- New OAS file: `contracts/api/identity/users-show.yaml`
- The `contracts/api/identity/` directory does not exist yet — this WP creates it.

### Open questions

None blocking. (Open questions on the Identity engine roadmap — social login, multi-phone — are tracked in §15 of the engine doc and out of scope here.)

---

## Stage 2 — Impact Map

| Surface                    | Impact                                                                                                                                                                  |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Database**               | Add nullable `area_id UUID` and `avatar_url TEXT` to `users`. Add index on `area_id`.                                                                                   |
| **API**                    | 4 new endpoints under `/api/v1/users/{me,…/me/avatar,{id}}`.                                                                                                            |
| **Codegen (front)**        | `npm run codegen:api` regenerates TypeScript client from the 4 new OAS files. No frontend implementation in this WP — that's WP-20260601.                              |
| **Admin Configuration**    | 5 new config keys registered with seed values.                                                                                                                          |
| **Filament**               | `UserResource` gets read-only display of `area_id` and `avatar_url` on the detail page. No edit forms in this WP (Filament edit is admin-side — separate concern).      |
| **Outbox / events**        | None. No engine-significant state transitions in this WP. (Profile edits do NOT emit an event in V1 — the Identity doc §11 reserves events for register/claim/role/archive only.) |
| **Notification**           | None.                                                                                                                                                                   |
| **RP / Trust / Match**     | None.                                                                                                                                                                   |
| **Tests**                  | Feature: profile read, profile patch (name/area/avatar), avatar upload (local driver in CI), public projection strips PII, invalid area rejected, oversize upload rejected, role cannot be patched, phone cannot be patched, archived user 404s on public show. Architecture: avatar driver contract has both `LocalAvatarDriver` and `CloudinaryAvatarDriver` implementations. |

### Risk surface

- **Zone Engine coupling** — Identity now needs to call into Zone (`AreaExistsQuery`) at write time. This is the first cross-engine read in the codebase. The pattern (Application-layer query class consumed via container binding, no DB-level FK) sets precedent for every future cross-engine read.
- **Avatar driver Cloudinary wiring** — Cloudinary driver requires `CLOUDINARY_URL` env (`cloudinary://<key>:<secret>@<cloud>`). In CI/dev this is absent — the driver must throw a clear, configuration-aware error if `users.avatar.driver=cloudinary` is set without env. Default `local` keeps the path safe. Credentials are **env-only** — never in admin config (engineering-standards §10).

---

## Stage 3 — Rules Review

### Identity Engine

- §2 (User Definition) — `area_id` and `avatar_url` are explicitly listed as required (`area_id`) / optional (`avatar_url`) profile fields. ✅
- §8 (Profile Surface) — endpoint list matches this WP exactly. ✅
- §10 (Configurability) — `users.avatar.driver` and `users.profile.name_min/max` already enumerated in the engine doc. ✅
- §12 (Privacy Contract) — public projection of `GET /users/{id}` strips phone/email/archive fields. Enforced via dedicated API resource. ✅
- §11 (Events) — profile edits emit **no** event in V1. This WP does not add one. ✅

### Constitution

- **Law 1 (engine boundaries)** — `users.area_id` is an opaque UUID, **no FK** to `zone.areas`. Existence is validated through a `Zone\Application\AreaExistsQuery` consumer-side query. ✅
- **Law 2 (configurability)** — every threshold (name length, file size, MIME list, driver) is config-keyed. No magic numbers. ✅
- **Law 3 (backend owns truth)** — frontend never computes the avatar URL; it stores whatever the backend returns from the upload endpoint. ✅
- **Law 10 (public vs private)** — public `GET /users/{id}` strips `phone_*`, `email`, `email_verified_at`, `archived_at`, `last_seen_at`. ✅
- **Law 13 (archive don't delete)** — archived users return 404 on public show; the row stays. ✅
- **Law 14 (idempotency)** — `PATCH /users/me` and `POST /users/me/avatar` accept `Idempotency-Key` header via existing middleware. ✅

### Engineering Standards

- §3 (file size) — each new file targets < 200 LOC. No single file balloons.
- §4 (naming) — controllers in `Http/Controllers/Identity/`, services in `app/Modules/Identity/Application/`, drivers in `app/Modules/Identity/Infrastructure/Avatar/`.
- §6 (UUIDv7) — `area_id` is UUID; no autoincrements introduced. ✅
- §7 (DB indexing) — index on `users.area_id` for "list users by area" admin queries.
- §11 (API versioning) — all new endpoints under `/api/v1/`. ✅

---

## Stage 4 — Architecture Check

### Module layout (new)

```
kalaanba-api/app/Modules/Identity/
├── Application/
│   ├── UpdateProfileService.php          # PATCH /users/me orchestrator
│   ├── UploadAvatarService.php           # POST /users/me/avatar orchestrator
│   └── GetPublicProfileQuery.php         # GET /users/{id} read model
├── Domain/
│   ├── ProfileUpdate.php                 # DTO: name?, area_id?, avatar_url?
│   └── AvatarDriver.php                  # interface: store(UploadedFile, userId): string
├── Infrastructure/
│   └── Avatar/
│       ├── LocalAvatarDriver.php         # writes to storage/app/public/avatars
│       ├── CloudinaryAvatarDriver.php    # uploads via cloudinary/cloudinary_php SDK
│       └── AvatarDriverFactory.php       # reads config and returns the driver
└── IdentityServiceProvider.php           # binds AvatarDriver via factory
```

### Cross-engine call (Identity → Zone)

`UpdateProfileService` depends on `Zone\Application\AreaExistsQuery` via constructor injection. The query is a read-only `__invoke(string $areaId): bool` against `zone.areas`. No FKs. No event bus. Synchronous read. This is the **first** cross-engine call in the codebase; the pattern is documented here as the canonical approach for read-only existence checks.

Deptrac rule (added in Stage 6): `Identity` may `read` from `Zone\Application` namespace only — no other Zone access.

### Avatar driver contract

```php
interface AvatarDriver {
    /** @return string Resolvable URL to store in users.avatar_url. */
    public function store(UploadedFile $file, string $userId): string;
}
```

`AvatarDriverFactory::make(): AvatarDriver` switches on `config('users.avatar.driver')`. Throws `ConfigurationException` if the configured driver string is unknown or if Cloudinary is selected but `CLOUDINARY_URL` env is missing.

### Filament

`UserResource::infolist()` gets two read-only entries: `area_id` (UUID shown as monospace + linked-area-name lookup) and `avatar_url` (image preview). No new resource files.

### Migration

Single migration: `2026_05_29_000001_add_profile_fields_to_users.php`. Adds `area_id` (UUID nullable) + index, `avatar_url` (text nullable). Reversible.

---

## Stage 5 — Contract Design

### `GET /api/v1/users/me`

Auth: required (Sanctum). Returns the full owned profile shape:

```json
{
  "id": "01HXY...",
  "name": "Kwame Mensah",
  "phone_present": true,
  "phone_last4": "3456",
  "email": "kwame@example.com",
  "email_verified_at": "2026-05-26T10:00:00Z",
  "area_id": "01HXX...",
  "area_name": "Madina",
  "avatar_url": "https://r2.kalaanba.com/avatars/01HXY...jpg",
  "role": "user",
  "role_label": "User",
  "claimed_at": "2026-05-26T09:55:00Z",
  "last_seen_at": "2026-05-26T15:22:00Z"
}
```

`phone_present` is a boolean (never the hash, never the full number). `phone_last4` only when phone is bound. `area_name` resolved via Zone read at response time.

### `PATCH /api/v1/users/me`

Auth: required. Body (all optional):

```json
{
  "name": "Kwame M.",
  "area_id": "01HXX...",
  "avatar_url": "https://r2.kalaanba.com/avatars/01HXY...jpg"
}
```

Validates name length against config, validates `area_id` against Zone, validates `avatar_url` is a URL the platform issued (or null). Returns 200 with the same shape as `GET /users/me`. 422 on validation error. Cannot patch `role`, `phone_*`, `email`, archive flags — those keys in the body are silently dropped at the FormRequest layer.

### `POST /api/v1/users/me/avatar`

Auth: required. Multipart upload: `file=<binary>`. Server validates MIME + size against config. Returns:

```json
{ "avatar_url": "https://r2.kalaanba.com/avatars/01HXY...jpg" }
```

Caller then PATCHes `avatar_url` on `/users/me` to persist. (Two-step keeps upload idempotent and PATCH simple.)

### `GET /api/v1/users/{id}`

Auth: optional (rate-limited harder when anonymous). Returns the public projection:

```json
{
  "id": "01HXY...",
  "name": "Kwame Mensah",
  "area_name": "Madina",
  "avatar_url": "https://r2.kalaanba.com/avatars/01HXY...jpg",
  "badges": []
}
```

`badges` is an array of role-derived badges: `[]` for `user`, `["referee"]` for `referee`, `["facility_manager"]` for `facility_manager`, `["admin"]` for the three admin tiers. 404 if user is archived or does not exist.

### Error envelope

All errors follow the existing platform shape (`{ error: { code, message } }`). New error codes:
- `identity.profile.area_unknown` — area_id did not resolve in Zone.
- `identity.profile.name_invalid` — name length outside config bounds.
- `identity.avatar.too_large` — exceeds `users.avatar.max_bytes`.
- `identity.avatar.mime_disallowed` — MIME not in `users.avatar.allowed_mime`.
- `identity.avatar.driver_misconfigured` — driver=cloudinary but `CLOUDINARY_URL` env missing.

---

## Stage 6 — Implementation

_To begin after Stage 5 review._

### Files to add / change (planned)

| File                                                                                                                  | Action |
| --------------------------------------------------------------------------------------------------------------------- | ------ |
| `kalaanba-api/database/migrations/2026_05_29_000001_add_profile_fields_to_users.php`                                  | NEW    |
| `kalaanba-api/app/Models/User.php`                                                                                    | EDIT — add `area_id`, `avatar_url` to fillable + casts + property docs |
| `kalaanba-api/app/Modules/Identity/Domain/ProfileUpdate.php`                                                          | NEW    |
| `kalaanba-api/app/Modules/Identity/Domain/AvatarDriver.php`                                                           | NEW    |
| `kalaanba-api/app/Modules/Identity/Application/UpdateProfileService.php`                                              | NEW    |
| `kalaanba-api/app/Modules/Identity/Application/UploadAvatarService.php`                                               | NEW    |
| `kalaanba-api/app/Modules/Identity/Application/GetPublicProfileQuery.php`                                             | NEW    |
| `kalaanba-api/app/Modules/Identity/Infrastructure/Avatar/LocalAvatarDriver.php`                                       | NEW    |
| `kalaanba-api/app/Modules/Identity/Infrastructure/Avatar/CloudinaryAvatarDriver.php`                                  | NEW — wraps `cloudinary/cloudinary_php` SDK |
| `kalaanba-api/app/Modules/Identity/Infrastructure/Avatar/AvatarDriverFactory.php`                                     | NEW    |
| `kalaanba-api/app/Modules/Identity/IdentityServiceProvider.php`                                                       | NEW    |
| `kalaanba-api/app/Modules/Zone/Application/AreaExistsQuery.php`                                                       | NEW (added to Zone, consumed by Identity) |
| `kalaanba-api/app/Http/Controllers/Identity/MeController.php`                                                         | NEW — `show` + `update`                  |
| `kalaanba-api/app/Http/Controllers/Identity/AvatarController.php`                                                     | NEW — `store`                            |
| `kalaanba-api/app/Http/Controllers/Identity/UserShowController.php`                                                   | NEW — public projection                  |
| `kalaanba-api/app/Http/Requests/Identity/UpdateProfileRequest.php`                                                    | NEW                                      |
| `kalaanba-api/app/Http/Requests/Identity/UploadAvatarRequest.php`                                                     | NEW                                      |
| `kalaanba-api/app/Http/Resources/Identity/MeResource.php`                                                             | NEW                                      |
| `kalaanba-api/app/Http/Resources/Identity/PublicUserResource.php`                                                     | NEW                                      |
| `kalaanba-api/routes/api.php`                                                                                         | EDIT — add 4 routes under `v1` group     |
| `kalaanba-api/config/users.php`                                                                                       | NEW (or extend existing if present)      |
| `kalaanba-api/database/seeders/AdminConfigSeeder.php` (or equivalent)                                                 | EDIT — seed the 5 new config keys        |
| `kalaanba-api/deptrac.yaml`                                                                                           | EDIT — allow `Identity` to read `Zone\Application` only |
| `kalaanba-api/app/Filament/Resources/UserResource.php`                                                                | EDIT — add infolist entries              |
| `kalaanba-api/tests/Feature/Identity/MeTest.php`                                                                      | NEW                                      |
| `kalaanba-api/tests/Feature/Identity/AvatarUploadTest.php`                                                            | NEW                                      |
| `kalaanba-api/tests/Feature/Identity/PublicUserTest.php`                                                              | NEW                                      |
| `kalaanba-api/tests/Architecture/IdentityModuleArchitectureTest.php`                                                  | NEW                                      |
| `kalaanba-front/contracts/api/identity/users-me-get.yaml`                                                             | NEW                                      |
| `kalaanba-front/contracts/api/identity/users-me-patch.yaml`                                                           | NEW                                      |
| `kalaanba-front/contracts/api/identity/users-me-avatar-upload.yaml`                                                   | NEW                                      |
| `kalaanba-front/contracts/api/identity/users-show.yaml`                                                               | NEW                                      |

**Estimated diff size**: ~25 new files, ~6 edits. All small.

---

## Stage 7 — Security Review

_To complete after Stage 6._

Planned check list:
- Avatar upload — MIME re-validated server-side after content-sniff (not just `Content-Type` header).
- Avatar storage — files stored under content-addressed path (hash of bytes) to defeat duplicate uploads and prevent enumeration.
- Public projection — automated test asserts no `phone_*`, `email`, `archived_at`, `last_seen_at` keys appear in `GET /users/{id}` response.
- PATCH boundary — automated test attempts to patch `role`, `phone_e164_hash`, `email`, `archived_at` and asserts they are rejected/ignored.
- Rate limiting — `POST /users/me/avatar` carries an idempotency + per-user rate limit (default: 10/min, config-keyed `users.avatar.throttle.per_minute=10`).

---

## Stage 8 — QA Plan + Tests

_To complete after Stage 6._

Planned suites:
- `tests/Feature/Identity/MeTest.php` — read own profile; patch name within bounds; patch name outside bounds 422; patch area success; patch area unknown 422; patch ignores role/phone/email/archive; unauthenticated 401.
- `tests/Feature/Identity/AvatarUploadTest.php` — successful local-driver upload; oversize 422; disallowed MIME 422; Cloudinary driver misconfigured throws ConfigurationException at boot.
- `tests/Feature/Identity/PublicUserTest.php` — public read strips PII; archived user returns 404; badges array matches role.
- `tests/Architecture/IdentityModuleArchitectureTest.php` — Identity Application layer depends only on Identity Domain + Zone\Application; Identity Infrastructure does not leak into Http controllers; both avatar drivers implement the `AvatarDriver` contract.

Gates: `pint --test` clean, `phpstan` 0 errors at Larastan L6, `deptrac` 0 violations, `pest` all green (existing 144 + new ~20).

---

## Stage 9 — Docs Update

_To complete at PR time._

- `docs/engines/identity/Identity_Engine_System_Document.md` — already covers everything in this WP. No edits expected unless something shifts during implementation.
- `docs/Architecture/Build_Plan.md` — tick Phase 1.3 backend WP 1 of 3 box.
- `docs/JOURNAL.md` — Sankofa entry summarising any pattern decisions made during implementation (e.g. cross-engine read pattern as canonical).

---

## Stage 10 — Release Packet

_To complete at PR time._

Standard checklist: pipeline all green, ADR-not-required (no architectural decision novel to this WP), no new event types (so Analytics/Notification consumers untouched), no config rollout coordination needed (config keys are seeded in the same PR).
