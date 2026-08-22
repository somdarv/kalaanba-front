/**
 * The one place `process.env` is read on the client.
 *
 * Engineering standards §9 forbids `process.env` outside `next.config.ts` and
 * env loaders; this is the loader. Everything else imports a named constant,
 * which is also what keeps the values statically analysable — Next inlines
 * `process.env.NEXT_PUBLIC_*` at build time only when it sees the full member
 * expression written out, so these must stay literal and must not be indexed
 * dynamically.
 *
 * `src/lib/api/index.ts` still reads `NEXT_PUBLIC_API_URL` directly. Left alone
 * deliberately: it is the API loader and moving it here would make this module
 * a dependency of the client for no gain. Two loaders, each owning its own
 * concern, is the shape the rule describes.
 */

/**
 * Whether the seeded demo dataset stands in for engines that have no endpoints.
 *
 * PRODUCT.md §3.1 is the build philosophy: the frontend is built against a typed
 * mock layer first. This flag is what keeps that philosophy out of production.
 *
 * **Why a flag at all, when the home feed seeds unconditionally.** A fabricated
 * league table is fiction about a competition nobody owns. A fabricated stat
 * line on `/me` is fiction about one identifiable player, on the page they will
 * screenshot and send to a club, and Player & Affiliation §13 is explicit that
 * claimed stats never appear in profile totals. The difference in blast radius
 * is the whole reason this exists.
 *
 * Default OFF. An unset variable in a production build yields `false`, so the
 * failure mode of forgetting to configure anything is an honest empty state.
 * Turning it on is a deliberate act in a `.env` file.
 */
export const IS_SEED_ENABLED =
  process.env.NEXT_PUBLIC_KX_SEED === "1" ||
  process.env.NEXT_PUBLIC_KX_SEED === "true";
