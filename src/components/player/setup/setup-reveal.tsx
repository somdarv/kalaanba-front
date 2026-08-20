"use client";

import { Button, Card, Divider, Eyebrow, KeyboardFooter } from "@/components/ui";
import { labelFor, type Player, type PlayerMeta } from "@/lib/api/player";

import { PlayerCard } from "./player-card";
import { StepStagger } from "./step-transition";

/**
 * The payoff screen. Renders the player the API just returned — not the local
 * form state — so what is celebrated is what was actually saved
 * (Constitution Law 3).
 *
 * The card arrives first and the record underneath follows a beat later
 * (DESIGN_LANGUAGE §3.1), which is the difference between a screen appearing
 * and a thing being handed over.
 */

export type SetupRevealProps = {
  player: Player;
  meta: PlayerMeta;
  /** Continue out of the flow. Club assignment is a separate journey. */
  onDone: () => void;
};

export function SetupReveal({ player, meta, onDone }: SetupRevealProps) {
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
      <main className="flex-1 px-[max(1.25rem,env(safe-area-inset-left))] pt-10 pb-6">
        <div className="mx-auto flex w-full max-w-md flex-col gap-6">
          <StepStagger index={0}>
            <header className="space-y-2">
              <Eyebrow tone="primary">Profile created</Eyebrow>
              <h1 className="font-display text-3xl leading-tight font-bold tracking-tight text-fg sm:text-4xl">
                You&apos;re on the record.
              </h1>
              <p className="text-sm text-fg-muted">
                This is your card. It grows as you play — verified matches
                only, so every number on it will be one you earned.
              </p>
            </header>
          </StepStagger>

          <StepStagger index={1}>
            <PlayerCard
              player={player}
              positions={meta.positions}
              marketStatuses={meta.market_statuses}
            />
          </StepStagger>

          <StepStagger index={2}>
            <Card tone="raised" size="md">
              {/* Not an <Eyebrow>. That primitive is 12px uppercase on 0.14em tracking
                  (§2.6), which is right for a label announcing a section of a
                  page and too shouty for a caption on a card the player is
                  reading for the first time. Normal case, semibold, normal
                  tracking. */}
              <h3 className="text-sm font-semibold text-fg">Your details</h3>
              <dl className="mt-3">
                {rows.map((row, index) => (
                  <div key={row.label}>
                    {index > 0 ? <Divider /> : null}
                    <div className="flex items-baseline justify-between gap-4 py-2.5">
                      <dt className="text-sm text-fg-muted">{row.label}</dt>
                      <dd className="text-right text-sm font-medium text-fg">
                        {row.value}
                      </dd>
                    </div>
                  </div>
                ))}
              </dl>
            </Card>
          </StepStagger>
        </div>
      </main>

      <KeyboardFooter bordered={false} className="bg-bg/95">
        <div className="mx-auto w-full max-w-md">
          <Button fullWidth size="lg" onClick={onDone}>
            Find a club
          </Button>
        </div>
      </KeyboardFooter>
    </div>
  );
}
