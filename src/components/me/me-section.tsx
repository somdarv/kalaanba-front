"use client";

import type { ReactNode } from "react";

import { Card, Eyebrow } from "@/components/ui";
import { cn } from "@/lib/cn";

/**
 * One block of `/me`, with its heading row.
 *
 * Every block on this surface is the same shape — a title, an optional status
 * chip beside it, an optional action on the right, then content — so the shape
 * is declared once here rather than re-derived eight times. Composing `<Card>`
 * keeps the elevation recipe in the one place DESIGN_LANGUAGE §2.4 puts it
 * ("compose the class; do not re-derive the recipe").
 *
 * **`tone="spotlight"` is an experiment (WP-20260823-me-spotlight), and it
 * replaces `soft` here.** `soft` was the previous attempt at the same problem:
 * under `raised` these blocks were boxes drawn with a line, so six sections
 * down a page read as six outlines rather than six objects. `soft` answered by
 * deleting the line, which on a light ramp with no ground step left the card
 * held together by almost nothing.
 *
 * `spotlight` answers the other way, and takes its answer from the Player of
 * the Matchweek panel on `/legacy/landing`, which is the one surface in this
 * product that already reads the way the owner wants this one to. Keep the
 * line, step the shadow up to `--shadow-md`, and wash the ground underneath
 * (`.kx-ground-spotlight`). The card then reads as an object ON a ground
 * rather than a panel painted onto it. Both halves are needed: the shadow is
 * what the wash is for, and the wash is what makes the shadow legible.
 *
 * The heading takes the same panel's typography. That panel leads with a
 * display headline at tight tracking, and this one led with 16px semibold,
 * which is a list item's weight rather than a section's.
 *
 * What is deliberately NOT ported: the display headline's accent word and the
 * meter's pink-to-blue sweep. One accent per viewport (§4.3), and the page
 * already spends it on the player card at the top. `/me` is the only route
 * composing this tone; an ADR gates it going anywhere else (§8).
 *
 * The heading is an `<h2>` because the page's `<h1>` is the player's own name
 * on the card. A screen reader running the heading list should hear who this is
 * before it hears what is on the page.
 *
 * `note` sits next to the title rather than under it: on a 360px screen a chip
 * on its own line costs a whole row to say one word.
 */

export type MeSectionProps = {
  /**
   * `ReactNode` rather than `string` so a block can set a word of its own
   * heading apart. Nothing does yet, per the accent note above.
   */
  title: ReactNode;
  /** Status beside the title. A chip or badge, not a sentence. */
  note?: ReactNode;
  /** Right-aligned control on the heading row. */
  action?: ReactNode;
  /** One line under the title, when the block needs framing. */
  description?: ReactNode;
  /**
   * Optional: a block whose whole point is its heading row (a title, a state
   * line and one action) has no body, and an empty div still costs its top
   * margin.
   */
  children?: ReactNode;
  className?: string;
  id?: string;
};

export function MeSection({
  title,
  note,
  action,
  description,
  children,
  className,
  id,
}: MeSectionProps) {
  return (
    <Card
      tone="spotlight"
      size="md"
      className={cn("w-full", className)}
      id={id}
    >
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
        <div className="flex min-w-0 items-center gap-2">
          <h2 className="font-display text-fg text-lg font-extrabold tracking-tight sm:text-xl">
            {title}
          </h2>
          {note}
        </div>
        {action}
      </div>

      {description ? (
        <p className="text-fg-muted mt-1.5 text-sm">{description}</p>
      ) : null}

      {children ? <div className="mt-4">{children}</div> : null}
    </Card>
  );
}

/**
 * A label/value row, the repeating unit inside the details and account blocks.
 *
 * Baseline-aligned rather than centred so a wrapped value still lines its first
 * line up with its label, and `text-right` on the value so a column of them
 * reads as a column.
 *
 * The label is an `<Eyebrow>` (WP-20260823-me-spotlight). Two sentence-case
 * columns of the same size left the eye no way in, and the reference panel
 * writes every one of its labels as a tracked uppercase micro-line above or
 * beside the figure it names. Composing the primitive rather than restating
 * its classes keeps §2.6 in the one place it is implemented.
 */
export function MeRow({
  label,
  value,
  trailing,
}: {
  label: ReactNode;
  value: ReactNode;
  trailing?: ReactNode;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-3">
      <Eyebrow as="dt" tone="muted" className="shrink-0">
        {label}
      </Eyebrow>
      <dd className="text-fg flex min-w-0 items-baseline gap-2 text-right text-sm font-semibold">
        <span className="min-w-0 break-words">{value}</span>
        {trailing}
      </dd>
    </div>
  );
}
