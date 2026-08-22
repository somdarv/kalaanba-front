"use client";

import { ChipToggle, useToast } from "@/components/ui";
import { useUpdatePlayer } from "@/lib/api/hooks/use-player";
import { labelFor, type MyPlayer, type PlayerMeta } from "@/lib/api/player";

import { MeSection } from "./me-section";

/**
 * Availability — the one control on `/me` that writes on a single tap.
 *
 * It earns that because of §12: a player's availability feeds the club
 * readiness summary, so this is the field with a consequence past this page.
 * Everything else here is either read-only or edited behind a sheet.
 *
 * The options come from `meta.availability` (ADR-0007), so an admin renaming
 * "Available" to "Ready to go" reaches this row without a deploy, and the
 * `description` a config author wrote for each option is shown rather than
 * discarded (§24 treats those as part of the vocabulary).
 *
 * The write is optimistic in `useUpdatePlayer` — a control that waits for a
 * round trip on a Ghanaian mobile connection reads as broken. This component
 * only decides what to SAY about the outcome; the hook owns putting the record
 * back if the server refuses.
 *
 * `<ChipToggle>` rather than a radio group: it carries `aria-pressed` and
 * recovers its 44px target through `tapExpand` (DESIGN_LANGUAGE §9.1), and the
 * set is short enough to read as a row of choices rather than a list.
 */

export type AvailabilityBlockProps = {
  player: MyPlayer;
  meta: PlayerMeta;
};

export function AvailabilityBlock({ player, meta }: AvailabilityBlockProps) {
  const { push } = useToast();
  const update = useUpdatePlayer(player);

  const current = player.availability_status;
  const currentDescription = meta.availability.find(
    (option) => option.key === current,
  )?.description;

  const choose = (key: string) => {
    if (key === current || update.isPending) return;

    update.mutate(
      { availability_status: key },
      {
        onSuccess: () => {
          push({ title: "Availability saved", tone: "success" });
        },
        onError: () => {
          push({
            title: "That did not save",
            description: "Check your connection and tap again.",
            tone: "danger",
          });
        },
      },
    );
  };

  return (
    <MeSection title="When can you play" description="Clubs near you see this.">
      <div
        className="flex flex-wrap gap-2"
        role="group"
        aria-label="Your availability"
      >
        {meta.availability.map((option) => (
          <ChipToggle
            key={option.key}
            pressed={option.key === current}
            onClick={() => choose(option.key)}
            disabled={update.isPending}
          >
            {option.label}
          </ChipToggle>
        ))}
      </div>

      {/* The config author's own line for the selected option. `aria-live` so a
          screen reader hears the description change after a tap, which is the
          only feedback the toast does not already carry. */}
      <p className="text-fg-muted mt-3 text-sm" aria-live="polite">
        {currentDescription ??
          `You are set to ${labelFor(meta.availability, current) ?? current}.`}
      </p>
    </MeSection>
  );
}
