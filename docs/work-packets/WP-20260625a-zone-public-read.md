# WP-20260625a-zone-public-read

> **Work Packet** tracking sheet. Paired backend WP for `WP-20260625-onboarding-area`.

| Field                | Value                                                                                                       |
| -------------------- | --------------------------------------------------------------------------------------------------------- |
| **ID**               | `WP-20260625a-zone-public-read`                                                                            |
| **Title**            | Zone Engine — public geography reads (hubs, areas) + user-facing area suggestion; API unauthenticated-500 fix |
| **Opened / Closed**  | 2026-06-25 / 2026-06-25                                                                                    |
| **Owner**            | Sole developer / product owner                                                                             |
| **Canonical doc**    | [Zone Engine](../engines/zone/Zone_Engine_UPDATED.md) §2 (hierarchy), §5 (user flow), §11 (backend owns truth) |
| **Repo**             | `kalaanba-api`                                                                                             |
| **Status**           | 🟢 Implemented + verified live; gates green for this WP's code                                              |

---

## Pipeline Progress

- [x] Stage 1 — Intake
- [x] Stage 2 — Impact Map
- [x] Stage 3 — Rules Review
- [x] Stage 4 — Architecture Check
- [x] Stage 5 — Contract Design (contracts authored in the paired frontend WP)
- [x] Stage 6 — Implementation
- [x] Stage 7 — Security Review
- [x] Stage 8 — QA Plan + Tests
- [x] Stage 9 — Docs Update
- [x] Stage 10 — Release Packet (this doc)

---

## Stage 1–2 — Intake + Impact

The frontend area picker (WP-20260625) needs to read City Hubs and Areas and let users suggest a missing area, but only **admin** area-suggestion review endpoints existed. This WP adds the **public read surface** the Zone engine doc §5 implies ("users choose Area first… suggest if missing") and was never contracted.

Also fixes a latent API bug discovered during integration: an unauthenticated request to any `/api/*` route **without** a JSON `Accept` header 500'd with `Route [login] not defined` (the web Authenticate redirect) instead of returning `401 JSON`.

Surfaces: 3 new endpoints, 2 new throttle config keys, 1 reader method, the bootstrap exception/middleware config. No schema migration (reuses `city_hubs`, `zones`, `areas`, `area_suggestions`).

## Stage 3 — Rules Review

- Zone §2/§5 — users pick **Hub** then **Area**; Zone/Belt mapping is admin-derived and **not** exposed (areas response omits `zone_id`). ✅
- Zone §11 / Constitution Law 3 — backend owns the area→zone mapping; the API returns reference data only. ✅
- Constitution Law 1 — no cross-schema access; reads go through the Zone `GeographyReader` port. ✅
- Constitution Law 14 — the suggest write carries `Idempotency-Key` (suggestion UUID is the natural key; reuses existing `SubmitAreaSuggestion` which emits `zone.area_suggested` via the outbox). ✅

## Stage 4 — Architecture Check

- Read port `GeographyReader` (Domain) extended with `listCityHubs()` and an optional `$search` on `listAreasForCityHub()`; implemented in `EloquentGeographyReader` (Infrastructure). Layering unchanged.
- Thin HTTP controllers (`App\Http\Controllers\Zone\{GeographyController, AreaSuggestionController}`) depend on the Domain port / existing Application service — same pattern as the admin Zone controller.
- Deptrac: 0 violations.

## Stage 5 — Contracts

`contracts/api/zone/{get-hubs,get-areas,post-area-suggestions}.v1.yaml` (authored in WP-20260625, satisfied here).

## Stage 6 — Implementation

| File | Change |
| --- | --- |
| `app/Modules/Zone/Domain/GeographyReader.php` | + `listCityHubs()`, `listAreasForCityHub(string, ?string $search)` |
| `app/Modules/Zone/Infrastructure/Eloquent/EloquentGeographyReader.php` | implement both; portable `LOWER(name) LIKE` search |
| `app/Http/Controllers/Zone/GeographyController.php` | NEW — `hubs()`, `areas()` (resolves region name, dedup) |
| `app/Http/Controllers/Zone/AreaSuggestionController.php` | NEW — `store()` → `SubmitAreaSuggestion` |
| `app/Http/Requests/Zone/SuggestAreaRequest.php` | NEW — config-driven name bounds |
| `routes/api.php` | NEW public `zone` group (`throttle:zone-read` reads; `auth:sanctum`+`throttle:zone-suggest`+`idempotency` suggest) |
| `app/Providers/AppServiceProvider.php` | + `zone-read`, `zone-suggest` rate limiters |
| `database/seeders/AdminConfigSeeder.php` | + `zone.throttle.read.per_minute` (60), `zone.throttle.suggest.per_minute` (5) |
| `bootstrap/app.php` | API-only JSON exceptions: `shouldRenderJsonWhen(api/*)` + `redirectGuestsTo` returns null for `api/*` — fixes the unauthenticated 500 |
| `app/Modules/Identity/Domain/UserProfileSnapshot.php` | **Bug fix** — `$email` was typed non-nullable `string`, so `GET /users/me` 500'd for a phone-only user (email null). Made nullable per Identity §2/§8. This was the *actual* cause of the post-login "redirects to login" report: `/users/me` 500 → frontend `useUser` undefined → onboarding guard → login. Regression test added in `tests/Feature/Identity/MeTest.php`. |

## Stage 7 — Security Review

- Reads are public reference data; no PII, no account enumeration (hubs/areas reveal nothing about users). ✅
- Suggest is bearer-auth + per-user throttle + idempotent; submitter recorded; name length config-bounded. ✅
- The 500-fix returns the standard `{message:"Unauthenticated."}` 401 for API — no stack traces leak (previously the 500 rendered a debug page). Net security improvement. ✅

## Stage 8 — QA + Gates

`tests/Feature/Zone/PublicGeographyTest.php` — **9 passed (30 assertions)**: hubs+region, areas list (no `zone_id` leak), case-insensitive `q`, missing/unknown hub 422, suggest auth-required 401, suggest happy 201, unknown-hub 422, name-length 422, and the unauthenticated-API-returns-JSON-401 regression.

Gates (this WP's code): Pint clean · PHPStan 0 errors in changed files · Deptrac 0 violations · live-verified (`/zone/hubs` → Tamale; `/zone/areas` → Aboabo; `users/me` no-Accept → 401 JSON).

**Pre-existing failures NOT introduced by this WP** (separate debt, untouched files): PHPStan `larastan.noEnvCallsOutsideOfConfig` in `database/seeders/AdminAccessCodeSeeder.php` (from WP-20260624-admin-users), and 4 `Tests\Unit\…\OtpServiceTest` failures (`MockOtpProvider` calls `app()->environment()` on a partial unit-test container). Flagged for a cleanup WP.

## Stage 9–10 — Docs + Release

- Build Plan Phase 1.2 / 1.3 note added.
- Dev DB seeded with `ZoneHierarchySeeder` so the picker shows Tamale → Aboabo.
- Unblocks WP-20260625 Stage 10.
