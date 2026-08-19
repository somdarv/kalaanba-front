import { AgentOSBanner } from "@/components/_archive/site/agent-os-banner";
import { SiteHeader } from "@/components/_archive/site/site-header";
import { SiteHero } from "@/components/_archive/site/site-hero";
import { HomeCtaPrompts } from "@/components/site";

export const metadata = {
  title: "Kalaanba — Seeds of Play",
};

/**
 * Interim live-activity home (WP-20260702-home-rewire). `/` redirects here.
 * Reuses the legacy landing surface as-is until a design-system-compliant home
 * is rebuilt (tracked debt), and hangs the post-signup soft-prompt CTAs above
 * the hero so a fresh user lands straight into "come into live activity".
 */
export default function LegacyLandingPage() {
  return (
    <>
      <AgentOSBanner />
      <SiteHeader />
      <main>
        <HomeCtaPrompts />
        <SiteHero />
      </main>
    </>
  );
}
