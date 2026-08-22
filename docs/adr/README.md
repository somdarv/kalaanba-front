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

| ADR                                             | Title                                                      | Status   | Date       |
| ----------------------------------------------- | ---------------------------------------------------------- | -------- | ---------- |
| [0001](0001-modular-monolith-with-event-bus.md) | Modular monolith with schema-per-engine + outbox event bus | Accepted | 2026-05-12 |
| [0002](0002-filament-godmode-admin-portal.md)   | Filament v3 as the God Mode developer admin portal         | Accepted | 2026-05-25 |
| [0006](0006-oklch-design-tokens.md)             | OKLCH design tokens and the fill/ink role split            | Proposed | 2026-08-12 |
| [0007](0007-config-derived-option-sets-meta-endpoint.md) | Config-derived option sets served by a per-engine `/meta` endpoint | Proposed | 2026-08-19 |
| [0015](0015-owner-rendered-share-graphic.md) | The share graphic ships before the §16 minor-privacy work | Accepted | 2026-08-22 |
