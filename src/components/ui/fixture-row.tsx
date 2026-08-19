"use client";

/**
 * FixtureRow — the atom of every fixture list, results feed, and calendar.
 *
 * Cites:
 *  - docs/design-system/DESIGN_LANGUAGE.md §2.3 (`--radius-row`, the tight
 *    end of the shape scale added in the v3 token migration)
 *  - docs/design-system/DESIGN_LANGUAGE.md §9.1 (44px hit area — a whole row
 *    is the touch target, which is why the row itself is the button)
 *  - docs/design-system/DESIGN_LANGUAGE.md §2.4 (`flat` elevation for list
 *    rows: surface + hairline, no shadow)
 *  - Constitution Law 3 / Law 4 (display only; internal keys, prop labels)
 *
 * Dense on purpose. The reference material stacks twenty of these on one
 * screen, so the row trades the card's generous 20px radius for the 10px
 * `--radius-row` and keeps its vertical rhythm tight. v2 had no radius in
 * this range at all — every list either used a pill or a soft 25px card,
 * which is why dense football data never looked like football data.
 */

import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Crest } from "./crest";
import { LiveIndicator } from "./live-indicator";
import { pressableBase } from "./pressable";
import { StatValue } from "./stat-value";
import type { MatchStatus, ScoreLineTeam } from "./score-line";

type FixtureRowBase = {
  home: ScoreLineTeam;
  away: ScoreLineTeam;
  homeScore?: number | null;
  awayScore?: number | null;
  status: MatchStatus;
  /** Configurable label for the status (Law 4). */
  statusLabel?: ReactNode;
  /** Live minute, e.g. "67'". */
  minute?: ReactNode;
  /** Kickoff time or date — caller-formatted, never computed here. */
  kickoff?: ReactNode;
  /** Venue, competition, or matchday. */
  meta?: ReactNode;
  className?: string;
};

type StaticRowProps = FixtureRowBase &
  Omit<HTMLAttributes<HTMLDivElement>, keyof FixtureRowBase> & {
    interactive?: false;
  };

type InteractiveRowProps = FixtureRowBase &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof FixtureRowBase> & {
    interactive: true;
  };

export type FixtureRowProps = StaticRowProps | InteractiveRowProps;

export function FixtureRow(props: FixtureRowProps) {
  // Destructure once: the named keys are the component's own API, `rest` is
  // whatever DOM props the caller passed through.
  const {
    home,
    away,
    homeScore,
    awayScore,
    status,
    statusLabel,
    minute,
    kickoff,
    meta,
    className,
    interactive,
    ...rest
  } = props;

  const hasScore = homeScore != null && awayScore != null;
  const isLive = status === "live" || status === "half_time";

  const body = (
    <>
      {/* Left rail: kickoff, or the live pip once the match is underway. */}
      <div className="flex w-14 shrink-0 flex-col items-start gap-0.5 sm:w-16">
        {isLive ? (
          <LiveIndicator variant="inline" label="LIVE" minute={minute} />
        ) : (
          <>
            <span className="kx-numeric text-fg text-xs font-semibold">
              {kickoff}
            </span>
            {statusLabel ? (
              <span className="text-fg-subtle text-[0.625rem] tracking-wide uppercase">
                {statusLabel}
              </span>
            ) : null}
          </>
        )}
      </div>

      {/* Teams stack so long grassroots club names wrap instead of truncating
          into ambiguity at 360px. */}
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <TeamLine
          team={home}
          score={homeScore}
          hasScore={hasScore}
          isLive={isLive}
        />
        <TeamLine
          team={away}
          score={awayScore}
          hasScore={hasScore}
          isLive={isLive}
        />
        {meta ? (
          <span className="text-fg-subtle truncate text-xs">{meta}</span>
        ) : null}
      </div>
    </>
  );

  const shared = cn(
    "flex w-full items-center gap-3 text-left",
    "rounded-row border border-border bg-surface",
    "px-3 py-3",
    className,
  );

  if (interactive === true) {
    return (
      <button
        type="button"
        className={cn(
          pressableBase,
          "min-h-11 justify-start",
          shared,
          "hover:border-border-strong hover:bg-surface-elev",
          "active:shadow-(--shadow-pressed)",
        )}
        {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {body}
      </button>
    );
  }

  return (
    <div className={shared} {...(rest as HTMLAttributes<HTMLDivElement>)}>
      {body}
    </div>
  );
}

function TeamLine({
  team,
  score,
  hasScore,
  isLive,
}: {
  team: ScoreLineTeam;
  score?: number | null;
  hasScore: boolean;
  isLive: boolean;
}) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <Crest name={team.name} src={team.crestUrl} size="sm" decorative />
      <span className="text-fg min-w-0 flex-1 truncate text-sm font-medium">
        {team.name}
      </span>
      <StatValue
        size="md"
        tone={isLive ? "live" : hasScore ? "default" : "muted"}
        className="w-5 shrink-0 text-right"
      >
        {hasScore ? score : "–"}
      </StatValue>
    </div>
  );
}
