# Kalaanba Journal

A living, deduplicated log of how this project is being built. Maintained turn-by-turn by the **Sankofa** agent. Do not hand-edit unless you are reorganizing — Sankofa will dedupe and update in place.

Entry format: `- **YYYY-MM-DD** — Short, factual statement. Optional second clause for the *why*.`

## Decisions

- **2026-05-03** — Auto-invoke Sankofa via `applyTo: "**"` instruction file rather than shell hook. Reason: hooks can only run shell commands and cannot directly invoke subagents.
- **2026-05-04** — Challenge card visuals built as composable layers (scene plate + brush splash + real club crest + headline copy + chrome), **not** per-challenge AI image generation. Reasons: crest fidelity, latency, cost, brand control.
- **2026-05-04** — No money or real-world stakes in Challenge rivalries; staking is RP-only, and RP can only be won by beating other clubs.
- **2026-05-04** — Fan Buzz needs its own engine and should affect homepage Challenge rotation.
- **2026-05-11** — Kalaanba architecture for 250k–1M DAU: modular monolith on Next.js 15 + Postgres (schema-per-engine isolation) + Redis + BullMQ workers, deployed on Fly.io jnb region for Ghana proximity. Scaling path: PgBouncer + read replicas → strategic partitioning (`analytics_events`, `rp_ledger`, `notifications_outbox`) → eventual service extraction of Notification/Analytics/Buzz.
- **2026-05-11** — Six load-bearing cross-cutting subsystems: (1) event bus + transactional outbox for inter-engine comms, (2) Admin Config registry (versioned, scoped, effective-dated), (3) Trust clearance store (stored outputs, not recomputed), (4) append-only RP ledger (partitioned by season, derived balance views), (5) two-layer Notification (WebSocket live UI + outbox-backed reliable delivery), (6) Moderation gate (sync screen before publish).
- **2026-05-11** — Primary external integrations: WhatsApp Business API + Hubtel/Paystack MoMo, with idempotent reconciliation workers for payment/messaging state.
- **2026-05-11** — Build order: foundation → identity/clubs → players → match+trust+RP core loop → competition/challenge → notification → venue/booking/payments → buzz/awards → moderation/referee → analytics dashboards.

## Reversals

- **2026-05-04** — RP shifted from simple bragging rewards toward club-vs-club staking/transfer; exact staking units and caps remain open.

## Architectural Rules

- **2026-05-03** — After every substantive turn, the main agent must silently delegate to `Sankofa` subagent and only surface `📓 Journal updated.` when an entry was actually added.
- **2026-05-03** — `docs/JOURNAL.md` is owned exclusively by Sankofa; the main agent must never write to it directly.
- **2026-05-03** — Sankofa must never edit `PRODUCT.md`, `AGENTS.md`, `CLAUDE.md`, `README.md`, or any source/config files — scope is `docs/JOURNAL.md` only.
- **2026-05-04** — In Codex chat, a Codex subagent may stand in for VS Code/Copilot `runSubagent(agentName: "Sankofa")`; it must follow Sankofa rules and update only `docs/JOURNAL.md`, not a separate memory or handoff file.
- **2026-05-04** — Club crests must never be recolored, cropped, filtered, or passed through generative models. They render as-is from `/public/clubs/<slug>.svg`.
- **2026-05-04** — The same Challenge card system serves five surfaces (hero spotlight, hero-mobile, `/challenges/[id]` detail, `/challenges` list card, dashboard widget); geometry differs per surface, layers and data are shared.
- **2026-05-04** — Headline copy on Challenge cards is selected deterministically on `challenge.id` from a phrase library indexed by stage + tone + club voice — varied across challenges, stable across re-renders.
- **2026-05-11** — No cross-schema joins between engines; all inter-engine communication flows through the outbox event bus only. Reason: independent scaling, zero tight coupling.
- **2026-05-11** — Trust clearances gate **records** (who can see/access data); Moderation gates **public surfaces** (what gets published). These two must never be confused; Trust is for fine-grained access control, Moderation is for brand safety and user safety.

## Challenges & Resolutions

## Open Questions

- **2026-05-04** — Designer pipeline for the 6–10 Challenge scene plates: hire a designer, AI-generate-and-clean, or hybrid?
- **2026-05-04** — RP staking design remains open: pure RP units vs percentage of available RP with caps, plus tier/zone leaderboard treatment.
- **2026-05-04** — Potential Challenge lifecycle defaults remain open: issuer minimum RP/tier, 3-day response window, 4-day scheduling window, monthly callout cooldown, and result verification roles.
- **2026-05-04** — Headline highlight color on Challenge cards: always Kalaanba pink, or follow each challenger's club accent?

## Parked Ideas

- **2026-05-03** — A `journal-recap.prompt.md` user-level prompt to summarize the journal into a weekly digest.
- **2026-05-04** — Build the full Challenge Engine — lifecycle states, eligibility, buzz formula weights, RP values, anti-abuse, moderation. Full scoping in `docs/challenge-engine.md` and `docs/challenge-card-system.md`.
- **2026-05-04** — Further Challenge card system work is deferred for now.
- **2026-05-11** — Extract Notification, Analytics, and Buzz as standalone services once load testing reveals capacity limits on the monolith. Outlined in scaling path but deferred until partition strategy hits diminishing returns.

## Glossary

- **Sankofa** — The project's continuous documentation subagent; named after the Akan symbol meaning "go back and fetch it." Owns and maintains `docs/JOURNAL.md`.
- **Respect Points (RP)** — The non-monetary currency of the Challenge system; transferred between clubs based on call-out outcomes (win, draw, forfeit, ducked).
- **Fan Buzz** — A normalized hype score for a Challenge, mixing reactions, WhatsApp shares, predictions, comments, and view velocity. Displayed as a percentile against rolling-average buzz, not an absolute number.
- **Scene pack** — The hand-curated library of Challenge card background art plates (gauntlet, lightning, war-drums, etc.) the card composer draws from.

## Action Items

- **2026-05-04** — User to drop the four supplied background images into `public/images/challenge-scenes/` as `bg-organic-neon.webp`, `bg-lightning-pink.webp`, `bg-red-geometric.webp`, `bg-adinkra-red.webp`. Then we wire them into the scene catalog.
