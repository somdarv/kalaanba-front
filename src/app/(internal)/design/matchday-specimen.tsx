"use client";

/**
 * The football primitives shown doing their actual job.
 *
 * A gallery of components in isolation proves they render. It does not prove
 * they compose, that a scoreline and a fixture list share a rhythm, or that
 * the system reads as football rather than as generic app furniture. So this
 * is a matchday surface, built only from the shipped primitives.
 *
 * All content is SYNTHETIC demonstration data. Club names are derived from
 * the real Tamale zones in PRODUCT.md §11 (Lamashegu, Kalpohin, Vittin,
 * Sakasaka, Choggu, Aboabo, Bulpela, Gumbihini); the clubs, scores and
 * fixtures are invented. Replace before this pattern reaches any public
 * surface.
 */

import { useState } from "react";
import {
  Badge,
  Button,
  Card,
  ChipToggle,
  Crest,
  Eyebrow,
  FixtureRow,
  LiveIndicator,
  ScoreLine,
  StatBlock,
  StatValue,
  type MatchStatus,
} from "@/components/ui";

type Fixture = {
  id: string;
  home: { name: string };
  away: { name: string };
  homeScore: number | null;
  awayScore: number | null;
  status: MatchStatus;
  statusLabel?: string;
  minute?: string;
  kickoff: string;
};

const FIXTURES: Fixture[] = [
  {
    id: "f1",
    home: { name: "Lamashegu Warriors" },
    away: { name: "Kalpohin Stars" },
    homeScore: 2,
    awayScore: 1,
    status: "live",
    minute: "67'",
    kickoff: "15:30",
  },
  {
    id: "f2",
    home: { name: "Vittin FC" },
    away: { name: "Sakasaka United" },
    homeScore: 0,
    awayScore: 0,
    status: "half_time",
    statusLabel: "HT",
    kickoff: "16:00",
  },
  {
    id: "f3",
    home: { name: "Choggu Rangers" },
    away: { name: "Aboabo Real" },
    homeScore: 3,
    awayScore: 2,
    status: "awaiting_confirmation",
    statusLabel: "Unconfirmed",
    kickoff: "13:00",
  },
  {
    id: "f4",
    home: { name: "Bulpela Athletic" },
    away: { name: "Gumbihini Youth" },
    homeScore: null,
    awayScore: null,
    status: "scheduled",
    statusLabel: "Sun",
    kickoff: "16:30",
  },
];

const FILTERS = ["All", "Live", "Results", "Upcoming"] as const;

export function MatchdaySpecimen() {
  const [filter, setFilter] = useState<string>("All");

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-4">
        <header className="flex flex-col gap-1.5">
          <Eyebrow tone="primary">In practice</Eyebrow>
          <h2 className="font-display text-xl font-semibold tracking-tight">
            A matchday, built only from the new primitives
          </h2>
          <p className="text-fg-muted max-w-prose text-sm">
            Synthetic data. Club names come from the real Tamale zones; the
            results are invented.
          </p>
        </header>

        {/* Hero result — the object the product exists to render. */}
        <Card tone="raised" size="lg">
          <ScoreLine
            home={{ name: "Lamashegu Warriors" }}
            away={{ name: "Kalpohin Stars" }}
            homeScore={2}
            awayScore={1}
            status="live"
            minute="67'"
            size="lg"
            meta="Tamale Premier League · Matchday 9 · Kalpohin Astro"
          />
          <Card.Footer>
            <Button intent="ghost" size="sm">
              Line-ups
            </Button>
            <Button intent="primary" size="sm">
              Follow
            </Button>
          </Card.Footer>
        </Card>

        {/* Provisional result — Law 7 in the UI. */}
        <Card tone="raised">
          <ScoreLine
            home={{ name: "Choggu Rangers" }}
            away={{ name: "Aboabo Real" }}
            homeScore={3}
            awayScore={2}
            status="awaiting_confirmation"
            statusLabel="Awaiting confirmation"
            meta="Tamale Premier League · Matchday 9"
          />
        </Card>
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Eyebrow tone="primary">Fixture list</Eyebrow>
          <LiveIndicator label="2 live" />
        </div>

        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <ChipToggle
              key={f}
              pressed={filter === f}
              onClick={() => setFilter(f)}
            >
              {f}
            </ChipToggle>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          {FIXTURES.map((f) => (
            <FixtureRow
              key={f.id}
              interactive
              home={f.home}
              away={f.away}
              homeScore={f.homeScore}
              awayScore={f.awayScore}
              status={f.status}
              statusLabel={f.statusLabel}
              minute={f.minute}
              kickoff={f.kickoff}
            />
          ))}
        </div>
        <p className="text-fg-subtle text-xs">
          Each row is the touch target — tap anywhere. Rows use{" "}
          <code>--radius-row</code> (10px) and the <code>flat</code> elevation
          recipe.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <Eyebrow tone="primary">Stat blocks</Eyebrow>
        <Card tone="raised">
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
            <StatBlock label="Goals" value="14" hint="+3 this month" />
            <StatBlock label="Assists" value="7" hint="2nd in league" />
            <StatBlock label="Clean sheets" value="5" tone="success" />
            <StatBlock label="Cards" value="3" tone="danger" hint="1 red" />
          </div>
        </Card>
        <p className="text-fg-subtle text-xs">
          Every numeral rides <code>.kx-numeric</code> — tabular, so digits hold
          their column when these stack in a table.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <Eyebrow tone="primary">Crests &amp; identity</Eyebrow>
        <Card tone="raised">
          <div className="flex flex-wrap items-end gap-5">
            {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
              <div key={size} className="flex flex-col items-center gap-2">
                <Crest name="Lamashegu Warriors" size={size} />
                <span className="text-fg-subtle text-[0.65rem]">{size}</span>
              </div>
            ))}
          </div>
          <p className="text-fg-muted mt-4 text-sm">
            Grassroots clubs mostly have no crest, so the initials fallback is
            the common case, not the exception. Not round — a crest is an
            institution, an avatar is a person.
          </p>
        </Card>
      </section>

      <section className="flex flex-col gap-3">
        <Eyebrow tone="primary">Status &amp; state</Eyebrow>
        <Card tone="raised">
          <div className="flex flex-wrap items-center gap-2">
            <LiveIndicator minute="67'" />
            <Badge intent="success">Confirmed</Badge>
            <Badge intent="warning">Awaiting</Badge>
            <Badge intent="danger">Disputed</Badge>
            <Badge>Scheduled</Badge>
          </div>
          <p className="text-fg-muted mt-4 text-sm">
            <code>--live</code> appears exactly once, in{" "}
            <code>LiveIndicator</code>. Rationing it is what keeps it meaning
            &ldquo;happening right now&rdquo;.
          </p>
        </Card>
      </section>

      <section className="flex flex-col gap-3">
        <Eyebrow tone="primary">Controls</Eyebrow>
        <Card tone="raised">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <Button intent="primary">Primary</Button>
              <Button intent="secondary">Secondary</Button>
              <Button intent="accent">Accent</Button>
              <Button intent="success">Success</Button>
              <Button intent="danger">Danger</Button>
              <Button intent="ghost">Ghost</Button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
              <Button loading loadingText="Saving">
                Save
              </Button>
              <Button disabled>Disabled</Button>
            </div>
            <p className="text-fg-subtle text-xs">
              Tab through these — the focus ring is cyan, offset off the fill, so
              it stays visible on every intent including primary. Small stays a
              36px box but has a 44px hit area.
            </p>
          </div>
        </Card>
      </section>

      <section className="flex flex-col gap-3">
        <Eyebrow tone="primary">Numerals at display scale</Eyebrow>
        <Card tone="raised">
          <div className="flex flex-wrap items-baseline gap-6">
            <StatValue size="score">3</StatValue>
            <StatValue size="xl">17</StatValue>
            <StatValue size="lg" tone="live">
              67&apos;
            </StatValue>
            <StatValue size="md" tone="primary">
              +9
            </StatValue>
          </div>
        </Card>
      </section>
    </div>
  );
}
