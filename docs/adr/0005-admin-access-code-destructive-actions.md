# ADR-0005: Admin access code for destructive Users-section actions

- **Status:** Accepted
- **Date:** 2026-06-24
- **Work Packet:** WP-20260624-admin-users
- **Affected engines:** Admin Configuration & Governance (gate + audit); Identity (the user mutations being gated)

## Context

Pre-alpha tester support requires an admin Users section that can reset passwords, force-verify channels, and (later) delete accounts. These are high-impact actions. The product owner wants a lightweight, memorable confirmation step — a 6-digit **admin access code** — without weakening the existing authn/authz.

Two non-negotiables from the brief: passwords/OTPs are never displayed or stored recoverably, and every admin action is audited.

## Decision

1. **Section access stays on `super_admin` Sanctum** (already enforced on the `/admin` route group). The access code is **not** an authentication mechanism and never replaces login. (Gate choice: "confirm destructive actions only".)
2. **Destructive actions require the access code** in addition to the super-admin session. In this WP that is **set-password** and **force-verify**; delete (when built) will join them. Non-destructive support actions (resend OTP, clear lockout, enable/disable, edit phone/email) do **not** require the code.
3. **The code is stored only as a bcrypt hash** in `admin_access_codes` (label-namespaced so it can be rotated per surface). Seeded to `023050` for pre-alpha via `AdminAccessCodeSeeder` (override with `ADMIN_USERS_ACCESS_CODE`). The plaintext is never persisted, returned, or logged.
4. **The code is supplied per destructive request** (header `X-Admin-Access-Code` or body `access_code`) and verified with `Hash::check`. It is added to the audit `PayloadRedactor` token list, so it never lands in `admin_audit_log`.
5. **Auditing is automatic** via the existing `AdminAuditMiddleware`, which records actor, route, path, status, and a redacted payload for every authenticated admin mutation.

## Alternatives considered

- **Code as the sole gate** (no super-admin login). Rejected: a 6-digit code alone guarding password resets is far too weak.
- **Code on every action.** Rejected: friction on read-only support work; the brief scopes the confirmation to destructive actions.
- **TOTP / per-admin PIN.** Deferred: heavier than pre-alpha needs; revisit for alpha multi-admin.

## Consequences

- A super admin who walks away from an unlocked session still cannot reset a password without re-entering the code.
- The code is shared and rotates rarely — acceptable for a single pre-alpha operator; alpha should move to per-admin step-up auth (noted as a follow-up).
- No new auth primitive on the hot path; the gate is one `Hash::check` on destructive calls only.

## References

- `docs/engines/identity/Identity_Engine_System_Document.md` §12 (privacy — no secrets surfaced).
- `.github/instructions/engineering-standards.instructions.md` §10/§11 (no secrets in logs; explicit authz).
- `app/Support/Http/Middleware/AdminAuditMiddleware.php` + `app/Support/Audit/PayloadRedactor.php`.
