# ADR-0002: Filament v3 as the God Mode developer admin portal

- **Status:** Accepted
- **Date:** 2026-05-25
- **Work Packet:** WP-20260525-godmode-admin-foundation (to be opened)
- **Affected engines:** Cross-cutting (Admin Governance + every engine that exposes a Filament resource)

## Context

Kalaanba is in pre-alpha. There is one developer (also product owner). Every Stage 1 engine (Season, Geography, Identity, Club, Player) will be exercised manually before any real users exist, which means heavy hands-on database manipulation: creating mock clubs, claiming ghost players, fast-forwarding seasons, reverting RP movements, impersonating users, replaying events, etc.

The developer is **not fluent in SQL** and prefers UI over `psql`. Doing all of this through ad-hoc artisan commands and Tinker sessions is slow and error-prone. We need a "God Mode" panel that exposes every Eloquent table with full CRUD, plus a few engine-specific power-tools (event replayer, action reverser, data injector, impersonation), gated by the `SuperAdmin` role.

We also have two **separate admin audiences** that the architecture must keep distinct:

1. **Developer God Mode** — one user (the sole developer). Internal. Wide-open access to every table and every action. Lifespan: pre-alpha → beta. Ugly-but-modern is acceptable; brand fit is not required.
2. **Public-facing Admin Portal** — many users (Hub Admins, Club Admins, Comp Organisers, Referees, Kalaanba ops staff). Scoped, role-gated, branded with the Kalaanba design language. Lifespan: GA onwards. Lives under the Admin Governance engine.

Conflating these two leads to either an over-engineered God Mode (3+ months of custom Next.js admin work for a 1-user internal tool) or an under-polished public admin (Filament-themed UI shown to real users).

## Decision

Build the **God Mode developer admin portal** with **[Filament v3](https://filamentphp.com)**, mounted at `/admin` on the existing `kalaanba-api` Laravel app, gated by `RequireSuperAdminMiddleware` (already built in Phase 0.6 WP-C).

Public-facing admin remains a future Next.js application built with the Kalaanba design system as part of the Admin Configuration & Governance engine (Stage 6+); it is **out of scope** of this ADR.

### Why Filament

- **Auto-CRUD over Eloquent.** A new resource file is ~50 lines and yields a full list / create / edit / delete UI with filters, search, bulk actions, relation managers.
- **Modern, professional default UI.** Tailwind + AlpineJS + Livewire, dark mode, keyboard shortcuts, command palette. Comparable in feel to Linear / Stripe / Cal.com admin tiers.
- **Native Laravel.** Same auth (Sanctum), same policies, same models, same DB, same Redis. No new auth provider, no separate deploy, no new language.
- **MIT-licensed, free.** No vendor lock, no subscription, no per-user pricing.
- **De-facto Laravel standard.** Spatie, Laravel News, the Laravel ecosystem at large use Filament for admin tooling — community + documentation are mature.
- **Forward-compatible with the modular monolith.** Filament auto-discovers resources from configured directories. Each engine module owns its own `app/Modules/<Engine>/Filament/Resources/` namespace; the portal grows as engines ship.

### Constraints accepted

- **Filament's UI tokens will not match the Kalaanba design language exactly.** Light theming (brand colour, logo, Inter font, slight palette tweaks) is permitted; deep visual rewrite is forbidden. The God Mode portal is a developer tool, not a brand surface.
- **Security posture is dev-grade during pre-alpha → alpha.** `SuperAdmin` role middleware is the only lock. 2FA, hardware-key enforcement, IP allowlist, signed URLs, replay protection — deferred to a Phase 9 pre-launch hardening WP. The developer accepts that compromise of the sole `SuperAdmin` account is a total platform compromise; this is acknowledged and time-boxed to pre-alpha + alpha only.
- **Every action in the panel must still flow through the existing `AdminAuditMiddleware`** (WP-C). The audit log is the immutable record of what the God Mode user did and is non-negotiable.
- **No domain logic lives in Filament resource files.** Resources call into existing module Application services / commands. Filament is a thin UI binding on top of the Domain layer; it does not become a parallel logic path.

## Alternatives considered

- **Laravel Nova** (commercial, $99/dev/year). Rejected. Filament is functionally equivalent, free, and has better community momentum in 2025+.
- **Backpack for Laravel** (commercial, freemium). Rejected. Filament has a cleaner DX and modern UI; Backpack feels closer to a 2018 admin aesthetic.
- **Custom Next.js admin using the Kalaanba design system.** Rejected for the God Mode panel. Estimated 4–6 weeks of work to rebuild what Filament gives for free, all for a 1-user internal tool. The Next.js custom admin is the right answer **only** for the future public-facing portal where real users see it.
- **Direct psql / Tinker.** Rejected. The developer is not SQL-fluent; ad-hoc scripts cost more time than the panel will, and they bypass `AdminAuditMiddleware`.

## Consequences

### Positive

- Developer productivity for Stage 1 onwards dramatically improves — no more Tinker sessions to mock-create a club, no more SQL to reverse a ledger entry.
- Every engine WP from Phase 1 onwards picks up a small "ship a Filament resource" deliverable as part of its definition-of-done. The God Mode portal grows by construction, not by retrofit.
- Existing infrastructure is reused — same Sanctum, same `AdminAuditMiddleware`, same `RequireSuperAdminMiddleware`, same Redis, same Postgres.
- The two-admin mental model (God Mode vs Public Admin) is captured explicitly, preventing the common drift where a dev panel slowly morphs into a half-broken public portal.

### Negative

- An additional ~30 MB of PHP dependencies (`filament/filament` + Livewire + Alpine, all already common in modern Laravel apps).
- Filament's UI does not match the Kalaanba design language; non-developers seeing the panel may be confused. Mitigated by the panel being SuperAdmin-only and not exposed in any product navigation.
- A future migration off Filament (e.g. to a custom Next.js God Mode) would require rewriting each engine's resource files. Estimated cost low because resource files are thin (~50–150 lines each, no domain logic).
- Filament uses Livewire + Alpine on the admin route; the rest of the public app stays Next.js. One mental-model context-switch for the developer when working in the panel.

### Follow-up

- **WP-20260525-godmode-admin-foundation** opens immediately after this ADR. Scope: install Filament, brand theming pass (Kalaanba palette + logo + Inter font), `RequireSuperAdminMiddleware` on `/admin`, resources for `User`, `OutboxEvent`, `AdminAuditLog`, `AdminConfig`, `AnalyticsEvent` (read-only).
- Phase 0.8 — Observability is downgraded to "Lite" (Sentry both repos + Horizon + JSON logs + UptimeRobot). Deferred items (Prometheus, Loki, Tempo, Telescope) move to a new Phase 9 — Pre-launch hardening section in `Build_Plan.md`.
- From Phase 1.1 onwards, every engine WP must list `app/Modules/<Engine>/Filament/Resources/*` deliverables in its definition-of-done.
- Pre-launch hardening WP (Phase 9): enforce 2FA on `SuperAdmin`, optionally relocate `/admin` behind IP allowlist + signed cookie, audit every Filament resource for accidental write paths.
