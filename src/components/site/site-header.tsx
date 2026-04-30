"use client";

/* ---------------------------------------------------------------------
   Kalaanba — Site Header (3-level)

   Bar 1  Utility — region dropdown · audience links · theme toggle
   Bar 2  Main nav — brand · primary nav · search · auth (KxButton)
   Bar 3  Live ticker — auto-scrolling fixture rail (KxTicker)

   Region uses KxMenu, with a one-time geolocation snap to the nearest
   Ghana city. Search opens KxCommandPalette (Cmd/Ctrl+K).
   --------------------------------------------------------------------- */

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  CaretDown,
  Check,
  List,
  MagnifyingGlass,
  MapPin,
  X,
} from "@phosphor-icons/react";

import { cn } from "@/lib/utils";
import { KxButton } from "@/components/showcase/primitives";
import { KxMenu, type MenuItem } from "@/components/showcase/extras";
import { KxCommandPalette } from "@/components/showcase/surfaces";
import { KxTicker } from "@/components/showcase/motion";
import { KxThemeToggle } from "@/components/showcase/theme-toggle";

/* ---------- Static config ---------- */

const PRIMARY_NAV: { href: string; label: string }[] = [
  { href: "/matches", label: "Matches" },
  { href: "/table",   label: "Table" },
  { href: "/players", label: "Players" },
  { href: "/clubs",   label: "Clubs" },
  { href: "/zones",   label: "Zones" },
  { href: "/news",    label: "News" },
];

const AUDIENCE_LINKS: { href: string; label: string }[] = [
  { href: "/for-facilities", label: "For Facilities" },
  { href: "/for-organisers", label: "For Organisers" },
  { href: "/about",          label: "About" },
  { href: "/blog",           label: "Blog" },
];

type City = { id: string; name: string; lat: number; lon: number };

const CITIES: City[] = [
  { id: "tamale",   name: "Tamale",         lat:  9.4008, lon: -0.8393 },
  { id: "accra",    name: "Accra",          lat:  5.6037, lon: -0.1870 },
  { id: "kumasi",   name: "Kumasi",         lat:  6.6885, lon: -1.6244 },
  { id: "takoradi", name: "Takoradi",       lat:  4.8910, lon: -1.7554 },
  { id: "cape-coast", name: "Cape Coast",   lat:  5.1054, lon: -1.2466 },
  { id: "ho",       name: "Ho",             lat:  6.6000, lon:  0.4700 },
  { id: "sunyani",  name: "Sunyani",        lat:  7.3349, lon: -2.3275 },
  { id: "wa",       name: "Wa",             lat: 10.0601, lon: -2.5057 },
  { id: "bolga",    name: "Bolgatanga",     lat: 10.7856, lon: -0.8514 },
  { id: "koforidua", name: "Koforidua",     lat:  6.0940, lon: -0.2570 },
];

type TickerMatch = {
  id: string;
  home: string; away: string;
  homeScore: number; awayScore: number;
  status: "FT" | "HT" | string;
};

const TICKER_DEMO: TickerMatch[] = [
  { id: "m1", home: "Lamashegu", away: "Vittin",   homeScore: 2, awayScore: 1, status: "67'" },
  { id: "m2", home: "Choggu",    away: "Sakasaka", homeScore: 0, awayScore: 0, status: "HT"  },
  { id: "m3", home: "Aboabo",    away: "Gumani",   homeScore: 3, awayScore: 1, status: "FT"  },
  { id: "m4", home: "Bantama",   away: "Sagnarigu",homeScore: 1, awayScore: 1, status: "82'" },
  { id: "m5", home: "Tishigu",   away: "Kakpagyili",homeScore: 4, awayScore: 2, status: "FT" },
  { id: "m6", home: "Nyohini",   away: "Kalpohini",homeScore: 0, awayScore: 1, status: "23'" },
];

/* Search demo set — clubs, players, competitions, fixtures. */
const SEARCH_ITEMS = [
  { id: "c-bantama",  group: "Clubs",   label: "Bantama Boys",            hint: "Tamale Premier League", href: "/clubs/bantama-boys" },
  { id: "c-sagnar",   group: "Clubs",   label: "Sagnarigu Stars",         hint: "Tamale Premier League", href: "/clubs/sagnarigu-stars" },
  { id: "c-northern", group: "Clubs",   label: "Northern United",         hint: "Northern Zone",         href: "/clubs/northern-united" },
  { id: "p-derek",    group: "Players", label: "Derek Osei",              hint: "Forward · Bantama Boys", href: "/players/derek-osei" },
  { id: "p-richard",  group: "Players", label: "Richard Somda",           hint: "Midfielder · Sagnarigu", href: "/players/richard-somda" },
  { id: "t-tpl",      group: "Competitions", label: "Tamale Premier League", hint: "2025 / 26 season",    href: "/competitions/tpl" },
  { id: "t-cup",      group: "Competitions", label: "Northern Cup",        hint: "Knockout",              href: "/competitions/northern-cup" },
  { id: "f-bvs",      group: "Fixtures", label: "Bantama Boys vs Sagnarigu Stars", hint: "Sat 19:30 · Aliu Mahama", href: "/matches/bvs" },
];

/* ---------- Helpers ---------- */

const STORAGE_REGION = "kalaanba-region";

function haversine(a: { lat: number; lon: number }, b: { lat: number; lon: number }) {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

function nearestCity(lat: number, lon: number): City {
  let best = CITIES[0];
  let bestD = Infinity;
  for (const c of CITIES) {
    const d = haversine({ lat, lon }, c);
    if (d < bestD) { bestD = d; best = c; }
  }
  return best;
}

/* ---------- Component ---------- */

export function SiteHeader({
  ticker = TICKER_DEMO,
  defaultRegion = "tamale",
}: {
  ticker?: TickerMatch[];
  defaultRegion?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [regionId, setRegionId] = useState<string>(defaultRegion);

  const region = useMemo(
    () => CITIES.find((c) => c.id === regionId) ?? CITIES[0],
    [regionId],
  );

  // Restore stored region; if none, try a one-time geolocation snap.
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_REGION);
      if (stored && CITIES.some((c) => c.id === stored)) {
        setRegionId(stored);
        return;
      }
    } catch { /* ignore */ }
    if (typeof navigator === "undefined" || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const c = nearestCity(pos.coords.latitude, pos.coords.longitude);
        setRegionId(c.id);
        try { localStorage.setItem(STORAGE_REGION, c.id); } catch { /* ignore */ }
      },
      () => { /* user declined — keep default */ },
      { enableHighAccuracy: false, timeout: 4000, maximumAge: 60 * 60 * 1000 },
    );
  }, []);

  function pickRegion(id: string) {
    setRegionId(id);
    try { localStorage.setItem(STORAGE_REGION, id); } catch { /* ignore */ }
  }

  // Cmd/Ctrl+K opens the command palette.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname?.startsWith(href));

  const regionMenuItems: MenuItem[] = CITIES.map((c) => ({
    label: c.name,
    icon: c.id === region.id ? <Check size={14} weight="bold" /> : undefined,
    onSelect: () => pickRegion(c.id),
  }));

  return (
    <>
      <header className="sticky top-0 z-40 w-full">
        {/* Bar 1 — Utility */}
        <div className="border-b border-[var(--kx-border)] bg-[var(--kx-card-2)]">
          <div className="mx-auto flex h-9 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
            <KxMenu
              align="start"
              items={regionMenuItems}
              trigger={
                <button
                  type="button"
                  aria-label={`Region: ${region.name}`}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border border-[var(--kx-border)]",
                    "bg-[var(--kx-card)] px-2.5 py-1 text-[12px] font-medium text-[var(--kx-fg)]",
                    "transition-colors hover:border-[var(--kx-border-strong)]",
                  )}
                >
                  <MapPin size={12} weight="fill" className="text-[var(--kx-pink)]" />
                  <span>{region.name}</span>
                  <CaretDown size={10} weight="bold" className="text-[var(--kx-fg-muted)]" />
                </button>
              }
            />

            <div className="flex items-center gap-4">
              <nav className="hidden items-center gap-5 md:flex">
                {AUDIENCE_LINKS.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="text-[12px] font-medium text-[var(--kx-fg-muted)] transition-colors hover:text-[var(--kx-fg)]"
                  >
                    {l.label}
                  </Link>
                ))}
              </nav>
              <div className="-my-1">
                <KxThemeToggle />
              </div>
            </div>
          </div>
        </div>

        {/* Bar 2 — Main nav */}
        <div className="border-b border-[var(--kx-border)] bg-[var(--kx-card)]">
          <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6">
            <Link href="/" className="flex shrink-0 items-center gap-2.5">
              <span
                className={cn(
                  "grid h-9 w-9 place-items-center rounded-[10px]",
                  "bg-[var(--kx-pink)] text-[var(--kx-on-pink)]",
                  "[font-family:var(--kx-font-display)] text-[14px] font-extrabold tracking-tight",
                  "shadow-[var(--kx-shadow-pink)]",
                )}
                aria-hidden
              >
                KB
              </span>
              <span className="hidden [font-family:var(--kx-font-display)] text-[18px] font-extrabold tracking-tight text-[var(--kx-fg)] sm:inline">
                KALA<span className="text-[var(--kx-pink)]">ANBA</span>
              </span>
            </Link>

            <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex">
              {PRIMARY_NAV.map((l) => {
                const active = isActive(l.href);
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={cn(
                      "relative px-3 py-2 text-[14px] font-semibold transition-colors",
                      active
                        ? "text-[var(--kx-fg)]"
                        : "text-[var(--kx-fg-muted)] hover:text-[var(--kx-fg)]",
                    )}
                  >
                    {l.label}
                    {active ? (
                      <span
                        aria-hidden
                        className="absolute -bottom-[2px] left-3 right-3 h-[2px] rounded-full bg-[var(--kx-pink)]"
                      />
                    ) : null}
                  </Link>
                );
              })}
            </nav>

            <div className="flex flex-1 items-center justify-end gap-2 lg:flex-none">
              <button
                type="button"
                onClick={() => setPaletteOpen(true)}
                aria-label="Search"
                title="Search"
                className={cn(
                  "hidden h-10 items-center gap-2 rounded-full border border-[var(--kx-border-strong)] px-3",
                  "text-[12px] font-medium text-[var(--kx-fg-muted)] transition-colors",
                  "hover:border-[var(--kx-fg-muted)] hover:text-[var(--kx-fg)] sm:inline-flex",
                )}
              >
                <MagnifyingGlass size={14} weight="bold" />
                <span>Search</span>
              </button>

              <KxButton
                variant="secondary"
                size="md"
                onClick={() => router.push("/sign-in")}
                className="hidden sm:inline-flex"
              >
                Sign in
              </KxButton>

              <KxButton
                variant="primary"
                size="md"
                onClick={() => router.push("/get-started")}
              >
                Get started
              </KxButton>

              <button
                type="button"
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
                onClick={() => setMobileOpen((v) => !v)}
                className="grid h-10 w-10 place-items-center rounded-full text-[var(--kx-fg)] transition-colors hover:bg-[var(--kx-card-2)] lg:hidden"
              >
                {mobileOpen ? <X size={20} weight="bold" /> : <List size={20} weight="bold" />}
              </button>
            </div>
          </div>

          {mobileOpen ? (
            <nav className="border-t border-[var(--kx-border)] bg-[var(--kx-card)] px-4 pb-4 pt-2 lg:hidden">
              <ul className="flex flex-col">
                {PRIMARY_NAV.map((l) => {
                  const active = isActive(l.href);
                  return (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "flex items-center justify-between rounded-[var(--kx-r-tile)] px-3 py-3 text-[15px] font-semibold transition-colors",
                          active
                            ? "bg-[var(--kx-card-2)] text-[var(--kx-fg)]"
                            : "text-[var(--kx-fg-muted)] hover:bg-[var(--kx-card-2)] hover:text-[var(--kx-fg)]",
                        )}
                      >
                        {l.label}
                        {active ? (
                          <span className="h-1.5 w-1.5 rounded-full bg-[var(--kx-pink)]" />
                        ) : null}
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-3 grid grid-cols-2 gap-2 border-t border-[var(--kx-border)] pt-3">
                {AUDIENCE_LINKS.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-[var(--kx-r-tile)] px-3 py-2 text-[12px] font-medium text-[var(--kx-fg-muted)] hover:text-[var(--kx-fg)]"
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            </nav>
          ) : null}
        </div>

        {/* Bar 3 — Auto-scrolling ticker */}
        <div className="border-b border-[var(--kx-border)] bg-[var(--kx-bg)]">
          <div className="mx-auto max-w-7xl px-4 py-2 sm:px-6">
            <KxTicker speed={60} className="!rounded-full">
              {ticker.map((m) => (
                <TickerItem key={m.id} match={m} />
              ))}
            </KxTicker>
          </div>
        </div>
      </header>

      <KxCommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        items={SEARCH_ITEMS}
        onSelect={(item) => {
          const target = SEARCH_ITEMS.find((i) => i.id === item.id);
          if (target?.href) router.push(target.href);
        }}
        placeholder="Search clubs, players, competitions, fixtures…"
      />
    </>
  );
}

function TickerItem({ match: m }: { match: TickerMatch }): ReactNode {
  const isLive = m.status !== "FT" && m.status !== "HT";
  return (
    <div className="flex shrink-0 items-center gap-2 text-[12px] font-medium text-[var(--kx-fg)]">
      <span className="text-[var(--kx-fg-muted)]">{m.home}</span>
      <span
        className={cn(
          "inline-flex h-6 min-w-12 items-center justify-center rounded-md px-1.5",
          "bg-[var(--kx-card-2)] text-[12px] font-extrabold tabular-nums tracking-tight text-[var(--kx-fg)]",
        )}
      >
        {m.homeScore} – {m.awayScore}
      </span>
      <span className="text-[var(--kx-fg-muted)]">{m.away}</span>
      <span
        className={cn(
          "ml-1 text-[11px] font-bold uppercase tracking-wide",
          isLive ? "text-[var(--kx-pink)]" : "text-[var(--kx-fg-muted)]",
        )}
      >
        {m.status}
      </span>
    </div>
  );
}
