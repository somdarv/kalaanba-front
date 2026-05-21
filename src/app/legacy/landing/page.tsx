import { AgentOSBanner } from "@/components/_archive/site/agent-os-banner";
import { SiteHeader } from "@/components/_archive/site/site-header";
import { SiteHero } from "@/components/_archive/site/site-hero";

export const metadata = {
  title: "Original landing — Kalaanba (legacy)",
};

export default function LegacyLandingPage() {
  return (
    <>
      <AgentOSBanner />
      <SiteHeader />
      <main>
        <SiteHero />
      </main>
    </>
  );
}
