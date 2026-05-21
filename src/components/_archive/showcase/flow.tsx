"use client";

/* =====================================================================
   KX TRACK 6 · ORGANISER FLOW & DELTAS
     - KxStepper       (numbered wizard header)
     - KxFixtureRow    (compact list-row variant of a fixture)
     - KxStatDelta     (small ±change pill)
   All scoped under .kx-root. Token-driven for light + dark.
   ===================================================================== */

import type { ReactNode } from "react";
import { Check, CaretRight, CaretUp, CaretDown, Minus } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

/* --------------------------- KxStepper --------------------------- */

export type StepStatus = "complete" | "current" | "upcoming";

export type StepItem = {
  key: string;
  label: string;
  hint?: string;
  status: StepStatus;
};

export function KxStepper({
  steps,
  className,
}: {
  steps: StepItem[];
  className?: string;
}) {
  return (
    <ol
      className={cn(
        "flex w-full items-stretch gap-1 rounded-[var(--kx-r-card)] border border-[var(--kx-border)] bg-[var(--kx-card)] p-2 sm:gap-2 sm:p-3",
        className,
      )}
    >
      {steps.map((s, i) => {
        const isLast = i === steps.length - 1;
        return (
          <li key={s.key} className="flex min-w-0 flex-1 items-center gap-2">
            <StepBubble status={s.status} index={i + 1} />
            <div className="hidden min-w-0 flex-1 sm:block">
              <p
                className={cn(
                  "truncate text-[12.5px] font-semibold leading-tight",
                  s.status === "current"
                    ? "text-[var(--kx-fg)]"
                    : s.status === "complete"
                      ? "text-[var(--kx-fg)]"
                      : "text-[var(--kx-fg-muted)]",
                )}
              >
                {s.label}
              </p>
              {s.hint ? (
                <p className="truncate text-[11px] text-[var(--kx-fg-muted)]">{s.hint}</p>
              ) : null}
            </div>
            {!isLast ? (
              <span aria-hidden className="flex h-px flex-1 items-center sm:flex-none sm:px-1">
                <span
                  className={cn(
                    "h-px w-full sm:w-8",
                    s.status === "complete"
                      ? "bg-[var(--kx-pink)]"
                      : "bg-[var(--kx-border)]",
                  )}
                />
              </span>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

function StepBubble({ status, index }: { status: StepStatus; index: number }) {
  const cls =
    status === "complete"
      ? "bg-[var(--kx-pink)] text-[var(--kx-on-pink)] border-transparent shadow-[var(--kx-shadow-pink)]"
      : status === "current"
        ? "bg-[var(--kx-card)] text-[var(--kx-pink)] border-[var(--kx-pink)] shadow-[0_0_0_3px_var(--kx-ring)]"
        : "bg-[var(--kx-card-2)] text-[var(--kx-fg-muted)] border-[var(--kx-border)]";
  return (
    <span
      className={cn(
        "grid h-8 w-8 shrink-0 place-items-center rounded-full border [font-family:var(--kx-font-display)] text-[12.5px] font-extrabold transition-colors",
        cls,
      )}
    >
      {status === "complete" ? <Check size={14} weight="bold" /> : index}
    </span>
  );
}

/* --------------------------- KxFixtureRow --------------------------- */

export type FixtureRowProps = {
  /** Local kickoff date / time. */
  kickoff: Date;
  homeName: string;
  awayName: string;
  homeCrest?: ReactNode;
  awayCrest?: ReactNode;
  /** Final or current score, e.g. [2, 1]. Omit for upcoming fixtures. */
  score?: [number, number];
  /** Match state. Drives the right-hand pill. */
  state?: "scheduled" | "live" | "final" | "postponed";
  /** Live clock string when state = "live", e.g. "67'". */
  liveClock?: string;
  /** Optional venue / competition tag. */
  meta?: string;
  onClick?: () => void;
  className?: string;
};

export function KxFixtureRow({
  kickoff,
  homeName,
  awayName,
  homeCrest,
  awayCrest,
  score,
  state = "scheduled",
  liveClock,
  meta,
  onClick,
  className,
}: FixtureRowProps) {
  const dateStr = kickoff.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" });
  const timeStr = kickoff.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });

  const Wrapper = onClick ? "button" : "div";

  return (
    <Wrapper
      onClick={onClick}
      type={onClick ? "button" : undefined}
      className={cn(
        "group relative flex w-full items-center gap-3 rounded-2xl border border-[var(--kx-border)] bg-[var(--kx-card)] px-3 py-2.5 text-left outline-none transition-[background-color,border-color,box-shadow] duration-200 ease-[var(--kx-ease)]",
        onClick &&
          "cursor-pointer hover:border-[var(--kx-border-strong)] hover:bg-[var(--kx-card-2)] focus-visible:shadow-[0_0_0_3px_var(--kx-ring)]",
        className,
      )}
    >
      {/* Date column */}
      <div className="hidden w-16 shrink-0 flex-col items-start sm:flex">
        <span suppressHydrationWarning className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--kx-fg-muted)]">
          {dateStr}
        </span>
        <span suppressHydrationWarning className="text-[12.5px] font-semibold tabular-nums text-[var(--kx-fg)]">
          {timeStr}
        </span>
      </div>

      <span aria-hidden className="hidden h-8 w-px shrink-0 bg-[var(--kx-border)] sm:block" />

      {/* Home */}
      <div className="flex min-w-0 flex-1 items-center justify-end gap-2 text-right">
        <span className="truncate text-[13.5px] font-semibold text-[var(--kx-fg)]">{homeName}</span>
        {homeCrest}
      </div>

      {/* Score / vs */}
      <div className="grid w-[68px] shrink-0 place-items-center">
        {score ? (
          <span className="[font-family:var(--kx-font-display)] text-lg font-extrabold tabular-nums text-[var(--kx-fg)]">
            {score[0]}
            <span className="mx-1 text-[var(--kx-fg-muted)]">–</span>
            {score[1]}
          </span>
        ) : (
          <span className="text-[12.5px] font-bold uppercase tracking-[0.18em] text-[var(--kx-fg-muted)] sm:hidden">
            {timeStr}
          </span>
        )}
        {!score ? (
          <span className="hidden text-[10.5px] font-bold uppercase tracking-[0.18em] text-[var(--kx-fg-muted)] sm:inline">
            vs
          </span>
        ) : null}
      </div>

      {/* Away */}
      <div className="flex min-w-0 flex-1 items-center gap-2">
        {awayCrest}
        <span className="truncate text-[13.5px] font-semibold text-[var(--kx-fg)]">{awayName}</span>
      </div>

      {/* State pill */}
      <div className="hidden shrink-0 items-center gap-2 sm:flex">
        <StatePill state={state} liveClock={liveClock} />
        {meta ? (
          <span className="hidden text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--kx-fg-muted)] md:inline">
            {meta}
          </span>
        ) : null}
        {onClick ? (
          <CaretRight
            size={14}
            weight="bold"
            className="text-[var(--kx-fg-muted)] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-[var(--kx-fg)]"
          />
        ) : null}
      </div>
    </Wrapper>
  );
}

function StatePill({ state, liveClock }: { state: NonNullable<FixtureRowProps["state"]>; liveClock?: string }) {
  if (state === "live") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--kx-pink)] px-2.5 py-1 text-[10.5px] font-extrabold uppercase tracking-[0.14em] text-[var(--kx-on-pink)]">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--kx-on-pink)]" />
        Live {liveClock ? <span className="tabular-nums opacity-90">{liveClock}</span> : null}
      </span>
    );
  }
  if (state === "final") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--kx-border)] bg-[var(--kx-card-2)] px-2.5 py-1 text-[10.5px] font-extrabold uppercase tracking-[0.14em] text-[var(--kx-fg)]">
        Final
      </span>
    );
  }
  if (state === "postponed") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[color-mix(in_oklab,var(--kx-warning)_18%,transparent)] px-2.5 py-1 text-[10.5px] font-extrabold uppercase tracking-[0.14em] text-[var(--kx-warning)]">
        Postponed
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--kx-border)] bg-transparent px-2.5 py-1 text-[10.5px] font-extrabold uppercase tracking-[0.14em] text-[var(--kx-fg-muted)]">
      Scheduled
    </span>
  );
}

/* --------------------------- KxStatDelta --------------------------- */

export function KxStatDelta({
  value,
  unit,
  /** When present, prefix the value (e.g. "+3" → "+3 goals"). */
  label,
  /** Reverse the polarity: a negative number is "good" (e.g. goals conceded). */
  invert = false,
  size = "md",
  className,
}: {
  value: number;
  unit?: string;
  label?: string;
  invert?: boolean;
  size?: "sm" | "md";
  className?: string;
}) {
  const sign = value === 0 ? "flat" : value > 0 ? "up" : "down";
  const good = invert ? sign === "down" : sign === "up";
  const bad = invert ? sign === "up" : sign === "down";

  const tone = good
    ? { bg: "color-mix(in oklab, var(--kx-pink) 14%, transparent)", fg: "var(--kx-pink)" }
    : bad
      ? { bg: "color-mix(in oklab, var(--kx-danger) 14%, transparent)", fg: "var(--kx-danger)" }
      : { bg: "var(--kx-card-2)", fg: "var(--kx-fg-muted)" };

  const display =
    sign === "flat" ? "0" : `${value > 0 ? "+" : ""}${value}${unit ? unit : ""}`;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-extrabold tabular-nums",
        size === "sm" ? "h-5 px-1.5 text-[10.5px]" : "h-6 px-2 text-[11.5px]",
        className,
      )}
      style={{ background: tone.bg, color: tone.fg }}
      aria-label={
        label
          ? `${display} ${label}`
          : sign === "flat"
            ? "No change"
            : sign === "up"
              ? `Up ${value}`
              : `Down ${value}`
      }
    >
      {sign === "up" ? (
        <CaretUp size={size === "sm" ? 9 : 10} weight="bold" />
      ) : sign === "down" ? (
        <CaretDown size={size === "sm" ? 9 : 10} weight="bold" />
      ) : (
        <Minus size={size === "sm" ? 9 : 10} weight="bold" />
      )}
      <span>{display}</span>
      {label ? <span className="font-semibold opacity-80">{label}</span> : null}
    </span>
  );
}
