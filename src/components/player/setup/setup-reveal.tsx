"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, useReducedMotion } from "framer-motion";

import {
  Button,
  Card,
  Divider,
  KeyboardFooter,
  Wordmark,
  flowColumn,
  flowGutter,
} from "@/components/ui";
import { labelFor, type Player, type PlayerMeta } from "@/lib/api/player";

import { PlayerCard } from "./player-card";
import {
  ANNOUNCEMENT_HOLD_MS,
  SetupAnnouncement,
} from "./setup-announcement";
import { RevealBeat } from "./step-transition";

/**
 * The payoff screen. Renders the player the API just returned — not the local
 * form state — so what is celebrated is what was actually saved
 * (Constitution Law 3).
 *
 * Two acts (2026-08-20), per DESIGN_LANGUAGE §3.1 (soft arrival, confident
 * settle) and §3.3 (sequences belong in Framer, not CSS):
 *
 *   1. the tick and "Profile created" hold the top on their own;
 *   2. they leave, and the profile takes the space they were using.
 *
 * `mode="wait"` is what makes act two fill the gap: the announcement finishes
 * leaving before the profile mounts in the same slot, so the content arrives
 * at the top rather than sliding up into it. That also keeps the whole screen
 * on `transform` and `opacity` (§3.4) with no layout animation.
 *
 * The announcement is why there is no "Profile created" eyebrow below. Saying
 * it twice would make the second one noise.
 */

/** Seconds after the profile mounts. The announcement has already run. */
const BEAT = {
  headline: 0,
  note: 0.08,
  card: 0.18,
  record: 0.3,
  cta: 0.38,
} as const;

export type SetupRevealProps = {
  player: Player;
  meta: PlayerMeta;
  /** Straight on to club discovery. */
  onFindClub: () => void;
  /** Out of the flow without picking a club. */
  onGoHome: () => void;
};

export function SetupReveal({
  player,
  meta,
  onFindClub,
  onGoHome,
}: SetupRevealProps) {
  const reduce = useReducedMotion();
  const [hasHeld, setHasHeld] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(
      () => setHasHeld(true),
      ANNOUNCEMENT_HOLD_MS,
    );
    return () => window.clearTimeout(timer);
  }, []);

  // Derived, not set from the effect: reduced motion skips the act outright
  // (§3.6) rather than playing a fast version of it, and the timer is only
  // ever the thing that ends a moment that is actually running.
  const isAnnouncing = !reduce && !hasHeld;

  const rows: ReadonlyArray<{ label: string; value: string }> = [
    {
      label: "Full name",
      value: `${player.first_name} ${player.last_name}`.trim(),
    },
    { label: "Football name", value: player.stage_name },
    {
      label: "Preferred number",
      value: player.preferred_number != null
        ? String(player.preferred_number)
        : "Not set",
    },
    {
      label: "Primary position",
      value: labelFor(meta.positions, player.primary_position) ?? "Not set",
    },
    {
      label: "Availability",
      value:
        labelFor(meta.availability, player.availability_status) ?? "Not set",
    },
  ];

  return (
    <div className="flex min-h-dvh flex-col bg-bg">
      {/* The flow's other screens carry a top bar; the payoff had none, so the
          brand dropped out exactly where the player is being handed something.
          Pink, not theme ink: this is the one screen in the flow that is a
          celebration, and <Wordmark> masks `currentColor` so the brand hue is
          a token away (ADR-0010). No back control — the profile exists, and
          there is nothing behind this screen to go back to. */}
      <header className="kx-chrome sticky top-0 z-20 bg-bg/95 backdrop-blur-md">
        <div className="flex min-h-14 items-center justify-center px-2">
          <Wordmark size="sm" className="text-primary" />
        </div>
      </header>

      <main className={`flex-1 ${flowGutter} pt-8 pb-6`}>
        <div className={flowColumn}>
          {/* No `initial={false}`. AnimatePresence puts that on
              PresenceContext, nested motion components read it, and the whole
              announcement would appear fully formed with the tick already
              stamped. The entrance IS the point here. It only ever applied to
              the first render anyway, so dropping it costs the swap nothing. */}
          <AnimatePresence mode="wait">
            {isAnnouncing ? (
              <SetupAnnouncement key="announcement" />
            ) : (
              <div key="profile" className="flex flex-col gap-6">
                <header className="space-y-2">
                  <RevealBeat delay={BEAT.headline}>
                    <h1 className="font-display text-3xl leading-tight font-bold tracking-tight text-fg sm:text-4xl">
                      You&apos;re on the record.
                    </h1>
                  </RevealBeat>

                  <RevealBeat delay={BEAT.note}>
                    <p className="text-sm text-fg-muted">
                      This is your card. It grows as you play. Only verified
                      matches count, so every number on it is one you earned.
                    </p>
                  </RevealBeat>
                </header>

                <RevealBeat delay={BEAT.card}>
                  <PlayerCard
                    player={player}
                    positions={meta.positions}
                    marketStatuses={meta.market_statuses}
                    availability={meta.availability}
                    featuredStats={meta.card_featured_stats}
                  />
                </RevealBeat>

                <RevealBeat delay={BEAT.record}>
                  <Card tone="raised" size="md">
                    {/* Not an <Eyebrow>. That primitive is 12px uppercase on 0.14em
                        tracking (§2.6), which is right for a label announcing a
                        section of a page and too shouty for a caption on a card
                        the player is reading for the first time. Normal case,
                        semibold, normal tracking. */}
                    <h3 className="text-sm font-semibold text-fg">
                      Your details
                    </h3>
                    <dl className="mt-3">
                      {rows.map((row, index) => (
                        <div key={row.label}>
                          {index > 0 ? <Divider /> : null}
                          <div className="flex items-baseline justify-between gap-4 py-2.5">
                            <dt className="text-sm text-fg-muted">
                              {row.label}
                            </dt>
                            <dd className="text-right text-sm font-medium text-fg">
                              {row.value}
                            </dd>
                          </div>
                        </div>
                      ))}
                    </dl>
                  </Card>
                </RevealBeat>
              </div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Held back until the moment is over, so the announcement is the only
          thing on screen while it runs. Two ways out, one of them primary
          (§4.3): finding a club is the next step of the journey, home is the
          way to leave it.

          Side by side rather than stacked, and `md` rather than `lg`. Stacked
          `lg` buttons cost 128px of a phone's height and pushed the card the
          player just earned off the bottom of the screen, which is the wrong
          thing to hide behind the controls for leaving. 48px still clears the
          §9.1 bar ("48 x 48 preferred for primary actions"), and the pink fill
          carries the hierarchy that the extra height was carrying.

          The primary takes more of the row so "Find a club" cannot wrap at
          320px, which is under the 360px §9.2 design width but still out
          there. */}
      {isAnnouncing ? null : (
        <KeyboardFooter bordered={false} className={`bg-bg/95 ${flowGutter}`}>
          <RevealBeat delay={BEAT.cta} className={flowColumn}>
            <div className="flex items-center gap-3">
              <Button
                intent="ghost"
                size="md"
                className="flex-1"
                onClick={onGoHome}
              >
                Home
              </Button>
              <Button size="md" className="flex-[1.4]" onClick={onFindClub}>
                Find a club
              </Button>
            </div>
          </RevealBeat>
        </KeyboardFooter>
      )}
    </div>
  );
}
