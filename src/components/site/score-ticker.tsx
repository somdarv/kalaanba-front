"use client";

import { Fragment } from "react";

import { cn } from "@/lib/cn";

/**
 * The live-score strip under the nav.
 *
 * It takes its fixtures as a prop and renders nothing when there are none.
 * That is the whole safety story: there is no match or fixture endpoint yet,
 * so on `/` the array is empty and the strip is simply absent, and it cannot
 * be made to show a score the backend did not produce (Law 3). When
 * Match/Fixture ships, this gets a hook and nothing else here changes.
 *
 * Presentational only, per engineering-standards §5 — it formats and displays.
 * The minute, the status label and the scores all arrive computed.
 *
 * Scrolls horizontally by hand rather than auto-marquee. An auto-scrolling
 * ticker moves text out from under the reader, is unreadable on a phone, and
 * needs a `prefers-reduced-motion` escape hatch to be accessible at all
 * (§3.6). A swipeable strip has none of those problems and is the gesture the
 * user already knows from every other rail in the product.
 */

export type TickerFixture = {
  id: string;
  home: string;
  away: string;
  homeScore: number | null;
  awayScore: number | null;
  /** Short status: "FT", "HT", or null while a minute is showing. */
  statusLabel: string | null;
  /** Live minute, e.g. "67'". Present only while the match is running. */
  minute: string | null;
  /** Where the row goes. Null until the match route exists. */
  href?: string | null;
};

export type ScoreTickerProps = {
  fixtures: readonly TickerFixture[];
  className?: string;
};

export function ScoreTicker({ fixtures, className }: ScoreTickerProps) {
  if (fixtures.length === 0) return null;

  return (
    <div
      className={cn(
        "border-b border-divider bg-surface",
        className,
      )}
    >
      <div
        // A named region rather than an anonymous scroller: it is a list of
        // results, and a screen reader user needs to be able to find or skip
        // it as one thing.
        role="region"
        aria-label="Latest scores"
        className="kx-scroll mx-auto flex w-full max-w-5xl items-center gap-0 overflow-x-auto overscroll-x-contain px-4 sm:px-6"
      >
        {fixtures.map((fixture, index) => (
          <Fragment key={fixture.id}>
            {index > 0 ? (
              <span
                aria-hidden
                className="mx-1 h-5 w-px shrink-0 bg-divider"
              />
            ) : null}
            <TickerRow fixture={fixture} />
          </Fragment>
        ))}
      </div>
    </div>
  );
}

function TickerRow({ fixture }: { fixture: TickerFixture }) {
  const hasScore =
    fixture.homeScore !== null && fixture.awayScore !== null;
  const isLive = fixture.minute !== null;

  return (
    <div className="flex shrink-0 items-center gap-2 py-2 pr-2 pl-1 text-sm whitespace-nowrap">
      <span className="text-fg-muted">{fixture.home}</span>
      {hasScore ? (
        <span className="kx-numeric rounded-row bg-surface-elev px-2 py-0.5 font-semibold text-fg">
          {fixture.homeScore}&nbsp;-&nbsp;{fixture.awayScore}
        </span>
      ) : null}
      <span className="text-fg-muted">{fixture.away}</span>
      {isLive ? (
        // Brand ink on the minute, matching the reference. It is the one
        // thing in the strip that is changing, so it is the one thing that
        // gets colour. Never colour alone: the apostrophe reads as a minute.
        <span className="kx-numeric text-xs font-semibold text-primary-ink">
          {fixture.minute}
        </span>
      ) : fixture.statusLabel ? (
        <span className="text-xs font-semibold text-fg-subtle">
          {fixture.statusLabel}
        </span>
      ) : null}
    </div>
  );
}
