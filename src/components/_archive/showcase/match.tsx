"use client";

/* =====================================================================
   KX TRACK 4 · MATCH & COMPETITION
     - KxScorePicker          (enter final score for a fixture)
     - KxLeagueTable          (P W D L GF GA GD Pts standings)
     - KxMatchEventTimeline   (goals / cards / subs along the match clock)
   All scoped under .kx-root. Token-driven for light + dark.
   ===================================================================== */

import { useMemo, type ReactNode } from "react";
import {
  Minus,
  Plus,
  SoccerBall,
  Cards,
  ArrowsLeftRight,
  Flag,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

/* --------------------------- KxScorePicker --------------------------- */

export function KxScorePicker({
  home,
  away,
  homeName = "Home",
  awayName = "Away",
  onChange,
  max = 30,
  className,
}: {
  home: number;
  away: number;
  homeName?: string;
  awayName?: string;
  onChange?: (next: { home: number; away: number }) => void;
  max?: number;
  className?: string;
}) {
  const set = (k: "home" | "away", delta: number) => {
    const next = { home, away };
    next[k] = Math.max(0, Math.min(max, next[k] + delta));
    onChange?.(next);
  };

  return (
    <div
      className={cn(
        "relative flex items-stretch gap-2 rounded-[var(--kx-r-card)] border border-[var(--kx-border)] bg-[var(--kx-card)] p-3 sm:gap-4 sm:p-4",
        className,
      )}
    >
      <Side name={homeName} value={home} onInc={() => set("home", 1)} onDec={() => set("home", -1)} />
      <div className="flex flex-col items-center justify-center px-1">
        <span className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-[var(--kx-fg-muted)]">
          Full time
        </span>
        <span className="mt-1 [font-family:var(--kx-font-display)] text-2xl font-extrabold text-[var(--kx-fg-muted)]">
          —
        </span>
      </div>
      <Side name={awayName} value={away} onInc={() => set("away", 1)} onDec={() => set("away", -1)} />
    </div>
  );
}

function Side({
  name,
  value,
  onInc,
  onDec,
}: {
  name: string;
  value: number;
  onInc: () => void;
  onDec: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col items-center gap-2">
      <span className="line-clamp-1 max-w-full text-center text-[12.5px] font-semibold text-[var(--kx-fg-muted)]">
        {name}
      </span>
      <div className="flex items-center gap-2 sm:gap-3">
        <StepButton onClick={onDec} aria-label={`Subtract a goal from ${name}`}>
          <Minus size={16} weight="bold" />
        </StepButton>
        <span
          aria-live="polite"
          className="min-w-[3ch] text-center [font-family:var(--kx-font-display)] text-4xl font-extrabold tabular-nums text-[var(--kx-fg)] sm:text-5xl"
        >
          {value}
        </span>
        <StepButton onClick={onInc} aria-label={`Add a goal to ${name}`} pink>
          <Plus size={16} weight="bold" />
        </StepButton>
      </div>
    </div>
  );
}

function StepButton({
  children,
  onClick,
  pink,
  ...rest
}: {
  children: ReactNode;
  onClick?: () => void;
  pink?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "grid h-9 w-9 cursor-pointer place-items-center rounded-full outline-none transition-[background-color,color,box-shadow,transform] duration-200 ease-[var(--kx-ease)]",
        "active:scale-[0.94]",
        "focus-visible:shadow-[0_0_0_3px_var(--kx-ring)]",
        pink
          ? "bg-[var(--kx-pink)] text-[var(--kx-on-pink)] shadow-[var(--kx-shadow-pink)] hover:brightness-[1.05]"
          : "border border-[var(--kx-border)] bg-[var(--kx-card-2)] text-[var(--kx-fg)] hover:border-[var(--kx-border-strong)]",
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

/* --------------------------- KxLeagueTable --------------------------- */

export type LeagueRow = {
  rank: number;
  team: string;
  crest?: ReactNode; // Optional small crest node
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  /** Optional override; otherwise GF − GA. */
  gd?: number;
  /** Optional override; otherwise W*3 + D. */
  pts?: number;
  /** Tints the row's left edge to indicate status. */
  zone?: "promotion" | "playoff" | "relegation";
  /** Recent results, oldest → newest. */
  form?: ("W" | "D" | "L")[];
};

export function KxLeagueTable({
  rows,
  caption,
  highlightTeam,
  className,
}: {
  rows: LeagueRow[];
  caption?: string;
  highlightTeam?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[var(--kx-r-card)] border border-[var(--kx-border)] bg-[var(--kx-card)]",
        className,
      )}
    >
      {caption ? (
        <div className="flex items-center justify-between border-b border-[var(--kx-border)] px-4 py-3">
          <span className="text-[12.5px] font-semibold text-[var(--kx-fg)]">{caption}</span>
          <Legend />
        </div>
      ) : null}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[13px]">
          <thead className="bg-[var(--kx-card-2)]/60 text-[10.5px] font-bold uppercase tracking-[0.14em] text-[var(--kx-fg-muted)]">
            <tr>
              <Th className="w-10 text-center">#</Th>
              <Th>Team</Th>
              <Th className="text-center">P</Th>
              <Th className="text-center">W</Th>
              <Th className="text-center">D</Th>
              <Th className="text-center">L</Th>
              <Th className="text-center">GF</Th>
              <Th className="text-center">GA</Th>
              <Th className="text-center">GD</Th>
              <Th className="text-center text-[var(--kx-fg)]">Pts</Th>
              <Th className="hidden sm:table-cell">Form</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const gd = r.gd ?? r.gf - r.ga;
              const pts = r.pts ?? r.won * 3 + r.drawn;
              const isHi = !!highlightTeam && highlightTeam === r.team;
              return (
                <tr
                  key={`${r.rank}-${r.team}`}
                  className={cn(
                    "border-t border-[var(--kx-border)] transition-colors",
                    isHi
                      ? "bg-[color-mix(in_oklab,var(--kx-pink)_8%,transparent)]"
                      : "hover:bg-[var(--kx-card-2)]/60",
                  )}
                >
                  <td className="relative w-10 text-center">
                    <ZoneBar zone={r.zone} />
                    <span className="tabular-nums text-[var(--kx-fg-muted)]">{r.rank}</span>
                  </td>
                  <td className="py-2.5 pr-3">
                    <div className="flex items-center gap-2.5">
                      {r.crest ?? <CrestPlaceholder />}
                      <span className={cn("font-semibold", isHi ? "text-[var(--kx-pink)]" : "text-[var(--kx-fg)]")}>
                        {r.team}
                      </span>
                    </div>
                  </td>
                  <Td>{r.played}</Td>
                  <Td>{r.won}</Td>
                  <Td>{r.drawn}</Td>
                  <Td>{r.lost}</Td>
                  <Td>{r.gf}</Td>
                  <Td>{r.ga}</Td>
                  <Td className={cn(gd > 0 && "text-[var(--kx-success)]", gd < 0 && "text-[var(--kx-danger)]")}>
                    {gd > 0 ? `+${gd}` : gd}
                  </Td>
                  <Td className="font-extrabold text-[var(--kx-fg)]">{pts}</Td>
                  <td className="hidden py-2.5 pr-3 sm:table-cell">
                    {r.form ? <FormDots form={r.form} /> : <span className="text-[var(--kx-fg-muted)]">—</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Th({ children, className }: { children: ReactNode; className?: string }) {
  return <th className={cn("py-2.5 pr-3 first:pl-3 last:pr-3 font-bold", className)}>{children}</th>;
}

function Td({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <td className={cn("py-2.5 pr-3 text-center tabular-nums text-[var(--kx-fg)]", className)}>{children}</td>
  );
}

function CrestPlaceholder() {
  return (
    <span
      aria-hidden
      className="grid h-6 w-6 place-items-center rounded-full bg-[color-mix(in_oklab,var(--kx-blue)_14%,transparent)] text-[10px] font-extrabold text-[var(--kx-blue)]"
    >
      ●
    </span>
  );
}

function ZoneBar({ zone }: { zone?: LeagueRow["zone"] }) {
  if (!zone) return null;
  const color =
    zone === "promotion"
      ? "var(--kx-success)"
      : zone === "playoff"
        ? "var(--kx-pink)"
        : "var(--kx-danger)";
  return (
    <span
      aria-hidden
      className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full"
      style={{ background: color }}
    />
  );
}

function Legend() {
  return (
    <div className="flex items-center gap-3 text-[10.5px] font-bold uppercase tracking-[0.14em] text-[var(--kx-fg-muted)]">
      <span className="flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-[var(--kx-success)]" />
        Promotion
      </span>
      <span className="flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-[var(--kx-pink)]" />
        Playoff
      </span>
      <span className="flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-[var(--kx-danger)]" />
        Drop
      </span>
    </div>
  );
}

function FormDots({ form }: { form: ("W" | "D" | "L")[] }) {
  return (
    <div className="flex items-center gap-1">
      {form.slice(-5).map((r, i) => {
        const tone =
          r === "W" ? "var(--kx-success)" : r === "D" ? "var(--kx-fg-muted)" : "var(--kx-danger)";
        return (
          <span
            key={i}
            aria-label={r === "W" ? "Win" : r === "D" ? "Draw" : "Loss"}
            className="grid h-5 w-5 place-items-center rounded-full text-[9.5px] font-extrabold text-white"
            style={{ background: tone }}
          >
            {r}
          </span>
        );
      })}
    </div>
  );
}

/* --------------------------- KxMatchEventTimeline --------------------------- */

export type MatchEvent = {
  minute: number;
  side: "home" | "away";
  type: "goal" | "yellow" | "red" | "sub" | "kickoff" | "halftime" | "fulltime";
  player?: string;
  detail?: string; // assist, replaced player, etc.
};

export function KxMatchEventTimeline({
  events,
  className,
}: {
  events: MatchEvent[];
  className?: string;
}) {
  const sorted = useMemo(() => [...events].sort((a, b) => a.minute - b.minute), [events]);
  return (
    <ol
      className={cn(
        "relative flex flex-col gap-2 rounded-[var(--kx-r-card)] border border-[var(--kx-border)] bg-[var(--kx-card)] p-3 sm:p-4",
        className,
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-3 left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[var(--kx-border)] to-transparent"
      />
      {sorted.map((e, i) => (
        <EventRow key={i} ev={e} />
      ))}
    </ol>
  );
}

function EventRow({ ev }: { ev: MatchEvent }) {
  const isPhase = ev.type === "kickoff" || ev.type === "halftime" || ev.type === "fulltime";
  if (isPhase) {
    const label =
      ev.type === "kickoff" ? "Kick off" : ev.type === "halftime" ? "Half time" : "Full time";
    return (
      <li className="relative my-1 flex items-center justify-center">
        <span className="z-[1] flex items-center gap-2 rounded-full border border-[var(--kx-border)] bg-[var(--kx-card-2)] px-3 py-1 text-[10.5px] font-bold uppercase tracking-[0.14em] text-[var(--kx-fg-muted)]">
          <Flag size={12} weight="bold" />
          {label}
          <span className="tabular-nums text-[var(--kx-fg)]">{ev.minute}&apos;</span>
        </span>
      </li>
    );
  }

  const left = ev.side === "home";
  const icon = eventIcon(ev.type);

  return (
    <li className="relative grid grid-cols-[1fr_auto_1fr] items-center gap-2">
      {/* Left side */}
      <div className={cn("flex min-w-0 items-center gap-2", left ? "justify-end pr-2 text-right" : "")}>
        {left ? <EventBody ev={ev} icon={icon} align="right" /> : null}
      </div>
      {/* Minute pill */}
      <span className="z-[1] grid h-7 min-w-[2.25rem] place-items-center rounded-full border border-[var(--kx-border)] bg-[var(--kx-card)] px-2 text-[11px] font-extrabold tabular-nums text-[var(--kx-fg)]">
        {ev.minute}&apos;
      </span>
      {/* Right side */}
      <div className={cn("flex min-w-0 items-center gap-2", !left ? "pl-2" : "")}>
        {!left ? <EventBody ev={ev} icon={icon} align="left" /> : null}
      </div>
    </li>
  );
}

function EventBody({
  ev,
  icon,
  align,
}: {
  ev: MatchEvent;
  icon: ReactNode;
  align: "left" | "right";
}) {
  return (
    <div className={cn("flex min-w-0 items-center gap-2", align === "right" && "flex-row-reverse text-right")}>
      <span
        aria-hidden
        className="grid h-6 w-6 shrink-0 place-items-center rounded-full"
        style={{ background: eventBg(ev.type), color: eventFg(ev.type) }}
      >
        {icon}
      </span>
      <div className="min-w-0">
        {ev.player ? (
          <p className="truncate text-[13px] font-semibold text-[var(--kx-fg)]">{ev.player}</p>
        ) : null}
        {ev.detail ? (
          <p className="truncate text-[11.5px] text-[var(--kx-fg-muted)]">{ev.detail}</p>
        ) : null}
      </div>
    </div>
  );
}

function eventIcon(t: MatchEvent["type"]): ReactNode {
  switch (t) {
    case "goal":
      return <SoccerBall size={12} weight="bold" />;
    case "yellow":
    case "red":
      return <Cards size={12} weight="bold" />;
    case "sub":
      return <ArrowsLeftRight size={12} weight="bold" />;
    default:
      return <Flag size={12} weight="bold" />;
  }
}

function eventBg(t: MatchEvent["type"]): string {
  switch (t) {
    case "goal":
      return "color-mix(in oklab, var(--kx-pink) 18%, transparent)";
    case "yellow":
      return "color-mix(in oklab, var(--kx-warning) 22%, transparent)";
    case "red":
      return "color-mix(in oklab, var(--kx-danger) 22%, transparent)";
    case "sub":
      return "color-mix(in oklab, var(--kx-blue) 18%, transparent)";
    default:
      return "var(--kx-card-2)";
  }
}

function eventFg(t: MatchEvent["type"]): string {
  switch (t) {
    case "goal":
      return "var(--kx-pink)";
    case "yellow":
      return "var(--kx-warning)";
    case "red":
      return "var(--kx-danger)";
    case "sub":
      return "var(--kx-blue)";
    default:
      return "var(--kx-fg)";
  }
}
