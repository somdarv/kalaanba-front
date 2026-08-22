"use client";

import { Fragment } from "react";

import { cn } from "@/lib/cn";

/**
 * The live-score strip under the nav, moving.
 *
 * It takes its fixtures as a prop and renders nothing when there are none, so
 * a page with no football on it simply has a two-row nav.
 *
 * MOTION. The track holds the list twice and slides exactly -50%, so the loop
 * has no seam and needs no JS (see `.kx-ticker` in globals.css). Duration is
 * derived from the number of fixtures rather than fixed, because a fixed
 * duration means six scores crawl and twenty scores sprint; per-item seconds
 * keeps the reading speed constant whatever the matchday holds.
 *
 * It pauses on hover and on focus inside it, and `prefers-reduced-motion`
 * stops it entirely and gives the reader an ordinary scroller instead (§3.6).
 * A ticker is unreadable to anyone with vestibular sensitivity while it runs,
 * so that path is the accessible one rather than a degraded one.
 *
 * ACCESSIBILITY. The second copy of the list is `aria-hidden`: it exists only
 * to make the loop seamless, and a screen reader announcing every score twice
 * would be the cost of a purely visual trick.
 *
 * Presentational only (engineering-standards §5) — the minute, the status
 * label and the scores all arrive computed.
 */

/** Seconds each fixture spends crossing. Tuned so a score stays readable. */
const SECONDS_PER_FIXTURE = 6;

export type TickerFixture = {
  id: string;
  home: string;
  away: string;
  homeScore: number | null;
  awayScore: number | null;
  /** Short status: "FT", "HT". Null while a minute is showing. */
  statusLabel: string | null;
  /** Live minute, e.g. "67'". Present only while the match is running. */
  minute: string | null;
};

export type ScoreTickerProps = {
  fixtures: readonly TickerFixture[];
  className?: string;
};

export function ScoreTicker({ fixtures, className }: ScoreTickerProps) {
  if (fixtures.length === 0) return null;

  const duration = `${fixtures.length * SECONDS_PER_FIXTURE}s`;

  return (
    <div
      className={cn(
        // --brand-wash: the brand hue at 4%, which lands around #FEF8FB on
        // paper. Nearly white with a hint of pink in it, so the strip belongs
        // to the brand without becoming a third coloured bar under the other
        // two. --hover-overlay (7%) was tried first and read as a panel.
        "border-b border-divider bg-brand-wash",
        className,
      )}
    >
      <div
        role="region"
        aria-label="Latest scores"
        className="kx-ticker mx-auto w-full max-w-6xl"
        style={{ ["--kx-ticker-duration" as string]: duration }}
      >
        {/* Layout in utilities, motion in CSS. `.kx-ticker-track` used to
            carry `display:flex` and `width:max-content` too, and when that
            single class lost for any reason the two runs fell back to block
            and stacked into two rows. Tailwind's `flex w-max flex-nowrap` is
            the same layout expressed where it cannot silently go missing, and
            the custom class is now only the animation. */}
        <div className="kx-ticker-track flex w-max flex-nowrap">
          <TickerRun fixtures={fixtures} />
          <TickerRun fixtures={fixtures} aria-hidden />
        </div>
      </div>
    </div>
  );
}

/** One pass of the list. Rendered twice so the loop closes on itself. */
function TickerRun({
  fixtures,
  "aria-hidden": ariaHidden,
}: {
  fixtures: readonly TickerFixture[];
  "aria-hidden"?: boolean;
}) {
  return (
    <div className="flex shrink-0 items-center" aria-hidden={ariaHidden}>
      {fixtures.map((fixture, index) => (
        <Fragment key={fixture.id}>
          {index > 0 ? (
            <span aria-hidden className="h-5 w-px shrink-0 bg-divider" />
          ) : null}
          <TickerRow fixture={fixture} />
        </Fragment>
      ))}
      {/* Closes the gap between the last fixture of one pass and the first of
          the next, so the rhythm does not stutter at the seam. */}
      <span aria-hidden className="h-5 w-px shrink-0 bg-divider" />
    </div>
  );
}

function TickerRow({ fixture }: { fixture: TickerFixture }) {
  const hasScore = fixture.homeScore !== null && fixture.awayScore !== null;
  const isLive = fixture.minute !== null;

  return (
    <div className="flex shrink-0 items-center gap-2.5 px-5 py-2.5 text-[0.7375rem] whitespace-nowrap">
      <span className="text-fg-muted">{fixture.home}</span>
      {hasScore ? (
        <span className="kx-numeric rounded-row bg-bg px-2.5 py-1 font-semibold text-fg">
          {fixture.homeScore}&nbsp;-&nbsp;{fixture.awayScore}
        </span>
      ) : null}
      <span className="text-fg-muted">{fixture.away}</span>
      {isLive ? (
        /* Brand ink on the minute: it is the one thing in the strip that is
           changing, so it is the one thing that gets colour. Not colour alone
           either, since the apostrophe already reads as a minute. */
        <span className="kx-numeric text-[0.7375rem] font-semibold text-primary-ink">
          {fixture.minute}
        </span>
      ) : fixture.statusLabel ? (
        <span className="text-sm font-semibold text-fg-subtle">
          {fixture.statusLabel}
        </span>
      ) : null}
    </div>
  );
}
