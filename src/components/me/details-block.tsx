"use client";

import { Button, Divider } from "@/components/ui";
import { labelFor, type MyPlayer, type PlayerMeta } from "@/lib/api/player";

import { MeRow, MeSection } from "./me-section";

/**
 * The identity fields (Player & Affiliation §6), read-only here.
 *
 * Rows rather than a form. These change rarely — a football name is picked
 * once — so putting five inputs permanently on the surface would spend the
 * page's whole middle on something nobody is here to do. Editing happens in
 * `<DetailsSheet>`, one deliberate tap away.
 *
 * "Not set" rather than an empty cell for the two nullable fields: a blank row
 * reads as a loading state or a bug, and both of these are legitimately
 * optional at creation.
 *
 * Availability is absent on purpose. It is §12's field with a consequence past
 * this page and lives on the surface as its own control, not as a row here.
 * Listing it twice would give a player two places to change one thing.
 */

export type DetailsBlockProps = {
  player: MyPlayer;
  meta: PlayerMeta;
  onEdit: () => void;
};

export function DetailsBlock({ player, meta, onEdit }: DetailsBlockProps) {
  const fullName = `${player.first_name} ${player.last_name}`.trim();

  const rows: ReadonlyArray<{ label: string; value: string }> = [
    { label: "Football name", value: player.stage_name },
    { label: "Full name", value: fullName },
    {
      label: "Number",
      value:
        player.preferred_number != null
          ? String(player.preferred_number)
          : "Not set",
    },
    {
      label: "Position",
      value: labelFor(meta.positions, player.primary_position) ?? "Not set",
    },
  ];

  return (
    <MeSection
      title="Your details"
      action={
        <Button intent="ghost" size="sm" onClick={onEdit}>
          Edit
        </Button>
      }
    >
      <dl>
        {rows.map((row, index) => (
          <div key={row.label}>
            {index > 0 ? <Divider /> : null}
            <MeRow label={row.label} value={row.value} />
          </div>
        ))}
      </dl>
    </MeSection>
  );
}
