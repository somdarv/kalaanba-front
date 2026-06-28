# WP-20260624-admin-users

> **Work Packet** tracking sheet.

| Field                | Value                                                                                                |
| -------------------- | ---------------------------------------------------------------------------------------------------- |
| **ID**               | `WP-20260624-admin-users`                                                                            |
| **Title**            | Admin Portal — Users section (pre-alpha tester support, testable-slice)                              |
| **Opened**           | 2026-06-24                                                                                            |
| **Owner**            | Sole developer / product owner                                                                        |
| **Canonical docs**   | Identity §4/§12; Admin Governance (audit). ADR-0005.                                                  |
| **Repo(s)**          | `kalaanba-api` + `kalaanba-front`                                                                     |
| **Status**           | 🟢 Slice green — backend + frontend wired and tested                                                  |

## Scope decisions (product owner)

- **Testable support slice** (not the full 16-item checklist).
- **Access code gates destructive actions only** (super-admin login still gates section access). Code = `023050`, stored bcrypt-hashed, seeded into the DB.

## Built

**Backend (`kalaanba-api`)**
- Migrations: `users.disabled_at` (soft, reversible disable, distinct from `archived_at`); `admin_access_codes` table (hashed codes).
- `AdminAccessCodeSeeder` → seeds `023050` (override `ADMIN_USERS_ACCESS_CODE`); wired into `DatabaseSeeder`.
- `AdminAccessCodeVerifier` (bcrypt check, stamps `last_used_at`).
- `App\Services\Admin\AdminUserDirectory` (search/filter/sort/paginate, admin-safe projection — no secrets, masked phone) + `AdminUserActions` (set password, force-verify, edit phone/email, enable/disable, resend OTP, clear lockout).
- `Admin\UserController` + routes under `/api/v1/admin/users` (super_admin + idempotency). Destructive actions require the access code (header `X-Admin-Access-Code` or `access_code` body).
- Login gating: `disabled_at` now blocks OTP-verify + session login.
- Audit: automatic via `AdminAuditMiddleware`; added `access_code` to `PayloadRedactor`.

**Frontend (`kalaanba-front`)**
- `lib/api/admin.ts` + `hooks/use-admin.ts`: `listAdminUsers` + 8 action mutations.
- Replaced the mock `governance/users` page with a real wired list (search, status filter, pagination) + `_manage-user-dialog` (all actions; destructive ones require the access-code field).

## Security posture (per the brief's hard rules)

- Passwords: set-only (hashed on save via the `hashed` cast); never read or displayed.
- OTPs: never displayed; resend re-issues, admin supplies the number (verified vs stored hash, §12).
- Full phone never returned — masked last-4 only.
- Every mutation audited; access code + password redacted in the audit payload.

## Tests

- Backend `tests/Feature/Admin/UserManagementTest.php` (8): list-no-secrets, non-super-admin 403, set-password requires code, set-password + login, force-verify + code, disable blocks login / enable restores, resend OTP number-match, audit redaction. phpstan clean; 28 architecture tests green.
- Frontend: full suite 35 green (admin types compile + existing flow tests).

## Deferred (follow-ups, not in this slice)

- One-time login link, single-use temporary access code (new auth primitives + tables).
- Soft-delete with dependency graph (club ownership / fixtures) — needs cross-engine dependency check.
- A "locked" status surfaced in the list (OTP lockout is Redis state, not a user column).
- Per-admin step-up auth for alpha (ADR-0005 notes the shared-code limitation).
- Editing a phone doesn't separately track a phone-verified flag (none exists); re-verify via force-verify / resend.
