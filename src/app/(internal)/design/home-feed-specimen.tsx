"use client";

/**
 * Stage 2 of the home: what `/` becomes once Match/Fixture, Competition &
 * Rules and Fan Buzz can serve it.
 *
 * It lives here rather than on `/` for one reason: every number below is
 * invented, and a synthetic standings table on a live surface is
 * indistinguishable from a real one to the person reading it. Constitution
 * Law 3 puts all of it behind a backend engine. `/design` is noindex and
 * internal, which is the only place invented football is safe.
 *
 * Built only from shipped primitives, at phone width, because the reference
 * material for this was a set of desktop dashboards and Kalaanba is a phone
 * product. The desktop versions of these ideas are three columns of dense
 * tables; the phone version is one column that has to decide what matters
 * most. That decision is the design work, and it is what this specimen is for.
 *
 * Card mix follows Fan Buzz §11.1 (Home Feed). What is deliberately shown:
 *
 *   - a provisional result sitting next to confirmed ones, so Law 7 is visible
 *     rather than assumed. ScoreLine already marks it; this proves it reads.
 *   - buzz labelled as attention, never as respect (Law 8, Law 9).
 *   - no rating, no RP, no computed anything on a club or player card.
 */

import type { ReactNode } from "react";

import {
  Badge,
  Card,
  Crest,
  Divider,
  Eyebrow,
  FixtureRow,
  LiveIndicator,
  ScoreLine,
  StatValue,
} from "@/components/ui";

import {
  HERO_FIXTURE,
  LIVE_FIXTURE,
  RECENT_RESULTS,
  TOP_SCORERS,
  ZONE_PULSE,
  ZONE_TABLE,
} from "./home-feed-data";

export function HomeFeedSpecimen() {
  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-col gap-3">
        <Eyebrow tone="live">Stage 2 · Fan Buzz §11.1</Eyebrow>
        <h2 className="font-display text-xl font-semibold tracking-tight">
          The home feed, when there is football to feed it
        </h2>
        <p className="text-fg-muted max-w-prose text-sm leading-relaxed">
          The shell, the header and the area strip are the ones shipped on{" "}
          <code>/</code> today. Only the slot changes: discovery cards come out,
          these go in. Every score, table position and goal count below is
          invented and must never reach a public surface.
        </p>
      </header>

      {/* Phone column. The whole point is what survives at 360px. */}
      <div className="bg-surface rounded-card elev-flat mx-auto w-full max-w-md p-4">
        <div className="flex flex-col gap-6">
          <div>
            <SectionHeading
              title="Happening now"
              trailing={<LiveIndicator minute={LIVE_FIXTURE.minute} />}
            />
            <Card tone="raised" size="md">
              <ScoreLine
                home={LIVE_FIXTURE.home}
                away={LIVE_FIXTURE.away}
                homeScore={LIVE_FIXTURE.homeScore}
                awayScore={LIVE_FIXTURE.awayScore}
                status={LIVE_FIXTURE.status}
                statusLabel={LIVE_FIXTURE.statusLabel}
                minute={LIVE_FIXTURE.minute}
                meta={LIVE_FIXTURE.meta}
                size="lg"
              />
            </Card>
          </div>

          <div>
            <SectionHeading title="Next up" />
            {/* The reference designs gave this a photographic hero. Kalaanba
                has no press photography and never will at grassroots, so the
                weight has to come from type and the crests instead. */}
            <Card tone="raised" size="md">
              <div className="flex items-center justify-center gap-4">
                <Crest name={HERO_FIXTURE.home.name} size="xl" />
                <StatValue size="lg" tone="muted">
                  vs
                </StatValue>
                <Crest name={HERO_FIXTURE.away.name} size="xl" />
              </div>
              <p className="font-display mt-4 text-center text-lg leading-tight font-bold tracking-tight text-balance">
                {HERO_FIXTURE.home.name} vs {HERO_FIXTURE.away.name}
              </p>
              <p className="text-fg-muted mt-1 text-center text-sm">
                {HERO_FIXTURE.statusLabel}
              </p>
              <p className="text-fg-subtle mt-0.5 text-center text-xs">
                {HERO_FIXTURE.meta}
              </p>
            </Card>
          </div>

          <div>
            <SectionHeading title="Latest results" />
            <Card tone="flat" size="md">
              {RECENT_RESULTS.map((fixture, index) => (
                <div key={fixture.id}>
                  {index > 0 ? <Divider /> : null}
                  <FixtureRow
                    home={fixture.home}
                    away={fixture.away}
                    homeScore={fixture.homeScore}
                    awayScore={fixture.awayScore}
                    status={fixture.status}
                    statusLabel={fixture.statusLabel}
                    meta={fixture.meta}
                  />
                </div>
              ))}
            </Card>
            <p className="text-fg-subtle mt-2 text-xs">
              The third row is awaiting confirmation, so it presents itself as
              provisional. Only a confirmed result may look settled (Law 7).
            </p>
          </div>

          <div>
            <SectionHeading title="Tamale Central" />
            <ZoneTable />
          </div>

          <div>
            <SectionHeading title="Top scorers" />
            <Card tone="flat" size="md">
              {TOP_SCORERS.map((scorer, index) => (
                <div key={scorer.name}>
                  {index > 0 ? <Divider /> : null}
                  <div className="flex items-center gap-3 py-2.5">
                    <Crest name={scorer.club} size="sm" decorative />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">
                        {scorer.name}
                      </p>
                      <p className="text-fg-subtle truncate text-xs">
                        {scorer.club}
                      </p>
                    </div>
                    <StatValue size="md">{scorer.goals}</StatValue>
                  </div>
                </div>
              ))}
            </Card>
            <p className="text-fg-subtle mt-2 text-xs">
              Verified matches only (Law 9). A goal from an unconfirmed result
              does not appear here.
            </p>
          </div>

          <div>
            <SectionHeading
              title="Buzzing in Tamale"
              trailing={<Badge size="sm">Attention</Badge>}
            />
            <Card tone="flat" size="md">
              {ZONE_PULSE.map((item, index) => (
                <div key={item.id}>
                  {index > 0 ? <Divider /> : null}
                  <div className="py-2.5">
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-fg-subtle mt-0.5 text-xs">
                      {item.detail}
                    </p>
                  </div>
                </div>
              ))}
            </Card>
            <p className="text-fg-subtle mt-2 text-xs">
              Badged as attention on purpose. Buzz drives visibility, results
              drive respect (Law 8), so this can never look like a ranking.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionHeading({
  title,
  trailing,
}: {
  title: string;
  trailing?: ReactNode;
}) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <h3 className="font-display text-base font-bold tracking-tight">
        {title}
      </h3>
      {trailing}
    </div>
  );
}

/**
 * The standings table at phone width. The reference dashboards carry eight
 * columns (Pts W L D GF GA GD Last 5); at 360px that is either a horizontal
 * scroll nobody discovers or six columns of unreadable 10px numerals. Played,
 * goal difference and points is what decides a table, so that is what stays,
 * and the rest lives on the competition page.
 */
function ZoneTable() {
  return (
    <Card tone="flat" size="md">
      <div className="text-fg-subtle grid grid-cols-[1.5rem_1fr_2rem_2.25rem_2.25rem] gap-2 text-[0.6875rem] font-semibold tracking-[0.08em] uppercase">
        <span aria-hidden />
        <span>Club</span>
        <span className="text-right">P</span>
        <span className="text-right">GD</span>
        <span className="text-right">Pts</span>
      </div>
      <Divider />
      {ZONE_TABLE.map((row) => (
        <div
          key={row.club}
          className="grid grid-cols-[1.5rem_1fr_2rem_2.25rem_2.25rem] items-center gap-2 py-2 text-sm"
        >
          <span className="text-fg-subtle kx-numeric text-xs">
            {row.position}
          </span>
          <span className="flex min-w-0 items-center gap-2">
            <Crest name={row.club} size="xs" decorative />
            <span className="truncate">{row.club}</span>
          </span>
          <span className="text-fg-muted kx-numeric text-right text-xs">
            {row.played}
          </span>
          <span className="text-fg-muted kx-numeric text-right text-xs">
            {row.goalDifference > 0
              ? `+${row.goalDifference}`
              : row.goalDifference}
          </span>
          <span className="kx-numeric text-right font-semibold">
            {row.points}
          </span>
        </div>
      ))}
    </Card>
  );
}
