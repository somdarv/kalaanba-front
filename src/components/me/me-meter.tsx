"use client";

import { Eyebrow, Progress } from "@/components/ui";

/**
 * A labelled meter in its own tile.
 *
 * Ported from the "Fan vote" row on the Player of the Matchweek panel
 * (`/legacy/landing`, WP-20260823-me-spotlight): a micro-label on the left, the
 * reading on the right, the bar underneath, all boxed. A bare bar sitting
 * straight on the card carried no label of its own and read as decoration under
 * the paragraph above it.
 *
 * `value` arrives already formed. Constitution Law 3 — this displays a reading,
 * it never computes one.
 *
 * **The track is `--border`, not `<Progress>`'s default.** That default is
 * `--surface-elev`, which is the same fill as the card it usually sits on: in
 * light both are within ΔL 0.005 of paper and in dark the card IS
 * `--surface-elev`, so the unfilled part of the bar disappears in both themes.
 * At 0% there is then nothing on screen at all. Overridden here rather than in
 * the primitive because the same defect sits under the wizard, `/me/v2` and the
 * showcase, and fixing it for all four is its own change with its own stamp
 * (DESIGN_LANGUAGE §8).
 *
 * The reference sweeps its fill pink to blue. Not ported: a second bar recipe
 * for one caller is a primitive change, not a call-site one.
 */

export type MeMeterProps = {
  /** Micro-label on the left. Two or three words. */
  label: string;
  /** The reading on the right, already formatted. */
  value: string;
  /** 0 to 100. Presentation only. */
  percent: number;
  /** What the bar means, for a screen reader. */
  srLabel: string;
};

export function MeMeter({ label, value, percent, srLabel }: MeMeterProps) {
  return (
    <div className="rounded-control border-border bg-surface border px-3.5 py-3">
      <div className="flex items-center justify-between gap-3">
        <Eyebrow tone="muted">{label}</Eyebrow>
        <span className="kx-numeric text-fg text-xs font-semibold">
          {value}
        </span>
      </div>
      <Progress
        size="sm"
        value={percent}
        aria-label={srLabel}
        className="bg-border mt-2.5"
      />
    </div>
  );
}
