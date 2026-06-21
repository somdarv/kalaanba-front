# Work Packets

Active Work Packets live at the root of this folder. Closed (pipeline complete, all 10 stages ticked, build-plan checkbox green) Work Packets are moved into [`_archive/`](./_archive) for reference.

## Naming

`WP-YYYYMMDD-<kebab-slug>.md` — date is the day the packet was opened.

## Conventions

- Each Work Packet carries the full pipeline checklist (Stages 1–10).
- A packet is only archived once `composer check` is green and all relevant Build_Plan checkboxes are ticked.
- Once archived, the file is read-only — corrections happen via new Work Packets that supersede.

## Closed Work Packets

See [`_archive/`](./_archive/):

- [`WP-20260525-godmode-admin-foundation`](./_archive/WP-20260525-godmode-admin-foundation.md) — God Mode Filament admin portal foundation (Phase 0.7.5).
- [`WP-20260528-users-uuid-migration`](./_archive/WP-20260528-users-uuid-migration.md) — `users.id` BIGINT → UUIDv7-ordered (Stage 1 blocker resolution, ADR-0003).
