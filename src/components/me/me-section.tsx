"use client";

import type { ReactNode } from "react";

import { Card } from "@/components/ui";
import { cn } from "@/lib/cn";

/**
 * One block of `/me`, with its heading row.
 *
 * Every block on this surface is the same shape — a title, an optional status
 * chip beside it, an optional action on the right, then content — so the shape
 * is declared once here rather than re-derived eight times. Composing
 * `<Card tone="raised">` keeps the elevation recipe in the one place
 * DESIGN_LANGUAGE §2.4 puts it ("compose the class; do not re-derive the
 * recipe").
 *
 * The heading is an `<h2>` because the page's `<h1>` is the player's own name
 * on the card. A screen reader running the heading list should hear who this is
 * before it hears what is on the page.
 *
 * `note` sits next to the title rather than under it: on a 360px screen a chip
 * on its own line costs a whole row to say one word.
 */

export type MeSectionProps = {
  title: string;
  /** Status beside the title. A chip or badge, not a sentence. */
  note?: ReactNode;
  /** Right-aligned control on the heading row. */
  action?: ReactNode;
  /** One line under the title, when the block needs framing. */
  description?: ReactNode;
  children: ReactNode;
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
    <Card tone="raised" size="md" className={cn("w-full", className)} id={id}>
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
        <div className="flex min-w-0 items-center gap-2">
          <h2 className="font-display text-fg text-base font-bold tracking-tight">
            {title}
          </h2>
          {note}
        </div>
        {action}
      </div>

      {description ? (
        <p className="text-fg-muted mt-1.5 text-sm">{description}</p>
      ) : null}

      <div className="mt-4">{children}</div>
    </Card>
  );
}

/**
 * A label/value row, the repeating unit inside the details and account blocks.
 *
 * Baseline-aligned rather than centred so a wrapped value still lines its first
 * line up with its label, and `text-right` on the value so a column of them
 * reads as a column.
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
    <div className="flex items-baseline justify-between gap-4 py-2.5">
      <dt className="text-fg-muted shrink-0 text-sm">{label}</dt>
      <dd className="text-fg flex min-w-0 items-baseline gap-2 text-right text-sm font-medium">
        <span className="min-w-0 break-words">{value}</span>
        {trailing}
      </dd>
    </div>
  );
}
