import type { Metadata } from "next";
import { Eyebrow } from "@/components/ui";
import { InputSpecimens } from "./input-specimens";
import { MatchdaySpecimen } from "./matchday-specimen";
import { PlayerCardSpecimens } from "./player-card-specimens";
import { TokenSpecimens } from "./token-specimens";

/**
 * Internal design preview — the location REBUILD_PLAN Phase 2 names as the
 * exit criteria for every primitive ("a private design-preview page at
 * src/app/(internal)/design/page.tsx for visual QA at 360px and 1280px").
 *
 * Distinct from `/showcase`, which is the exhaustive component gallery. This
 * page has one job: show the v3 token layer and the football primitives
 * doing real work, so the system can be judged as a system.
 */

export const metadata: Metadata = {
  title: "Design v3 · Kalaanba",
  description:
    "Internal preview of the OKLCH token layer and the football primitives.",
  robots: { index: false, follow: false },
};

export default function DesignPreviewPage() {
  return (
    <main className="bg-bg min-h-dvh">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-[max(1rem,env(safe-area-inset-left))] py-10 sm:py-14">
        <header className="flex flex-col gap-3">
          <Eyebrow tone="live">WP-20260812 · ADR-0006</Eyebrow>
          <h1 className="font-display text-3xl font-semibold tracking-[-0.03em] text-balance sm:text-5xl">
            Token layer v3
          </h1>
          <p className="text-fg-muted max-w-prose text-base leading-relaxed">
            Colour authored in OKLCH, brand fill split from brand ink, a shape
            scale with a tight end, and six primitives for the objects the
            product actually renders. Every value below is verified in-gamut for
            sRGB and contrast-checked against its own label.
          </p>
        </header>

        <TokenSpecimens />

        <hr className="border-divider" />

        <PlayerCardSpecimens />

        <hr className="border-divider" />

        <InputSpecimens />

        <hr className="border-divider" />

        <MatchdaySpecimen />

        <footer className="border-divider text-fg-subtle border-t pt-6 text-xs">
          <p>
            Internal preview — noindex. Full component gallery lives at{" "}
            <code>/showcase</code>; the v2 language is preserved at{" "}
            <code>/legacy/showcase</code> for comparison. Audit and reasoning:{" "}
            <code>docs/design-system/token-audit.html</code> and{" "}
            <code>docs/adr/0006-oklch-design-tokens.md</code>.
          </p>
        </footer>
      </div>
    </main>
  );
}
