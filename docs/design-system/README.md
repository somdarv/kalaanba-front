# Kalaanba Design System

This folder is the **canonical home** for Kalaanba's design language and UI build plan. It is referenced from `docs/Architecture/Build_Plan.md` (UI Foundation track) and is updated every design/UI session.

## Contents

| File                                       | Purpose                                                                                                                         |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| [DESIGN_LANGUAGE.md](./DESIGN_LANGUAGE.md) | The design philosophy, token spec, motion rules, component recipes, typography scale. **Read this before writing any UI code.** |
| [REBUILD_PLAN.md](./REBUILD_PLAN.md)       | Ordered, session-by-session execution plan to rebuild the component system from scratch. **Tick boxes as you go.**              |
| [COMPONENT_INVENTORY.md](./COMPONENT_INVENTORY.md) | Full catalogue: every component we will build, its variants, what it composes, what composes it, and the build order. |

## Where things live

- **Live primitives**: `src/components/ui/` — start empty; rebuilt per the plan.
- **Tokens**: `src/app/globals.css` — single source of truth for colors, radii, shadows, motion, type.
- **Live providers**: `src/components/providers/` — `AppProviders` (TanStack Query). No theme provider (system removed; see `docs/JOURNAL.md`).
- **Legacy showcase (read-only reference)**: `src/components/_archive/` powers the `/legacy/showcase` route. Kept intact as a visual reference for the old "kx-\*" language. Do **not** import from `_archive/` in new code.

## Reading order for a new session

1. `docs/JOURNAL.md` — recent reversals & decisions.
2. `DESIGN_LANGUAGE.md` — what we're building toward (mandatory before any UI work).
3. `COMPONENT_INVENTORY.md` — what's in the kit, what depends on what.
4. `REBUILD_PLAN.md` — what's next.
5. `docs/Architecture/Build_Plan.md` — where UI Foundation fits in the broader build.

## How this is enforced for every agent

Every Copilot chat in `kalaanba-front/` auto-loads `.github/instructions/design-system-mandatory.instructions.md`, which:

- Requires reading `DESIGN_LANGUAGE.md` before any UI/CSS/component change.
- Requires explicit `Per docs/design-system/DESIGN_LANGUAGE.md §<n>.<n> ...` citation in the response.
- Lists hard refusal triggers (sub-44px hit areas, `100vh`, unguarded hover, inputs < 16px, hardcoded colors, archive imports, etc.).
- Layers on top of `engineering-standards.instructions.md` §5 (frontend best practices).

If an agent skips this, the change is wrong by definition.
