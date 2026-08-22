"use client";

import { Check } from "@phosphor-icons/react";

import { BottomSheet, pressableBase } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { LabelledOption } from "@/lib/api/player";

/**
 * Pick when you can play.
 *
 * `<BottomSheet>` because it already morphs to a centred `<Dialog>` at 768px,
 * which is the same one-state-machine-two-geometries trade `<DetailsSheet>`
 * makes.
 *
 * **One tap commits and closes.** There is no Save button because there is one
 * field: a sheet that makes a player choose an option, then confirm the choice
 * they just made, is asking twice. The write is optimistic upstream, so the row
 * behind the sheet is already correct by the time it finishes closing.
 *
 * A radio group rather than chips. Behind a sheet there is room for the config
 * author's description under each option (§24 treats those as part of the
 * vocabulary), and that line is what tells a player the difference between
 * "Available with notice" and "Not sure yet". Roving focus and arrow keys come
 * free with `role="radio"`, which a row of toggle chips does not give.
 *
 * Options and labels come from `meta.availability` (ADR-0007), so an admin
 * renaming one reaches this sheet without a deploy.
 */

export type AvailabilitySheetProps = {
  open: boolean;
  onOpenChange: (next: boolean) => void;
  options: ReadonlyArray<LabelledOption>;
  /** The stable internal key currently on the record. */
  current: string;
  onChoose: (key: string) => void;
  isPending?: boolean;
};

export function AvailabilitySheet({
  open,
  onOpenChange,
  options,
  current,
  onChoose,
  isPending,
}: AvailabilitySheetProps) {
  function choose(key: string) {
    if (key !== current) onChoose(key);
    onOpenChange(false);
  }

  return (
    <BottomSheet
      open={open}
      onOpenChange={onOpenChange}
      title="When can you play"
      description="Clubs near you see this."
      dismissible={!isPending}
    >
      <div role="radiogroup" aria-label="Your availability" className="pb-2">
        {options.map((option) => {
          const isCurrent = option.key === current;

          return (
            <button
              key={option.key}
              type="button"
              role="radio"
              aria-checked={isCurrent}
              disabled={isPending}
              onClick={() => choose(option.key)}
              className={cn(
                pressableBase,
                "rounded-control mt-1 w-full justify-start gap-3 px-3 py-3 text-left",
                "hover:bg-[var(--hover-overlay)]",
                isCurrent && "bg-[var(--hover-overlay)]",
              )}
            >
              <span className="min-w-0 flex-1">
                <span className="text-fg block text-sm font-semibold">
                  {option.label}
                </span>
                {option.description ? (
                  <span className="text-fg-muted mt-0.5 block text-xs">
                    {option.description}
                  </span>
                ) : null}
              </span>

              {/* A tick, not a colour. §6 — colour is never the only signal,
                  and `aria-checked` already carries it for a screen reader. */}
              {isCurrent ? (
                <Check
                  size={18}
                  weight="bold"
                  aria-hidden
                  className="text-primary-ink shrink-0"
                />
              ) : null}
            </button>
          );
        })}
      </div>
    </BottomSheet>
  );
}
