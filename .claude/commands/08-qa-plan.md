---
description: Stage 8 — test plan and tests for a Work Packet (qa-engineer).
argument-hint: <WP-id>
---

Delegate to the **qa-engineer** subagent (Task tool). Produce a test plan and write the tests for Work Packet $1.

Cover:

- Unit tests for each affected engine module.
- Contract tests against the schemas in `contracts/`.
- Integration tests across engine boundaries (events flowing via outbox).
- Edge cases from `docs/engines/<engine>/` (draw stood-ground, related-club, March transition, dispute hold, minor-protected visibility, walkover stats, etc.).
- Config-flip tests (change an admin config value, assert behaviour changes without code changes).
- Architecture lint (Deptrac / Pest Architecture) must pass.

Re-run every applicable local gate and paste the result before signing off. Output the Test Plan block defined in the subagent.
