import { SiteHeader } from "@/components/site/site-header";
import { SiteHero } from "@/components/site/site-hero";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <SiteHero />
      </main>
    </>
  );
}
