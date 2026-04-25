# Kalaanba — Product Brief

> **Single source of truth for anyone (human or AI agent) working on this codebase.**
> Read this file in full before writing any code. If something here is wrong, update this file in the same PR as your code changes — do not let the doc drift from reality.

*Version 1.0 · April 2026*

---

## 0. TL;DR

**Kalaanba** is a mobile-first web platform that lets grassroots football organisers in Ghana run their leagues, tournaments, and informal games end-to-end — and gives every player a verified, lasting record of their career. It replaces the WhatsApp groups, Excel sheets, paper fixtures, and notebooks that grassroots football currently runs on.

- **Tagline:** *Kalaanba — your game, on the record.*
- **Launch market:** Tamale, Ghana
- **Launch sport:** Soccer
- **Build phase:** Frontend-first with mock data. Backend follows once the UI is mature.
- **Project name (founder narrative):** Seeds of Play
- **Company / legal entity:** SaharaBase
- **Product name (what users say):** Kalaanba

---

## 1. What "Kalaanba" Means

In Tamale, *kalaanba* is the word for the informal football teams everyone has played for — the hood crews, the friend groups, the Sunday-afternoon sides. It is the football that already happens, every day, in dust and arguments and goal celebrations, and currently has no record of itself.

The product takes its name from this because the product *is* this — modernised, recorded, given a home. Not a new culture imposed; an existing culture finally given infrastructure.

This origin story is core marketing. Lead with it. Never bury it.

---

## 2. The Thesis

1. **Organising tools acquire users. Player data is the long-term product.** League management is the wedge. The verified player career database is what makes the platform commercially irreplaceable in 5 years.
2. **Informal clubs are the easiest acquisition segment.** They are already organising badly. Zero-friction entry. Upgrade path to formal preserves all data.
3. **The competitive moat is cultural specificity.** Mobile-first, cedi-priced, WhatsApp-native, Ghana-first. The name itself is part of the moat.
4. **WhatsApp is infrastructure, not a competitor.** The platform posts into existing WhatsApp groups. Communities never have to move channels.
5. **Verified data only.** Manual entry without verification poisons the database. Integrity is the long-term moat.

---

## 3. Build Philosophy

### 3.1 Frontend-first, mock data, swap to backend later

We build the entire frontend against a typed mock data layer before writing any backend. This:
- Forces the API contract to be defined by what the UI actually needs
- Lets us ship a clickable demo within weeks, not months
- De-risks design by surfacing UX mistakes before the backend locks them in

### 3.2 The mock layer rules

- All data access goes through `packages/api-client/`
- Component code never reads mock data directly
- Each api-client function is typed and async, returning the same shape the eventual backend will return
- Mock data lives in `packages/mock-data/` as a single seed (the "Tamale Premier League" demo dataset)
- Mutations persist to `localStorage` for the user's session, hydrate on load
- TanStack Query wraps everything for caching and invalidation
- When the backend exists, we replace the implementation inside `api-client/` functions. Components do not change.

### 3.3 Types are defined once, in shared

`packages/shared/types/` defines every entity (`Fixture`, `Player`, `Competition`, etc.). Frontend consumes them today; backend will produce them tomorrow. Single source of truth from day one.

### 3.4 Build order

1. **Demo landing page** — full vision, all features shown, marketing surface
2. **Public tournament page** — `/[slug]` — the highest-leverage product surface
3. **Organiser dashboard + flows** — club creation, competition creation, fixture entry
4. **Player profile pages** — including basic player card
5. **Backend** — only when the frontend is mature and stable

---

## 4. Tech Stack

### Frontend
- **Framework:** Next.js 15 (App Router, React Server Components where appropriate)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS
- **Component primitives:** shadcn/ui (Radix under the hood)
- **Data fetching / state:** TanStack Query (React Query) wrapping the api-client
- **Validation:** Zod (schemas mirror what the backend will enforce)
- **Forms:** React Hook Form + Zod resolver
- **Icons:** Lucide
- **Maps:** MapLibre GL (free, OpenStreetMap-backed) for venue pin-drop and zone display
- **Persistence (mock phase):** TanStack Query + custom localStorage adapter

### Backend (deferred — documented for forward compatibility)
- **Decision pending:** Full-stack TypeScript (Next.js Server Actions + Node worker on BullMQ + Postgres + Prisma/Drizzle) **vs** Laravel + Postgres
- The choice depends on the second builder's actual stack strength
- Until decided, the api-client is written so either choice works

### Database (when backend ships)
- **Postgres** (Supabase or Neon for managed)
- **Extensions:** `uuid-ossp`, `pg_trgm` (fuzzy name search), `postgis` (venue geolocation)

### Infrastructure
- **Frontend hosting:** Vercel (during dev and early launch)
- **Backend hosting (when it exists):** Fly.io preferred (multi-region, can place a node near Ghana)
- **Repo:** monorepo, pnpm workspaces, Turborepo for task orchestration
- **CI:** GitHub Actions

---

## 5. Architecture

### 5.1 Repo shape (monorepo)

```
seeds-of-play/
├── apps/
│   ├── web/                    # Next.js app (frontend + eventual API routes)
│   └── worker/                 # Node worker for background jobs (when backend ships)
├── packages/
│   ├── api-client/             # Typed data access layer. Mock today, real tomorrow.
│   ├── mock-data/              # Seed dataset for demo + dev
│   ├── shared/                 # Types, enums, constants, validation schemas
│   ├── ui/                     # Shared UI components (shadcn-based)
│   └── config/                 # Shared tsconfig, eslint, tailwind preset
├── docs/                       # Architecture, decisions, design notes
└── PRODUCT.md                  # This file
```

### 5.2 Backend will be a modular monolith

When the backend exists, it lives as one deployable unit with strict internal module boundaries:

```
modules/
├── identity/         # auth, users, OTP
├── clubs/            # clubs, memberships, teams
├── competitions/     # competitions, rules, fixtures, standings
├── players/          # players, ghost flow, affiliations, transfers
├── facilities/       # venues, surfaces, bookings, availability
├── notifications/    # WhatsApp, SMS, in-app
└── payments/         # Mobile Money, transactions, commissions
```

Modules talk through defined interfaces, not by reaching into each other's tables. This lets us extract any module into its own service later without rewriting it.

### 5.3 Deployment topology

- One frontend deployment (Vercel)
- One backend deployment (when it exists)
- One Postgres (with daily backups + point-in-time recovery)
- One worker process alongside the backend (same codebase, different entry point)
- Two CI pipelines (frontend, backend)

---

## 6. Brand & Design Direction

### 6.1 Naming hierarchy

- **Project name:** Seeds of Play (founder/strategy narrative)
- **Legal entity:** SaharaBase
- **Product name:** Kalaanba
- **Tagline:** *Kalaanba — your game, on the record.*

### 6.2 Visual direction (initial — revisable)

- **Mood:** Modern minimal frame with warm cultural accents. Clean like Linear, but with personality and color that feels Ghanaian — not kitsch, not safari-stock-photo, just genuinely warm.
- **Color palette (initial):** to be defined when we build the landing page. Direction: deep green (the pitch), warm earth/clay accents (Tamale soil, the dust we play in), high-contrast text. Avoid the generic "African" palette of orange/yellow/green flag colors.
- **Light/dark:** Light mode at launch. Dark mode in v1.1.
- **Typography:** Modern sans for body (Inter or Geist). Characterful display font for headings — gives personality without sacrificing legibility on cheap Android.
- **Iconography:** Lucide.

### 6.3 Voice

- **Direct.** No marketing fluff. Football people see through it.
- **Local without being parochial.** Use words people in Tamale say. Don't translate them.
- **Dignified.** Grassroots football is not "amateur." It's the real game. Every line should reflect that.
- **Brief.** A line that fits on a phone screen is a line that gets read.

---

## 7. Users & Entry Points

| User type | Entry point | Lands in |
|---|---|---|
| Informal club creator | Create a club (informal) | Club dashboard |
| Formal club admin | Create a club (formal) | Club dashboard |
| Competition organiser | Create a competition | Competition dashboard |
| Facility manager | Manage a facility | Facility dashboard *(deferred — not in MVP)* |
| Team manager | Registration link | Registration flow |
| Referee | Referee portal | Referee dashboard *(deferred)* |
| Free agent player | Create a player profile | Player profile |
| Ghost player | SMS link | Claim profile flow |
| Fan / follower | Public tournament page | No login required |

The fan is the only user who never registers. Everything they see is generated by the other users.

---

## 8. The MVP — What's In, What's Out

### ✅ IN — MVP

**Identity & onboarding**
- Phone + OTP auth (Twilio or Africa's Talking)
- Demo mode: pre-seeded "Tamale Premier League" sandbox

**Clubs (informal only at MVP)**
- Create club, invite members by phone, basic profile
- Activity area on map (configurable zones — not hardcoded NEWS)
- Members list with roles

**Competitions (one format only)**
- **League only.** Single round-robin.
- Manual rules: points, top-3 tiebreakers, match duration, squad size cap
- Manual fixture creation (organiser adds each fixture)
- No templates. Just a guided form.

**Players**
- Player profile (basic: name, phone, position, photo)
- Ghost player creation by team manager
- Ghost SMS sent on creation
- Ghost-to-claimed linking via phone match (kept in MVP — it's the data moat)

**Fixtures & live entry**
- Manual fixture creation
- Live match entry: score, scorers, cards, basic substitutions
- **Single-confirmation by organiser** (dual-confirmation deferred to v1.1)
- Auto-calculated standings

**Public tournament page**
- `kalaanba.com/[slug]`
- Fixtures, results, standings, basic team list
- Mobile-first, no login, shareable

**WhatsApp integration (one-way, into existing groups)**
- Fixture scheduled
- Result card after fixture completion
- Weekly standings snapshot
- Nothing else at MVP

**Notification basics**
- Per-user mute toggle (single switch)
- Frequency tiers deferred

### 🟡 v1.1 (post-pilot)

- Dual-manager stat confirmation
- Knockout format
- Player cards (front side, basic tier)
- Bulk player import
- Notification frequency preferences
- Goal alerts during live fixtures
- Free agent registration
- Formal club mode + verification
- Dark mode

### 🔴 OUT — explicitly deferred to v2+

- Facility management pillar (entire pillar)
- Mobile Money payments (entire pillar)
- Referee portal
- Reputation score (3-pillar system)
- Challenge system
- Zone leaderboards
- Player card tiers / special cards
- Media galleries
- Transfers (schema supports them; UI does not ship)
- Sponsorship, fan engagement, scouting

---

## 9. Data Model — Intent Only (Schema TBD)

The full ERD is in `docs/` (to be added). At a high level, the entities are:

**Core (always present):**
- `User` — phone-first identity
- `Club` — formal or informal group
- `ClubMembership` — user ↔ club with role
- `Team` — child of club (a club can field multiple teams)
- `Player` — career identity, can exist as ghost / claimed / free agent
- `PlayerAffiliation` — player ↔ club, multi-club aware
- `Transfer` — append-only history
- `Venue` — physical location
- `Surface` — child of venue (a venue may have multiple pitches)
- `Event` — **base entity for fixture, booking, training session**. This unification is the single most important schema decision. All slot-claiming logic lives at the Event level.

**Competition:**
- `Competition`, `CompetitionRules`, `Registration`, `SquadMember`, `Fixture` (extends Event), `FixtureEvent`, `PlayerStat`

**Facility (deferred to v2):**
- `Booking` (extends Event), `PricingRule`, `AvailabilityBlock`

**Infrastructure:**
- `Transaction` (polymorphic via `reference_type`), `ReputationEvent` (event-sourced, never denormalised)

### Three validation queries the schema must answer

1. Can I pull everything happening at a venue on a given day across all event types?
2. Can I pull a player's full verified career history across all competitions?
3. Can I move a fixture to a different venue without breaking availability, notifications, or standings?

---

## 10. Critical Product Decisions Already Made

- **Verified stats only.** Manual entry is allowed but flagged at a lower trust tier. Verified stats require organiser confirmation (MVP) or dual-manager + organiser confirmation (v1.1+).
- **Ghost players send SMS immediately on creation.** This is the viral acquisition loop.
- **Phone numbers are the universal identifier.** No emails required at signup.
- **Mobile Money is the only payment method.** No cards. Not at MVP, not at v2.
- **WhatsApp posts into existing groups.** We do not create new groups for organisers.
- **Templates are on-ramps, never destinations.** Every form section is expandable.
- **Result confirmation locks the fixture.** Stats pipeline only fires when `result_confirmed = true`.
- **Reputation is event-sourced.** Never store a denormalised score; always recompute from events.
- **Transfers are append-only.** History cannot be deleted.
- **The Event base entity is non-negotiable.** Bookings and fixtures share slot-claim logic.

---

## 11. Tamale-Specific Context

### Zones (initial seed — to be confirmed by Richard)

- Lamashegu
- Kalpohin
- Vittin
- Sakasaka
- Choggu
- Gumbihini
- Aboabo
- Bulpela

The zone model is **configurable per city** — not hardcoded to Tamale or to NEWS (which was the original Accra-specific scheme). When we expand to other cities, each city defines its own zones.

### First pilot

- Profile: an organiser running an active or upcoming league in Tamale
- Specific person: TBD by Richard
- Engagement model: white-glove. Free. Richard physically present for the first matchday.

---

## 12. Open Questions / Tabled Issues

These are documented so no one tries to "just decide" them on the fly. They need explicit conversation before they ship:

**Backend stack final answer** — depends on the second builder's strength
**Domain ownership** — `kalaanba.com` available at $10, not yet purchased
**WhatsApp Business API application** — must be started immediately (1–2 week wait)
**Booking ↔ fixture handoff** — when a competition fixture lands on a surface that already has a booking, what wins? Resolved structurally by the Event base entity; specific business rules TBD.
**Payment failure recovery flow** — Mobile Money debited but platform unconfirmed
**Notification opt-out preferences** — must be designed before MVP ships
**Goal alerts during live fixtures** — design exists in v5 brief, build deferred to v1.1
**Phone number recycling** — account takeover prevention mechanism
**Data protection compliance** — Ghana Data Protection Act review before launch
**Minor consent flow** — for under-18 player profiles

---

## 13. How to Work in This Repo

### For human contributors

1. Read this file end-to-end
2. Read the relevant module's local README before changing it
3. Run `pnpm install` then `pnpm dev` from repo root
4. Mock data changes go in `packages/mock-data/`. Never hardcode data in components.
5. New entity? Add the type to `packages/shared/types/` first, then the api-client function, then the UI.
6. Open a PR with: what changed, why, what was tested, and any updates to this doc

### For AI coding agents

- This file is your spec. If a request contradicts this file, surface the contradiction before coding.
- Never bypass the api-client to read mock data directly. Never put data in components.
- Never introduce a new dependency without justifying it in the PR description.
- Never silently change the data model or the api-client function signatures.
- If you discover something this doc gets wrong, update the doc in the same PR.
- Tailwind only. No CSS-in-JS, no styled-components, no separate CSS files except the one global stylesheet.
- Use shadcn/ui components first. Build custom only when shadcn doesn't have it.
- Mobile-first always. Every screen must work on a 360px viewport.

### Conventions

- **Commits:** Conventional commits (`feat:`, `fix:`, `docs:`, `refactor:`, `chore:`)
- **Branches:** `feat/short-description`, `fix/short-description`
- **Code style:** Prettier + ESLint, both enforced in CI
- **Types:** No `any`. If you need to escape the type system, use `unknown` and narrow.

---

## 14. Success Criteria for the MVP

- One full competition runs end-to-end in Tamale without data loss
- The public page is shared on WhatsApp and followed by people outside the platform
- Standings are correct after every confirmed result
- 60%+ of ghost players claim profiles via SMS
- The pilot organiser runs a matchday without calling Richard
- At least one unprompted "this is better than what we had"

---

## 15. Document History

- **v1.0 — April 2026** — Initial product brief. Locks naming, build philosophy, MVP scope, tech stack frontend, architecture intent. Backend stack still pending second-builder input.

---

*If anything in this document feels stale, fix it. Documents that drift are worse than no documents.*
