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

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  CalendarBlank,
  CaretRight,
  CaretUp,
  CaretDown,
  Compass,
  Eye,
  Fire,
  Lightning,
  MapPin,
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
  { id: "p1", name: "Derek Osei",     stat: "Goals",   value: "4",   tone: "pink" as const, initial: "D", headshot: "https://i.pravatar.cc/200?img=12" },
  { id: "p2", name: "Richard Somda",  stat: "Assists", value: "3",   tone: "blue" as const, initial: "R", headshot: "https://i.pravatar.cc/200?img=33" },
  { id: "p3", name: "Yaw Mensah",     stat: "Rating",  value: "9.4", tone: "pink" as const, initial: "Y", headshot: "https://i.pravatar.cc/200?img=68" },
];

const TOP_SCORERS = [
  { rank: 1, name: "Derek Osei",     club: "Bantama",   goals: 9, initial: "D", headshot: "https://i.pravatar.cc/120?img=12" },
  { rank: 2, name: "Yaw Mensah",     club: "Sagnarigu", goals: 8, initial: "Y", headshot: "https://i.pravatar.cc/120?img=68" },
  { rank: 3, name: "Kojo Boateng",   club: "Tishigu",   goals: 7, initial: "K", headshot: "https://i.pravatar.cc/120?img=15" },
  { rank: 4, name: "Ibrahim Salifu", club: "Aboabo",    goals: 6, initial: "I", headshot: "https://i.pravatar.cc/120?img=51" },
  { rank: 5, name: "Akwasi Owusu",   club: "Choggu",    goals: 6, initial: "A", headshot: "https://i.pravatar.cc/120?img=60" },
];

type SpotlightMode = "original" | "city-pulse";
const DEFAULT_SPOTLIGHT_MODE: SpotlightMode = "original";

/* ---------- Component ---------- */

export function SiteHero() {
  const [spotlightMode, setSpotlightMode] = useState<SpotlightMode>(DEFAULT_SPOTLIGHT_MODE);

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
              <SpotlightModeToggle value={spotlightMode} onChange={setSpotlightMode} />
              {spotlightMode === "city-pulse" ? <CityPulseSpotlight /> : <SpotlightSplit />}
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

function SpotlightModeToggle({
  value,
  onChange,
}: {
  value: SpotlightMode;
  onChange: (next: SpotlightMode) => void;
}) {
  const options: { value: SpotlightMode; label: string }[] = [
    { value: "original", label: "Original" },
    { value: "city-pulse", label: "City Pulse" },
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-full border border-[var(--kx-border)] bg-[var(--kx-card)] px-2 py-2 shadow-[var(--kx-shadow-sm)] sm:px-3">
      <span className="px-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[var(--kx-fg-muted)]">
        Spotlight reference
      </span>
      <div role="tablist" aria-label="Spotlight card style" className="flex rounded-full bg-[var(--kx-card-2)] p-1">
        {options.map((option) => {
          const selected = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => onChange(option.value)}
              className={cn(
                "rounded-full px-3 py-1.5 text-[11px] font-bold transition-colors",
                selected
                  ? "bg-[var(--kx-pink)] text-[var(--kx-on-pink)] shadow-[var(--kx-shadow-pink)]"
                  : "text-[var(--kx-fg-muted)] hover:text-[var(--kx-fg)]",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- shared share helpers ---------- */
const SHARE_TEXT =
  "Player of the Matchweek \u2014 Adaf (#17, Bantama Boys). 2 goals \u00b7 1 assist \u00b7 9.4 rating. Read on Kalaanba:";
const SHARE_URL = "https://kalaanba.com/players/adaf";
const WHATSAPP_HREF = `https://wa.me/?text=${encodeURIComponent(`${SHARE_TEXT} ${SHARE_URL}`)}`;

function whatsappHref(text: string, url: string) {
  return `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`;
}

function WhatsAppShare({
  tone = "on-photo",
  href = WHATSAPP_HREF,
  label = "Share",
}: {
  tone?: "on-photo" | "on-card";
  href?: string;
  label?: string;
}) {
  const onPhoto = tone === "on-photo";
  return (
    <a
      href={href}
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
      {label}
    </a>
  );
}

/* ---------- Spotlight experiment - City Pulse carousel ---------- */
const CITY_PULSE_SLIDES = [
  {
    id: "player",
    label: "Player",
    eyebrow: "City Pulse",
    title: "Tamale Player of the Week",
    caption: "Across verified matches - this week",
    accent: "var(--kx-pink)",
    shareHref: whatsappHref(
      "Tamale Player of the Week - Derek Osei. 2 goals, 1 assist, 9.4 rating. Read on Kalaanba:",
      "https://kalaanba.com/players/derek-osei",
    ),
  },
  {
    id: "challenge",
    label: "Challenge",
    eyebrow: "Club challenge",
    title: "Bantama Boys called out Sagnarigu Stars",
    caption: "Accepted - Saturday at Aliu Mahama Annex",
    accent: "var(--kx-danger)",
    shareHref: whatsappHref(
      "Bantama Boys called out Sagnarigu Stars. The challenge is live on Kalaanba:",
      "https://kalaanba.com/challenges/bantama-sagnarigu",
    ),
  },
  {
    id: "zone",
    label: "Zones",
    eyebrow: "Zone power map",
    title: "North Zone takes the lead",
    caption: "Area pride, verified weekly",
    accent: "var(--kx-blue)",
    shareHref: whatsappHref(
      "North Zone takes the lead in Tamale this week. Track the zone table on Kalaanba:",
      "https://kalaanba.com/zones/tamale",
    ),
  },
  {
    id: "match",
    label: "Match",
    eyebrow: "Match of the week",
    title: "Saturday belongs to Aboabo vs Lamashegu",
    caption: "The fixture everyone is watching",
    accent: "var(--kx-warning)",
    shareHref: whatsappHref(
      "Aboabo vs Lamashegu is the match of the week. Follow it on Kalaanba:",
      "https://kalaanba.com/matches/aboabo-lamashegu",
    ),
  },
] as const;

type CityPulseSlideId = (typeof CITY_PULSE_SLIDES)[number]["id"];

function CityPulseSpotlight() {
  const [active, setActive] = useState<CityPulseSlideId>("player");
  const activeIndex = Math.max(
    0,
    CITY_PULSE_SLIDES.findIndex((slide) => slide.id === active),
  );
  const activeSlide = CITY_PULSE_SLIDES[activeIndex] ?? CITY_PULSE_SLIDES[0];

  function move(delta: -1 | 1) {
    const next = (activeIndex + delta + CITY_PULSE_SLIDES.length) % CITY_PULSE_SLIDES.length;
    setActive(CITY_PULSE_SLIDES[next].id);
  }

  return (
    <article
      aria-label={`${activeSlide.title} spotlight`}
      className={cn(
        "relative min-h-[560px] overflow-hidden rounded-[var(--kx-r-card)] border border-[var(--kx-border)]",
        "bg-[var(--kx-card)] shadow-[var(--kx-shadow-md)] sm:min-h-[430px]",
      )}
      style={{
        backgroundImage: `radial-gradient(85% 70% at 0% 0%, color-mix(in oklab, ${activeSlide.accent} 22%, transparent) 0%, transparent 62%), radial-gradient(70% 58% at 100% 0%, color-mix(in oklab, var(--kx-blue) 13%, transparent) 0%, transparent 66%)`,
      }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-overlay"
        style={{
          backgroundImage:
            "linear-gradient(115deg, white 0 1px, transparent 1px 34px), linear-gradient(25deg, white 0 1px, transparent 1px 42px)",
        }}
      />

      <div className="relative flex min-h-[inherit] flex-col">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--kx-border)] px-4 py-3 sm:px-5">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span
                className="grid h-7 w-7 place-items-center rounded-full text-[var(--kx-on-pink)] shadow-[var(--kx-shadow-pink)]"
                style={{ background: activeSlide.accent }}
              >
                <Lightning size={13} weight="fill" />
              </span>
              <span className="[font-family:var(--kx-font-display)] text-[12px] font-extrabold uppercase tracking-[0.18em] text-[var(--kx-fg)]">
                {activeSlide.eyebrow}
              </span>
            </div>
            <p className="mt-1 truncate text-[11.5px] font-semibold text-[var(--kx-fg-muted)]">
              {activeSlide.caption}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div
              role="tablist"
              aria-label="City Pulse cards"
              className="hidden rounded-full bg-[var(--kx-card-2)] p-1 sm:flex"
            >
              {CITY_PULSE_SLIDES.map((slide) => {
                const selected = slide.id === active;
                return (
                  <button
                    key={slide.id}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    aria-controls={`city-pulse-${slide.id}`}
                    onClick={() => setActive(slide.id)}
                    className={cn(
                      "rounded-full px-3 py-1.5 text-[11px] font-bold transition-colors",
                      selected
                        ? "bg-[var(--kx-card)] text-[var(--kx-fg)] shadow-[var(--kx-shadow-sm)]"
                        : "text-[var(--kx-fg-muted)] hover:text-[var(--kx-fg)]",
                    )}
                  >
                    {slide.label}
                  </button>
                );
              })}
            </div>
            <WhatsAppShare tone="on-card" href={activeSlide.shareHref} />
          </div>
        </header>

        <div
          id={`city-pulse-${activeSlide.id}`}
          role="tabpanel"
          className="min-h-0 flex-1"
          key={activeSlide.id}
          style={{ animation: "kx-pop-in 0.28s var(--kx-ease-out) both" }}
        >
          {activeSlide.id === "player" ? <CityPulsePlayerSlide /> : null}
          {activeSlide.id === "challenge" ? <CityPulseChallengeSlide /> : null}
          {activeSlide.id === "zone" ? <CityPulseZoneSlide /> : null}
          {activeSlide.id === "match" ? <CityPulseMatchSlide /> : null}
        </div>

        <footer className="flex items-center justify-between gap-3 border-t border-[var(--kx-border)] bg-[color-mix(in_oklab,var(--kx-card)_82%,transparent)] px-4 py-3 sm:px-5">
          <div className="flex items-center gap-1.5">
            {CITY_PULSE_SLIDES.map((slide, index) => {
              const selected = slide.id === active;
              return (
                <button
                  key={slide.id}
                  type="button"
                  aria-label={`Show ${slide.label}`}
                  onClick={() => setActive(slide.id)}
                  className={cn(
                    "h-2.5 rounded-full transition-[width,background-color] duration-300",
                    selected ? "w-7 bg-[var(--kx-pink)]" : "w-2.5 bg-[var(--kx-card-2)] hover:bg-[var(--kx-fg-muted)]",
                  )}
                >
                  <span className="sr-only">{index + 1}</span>
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold tabular-nums text-[var(--kx-fg-muted)]">
              {activeIndex + 1} / {CITY_PULSE_SLIDES.length}
            </span>
            <button
              type="button"
              aria-label="Previous City Pulse card"
              onClick={() => move(-1)}
              className="grid h-8 w-8 place-items-center rounded-full bg-[var(--kx-card-2)] text-[var(--kx-fg-muted)] transition-colors hover:text-[var(--kx-fg)]"
            >
              <CaretRight size={14} weight="bold" className="rotate-180" />
            </button>
            <button
              type="button"
              aria-label="Next City Pulse card"
              onClick={() => move(1)}
              className="grid h-8 w-8 place-items-center rounded-full bg-[var(--kx-card-2)] text-[var(--kx-fg-muted)] transition-colors hover:text-[var(--kx-fg)]"
            >
              <CaretRight size={14} weight="bold" />
            </button>
          </div>
        </footer>
      </div>
    </article>
  );
}

/* ---------- Fallback spotlight - original split card ---------- */

const SPOTLIGHT_SLIDES = [
  { id: "player",    label: "Player",    accent: "var(--kx-pink)"    },
  { id: "challenge", label: "Challenge", accent: "var(--kx-danger)"  },
  { id: "zones",     label: "Zones",     accent: "var(--kx-blue)"    },
  { id: "match",     label: "Match",     accent: "var(--kx-warning)" },
] as const;

type SpotlightSlideId = (typeof SPOTLIGHT_SLIDES)[number]["id"];

const SLIDE_INTERVAL_MS = 5000;

function SpotlightSplit() {
  const [active, setActive] = useState<SpotlightSlideId>("player");
  const [direction, setDirection] = useState<1 | -1>(1);
  const [paused, setPaused] = useState(false);
  const articleRef = useRef<HTMLElement | null>(null);

  const idx = Math.max(0, SPOTLIGHT_SLIDES.findIndex((s) => s.id === active));

  function go(delta: 1 | -1) {
    setDirection(delta);
    const next = (idx + delta + SPOTLIGHT_SLIDES.length) % SPOTLIGHT_SLIDES.length;
    setActive(SPOTLIGHT_SLIDES[next].id);
  }

  function jump(id: SpotlightSlideId) {
    const ni = SPOTLIGHT_SLIDES.findIndex((s) => s.id === id);
    if (ni === idx) return;
    setDirection(ni > idx ? 1 : -1);
    setActive(id);
  }

  // Auto-advance every SLIDE_INTERVAL_MS, paused while user is pressing.
  useEffect(() => {
    if (paused) return;
    const t = window.setTimeout(() => {
      setDirection(1);
      const next = (idx + 1) % SPOTLIGHT_SLIDES.length;
      setActive(SPOTLIGHT_SLIDES[next].id);
    }, SLIDE_INTERVAL_MS);
    return () => window.clearTimeout(t);
  }, [active, idx, paused]);

  const dots = (
    <SlideDots
      active={active}
      onJump={jump}
      progressKey={active + (paused ? "-paused" : "-running")}
      paused={paused}
    />
  );

  return (
    <article
      ref={articleRef}
      className={cn(
        "relative overflow-hidden rounded-[var(--kx-r-card)] border border-[var(--kx-border)]",
        "bg-[var(--kx-card)] shadow-[var(--kx-shadow-md)] select-none",
      )}
      onPointerDown={() => setPaused(true)}
      onPointerUp={() => setPaused(false)}
      onPointerLeave={() => setPaused(false)}
      onPointerCancel={() => setPaused(false)}
    >
      <div
        key={active}
        style={{
          animation: `${direction === 1 ? "kx-slide-in-right" : "kx-slide-in-left"} 0.36s var(--kx-ease-out) both`,
        }}
      >
        {active === "player"    && <SpotlightPlayerSlide    dots={dots} />}
        {active === "challenge" && <SpotlightChallengeSlide dots={dots} />}
        {active === "zones"     && <SpotlightZonesSlide     dots={dots} />}
        {active === "match"     && <SpotlightMatchSlide     dots={dots} />}
      </div>
    </article>
  );
}

/* ---------- Slide dots (lives inside each slide's action row) ---------- */

function SlideDots({
  active,
  onJump,
  progressKey,
  paused,
}: {
  active: SpotlightSlideId;
  onJump: (id: SpotlightSlideId) => void;
  progressKey: string;
  paused: boolean;
}) {
  return (
    <div
      role="tablist"
      aria-label="Spotlight slides"
      className="flex items-center gap-1.5"
    >
      {SPOTLIGHT_SLIDES.map((slide) => {
        const selected = slide.id === active;
        return (
          <button
            key={slide.id}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-label={`Show ${slide.label}`}
            onClick={(e) => {
              // Prevent the article's pointer-down pause from sticking.
              e.stopPropagation();
              onJump(slide.id);
            }}
            onPointerDown={(e) => e.stopPropagation()}
            className={cn(
              "relative h-2.5 overflow-hidden rounded-full transition-[width] duration-300",
              selected ? "w-9" : "w-2.5",
            )}
            style={{
              background: selected
                ? "var(--kx-card-2)"
                : "var(--kx-card-2)",
              boxShadow: selected
                ? `inset 0 0 0 1px color-mix(in oklab, ${slide.accent} 50%, transparent)`
                : undefined,
            }}
          >
            {selected ? (
              <span
                key={progressKey}
                aria-hidden
                className="absolute inset-y-0 left-0 block rounded-full"
                style={{
                  background: slide.accent,
                  width: "100%",
                  animation: paused
                    ? "none"
                    : `kx-slide-progress ${SLIDE_INTERVAL_MS}ms linear forwards`,
                }}
              />
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

/* ---------- Shared shell + corner badge ---------- */

function SlideShell({
  mediaBg,
  media,
  mediaCaption,
  badge,
  children,
}: {
  mediaBg: string;
  media: ReactNode;
  mediaCaption?: ReactNode;
  badge?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[4fr_7fr]">
      <div
        className="relative min-h-[280px] p-3 sm:min-h-0 sm:p-4"
        style={{ background: mediaBg }}
      >
        <div className="relative h-full w-full overflow-hidden rounded-[var(--kx-r-tile)]">
          {media}
          {badge ? <div className="absolute right-3 top-3 z-10">{badge}</div> : null}
          {mediaCaption ? (
            <div className="absolute inset-x-3 bottom-2.5">{mediaCaption}</div>
          ) : null}
        </div>
      </div>

      <div className="relative flex flex-col gap-3.5 p-5 sm:p-6">
        {children}
      </div>
    </div>
  );
}

function CornerBadge({
  children,
  accent = "var(--kx-pink)",
}: {
  children: ReactNode;
  accent?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "grid h-12 min-w-[3rem] place-items-center rounded-2xl px-2",
        "[font-family:var(--kx-font-display)] text-[20px] font-black leading-none tabular-nums tracking-tight",
        "text-[var(--kx-on-pink)]",
      )}
      style={{
        background: `linear-gradient(160deg, color-mix(in oklab, ${accent} 92%, white 8%), color-mix(in oklab, ${accent} 78%, black 12%))`,
        boxShadow: "inset 0 0 0 1px color-mix(in oklab, white 22%, transparent)",
      }}
    >
      {children}
    </span>
  );
}

/* ---------- Slide 1 — Player of the Matchweek ---------- */

function SpotlightPlayerSlide({ dots }: { dots?: ReactNode }) {
  return (
    <SlideShell
      mediaBg=""
      badge={<CornerBadge>15</CornerBadge>}
      media={
        <>
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
            style={{
              background:
                "linear-gradient(180deg, transparent 45%, color-mix(in oklab, var(--kx-pink) 26%, transparent) 100%), linear-gradient(115deg, color-mix(in oklab, var(--kx-pink) 18%, transparent), transparent 55%)",
            }}
          />
          <span
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-24"
            style={{
              background:
                "linear-gradient(180deg, transparent, color-mix(in oklab, black 55%, transparent))",
            }}
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-overlay"
            style={{
              backgroundImage:
                "repeating-linear-gradient(115deg, white 0 18px, transparent 18px 36px)",
            }}
          />
        </>
      }
      mediaCaption={
        <span className="[font-family:var(--kx-font-display)] text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-white/90 drop-shadow">
          Bantama Boys
        </span>
      }
    >
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
            style={{
              width: "68%",
              background: "linear-gradient(90deg, var(--kx-pink), var(--kx-blue))",
            }}
          />
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-2">
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
        {dots}
      </div>
    </SlideShell>
  );
}

/* ---------- Slide 2 — Most-anticipated Challenge (soccer bout layout) ---------- */

function SpotlightChallengeSlide({ dots }: { dots?: ReactNode }) {
  return (
    <div className="relative flex min-h-[460px] flex-col gap-4 p-5 sm:p-6">
      {/* Ambient bout glow */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 18% 20%, color-mix(in oklab, var(--kx-danger) 16%, transparent) 0%, transparent 60%), radial-gradient(60% 50% at 82% 20%, color-mix(in oklab, var(--kx-blue) 14%, transparent) 0%, transparent 60%)",
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage:
            "linear-gradient(0deg, white 0 1px, transparent 1px 22px), linear-gradient(90deg, white 0 1px, transparent 1px 22px)",
        }}
      />

      {/* Header */}
      <div className="relative flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-[color-mix(in_oklab,var(--kx-danger)_22%,transparent)] px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[var(--kx-danger)]">
            <Fire size={10} weight="fill" /> Most anticipated
          </span>
          <span className="rounded-full bg-[var(--kx-card-2)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--kx-fg-muted)]">
            Accepted
          </span>
        </div>
        <WhatsAppShare
          tone="on-card"
          href={whatsappHref(
            "Bantama Boys called out Sagnarigu Stars - Saturday at Aliu Mahama Annex. Follow on Kalaanba:",
            "https://kalaanba.com/challenges/bantama-sagnarigu",
          )}
        />
      </div>

      {/* Title */}
      <h2 className="relative [font-family:var(--kx-font-display)] text-[26px] font-black leading-[1.05] tracking-tight text-[var(--kx-fg)] sm:text-[32px]">
        Bantama called out <span className="text-[var(--kx-danger)]">Sagnarigu</span>
      </h2>

      {/* Bout arena: home crest · VS · away crest */}
      <div className="relative grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-4">
        <BoutSide
          align="left"
          color="var(--kx-pink)"
          short="BAN"
          name="Bantama Boys"
          tagline="The North callers"
          form={["W", "W", "D", "L", "W"]}
          rank={1}
        />

        <BoutVs />

        <BoutSide
          align="right"
          color="var(--kx-blue)"
          short="SAG"
          name="Sagnarigu Stars"
          tagline="Reigning champs"
          form={["W", "W", "W", "D", "W"]}
          rank={2}
        />
      </div>

      {/* Fixture meta strip */}
      <div className="relative grid grid-cols-3 gap-2">
        <BoutMeta label="Kickoff"  value="Sat · 4:30 PM" />
        <BoutMeta label="Venue"    value="Aliu Mahama Annex" icon={<MapPin size={11} weight="fill" />} />
        <BoutMeta label="H2H"      value="Bantama 3-2" />
      </div>

      {/* Hype meter */}
      <div className="relative rounded-[var(--kx-r-tile)] border border-[var(--kx-border)] bg-[var(--kx-card)] px-3 py-2">
        <div className="flex items-center justify-between text-[11px] font-semibold text-[var(--kx-fg-muted)]">
          <span className="inline-flex items-center gap-1">
            <Fire size={11} weight="fill" className="text-[var(--kx-danger)]" /> Hype meter
          </span>
          <span className="tabular-nums text-[var(--kx-fg)]">
            <KxOdometer value={84} /> %
          </span>
        </div>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[var(--kx-card-2)]">
          <span
            aria-hidden
            className="block h-full rounded-full"
            style={{
              width: "84%",
              background:
                "linear-gradient(90deg, var(--kx-danger), var(--kx-warning))",
            }}
          />
        </div>
      </div>

      {/* Action row + dots */}
      <div className="relative mt-auto flex items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-2">
          <KxButton variant="primary" size="md" trailingIcon={<CaretRight size={14} weight="bold" />}>
            See the call-out
          </KxButton>
          <Link
            href="#"
            className="rounded-full border border-[var(--kx-border)] bg-[var(--kx-card)] px-3 py-2 text-[12px] font-semibold text-[var(--kx-fg-muted)] transition-colors hover:border-[var(--kx-border-strong)] hover:text-[var(--kx-fg)]"
          >
            All challenges
          </Link>
        </div>
        {dots}
      </div>
    </div>
  );
}

function BoutSide({
  align,
  color,
  short,
  name,
  tagline,
  form,
  rank,
}: {
  align: "left" | "right";
  color: string;
  short: string;
  name: string;
  tagline: string;
  form: ("W" | "D" | "L")[];
  rank: number;
}) {
  const right = align === "right";
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2 sm:gap-2.5",
        right ? "sm:items-end" : "sm:items-start",
      )}
    >
      {/* Crest */}
      <div
        className="relative grid h-20 w-20 place-items-center rounded-2xl sm:h-24 sm:w-24"
        style={{
          background: `linear-gradient(160deg, color-mix(in oklab, ${color} 90%, white 10%), color-mix(in oklab, ${color} 70%, black 18%))`,
          boxShadow: `inset 0 0 0 1.5px color-mix(in oklab, white 22%, transparent), 0 10px 24px -12px color-mix(in oklab, ${color} 60%, transparent)`,
        }}
      >
        <span className="[font-family:var(--kx-font-display)] text-[28px] font-black tracking-tight text-white sm:text-[32px]">
          {short}
        </span>
        <span
          className="absolute -bottom-1.5 right-1.5 grid h-6 w-6 place-items-center rounded-full bg-[var(--kx-card)] [font-family:var(--kx-font-display)] text-[10px] font-black text-[var(--kx-fg)] shadow-[var(--kx-shadow-sm)]"
          aria-label={`League position ${rank}`}
        >
          #{rank}
        </span>
      </div>

      <div className={cn("min-w-0 text-center", right ? "sm:text-right" : "sm:text-left")}>
        <div className="truncate [font-family:var(--kx-font-display)] text-[14px] font-extrabold tracking-tight text-[var(--kx-fg)] sm:text-[15px]">
          {name}
        </div>
        <div className="truncate text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[var(--kx-fg-muted)]">
          {tagline}
        </div>
      </div>

      <div className={cn("flex items-center gap-1", right ? "sm:flex-row-reverse" : "")}>
        {form.map((r, i) => (
          <span
            key={i}
            aria-label={r === "W" ? "Win" : r === "D" ? "Draw" : "Loss"}
            className="grid h-4 w-4 place-items-center rounded-full text-[8px] font-extrabold text-white"
            style={{
              background:
                r === "W"
                  ? "var(--kx-success)"
                  : r === "D"
                    ? "var(--kx-fg-muted)"
                    : "var(--kx-danger)",
            }}
          >
            {r}
          </span>
        ))}
      </div>
    </div>
  );
}

function BoutVs() {
  return (
    <div className="relative flex flex-col items-center gap-1.5">
      <span
        className={cn(
          "grid h-12 w-12 place-items-center rounded-full sm:h-14 sm:w-14",
          "[font-family:var(--kx-font-display)] text-[16px] font-black tracking-[0.05em] text-white sm:text-[18px]",
        )}
        style={{
          background:
            "linear-gradient(160deg, color-mix(in oklab, var(--kx-danger) 92%, white 8%), color-mix(in oklab, var(--kx-danger) 70%, black 18%))",
          boxShadow:
            "inset 0 0 0 1.5px color-mix(in oklab, white 25%, transparent), 0 8px 22px -10px color-mix(in oklab, var(--kx-danger) 70%, transparent)",
        }}
      >
        VS
      </span>
      <span className="inline-flex items-center gap-1 rounded-full bg-black/55 px-2 py-0.5 text-[9.5px] font-extrabold uppercase tracking-[0.18em] text-white backdrop-blur">
        <SoccerBall size={10} weight="fill" /> MW8
      </span>
    </div>
  );
}

function BoutMeta({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: ReactNode;
}) {
  return (
    <div className="rounded-[var(--kx-r-tile)] border border-[var(--kx-border)] bg-[var(--kx-card)] px-3 py-2">
      <div className="flex items-center gap-1 text-[9.5px] font-bold uppercase tracking-[0.14em] text-[var(--kx-fg-muted)]">
        {icon} {label}
      </div>
      <div className="mt-0.5 truncate [font-family:var(--kx-font-display)] text-[13px] font-extrabold tracking-tight text-[var(--kx-fg)]">
        {value}
      </div>
    </div>
  );
}

/* ---------- Slide 3 — Zones (Tamale map) ---------- */

function SpotlightZonesSlide({ dots }: { dots?: ReactNode }) {
  return (
    <SlideShell
      mediaBg="color-mix(in oklab, var(--kx-blue) 18%, black 10%)"
      badge={<CornerBadge accent="var(--kx-blue)">N</CornerBadge>}
      media={
        <>
          <span
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(80% 60% at 30% 20%, color-mix(in oklab, var(--kx-blue) 28%, transparent), transparent 60%), linear-gradient(160deg, color-mix(in oklab, black 30%, transparent), transparent)",
            }}
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.10] mix-blend-overlay"
            style={{
              backgroundImage:
                "linear-gradient(0deg, white 0 1px, transparent 1px 22px), linear-gradient(90deg, white 0 1px, transparent 1px 22px)",
            }}
          />
          <TamaleZoneMap leadingZone="N" />
        </>
      }
      mediaCaption={
        <div className="flex items-center justify-between">
          <span className="[font-family:var(--kx-font-display)] text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-white/90 drop-shadow">
            Tamale Metro
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-white backdrop-blur">
            <Compass size={10} weight="fill" /> 4 zones
          </span>
        </div>
      }
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-[color-mix(in_oklab,var(--kx-blue)_22%,transparent)] px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[var(--kx-blue)]">
            <Compass size={10} weight="fill" /> Zone power
          </span>
          <span className="rounded-full bg-[var(--kx-card-2)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--kx-fg-muted)]">
            Updated weekly
          </span>
        </div>
        <WhatsAppShare
          tone="on-card"
          href={whatsappHref(
            "North Zone takes the lead in Tamale this week. Track the zone table on Kalaanba:",
            "https://kalaanba.com/zones/tamale",
          )}
        />
      </div>

      <h2 className="[font-family:var(--kx-font-display)] text-[26px] font-black leading-[1.05] tracking-tight text-[var(--kx-fg)] sm:text-[32px]">
        North Zone takes the <span className="text-[var(--kx-blue)]">lead</span>
      </h2>

      <div className="-mt-1">
        <div className="flex items-center gap-2">
          <span className="[font-family:var(--kx-font-display)] text-[20px] font-extrabold tracking-tight text-[var(--kx-fg)]">
            Bantama, Choggu, Kalpohin
          </span>
        </div>
        <div className="text-[12px] font-semibold text-[var(--kx-fg-muted)]">
          12 verified clubs · 47 results this week
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        <ZoneTile id="N" name="North" lead score={32} accent="var(--kx-pink)" />
        <ZoneTile id="E" name="East"  score={28} accent="var(--kx-blue)" />
        <ZoneTile id="W" name="West"  score={26} accent="var(--kx-success)" />
        <ZoneTile id="S" name="South" score={21} accent="var(--kx-warning)" />
      </div>

      <div className="mt-auto flex items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-2">
          <KxButton variant="primary" size="md" trailingIcon={<CaretRight size={14} weight="bold" />}>
            Open zone table
          </KxButton>
          <Link
            href="#"
            className="rounded-full border border-[var(--kx-border)] bg-[var(--kx-card)] px-3 py-2 text-[12px] font-semibold text-[var(--kx-fg-muted)] transition-colors hover:border-[var(--kx-border-strong)] hover:text-[var(--kx-fg)]"
          >
            Pick your zone
          </Link>
        </div>
        {dots}
      </div>
    </SlideShell>
  );
}

function ZoneTile({
  id,
  name,
  score,
  accent,
  lead = false,
}: {
  id: ZoneId;
  name: string;
  score: number;
  accent: string;
  lead?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[var(--kx-r-tile)] border px-2 py-2",
        lead ? "border-transparent" : "border-[var(--kx-border)] bg-[var(--kx-card)]",
      )}
      style={
        lead
          ? {
              backgroundImage: `linear-gradient(180deg, color-mix(in oklab, ${accent} 22%, var(--kx-card)) 0%, var(--kx-card) 100%)`,
              boxShadow: `inset 0 0 0 1px color-mix(in oklab, ${accent} 50%, transparent)`,
            }
          : undefined
      }
    >
      <div className="flex items-center justify-between">
        <span
          className="[font-family:var(--kx-font-display)] text-[16px] font-black leading-none tracking-tight"
          style={{ color: lead ? accent : "var(--kx-fg)" }}
        >
          {id}
        </span>
        {lead ? (
          <span
            className="rounded-full px-1.5 py-[1px] text-[8.5px] font-extrabold uppercase tracking-[0.14em] text-[var(--kx-on-pink)]"
            style={{ background: accent }}
          >
            Lead
          </span>
        ) : null}
      </div>
      <div className="mt-1 [font-family:var(--kx-font-display)] text-[18px] font-extrabold tabular-nums text-[var(--kx-fg)]">
        {score}
      </div>
      <div className="text-[9.5px] font-bold uppercase tracking-[0.14em] text-[var(--kx-fg-muted)]">
        {name}
      </div>
    </div>
  );
}

/** Abstract Tamale-shaped map with N / E / S / W highlighted regions. */
function TamaleZoneMap({ leadingZone = "N" }: { leadingZone?: ZoneId }) {
  // Stylized organic blob roughly suggestive of Tamale Metro.
  const outline =
    "M 42 28 C 78 14, 128 12, 162 34 C 188 54, 196 96, 188 134 C 178 178, 150 210, 110 222 C 72 232, 36 218, 22 184 C 8 148, 8 102, 18 70 C 24 50, 30 38, 42 28 Z";
  const cx = 100;
  const cy = 120;
  // 4 wedges from center to bounding-box corners (clipped to outline)
  const wedges: { id: ZoneId; d: string; accent: string; label: { x: number; y: number } }[] = [
    { id: "N", d: `M ${cx} ${cy} L 0 0 L 200 0 Z`,     accent: "var(--kx-pink)",    label: { x: 100, y: 46 } },
    { id: "E", d: `M ${cx} ${cy} L 200 0 L 200 240 Z`, accent: "var(--kx-blue)",    label: { x: 158, y: 124 } },
    { id: "S", d: `M ${cx} ${cy} L 200 240 L 0 240 Z`, accent: "var(--kx-warning)", label: { x: 100, y: 196 } },
    { id: "W", d: `M ${cx} ${cy} L 0 240 L 0 0 Z`,     accent: "var(--kx-success)", label: { x: 42, y: 124 } },
  ];

  return (
    <svg
      viewBox="0 0 200 240"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
      aria-label="Tamale zone map"
    >
      <defs>
        <clipPath id="tamale-clip">
          <path d={outline} />
        </clipPath>
        <filter id="tamale-soften" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="0.4" />
        </filter>
      </defs>

      {/* Glow halo behind blob */}
      <path
        d={outline}
        fill="color-mix(in oklab, var(--kx-blue) 18%, transparent)"
        transform="translate(0 6)"
        opacity="0.55"
      />

      <g clipPath="url(#tamale-clip)" filter="url(#tamale-soften)">
        {wedges.map((w) => {
          const lead = w.id === leadingZone;
          return (
            <path
              key={w.id}
              d={w.d}
              fill={`color-mix(in oklab, ${w.accent} ${lead ? 70 : 38}%, transparent)`}
              stroke="color-mix(in oklab, white 18%, transparent)"
              strokeWidth="0.6"
            />
          );
        })}
      </g>

      {/* Blob outline on top */}
      <path
        d={outline}
        fill="none"
        stroke="color-mix(in oklab, white 32%, transparent)"
        strokeWidth="1.2"
      />

      {/* Cardinal labels */}
      {wedges.map((w) => {
        const lead = w.id === leadingZone;
        return (
          <g key={`lbl-${w.id}`}>
            <circle
              cx={w.label.x}
              cy={w.label.y}
              r={lead ? 11 : 9}
              fill={lead ? w.accent : "color-mix(in oklab, black 35%, transparent)"}
              stroke="color-mix(in oklab, white 30%, transparent)"
              strokeWidth="0.8"
            />
            <text
              x={w.label.x}
              y={w.label.y + 3.5}
              textAnchor="middle"
              fontSize={lead ? 11 : 10}
              fontWeight={900}
              fill="white"
              style={{ fontFamily: "var(--kx-font-display)", letterSpacing: "0.04em" }}
            >
              {w.id}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ---------- Slide 4 — Match to Watch ---------- */

function SpotlightMatchSlide({ dots }: { dots?: ReactNode }) {
  const [following, setFollowing] = useState(false);
  const baseWatchers = 487;
  const watchers = baseWatchers + (following ? 1 : 0);

  return (
    <SlideShell
      mediaBg="color-mix(in oklab, var(--kx-warning) 22%, black 10%)"
      badge={<CornerBadge accent="var(--kx-warning)">SAT</CornerBadge>}
      media={
        <>
          <span
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(70% 55% at 50% 30%, color-mix(in oklab, var(--kx-warning) 28%, transparent), transparent 65%), linear-gradient(180deg, color-mix(in oklab, black 25%, transparent), color-mix(in oklab, black 55%, transparent))",
            }}
          />
          {/* Pitch lines */}
          <svg
            viewBox="0 0 200 240"
            preserveAspectRatio="xMidYMid slice"
            className="absolute inset-0 h-full w-full opacity-40"
            aria-hidden
          >
            <g
              fill="none"
              stroke="white"
              strokeWidth="0.8"
              strokeOpacity="0.55"
            >
              <rect x="14" y="14" width="172" height="212" rx="6" />
              <line x1="14" y1="120" x2="186" y2="120" />
              <circle cx="100" cy="120" r="22" />
              <circle cx="100" cy="120" r="1.5" fill="white" />
              <rect x="60" y="14" width="80" height="32" />
              <rect x="60" y="194" width="80" height="32" />
            </g>
          </svg>

          {/* Two team monograms head-to-head */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex items-center gap-3">
              <TeamMonogram letter="A" color="var(--kx-pink)" name="Aboabo" />
              <span className="[font-family:var(--kx-font-display)] text-[14px] font-black uppercase tracking-[0.2em] text-white/80">
                vs
              </span>
              <TeamMonogram letter="L" color="var(--kx-blue)" name="Lamashegu" />
            </div>
          </div>

          <span
            className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/55 px-2 py-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-white backdrop-blur"
          >
            <Eye size={11} weight="fill" /> Match to watch
          </span>
        </>
      }
      mediaCaption={
        <div className="flex items-center justify-between">
          <span className="[font-family:var(--kx-font-display)] text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-white/90 drop-shadow">
            Aboabo Park
          </span>
          <span className="[font-family:var(--kx-font-display)] text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-white/90 drop-shadow">
            MW 8
          </span>
        </div>
      }
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-[color-mix(in_oklab,var(--kx-warning)_24%,transparent)] px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[var(--kx-warning)]">
            <CalendarBlank size={10} weight="fill" /> This Saturday
          </span>
          <span className="rounded-full bg-[var(--kx-card-2)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--kx-fg-muted)]">
            Top of table
          </span>
        </div>
        <WhatsAppShare
          tone="on-card"
          href={whatsappHref(
            "Aboabo vs Lamashegu - the match to watch this Saturday. Follow on Kalaanba:",
            "https://kalaanba.com/matches/aboabo-lamashegu",
          )}
        />
      </div>

      <h2 className="[font-family:var(--kx-font-display)] text-[26px] font-black leading-[1.05] tracking-tight text-[var(--kx-fg)] sm:text-[32px]">
        Aboabo vs <span className="text-[var(--kx-warning)]">Lamashegu</span>
      </h2>

      <div className="-mt-1">
        <div className="flex items-center gap-2">
          <span className="[font-family:var(--kx-font-display)] text-[20px] font-extrabold tracking-tight text-[var(--kx-fg)]">
            Saturday · 4:00 PM
          </span>
          <SealCheck size={16} weight="fill" className="text-[var(--kx-blue)]" />
        </div>
        <div className="flex items-center gap-1 text-[12px] font-semibold text-[var(--kx-fg-muted)]">
          <MapPin size={12} weight="fill" /> Aboabo Park · East Zone
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <MiniStat label="Aboabo form"     value="WWDWL" />
        <MiniStat label="Lamashegu form"  value="WWWDW" />
        <MiniStat label="Last H2H"        value="2-2" />
      </div>

      {/* Follow / watchers — Match-to-watch CTA */}
      <div className="rounded-[var(--kx-r-tile)] border border-[var(--kx-border)] bg-[var(--kx-card)] px-3 py-2.5">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-[var(--kx-fg-muted)]">
              <Eye size={11} weight="fill" /> Watching
            </div>
            <div className="[font-family:var(--kx-font-display)] text-[18px] font-extrabold tabular-nums text-[var(--kx-fg)]">
              <KxOdometer value={watchers} /> fans
            </div>
          </div>
          <button
            type="button"
            onClick={() => setFollowing((v) => !v)}
            aria-pressed={following}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-[12px] font-bold transition-colors",
              following
                ? "bg-[var(--kx-pink)] text-[var(--kx-on-pink)]"
                : "border border-[var(--kx-border)] bg-[var(--kx-card)] text-[var(--kx-fg)] hover:border-[var(--kx-border-strong)]",
            )}
          >
            <Eye size={13} weight={following ? "fill" : "bold"} />
            {following ? "Following" : "Follow match"}
          </button>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-2">
          <KxButton variant="primary" size="md" trailingIcon={<CaretRight size={14} weight="bold" />}>
            Match preview
          </KxButton>
          <Link
            href="#"
            className="rounded-full border border-[var(--kx-border)] bg-[var(--kx-card)] px-3 py-2 text-[12px] font-semibold text-[var(--kx-fg-muted)] transition-colors hover:border-[var(--kx-border-strong)] hover:text-[var(--kx-fg)]"
          >
            All fixtures
          </Link>
        </div>
        {dots}
      </div>
    </SlideShell>
  );
}

function TeamMonogram({
  letter,
  color,
  name,
}: {
  letter: string;
  color: string;
  name: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span
        className="grid h-14 w-14 place-items-center rounded-2xl [font-family:var(--kx-font-display)] text-[24px] font-black text-white"
        style={{
          background: `linear-gradient(160deg, color-mix(in oklab, ${color} 90%, white 10%), color-mix(in oklab, ${color} 70%, black 18%))`,
          boxShadow: "inset 0 0 0 1.5px color-mix(in oklab, white 22%, transparent)",
        }}
      >
        {letter}
      </span>
      <span className="rounded-full bg-black/55 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-[0.16em] text-white backdrop-blur">
        {name}
      </span>
    </div>
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

function CityPulsePlayerSlide() {
  return (
    <div className="grid min-h-[430px] grid-cols-1 sm:min-h-[360px] sm:grid-cols-[5fr_6fr]">
      <div className="relative min-h-[300px] overflow-hidden bg-[color-mix(in_oklab,var(--kx-pink)_22%,black_10%)] sm:min-h-0">
        <Image
          src="/images/players/derek-osei.webp"
          alt="Derek Osei on the pitch"
          fill
          preload
          sizes="(min-width: 1024px) 26vw, (min-width: 640px) 40vw, 100vw"
          className="object-cover object-[50%_16%]"
        />
        <span
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, transparent 42%, color-mix(in oklab, black 58%, transparent) 100%), linear-gradient(120deg, color-mix(in oklab, var(--kx-pink) 26%, transparent), transparent 58%)",
          }}
        />
        <div className="absolute inset-x-4 bottom-4">
          <div className="flex items-center justify-between gap-3">
            <span className="rounded-full bg-black/55 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-white backdrop-blur">
              Bantama Boys
            </span>
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[var(--kx-card)] [font-family:var(--kx-font-display)] text-[17px] font-black text-[var(--kx-fg)] shadow-[var(--kx-shadow-md)]">
              15
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <PulsePill tone="success">Across verified matches</PulsePill>
          <PulsePill>Tamale Premier League - MW7</PulsePill>
        </div>
        <h2 className="mt-4 [font-family:var(--kx-font-display)] text-[29px] font-black leading-[1.02] tracking-tight text-[var(--kx-fg)] sm:text-[36px]">
          Tamale Player of the <span className="text-[var(--kx-pink)]">Week</span>
        </h2>
        <div className="mt-3">
          <div className="flex items-center gap-2">
            <span className="[font-family:var(--kx-font-display)] text-[21px] font-extrabold tracking-tight text-[var(--kx-fg)]">
              Derek Osei
            </span>
            <SealCheck size={17} weight="fill" className="text-[var(--kx-blue)]" />
          </div>
          <p className="mt-1 text-[12.5px] font-semibold text-[var(--kx-fg-muted)]">
            Forward - #15 - Bantama Boys
          </p>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2">
          <PulseMetric label="Goals" value={2} />
          <PulseMetric label="Assists" value={1} />
          <PulseMetric label="Rating" value="9.4" />
        </div>

        <p className="mt-4 rounded-[var(--kx-r-tile)] border border-[var(--kx-border)] bg-[var(--kx-card)] px-3 py-2 text-[12.5px] font-semibold leading-5 text-[var(--kx-fg-muted)]">
          Decided the derby with a late goal, then set up the winner two days later.
        </p>

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-5">
          <KxButton variant="primary" size="md" trailingIcon={<CaretRight size={14} weight="bold" />}>
            View profile
          </KxButton>
          <Link
            href="/players/derek-osei"
            className="rounded-full border border-[var(--kx-border)] bg-[var(--kx-card)] px-3 py-2 text-[12px] font-semibold text-[var(--kx-fg-muted)] transition-colors hover:border-[var(--kx-border-strong)] hover:text-[var(--kx-fg)]"
          >
            Full story
          </Link>
        </div>
      </div>
    </div>
  );
}

function CityPulseChallengeSlide() {
  return (
    <div className="relative min-h-[430px] overflow-hidden p-5 sm:min-h-[360px] sm:p-6">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-px -rotate-12 bg-gradient-to-b from-transparent via-[var(--kx-border-strong)] to-transparent sm:block"
      />
      <div className="grid h-full gap-5 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
        <ChallengeClub
          align="right"
          name="Bantama Boys"
          short="BAN"
          tone="var(--kx-pink)"
          record="5 unbeaten"
          note="Issued the challenge"
          form={["W", "W", "D", "W"]}
        />

        <div className="relative mx-auto grid h-28 w-28 place-items-center rounded-full border border-[var(--kx-border)] bg-[var(--kx-card)] shadow-[var(--kx-shadow-lg)]">
          <span
            aria-hidden
            className="absolute inset-2 rounded-full"
            style={{
              background:
                "conic-gradient(from 180deg, var(--kx-pink), var(--kx-danger), var(--kx-blue), var(--kx-pink))",
            }}
          />
          <span className="relative grid h-20 w-20 place-items-center rounded-full bg-[var(--kx-card)] [font-family:var(--kx-font-display)] text-[22px] font-black text-[var(--kx-fg)]">
            VS
          </span>
        </div>

        <ChallengeClub
          name="Sagnarigu Stars"
          short="SAG"
          tone="var(--kx-blue)"
          record="Top scorers"
          note="Accepted - Sat 19:30"
          form={["W", "L", "W", "W"]}
        />
      </div>

      <div className="relative mt-5 rounded-[var(--kx-r-tile)] border border-[var(--kx-border)] bg-[color-mix(in_oklab,var(--kx-card)_86%,transparent)] p-3 sm:mt-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="[font-family:var(--kx-font-display)] text-[24px] font-black leading-tight text-[var(--kx-fg)] sm:text-[30px]">
              Bantama called. Sagnarigu answered.
            </h2>
            <p className="mt-1 text-[12.5px] font-semibold text-[var(--kx-fg-muted)]">
              One challenge, one fixture, one WhatsApp thread waiting to explode.
            </p>
          </div>
          <PulsePill tone="danger">Challenge live</PulsePill>
        </div>
      </div>
    </div>
  );
}

function CityPulseZoneSlide() {
  return (
    <div className="grid min-h-[430px] gap-5 p-5 sm:min-h-[360px] sm:grid-cols-[1.08fr_0.92fr] sm:p-6">
      <div className="relative min-h-[260px] overflow-hidden rounded-[var(--kx-r-card)] border border-[var(--kx-border)] bg-[var(--kx-card)] p-3">
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(55% 45% at 25% 16%, color-mix(in oklab, var(--kx-blue) 22%, transparent), transparent 70%), radial-gradient(45% 45% at 88% 84%, color-mix(in oklab, var(--kx-pink) 16%, transparent), transparent 72%)",
          }}
        />
        <div className="relative grid h-full min-h-[238px] grid-cols-[repeat(6,minmax(0,1fr))] grid-rows-[repeat(5,minmax(0,1fr))] gap-1.5">
          <ZoneMapCell active className="col-span-3 row-span-2" name="North" stat="+18 GD" />
          <ZoneMapCell className="col-span-3 row-span-2" name="East" stat="7W" />
          <ZoneMapCell className="col-span-2 row-span-3" name="West" stat="9W" />
          <ZoneMapCell className="col-span-2 row-span-3" name="Central" stat="6W" />
          <ZoneMapCell className="col-span-2 row-span-3" name="South" stat="4W" />
        </div>
      </div>

      <div className="flex flex-col">
        <div className="flex flex-wrap items-center gap-2">
          <PulsePill tone="blue">Tamale zones</PulsePill>
          <PulsePill>Weekly table</PulsePill>
        </div>
        <h2 className="mt-4 [font-family:var(--kx-font-display)] text-[29px] font-black leading-[1.02] tracking-tight text-[var(--kx-fg)] sm:text-[36px]">
          North Zone takes the <span className="text-[var(--kx-blue)]">lead</span>
        </h2>
        <p className="mt-3 text-[13px] font-semibold leading-6 text-[var(--kx-fg-muted)]">
          Lamashegu, Choggu, and Vittin teams pushed the zone clear after a week of away wins.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-2">
          <PulseMetric label="Wins" value={12} />
          <PulseMetric label="GD" value="+18" />
          <PulseMetric label="Top club" value="BAN" compact />
          <PulseMetric label="Top scorer" value="9G" compact />
        </div>

        <div className="mt-auto flex items-center gap-2 pt-5 text-[12px] font-bold text-[var(--kx-fg-muted)]">
          <MapPin size={15} weight="fill" className="text-[var(--kx-blue)]" />
          Configurable city zones, not fixed league groups.
        </div>
      </div>
    </div>
  );
}

function CityPulseMatchSlide() {
  return (
    <div className="grid min-h-[430px] gap-5 p-5 sm:min-h-[360px] sm:grid-cols-[1fr_0.7fr_1fr] sm:items-center sm:p-6">
      <MatchTeamPanel
        name="Aboabo"
        short="ABO"
        tone="var(--kx-success)"
        form={["W", "D", "W", "W"]}
        stat="Best defence"
      />

      <div className="flex flex-col items-center justify-center gap-3">
        <PulsePill tone="warning">Sat 16:30</PulsePill>
        <div className="grid h-24 w-24 place-items-center rounded-full border border-[var(--kx-border)] bg-[var(--kx-card)] [font-family:var(--kx-font-display)] text-[20px] font-black text-[var(--kx-fg)] shadow-[var(--kx-shadow-lg)]">
          vs
        </div>
        <div className="flex flex-col items-center gap-1 text-center text-[12px] font-semibold text-[var(--kx-fg-muted)]">
          <span className="inline-flex items-center gap-1">
            <CalendarBlank size={14} weight="bold" />
            Northern Cup
          </span>
          <span className="inline-flex items-center gap-1">
            <MapPin size={14} weight="fill" />
            Kaladan Park
          </span>
        </div>
      </div>

      <MatchTeamPanel
        name="Lamashegu"
        short="LAM"
        tone="var(--kx-warning)"
        form={["L", "W", "W", "D"]}
        stat="Most shots"
      />

      <div className="sm:col-span-3">
        <div className="rounded-[var(--kx-r-tile)] border border-[var(--kx-border)] bg-[var(--kx-card)] p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="[font-family:var(--kx-font-display)] text-[24px] font-black leading-tight text-[var(--kx-fg)] sm:text-[30px]">
                Saturday belongs to Aboabo vs Lamashegu
              </h2>
              <p className="mt-1 text-[12.5px] font-semibold text-[var(--kx-fg-muted)]">
                Follow the buildup, lineups, live score, and result card in one place.
              </p>
            </div>
            <KxButton variant="primary" size="md" trailingIcon={<CaretRight size={14} weight="bold" />}>
              Open match
            </KxButton>
          </div>
        </div>
      </div>
    </div>
  );
}

function PulsePill({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "success" | "blue" | "warning" | "danger";
}) {
  const color =
    tone === "success"
      ? "var(--kx-success)"
      : tone === "blue"
        ? "var(--kx-blue)"
        : tone === "warning"
          ? "var(--kx-warning)"
          : tone === "danger"
            ? "var(--kx-danger)"
            : "var(--kx-fg-muted)";
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em]"
      style={{
        background: `color-mix(in oklab, ${color} 16%, transparent)`,
        color,
      }}
    >
      {children}
    </span>
  );
}

function PulseMetric({
  label,
  value,
  compact = false,
}: {
  label: string;
  value: number | string;
  compact?: boolean;
}) {
  return (
    <div className="rounded-[var(--kx-r-tile)] border border-[var(--kx-border)] bg-[color-mix(in_oklab,var(--kx-card)_88%,transparent)] px-3 py-2">
      <div
        className={cn(
          "[font-family:var(--kx-font-display)] font-extrabold tabular-nums tracking-tight text-[var(--kx-fg)]",
          compact ? "text-[15px]" : "text-[20px]",
        )}
      >
        <KxOdometer value={value} />
      </div>
      <div className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--kx-fg-muted)]">
        {label}
      </div>
    </div>
  );
}

function ChallengeClub({
  name,
  short,
  tone,
  record,
  note,
  form,
  align = "left",
}: {
  name: string;
  short: string;
  tone: string;
  record: string;
  note: string;
  form: ("W" | "D" | "L")[];
  align?: "left" | "right";
}) {
  return (
    <div className={cn("flex flex-col gap-3", align === "right" && "items-end text-right")}>
      <span
        className="grid h-20 w-20 place-items-center rounded-[1.4rem] [font-family:var(--kx-font-display)] text-[21px] font-black text-[var(--kx-on-pink)] shadow-[var(--kx-shadow-md)]"
        style={{
          background: tone,
          boxShadow: `0 18px 42px -22px ${tone}`,
        }}
      >
        {short}
      </span>
      <div>
        <h3 className="[font-family:var(--kx-font-display)] text-[22px] font-black leading-tight text-[var(--kx-fg)]">
          {name}
        </h3>
        <p className="mt-1 text-[12.5px] font-semibold text-[var(--kx-fg-muted)]">{note}</p>
      </div>
      <div className={cn("flex flex-wrap items-center gap-2", align === "right" && "justify-end")}>
        <PulsePill>{record}</PulsePill>
        <ClubForm form={form} />
      </div>
    </div>
  );
}

function ClubForm({ form }: { form: ("W" | "D" | "L")[] }) {
  return (
    <div className="flex items-center gap-1">
      {form.map((result, index) => {
        const color =
          result === "W"
            ? "var(--kx-success)"
            : result === "D"
              ? "var(--kx-fg-muted)"
              : "var(--kx-danger)";
        return (
          <span
            key={`${result}-${index}`}
            className="grid h-6 w-6 place-items-center rounded-full text-[10px] font-black text-white"
            style={{ background: color }}
          >
            {result}
          </span>
        );
      })}
    </div>
  );
}

function ZoneMapCell({
  name,
  stat,
  active,
  className,
}: {
  name: string;
  stat: string;
  active?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex min-h-0 flex-col justify-between overflow-hidden rounded-[1rem] border p-2.5",
        active
          ? "border-transparent text-[var(--kx-on-pink)] shadow-[var(--kx-shadow-pink)]"
          : "border-[var(--kx-border)] bg-[var(--kx-card-2)] text-[var(--kx-fg)]",
        className,
      )}
      style={
        active
          ? {
              background:
                "linear-gradient(135deg, var(--kx-blue), color-mix(in oklab, var(--kx-pink) 76%, var(--kx-blue)))",
            }
          : undefined
      }
    >
      <span className="[font-family:var(--kx-font-display)] text-[13px] font-black tracking-tight">
        {name}
      </span>
      <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] opacity-80">
        {stat}
      </span>
    </div>
  );
}

function MatchTeamPanel({
  name,
  short,
  tone,
  form,
  stat,
}: {
  name: string;
  short: string;
  tone: string;
  form: ("W" | "D" | "L")[];
  stat: string;
}) {
  return (
    <div className="rounded-[var(--kx-r-card)] border border-[var(--kx-border)] bg-[var(--kx-card)] p-4 text-center shadow-[var(--kx-shadow-sm)]">
      <span
        className="mx-auto grid h-20 w-20 place-items-center rounded-full [font-family:var(--kx-font-display)] text-[22px] font-black text-[var(--kx-on-pink)]"
        style={{ background: tone }}
      >
        {short}
      </span>
      <h3 className="mt-3 [font-family:var(--kx-font-display)] text-[22px] font-black text-[var(--kx-fg)]">
        {name}
      </h3>
      <p className="mt-1 text-[12px] font-semibold text-[var(--kx-fg-muted)]">{stat}</p>
      <div className="mt-3 flex justify-center">
        <ClubForm form={form} />
      </div>
    </div>
  );
}

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
        {TOP_PERFORMERS.map((p) => {
          const accent = p.tone === "pink" ? "var(--kx-pink)" : "var(--kx-blue)";
          return (
            <Link
              key={p.id}
              href="#"
              className={cn(
                "group relative flex flex-col items-center gap-2 overflow-hidden rounded-[var(--kx-r-tile)] p-3",
                "border border-[var(--kx-border)] bg-[var(--kx-card)] transition-colors",
                "hover:border-[var(--kx-border-strong)]",
              )}
            >
              {/* Soft accent halo behind the avatar */}
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-14"
                style={{
                  background: `radial-gradient(60% 100% at 50% 0%, color-mix(in oklab, ${accent} 22%, transparent), transparent 70%)`,
                }}
              />

              {/* Headshot avatar */}
              <span
                className="relative grid h-14 w-14 place-items-center rounded-full p-[2px]"
                style={{
                  background: `linear-gradient(160deg, ${accent}, color-mix(in oklab, ${accent} 50%, black 30%))`,
                  boxShadow: `0 6px 14px -8px color-mix(in oklab, ${accent} 70%, transparent)`,
                }}
              >
                <Image
                  src={p.headshot}
                  alt={p.name}
                  width={52}
                  height={52}
                  className="h-full w-full rounded-full object-cover"
                />
              </span>

              <div className="min-w-0 text-center">
                <div className="truncate text-[12px] font-bold text-[var(--kx-fg)]">
                  {p.name}
                </div>
                <div className="text-[9.5px] font-bold uppercase tracking-[0.14em] text-[var(--kx-fg-muted)]">
                  {p.stat}
                </div>
              </div>

              <span
                className="[font-family:var(--kx-font-display)] text-[20px] font-extrabold tabular-nums leading-none tracking-tight"
                style={{ color: accent }}
              >
                {p.value}
              </span>
            </Link>
          );
        })}
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
                <span className="relative grid h-7 w-7 place-items-center overflow-hidden rounded-full bg-[var(--kx-card-2)]">
                  <Image
                    src={s.headshot}
                    alt={s.name}
                    width={28}
                    height={28}
                    className="h-full w-full object-cover"
                  />
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
