"use client";

/* ---------------------------------------------------------------------
   Kalaanba — Site Hero (v2)

   Asymmetric three-column grid:
     Left rail (~96px)   — Zone pulse  : 4 micro-tiles N · E · W · S
     Center (~50%)       — The Moment  : Player of the Matchweek (editorial)
                           + Team of the Matchweek (compact, half-height)
     Right (~30%)        — Top performers + Top scorers list

   Below the hero, separate full-width section: Fixtures · Coming up.
   --------------------------------------------------------------------- */

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  CaretRight,
  CaretUp,
  CaretDown,
  Lightning,
  Minus,
  SealCheck,
  SoccerBall,
  Trophy,
  Users,
  WhatsappLogo,
} from "@phosphor-icons/react";

import { cn } from "@/lib/utils";
import { KxButton } from "@/components/showcase/primitives";
import { KxFixtureCardCompact } from "@/components/showcase/extras";
import { KxOdometer } from "@/components/showcase/motion";

/* ---------- Static demo content ---------- */

type ZoneId = "N" | "E" | "W" | "S";
type Zone = {
  id: ZoneId;
  name: string;
  leader: { short: string; color: string };
  delta: "up" | "down" | "flat";
};
const ZONES: Zone[] = [
  { id: "N", name: "North", leader: { short: "BAN", color: "var(--kx-pink)" },    delta: "up"   },
  { id: "E", name: "East",  leader: { short: "TIS", color: "var(--kx-blue)" },    delta: "flat" },
  { id: "W", name: "West",  leader: { short: "ABO", color: "var(--kx-success)" }, delta: "up"   },
  { id: "S", name: "South", leader: { short: "NYO", color: "var(--kx-warning)" }, delta: "down" },
];

const TOP_PERFORMERS = [
  { id: "p1", name: "Derek Osei",     stat: "Goals",   value: "4",   tone: "pink" as const, initial: "D" },
  { id: "p2", name: "Richard Somda",  stat: "Assists", value: "3",   tone: "blue" as const, initial: "R" },
  { id: "p3", name: "Yaw Mensah",     stat: "Rating",  value: "9.4", tone: "pink" as const, initial: "Y" },
];

const TOP_SCORERS = [
  { rank: 1, name: "Derek Osei",     club: "Bantama",   goals: 9, initial: "D" },
  { rank: 2, name: "Yaw Mensah",     club: "Sagnarigu", goals: 8, initial: "Y" },
  { rank: 3, name: "Kojo Boateng",   club: "Tishigu",   goals: 7, initial: "K" },
  { rank: 4, name: "Ibrahim Salifu", club: "Aboabo",    goals: 6, initial: "I" },
  { rank: 5, name: "Akwasi Owusu",   club: "Choggu",    goals: 6, initial: "A" },
];

/* ---------- Component ---------- */

export function SiteHero() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-[var(--kx-border)] bg-[var(--kx-bg)]">
        {/* Ambient pitch glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(60% 50% at 18% 0%, color-mix(in oklab, var(--kx-pink) 14%, transparent) 0%, transparent 60%), radial-gradient(60% 50% at 82% 0%, color-mix(in oklab, var(--kx-blue) 12%, transparent) 0%, transparent 60%)",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-6 sm:px-6 lg:pb-14 lg:pt-8">
          <div className="grid grid-cols-12 gap-4 lg:gap-5">
            {/* === Left rail — Zone pulse === */}
            <ZoneRail className="col-span-12 lg:col-span-1" />

            {/* === Center — The Moment === */}
            <div className="col-span-12 flex flex-col gap-4 lg:col-span-7 lg:gap-5">
              <SpotlightSplit />
              <TeamOfTheWeek />
            </div>

            {/* === Right — Top performers === */}
            <PerformersColumn className="col-span-12 lg:col-span-4" />
          </div>
        </div>
      </section>

      <ComingUp />
    </>
  );
}

/* ====================================================================
   LEFT RAIL — Zone pulse
   ==================================================================== */

function ZoneRail({ className }: { className?: string }) {
  const leadingId: ZoneId = "N";
  return (
    <aside className={cn("flex gap-2 lg:flex-col", className)}>
      {ZONES.map((z) => {
        const leading = z.id === leadingId;
        return (
          <Link
            key={z.id}
            href={`/zones/${z.name.toLowerCase()}`}
            className={cn(
              "group relative flex flex-1 flex-col items-center justify-between overflow-hidden rounded-[var(--kx-r-tile)]",
              "border border-[var(--kx-border)] bg-[var(--kx-card)] p-2 transition-colors",
              "hover:border-[var(--kx-border-strong)]",
              leading && "border-transparent",
            )}
            style={
              leading
                ? {
                    backgroundImage:
                      "linear-gradient(180deg, color-mix(in oklab, var(--kx-pink) 16%, var(--kx-card)) 0%, var(--kx-card) 100%)",
                  }
                : undefined
            }
            aria-label={`Zone ${z.name} — leader ${z.leader.short}`}
          >
            <span
              className={cn(
                "[font-family:var(--kx-font-display)] text-[20px] font-black leading-none tracking-tight",
                leading ? "text-[var(--kx-pink)]" : "text-[var(--kx-fg)]",
              )}
            >
              {z.id}
            </span>
            <span
              aria-hidden
              className="grid h-7 w-7 place-items-center rounded-full text-[9.5px] font-extrabold uppercase tracking-wider text-[var(--kx-on-pink)] [font-family:var(--kx-font-display)]"
              style={{
                background: z.leader.color,
                boxShadow:
                  "inset 0 0 0 1.5px color-mix(in oklab, white 20%, transparent)",
              }}
            >
              {z.leader.short}
            </span>
            <DeltaArrow delta={z.delta} leading={leading} />
          </Link>
        );
      })}
    </aside>
  );
}

function DeltaArrow({ delta, leading }: { delta: Zone["delta"]; leading: boolean }) {
  const cls = "h-3 w-3";
  if (delta === "up")
    return <CaretUp weight="fill" className={cn(cls, leading ? "text-[var(--kx-pink)]" : "text-[var(--kx-success)]")} />;
  if (delta === "down")
    return <CaretDown weight="fill" className={cn(cls, "text-[var(--kx-danger)]")} />;
  return <Minus weight="bold" className={cn(cls, "text-[var(--kx-fg-muted)]")} />;
}

/* ====================================================================
   CENTER — The Moment
   ==================================================================== */

/* ---------- shared share helpers ---------- */
const SHARE_TEXT =
  "Player of the Matchweek \u2014 Adaf (#17, Bantama Boys). 2 goals \u00b7 1 assist \u00b7 9.4 rating. Read on Kalaanba:";
const SHARE_URL = "https://kalaanba.com/players/adaf";
const WHATSAPP_HREF = `https://wa.me/?text=${encodeURIComponent(`${SHARE_TEXT} ${SHARE_URL}`)}`;

function WhatsAppShare({ tone = "on-photo" }: { tone?: "on-photo" | "on-card" }) {
  const onPhoto = tone === "on-photo";
  return (
    <a
      href={WHATSAPP_HREF}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Share on WhatsApp"
      title="Share on WhatsApp"
      className={cn(
        "inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-[12px] font-bold transition-transform hover:-translate-y-0.5",
        onPhoto
          ? "bg-[#25D366] text-black shadow-[0_4px_18px_-6px_rgba(37,211,102,0.65)]"
          : "bg-[#25D366] text-black shadow-[0_4px_14px_-6px_rgba(37,211,102,0.55)]",
      )}
    >
      <WhatsappLogo size={14} weight="fill" />
      Share
    </a>
  );
}

/* ---------- Spotlight — Split (photo + copy) ---------- */
function SpotlightSplit() {
  return (
    <article
      className={cn(
        "relative overflow-hidden rounded-[var(--kx-r-card)] border border-[var(--kx-border)]",
        "bg-[var(--kx-card)] shadow-[var(--kx-shadow-md)]",
      )}
    >
      <div className="grid grid-cols-1 sm:grid-cols-[4fr_7fr]">
        {/* LEFT — narrower photo column */}
        <div className="relative min-h-[280px] overflow-hidden bg-[color-mix(in_oklab,var(--kx-pink)_24%,black_8%)] sm:min-h-0">
          <Image
            src="/images/players/derek-osei.webp"
            alt="Derek Osei on the pitch"
            fill
            priority
            sizes="(min-width: 1024px) 24vw, (min-width: 640px) 36vw, 100vw"
            className="object-cover object-[50%_18%]"
          />
          <span
            aria-hidden
            className="absolute inset-0"
            style={{ background: "linear-gradient(180deg, transparent 45%, color-mix(in oklab, var(--kx-pink) 26%, transparent) 100%), linear-gradient(115deg, color-mix(in oklab, var(--kx-pink) 18%, transparent), transparent 55%)" }}
          />
          <span
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-24"
            style={{ background: "linear-gradient(180deg, transparent, color-mix(in oklab, black 55%, transparent))" }}
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-overlay"
            style={{ backgroundImage: "repeating-linear-gradient(115deg, white 0 18px, transparent 18px 36px)" }}
          />
          <span
            className={cn(
              "absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-2xl",
              "bg-[var(--kx-card)] [font-family:var(--kx-font-display)] text-[16px] font-extrabold tabular-nums",
              "text-[var(--kx-fg)] shadow-[var(--kx-shadow-md)]",
            )}
          >
            15
          </span>
          <div className="absolute inset-x-3 bottom-2.5">
            <span className="[font-family:var(--kx-font-display)] text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-white/90 drop-shadow">
              Bantama Boys
            </span>
          </div>
        </div>

        {/* RIGHT — copy stack */}
        <div className="relative flex flex-col gap-3.5 p-5 sm:p-6">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-[color-mix(in_oklab,var(--kx-success)_22%,transparent)] px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[var(--kx-success)]">
                <Lightning size={10} weight="fill" /> Matchweek 7
              </span>
              <span className="rounded-full bg-[var(--kx-card-2)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--kx-fg-muted)]">
                Winner
              </span>
            </div>
            <WhatsAppShare tone="on-card" />
          </div>

          <h2 className="[font-family:var(--kx-font-display)] text-[26px] font-black leading-[1.05] tracking-tight text-[var(--kx-fg)] sm:text-[32px]">
            Player of the <span className="text-[var(--kx-pink)]">Matchweek</span>
          </h2>

          <div className="-mt-1">
            <div className="flex items-center gap-2">
              <span className="[font-family:var(--kx-font-display)] text-[20px] font-extrabold tracking-tight text-[var(--kx-fg)]">
                Derek Osei
              </span>
              <SealCheck size={16} weight="fill" className="text-[var(--kx-blue)]" />
            </div>
            <div className="text-[12px] font-semibold text-[var(--kx-fg-muted)]">
              Forward · #15 · Bantama Boys · Tamale Premier League
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <MiniStat label="Goals"   value={2} />
            <MiniStat label="Assists" value={1} />
            <MiniStat label="Rating"  value="9.4" />
          </div>

          <div className="rounded-[var(--kx-r-tile)] border border-[var(--kx-border)] bg-[var(--kx-card)] px-3 py-2">
            <div className="flex items-center justify-between text-[11px] font-semibold text-[var(--kx-fg-muted)]">
              <span>Fan vote</span>
              <span className="tabular-nums text-[var(--kx-fg)]">
                <KxOdometer value={68} /> %
              </span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[var(--kx-card-2)]">
              <span
                aria-hidden
                className="block h-full rounded-full"
                style={{ width: "68%", background: "linear-gradient(90deg, var(--kx-pink), var(--kx-blue))" }}
              />
            </div>
          </div>

          <div className="mt-auto flex items-center gap-2 pt-1">
            <KxButton variant="primary" size="md" trailingIcon={<CaretRight size={14} weight="bold" />}>
              Read the story
            </KxButton>
            <Link
              href="#"
              className="rounded-full border border-[var(--kx-border)] bg-[var(--kx-card)] px-3 py-2 text-[12px] font-semibold text-[var(--kx-fg-muted)] transition-colors hover:border-[var(--kx-border-strong)] hover:text-[var(--kx-fg)]"
            >
              View profile
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

function MiniStat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-[var(--kx-r-tile)] border border-[var(--kx-border)] bg-[var(--kx-card)] px-3 py-2">
      <div className="[font-family:var(--kx-font-display)] text-[18px] font-extrabold tabular-nums tracking-tight text-[var(--kx-fg)]">
        <KxOdometer value={value} />
      </div>
      <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--kx-fg-muted)]">
        {label}
      </div>
    </div>
  );
}



/* === Team of the Matchweek (compact) === */

function TeamOfTheWeek() {
  return (
    <article
      className={cn(
        "relative overflow-hidden rounded-[var(--kx-r-card)] border border-[var(--kx-border)]",
        "bg-[var(--kx-card)] shadow-[var(--kx-shadow-sm)]",
      )}
    >
      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 px-4 py-3 sm:px-5 sm:py-4">
        <span
          aria-hidden
          className={cn(
            "grid h-14 w-14 shrink-0 place-items-center rounded-2xl",
            "[font-family:var(--kx-font-display)] text-[16px] font-extrabold uppercase tracking-wider text-[var(--kx-on-pink)]",
          )}
          style={{
            background: "var(--kx-blue)",
            boxShadow: "inset 0 0 0 2px color-mix(in oklab, white 20%, transparent)",
          }}
        >
          SAG
        </span>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-[color-mix(in_oklab,var(--kx-blue)_18%,transparent)] px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[var(--kx-blue)]">
              <Users size={10} weight="fill" />
              Team of the Matchweek
            </span>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span className="[font-family:var(--kx-font-display)] text-[18px] font-extrabold tracking-tight text-[var(--kx-fg)]">
              Sagnarigu Stars
            </span>
            <span className="rounded-full bg-[var(--kx-card-2)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--kx-fg-muted)]">
              W 3 · D 0 · L 0
            </span>
          </div>
          <div className="mt-0.5 text-[12px] font-semibold text-[var(--kx-fg-muted)]">
            Three wins, eight goals, one clean sheet — the form team in Tamale.
          </div>
        </div>

        <Link
          href="#"
          className="hidden shrink-0 items-center gap-1 rounded-full bg-[var(--kx-card-2)] px-3 py-1.5 text-[12px] font-bold text-[var(--kx-fg)] transition-colors hover:bg-[var(--kx-card)] sm:inline-flex"
        >
          View squad
          <CaretRight size={12} weight="bold" />
        </Link>
      </div>
    </article>
  );
}

/* ====================================================================
   RIGHT — Top performers + Top scorers
   ==================================================================== */

function PerformersColumn({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col gap-4 lg:gap-5", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="grid h-6 w-6 place-items-center rounded-full bg-[color-mix(in_oklab,var(--kx-pink)_18%,transparent)] text-[var(--kx-pink)]">
            <Trophy size={12} weight="fill" />
          </span>
          <span className="[font-family:var(--kx-font-display)] text-[14px] font-extrabold tracking-tight text-[var(--kx-fg)]">
            Top performers
          </span>
          <span className="text-[11px] font-semibold text-[var(--kx-fg-muted)]">
            · This week
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        {TOP_PERFORMERS.map((p) => (
          <Link
            key={p.id}
            href="#"
            className={cn(
              "group relative flex flex-col overflow-hidden rounded-[var(--kx-r-tile)]",
              "border border-[var(--kx-border)] bg-[var(--kx-card)] transition-colors",
              "hover:border-[var(--kx-border-strong)]",
            )}
          >
            <div
              className={cn(
                "relative h-20 overflow-hidden",
                p.tone === "pink"
                  ? "bg-[color-mix(in_oklab,var(--kx-pink)_22%,black_6%)]"
                  : "bg-[color-mix(in_oklab,var(--kx-blue)_22%,black_6%)]",
              )}
            >
              <span
                aria-hidden
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(115deg, color-mix(in oklab, white 14%, transparent) 0 12px, transparent 12px 24px)",
                }}
              />
              <span className="absolute inset-x-0 bottom-0 grid place-items-center [font-family:var(--kx-font-display)] text-[64px] font-black leading-none text-[color-mix(in_oklab,white_85%,transparent)]">
                {p.initial}
              </span>
            </div>
            <div className="flex flex-1 flex-col gap-0.5 p-2.5">
              <div className="truncate text-[12px] font-bold text-[var(--kx-fg)]">
                {p.name}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-[var(--kx-fg-muted)]">
                  {p.stat}
                </span>
                <span className="[font-family:var(--kx-font-display)] text-[14px] font-extrabold tabular-nums tracking-tight text-[var(--kx-fg)]">
                  {p.value}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <article
        className={cn(
          "flex flex-col overflow-hidden rounded-[var(--kx-r-card)] border border-[var(--kx-border)]",
          "bg-[var(--kx-card)] shadow-[var(--kx-shadow-sm)]",
        )}
      >
        <header className="flex items-center justify-between border-b border-[var(--kx-border)] px-4 py-2.5">
          <div className="flex items-center gap-2">
            <SoccerBall size={14} weight="fill" className="text-[var(--kx-pink)]" />
            <span className="[font-family:var(--kx-font-display)] text-[13px] font-extrabold tracking-tight text-[var(--kx-fg)]">
              Top scorers
            </span>
            <span className="text-[11px] font-semibold text-[var(--kx-fg-muted)]">
              · TPL
            </span>
          </div>
        </header>
        <ul className="divide-y divide-[var(--kx-border)]">
          {TOP_SCORERS.map((s) => (
            <li key={s.rank}>
              <Link
                href="#"
                className="grid grid-cols-[20px_28px_1fr_auto_auto] items-center gap-3 px-4 py-2 transition-colors hover:bg-[var(--kx-card-2)]"
              >
                <span className="text-[11px] font-extrabold tabular-nums text-[var(--kx-fg-muted)]">
                  {s.rank}
                </span>
                <span
                  aria-hidden
                  className="grid h-7 w-7 place-items-center rounded-full bg-[var(--kx-card-2)] [font-family:var(--kx-font-display)] text-[11px] font-extrabold text-[var(--kx-fg)]"
                >
                  {s.initial}
                </span>
                <div className="min-w-0">
                  <div className="truncate text-[12.5px] font-bold text-[var(--kx-fg)]">
                    {s.name}
                  </div>
                  <div className="truncate text-[10.5px] font-semibold text-[var(--kx-fg-muted)]">
                    {s.club}
                  </div>
                </div>
                <span className="[font-family:var(--kx-font-display)] text-[14px] font-extrabold tabular-nums tracking-tight text-[var(--kx-fg)]">
                  {s.goals}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wide text-[var(--kx-fg-muted)]">
                  G
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <footer className="flex items-center justify-end border-t border-[var(--kx-border)] bg-[var(--kx-card-2)] px-4 py-2">
          <Link
            href="#"
            className="inline-flex items-center gap-1 text-[11px] font-bold text-[var(--kx-fg)] hover:text-[var(--kx-pink)]"
          >
            Full leaderboard
            <ArrowUpRight size={11} weight="bold" />
          </Link>
        </footer>
      </article>
    </div>
  );
}

/* ====================================================================
   COMING UP — full-width fixtures section
   ==================================================================== */

type BucketId = "today" | "tomorrow" | "sat" | "sun" | "week" | "all";
type FixtureRow = {
  id: string;
  bucket: BucketId;
  kickoff: string;
  status: "scheduled" | "live" | "ft";
  scoreHome?: number; scoreAway?: number;
  home: { name: string; short: string; crestColor: string };
  away: { name: string; short: string; crestColor: string };
  competition: string;
};

const BUCKETS: { id: BucketId; label: string }[] = [
  { id: "today",    label: "Today" },
  { id: "tomorrow", label: "Tomorrow" },
  { id: "sat",      label: "Sat 3 May" },
  { id: "sun",      label: "Sun 4 May" },
  { id: "week",     label: "This week" },
  { id: "all",      label: "All" },
];

const FIXTURES: FixtureRow[] = [
  { id: "fl1", bucket: "today",    kickoff: "19:00", status: "live",      scoreHome: 1, scoreAway: 1,
    home: { name: "Choggu",     short: "CHO", crestColor: "var(--kx-blue)" },
    away: { name: "Vittin",     short: "VIT", crestColor: "var(--kx-pink)" },
    competition: "TPL" },
  { id: "fl2", bucket: "today",    kickoff: "20:30", status: "live",      scoreHome: 0, scoreAway: 2,
    home: { name: "Lamashegu",  short: "LAM", crestColor: "var(--kx-warning)" },
    away: { name: "Aboabo",     short: "ABO", crestColor: "var(--kx-success)" },
    competition: "Cup" },
  { id: "f1",  bucket: "tomorrow", kickoff: "16:00", status: "scheduled",
    home: { name: "Sakasaka",   short: "SAK", crestColor: "var(--kx-blue)" },
    away: { name: "Gumani",     short: "GUM", crestColor: "var(--kx-pink)" },
    competition: "TPL" },
  { id: "f2",  bucket: "sat",      kickoff: "14:00", status: "scheduled",
    home: { name: "Bantama",    short: "BAN", crestColor: "var(--kx-pink)" },
    away: { name: "Sagnarigu",  short: "SAG", crestColor: "var(--kx-blue)" },
    competition: "TPL" },
  { id: "f3",  bucket: "sat",      kickoff: "16:30", status: "scheduled",
    home: { name: "Aboabo",     short: "ABO", crestColor: "var(--kx-success)" },
    away: { name: "Gumani",     short: "GUM", crestColor: "var(--kx-warning)" },
    competition: "Cup" },
  { id: "f4",  bucket: "sun",      kickoff: "13:00", status: "scheduled",
    home: { name: "Tishigu",    short: "TIS", crestColor: "var(--kx-pink)" },
    away: { name: "Kakpagyili", short: "KAK", crestColor: "var(--kx-fg-muted)" },
    competition: "Zone B" },
  { id: "f5",  bucket: "sun",      kickoff: "15:30", status: "scheduled",
    home: { name: "Nyohini",    short: "NYO", crestColor: "var(--kx-blue)" },
    away: { name: "Kalpohini",  short: "KAL", crestColor: "var(--kx-danger)" },
    competition: "Zone B" },
];

function ComingUp() {
  const [active, setActive] = useState<BucketId>("today");

  const live = FIXTURES.filter((f) => f.status === "live");
  const visible = (() => {
    if (active === "all" || active === "week")
      return FIXTURES.filter((f) => f.status !== "live");
    return FIXTURES.filter((f) => f.bucket === active && f.status !== "live");
  })();

  return (
    <section className="border-b border-[var(--kx-border)] bg-[var(--kx-bg)]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
        <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-[color-mix(in_oklab,var(--kx-pink)_18%,transparent)] text-[var(--kx-pink)]">
              <SoccerBall size={14} weight="fill" />
            </span>
            <h2 className="[font-family:var(--kx-font-display)] text-[20px] font-extrabold tracking-tight text-[var(--kx-fg)]">
              Fixtures · <span className="text-[var(--kx-fg-muted)]">Coming up</span>
            </h2>
          </div>
          <Link
            href="/matches"
            className="inline-flex items-center gap-1 text-[12px] font-bold text-[var(--kx-fg)] hover:text-[var(--kx-pink)]"
          >
            View full schedule
            <ArrowUpRight size={12} weight="bold" />
          </Link>
        </header>

        <div className="mb-4 flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {BUCKETS.map((b) => {
            const sel = b.id === active;
            return (
              <button
                key={b.id}
                type="button"
                onClick={() => setActive(b.id)}
                className={cn(
                  "shrink-0 rounded-full border px-3 py-1.5 text-[12px] font-bold transition-colors",
                  sel
                    ? "border-transparent bg-[var(--kx-pink)] text-[var(--kx-on-pink)] shadow-[var(--kx-shadow-pink)]"
                    : "border-[var(--kx-border)] bg-[var(--kx-card)] text-[var(--kx-fg-muted)] hover:border-[var(--kx-border-strong)] hover:text-[var(--kx-fg)]",
                )}
              >
                {b.label}
              </button>
            );
          })}
        </div>

        {live.length > 0 ? (
          <>
            <div className="mb-3 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-[color-mix(in_oklab,var(--kx-pink)_18%,transparent)] px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[var(--kx-pink)]">
                <span
                  className="kx-alive h-1.5 w-1.5 rounded-full bg-[var(--kx-pink)]"
                  style={{ animation: "kx-pulse 1.6s ease-in-out infinite" }}
                />
                Live now
              </span>
              <span className="text-[11px] font-semibold text-[var(--kx-fg-muted)]">
                {live.length} match{live.length === 1 ? "" : "es"} in progress
              </span>
            </div>
            <ul className="mb-5 grid grid-cols-1 gap-2 md:grid-cols-2">
              {live.map((f) => (
                <li key={f.id}>
                  <KxFixtureCardCompact
                    home={f.home}
                    away={f.away}
                    status={f.status}
                    scoreHome={f.scoreHome}
                    scoreAway={f.scoreAway}
                    kickoff={f.kickoff}
                    competition={f.competition}
                  />
                </li>
              ))}
            </ul>
          </>
        ) : null}

        {visible.length === 0 ? (
          <div className="rounded-[var(--kx-r-card)] border border-dashed border-[var(--kx-border)] bg-[var(--kx-card)] px-6 py-10 text-center text-[12px] font-semibold text-[var(--kx-fg-muted)]">
            No fixtures in this window. Try another tab.
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {visible.map((f) => (
              <li key={f.id}>
                <KxFixtureCardCompact
                  home={f.home}
                  away={f.away}
                  status={f.status}
                  scoreHome={f.scoreHome}
                  scoreAway={f.scoreAway}
                  kickoff={f.kickoff}
                  competition={f.competition}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
