/**
 * ScoreLine — the result object.
 *
 * Cites:
 *  - docs/design-system/DESIGN_LANGUAGE.md §2.6 (numeric treatment)
 *  - docs/design-system/DESIGN_LANGUAGE.md §9.1 / §9.7 (mobile-ready: reads
 *    at 360px with no horizontal scroll)
 *  - Constitution Law 3 (backend owns truth), Law 4 (stable internal keys,
 *    configurable labels), Law 7 (nothing is presented as final until
 *    `result_confirmed` AND Trust clearance)
 *
 * This is the object the whole product exists to render, and the inventory
 * had no way to draw it. Two crests, two numerals, a status. The numerals
 * are the hero — display face, tight negative tracking, tabular so a 1 and a
 * 7 occupy the same column when scores stack in a list.
 *
 * `status` is a stable internal key. The human-readable string arrives as
 * `statusLabel`, so labels stay configurable and translatable per Law 4 —
 * this component never renders a hardcoded "Full time".
 */

import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Crest } from "./crest";
import { LiveIndicator } from "./live-indicator";
import { StatValue } from "./stat-value";

/** Internal keys only. Never compare against a display string. */
export type MatchStatus =
  | "scheduled"
  | "live"
  | "half_time"
  | "awaiting_confirmation"
  | "result_confirmed"
  | "disputed"
  | "postponed"
  | "cancelled";

export type ScoreLineTeam = {
  name: string;
  crestUrl?: string | null;
};

/**
 * Only a confirmed result may present itself as settled (Law 7). Everything
 * else is explicitly provisional in the UI, so a disputed scoreline can never
 * be mistaken for a final one.
 */
const PROVISIONAL: ReadonlySet<MatchStatus> = new Set<MatchStatus>([
  "awaiting_confirmation",
  "disputed",
]);

export type ScoreLineProps = HTMLAttributes<HTMLDivElement> & {
  home: ScoreLineTeam;
  away: ScoreLineTeam;
  /** Already-final values from the backend. Null before kickoff. */
  homeScore?: number | null;
  awayScore?: number | null;
  status: MatchStatus;
  /** Configurable display label for `status` (Law 4). */
  statusLabel?: ReactNode;
  /** Live minute, e.g. "67'". Only rendered when status is `live`. */
  minute?: ReactNode;
  /** Kickoff time / competition name / venue — caller-formatted. */
  meta?: ReactNode;
  size?: "md" | "lg";
};

export function ScoreLine({
  home,
  away,
  homeScore,
  awayScore,
  status,
  statusLabel,
  minute,
  meta,
  size = "md",
  className,
  ...rest
}: ScoreLineProps) {
  const hasScore = homeScore != null && awayScore != null;
  const isLive = status === "live" || status === "half_time";
  const isProvisional = PROVISIONAL.has(status);
  const crestSize = size === "lg" ? "xl" : "lg";

  return (
    <div
      className={cn("flex flex-col items-center gap-3 text-center", className)}
      {...rest}
    >
      {(isLive || statusLabel) && (
        <div className="flex min-h-6 items-center gap-2">
          {isLive ? (
            <LiveIndicator minute={status === "live" ? minute : undefined} />
          ) : statusLabel ? (
            <span
              className={cn(
                "text-xs font-semibold tracking-[0.1em] uppercase",
                isProvisional ? "text-warning-ink" : "text-fg-subtle",
              )}
            >
              {statusLabel}
            </span>
          ) : null}
        </div>
      )}

      <div className="grid w-full grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-5">
        <TeamSide team={home} size={crestSize} />

        <div className="flex items-baseline gap-2 sm:gap-3">
          <StatValue size="score" tone={isLive ? "live" : "default"}>
            {hasScore ? homeScore : "–"}
          </StatValue>
          <span className="text-fg-subtle text-2xl font-light select-none sm:text-3xl">
            :
          </span>
          <StatValue size="score" tone={isLive ? "live" : "default"}>
            {hasScore ? awayScore : "–"}
          </StatValue>
        </div>

        <TeamSide team={away} size={crestSize} />
      </div>

      {meta ? <p className="text-fg-muted text-sm">{meta}</p> : null}

      {isProvisional ? (
        /* Law 7 — never let an unconfirmed score read as settled. */
        <p className="text-warning-ink text-xs">
          Provisional — not yet confirmed
        </p>
      ) : null}
    </div>
  );
}

function TeamSide({
  team,
  size,
}: {
  team: ScoreLineTeam;
  size: "lg" | "xl";
}) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-2">
      <Crest name={team.name} src={team.crestUrl} size={size} decorative />
      <span className="text-fg w-full text-sm leading-tight font-semibold text-balance">
        {team.name}
      </span>
    </div>
  );
}
