import { redirect } from "next/navigation";

/**
 * Home — interim live-activity landing (WP-20260702-home-rewire).
 *
 * `/` is the live-activity home. Until a design-system-compliant home is
 * rebuilt, it reuses the legacy landing surface. Kept as a redirect (not an
 * import) so no `_archive` dependency lands in new code — design-system §7
 * forbids importing `_archive/*` into new code; the legacy route owns that
 * exception on its own.
 */
export default function Home() {
  redirect("/legacy/landing");
}
