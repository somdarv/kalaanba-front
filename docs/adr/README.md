# Architecture Decision Records (ADRs)

This folder holds **Architecture Decision Records** — short, immutable documents that capture _why_ we made a load-bearing technical decision. Once accepted, an ADR is never edited; superseded decisions get a new ADR that references the older one.

## Format

Each ADR is a single Markdown file named `NNNN-<slug>.md` where `NNNN` is a zero-padded sequence number (`0001`, `0002`, …).

```markdown
# ADR-NNNN: <Decision title>

- **Status:** Proposed | Accepted | Superseded by ADR-XXXX | Deprecated
- **Date:** YYYY-MM-DD
- **Work Packet:** WP-YYYYMMDD-slug (if applicable)
- **Affected engines:** <list>

## Context

What problem are we solving? What constraints apply? Reference Brief / Build Plan / engine docs.

## Decision

The decision, stated plainly. Include the rule or pattern adopted.

## Alternatives considered

What else we looked at, and why we rejected each.

## Consequences

- Positive
- Negative
- Follow-up work / risks
```

## Pipeline integration

The Architect (Stage 4) proposes an ADR when a Work Packet introduces a new architectural pattern, a boundary change, or a cross-engine contract that doesn't already exist. The Docs Scribe (Stage 9) finalises and commits it.

## Index

Every ADR on disk appears here. If you add one, add its row in the same commit —
this table was three months behind the folder once and it will be again otherwise.

| ADR                                                      | Title                                                              | Status                     | Date       |
| -------------------------------------------------------- | ------------------------------------------------------------------ | -------------------------- | ---------- |
| [0001](0001-modular-monolith-with-event-bus.md)          | Modular monolith with schema-per-engine + outbox event bus          | Accepted                   | 2026-05-12 |
| [0002](0002-filament-godmode-admin-portal.md)            | Filament v3 as the God Mode developer admin portal                  | Accepted                   | 2026-05-25 |
| [0003](0003-uuidv7-user-identity.md)                     | UUIDv7 as the canonical user identity                               | Accepted                   | 2026-05-28 |
| [0004](0004-identifier-first-progressive-auth.md)        | Identifier-first progressive authentication                         | Accepted                   | 2026-06-24 |
| [0005](0005-admin-access-code-destructive-actions.md)    | Admin access code for destructive Users-section actions             | Accepted                   | 2026-06-24 |
| [0006](0006-oklch-design-tokens.md)                      | OKLCH design tokens and the fill/ink role split                     | Proposed (decision 3 superseded by 0010, then 0012) | 2026-08-12 |
| [0007](0007-config-derived-option-sets-meta-endpoint.md) | Config-derived option sets served by a per-engine `/meta` endpoint  | Proposed                   | 2026-08-19 |
| [0008](0008-smsonlinegh-as-the-live-otp-provider.md)     | SMSOnlineGH as the live OTP delivery provider                       | Superseded by 0009         | 2026-08-19 |
| [0009](0009-bms-as-the-live-otp-provider.md)             | BMS (Bulk Messaging Solutions) as the live OTP provider             | Accepted                   | 2026-08-19 |
| [0010](0010-bright-brand-fills-with-dark-labels.md)      | Bright brand fills with dark labels                                 | Superseded by 0012 (label colour only) | 2026-08-19 |
| [0011](0011-pitch-turf-tokens.md)                        | Pitch turf tokens for the position picker                           | Accepted                   | 2026-08-19 |
| [0012](0012-white-labels-on-bright-brand-fills.md)       | White labels on bright brand fills, below AA, knowingly             | Accepted                   | 2026-08-19 |
| [0013](0013-brand-tinted-secondary-hover.md)             | Secondary's hover is a brand tint, not a neutral step               | Accepted                   | 2026-08-20 |
| [0014](0014-theme-stable-player-card-tokens.md)          | Theme-stable player card tokens                                     | Accepted (amended 2026-08-21) | 2026-08-21 |
| [0015](0015-owner-rendered-share-graphic.md)             | The share graphic ships before the §16 minor-privacy work           | Accepted                   | 2026-08-22 |
| [0016](0016-signature-typeface-on-the-player-card.md)    | A third typeface, for the signature on a player card                | Accepted                   | 2026-08-22 |
| [0017](0017-reserved-club-names-and-the-official-tier.md) | Reserved club names, and the tier that decides what one means       | Proposed                   | 2026-08-23 |

### Open status questions

- **0006 and 0007 are still marked Proposed on disk, but both shipped.** 0006's
  token layer is the live system (`globals.css`, the v3 migration swept 45 files
  against it) and 0007's `/meta` endpoint serves `/players/meta` in production.
  Promoting either to Accepted is a decision, not a clerical fix, so the files
  are left alone and the gap is recorded here instead.
- **0014 was amended on 2026-08-21**, not superseded, when the decorative pattern
  layer was found to change the ground's luminance and the contrast rule was
  restated to measure the composite. The amendment lives inside the ADR.
