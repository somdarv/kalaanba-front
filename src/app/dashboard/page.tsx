import { redirect } from "next/navigation";

/**
 * Retired placeholder (WP-20260702-home-rewire). The post-auth tail now lands
 * on the live-activity home (`/`), not this stub. Kept as a redirect so any
 * bookmarked `/dashboard` deep links resolve instead of 404ing.
 */
export default function DashboardRedirect() {
  redirect("/");
}
