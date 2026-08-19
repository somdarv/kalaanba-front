# ADR-0007: Config-derived option sets are served by a per-engine `/meta` endpoint

- **Status:** Proposed
- **Date:** 2026-08-19
- **Work Packet:** WP-20260819-player-setup-wizard
- **Affected engines:** Player & Affiliation (first consumer), Admin Configuration & Governance (source of truth for the values)

## Context

Constitution Law 4 splits every enumerated set in two: a stable internal key that logic
depends on, and a display label that is configurable and translatable. Law 2 adds that
the *membership* of the set is itself configuration — `player.positions` and
`club.types` are both registered config keys whose descriptions say, in as many words,
that "the human-facing labels are resolved separately".

Nothing resolved them. The frontend shipped this instead
(`src/lib/api/player.ts`, before this packet):

```ts
// Internal keys are backend truth (config `player.positions` /
// availability); ... a future GET meta endpoint should serve them so labels
// stay translatable (Constitution Law 4).
export const PLAYER_POSITIONS = [
  { value: "goalkeeper", label: "Goalkeeper" }, ...
] as const;
```

A hardcoded mirror of a config default, with a comment admitting it. It has three
failure modes, and they get worse as the platform grows:

1. **Silent drift.** An admin adds `winger` to `player.positions`. The backend accepts
   it, the ledger records it, and the selector never offers it. Nothing errors.
2. **Untranslatable labels.** `Accept-Language` is honoured at the API boundary per
   engineering-standards §7, but a label compiled into the JS bundle cannot respond
   to it.
3. **Bounds duplication.** `preferred_number` is validated against a literal `1..99`
   in the Zod schema while `player.profile.preferred_number_min/max` are the real
   authority — the same magic number in two repos.

This is not specific to players. Every engine has enumerated sets (`club.types`,
match statuses, challenge outcomes, availability reasons), so whatever we do here we
will do eighteen more times.

## Decision

**Each engine exposes a single read-only `GET /api/v1/<engine-plural>/meta` endpoint
that returns every config-derived option set, label map, and bound the engine's client
surfaces need to render a form.** The frontend holds no copy of a config value.

Rules:

1. **Shape.** `{ key, label }` pairs in config-defined order, never a bare string
   array — order is presentation and belongs to config, not to the client's sort.
2. **Labels come from a `*.labels` config key** of `value_type: json`, mapping internal
   key → display string, `approval_level: low` (labels are cosmetic per the config
   README's approval table). A key present in the set but missing from the label map
   falls back to the key itself rather than rendering blank.
3. **Bounds travel with the set.** Min/max/length limits that a form must enforce are
   returned by the same call, so client-side Zod is generated from the response rather
   than from a literal.
4. **`Accept-Language` is honoured** — the label map is resolved server-side.
5. **Cached, not polled.** `etag` + `If-None-Match` per engineering-standards §7;
   clients treat it as reference data (long `staleTime`).
6. **It is not an escape hatch.** `/meta` returns presentation vocabulary only. No
   domain truth, no per-user state, no computed values — those keep their own
   endpoints (Law 3).

Client-side validation still exists (engineering-standards §5 requires two layers), but
it is now *derived* from the meta response instead of duplicating it, so the two layers
can no longer disagree.

## Alternatives considered

- **Keep the hardcoded mirrors, add a CI drift check.** Compares `contracts/config/*`
  defaults against the TS constants. Catches drift in the *defaults* but not in the
  *live* value, which is the whole point of configurability — an admin's runtime change
  never touches the repo. Rejected: it enforces the wrong invariant.
- **Embed the option sets in every resource response.** Ships the position list on
  every player payload. Rejected: bloats hot reads for a value that changes monthly.
- **One platform-wide `/api/v1/meta`.** Rejected: it becomes a cross-engine junk drawer
  and violates Law 1's ownership boundary — each engine owns its own vocabulary.
- **Generate the constants at build time from `contracts/config/`.** Rejected for the
  same reason as the drift check, plus it requires a redeploy to change a label, which
  is exactly what Law 2 forbids.

## Consequences

**Positive**

- A label change or a new option key is a config edit, audited by Admin Governance, with
  no deploy — Law 2 satisfied end-to-end for the first time.
- `Accept-Language` becomes real for enumerated sets.
- The `1..99` literal disappears from the frontend; bounds have one authority.
- The pattern is uniform, so the next seventeen engines have no design work to do.

**Negative**

- One extra round trip before an option-bearing form can render. Mitigated by a long
  `staleTime` (it is reference data — it changes when an admin edits a key, not when
  the user acts) and by prefetching it alongside the route that leads into the form.
- A form that needs options is now blocked on a network call, so it needs a loading and
  an error state it did not need before.

**Follow-up**

- `GET /api/v1/clubs/meta` should replace the equivalent hardcoded sets in the club
  create flow.
- The `*.labels` config keys need an admin UI surface for editing a key→label map;
  until it exists the values are edited as raw JSON.
- When a second locale ships, add a contract test asserting `Accept-Language` changes
  the labels but never the keys.
