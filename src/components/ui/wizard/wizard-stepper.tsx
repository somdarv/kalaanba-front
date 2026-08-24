"use client";

import { Spinner } from "@/components/ui";
import { cn } from "@/lib/cn";

/**
 * Progress through a guided flow, as beads on a thread.
 *
 * Replaces the hairline `<Progress>` bar the shell used to carry
 * (WP-20260824-setup-surface), from a supplied design: every step is a dot,
 * the step you are on swells into a pill and says where you are, and the thread
 * behind you is filled while the thread ahead is pale. A bar says "you are 43%
 * through something"; beads say "there are seven of these and this is the
 * third", which is the question someone actually has on step three of a form.
 *
 * **The pill is the only place the count is written.** All twelve steps across
 * the two flows used to print "Step 3 of 7" above their own question, five of
 * them as hardcoded literals that would go stale the moment a step was inserted
 * (which is exactly what happened to the club flow when the badge step landed).
 * The count is derived here, once, and the leads are gone.
 *
 * ## Motion
 *
 * The swell is a `height` and `max-width` transition, which DESIGN_LANGUAGE
 * §3.4 permits only "for special components where the geometric change IS the
 * animation". That is the case here: the pill opening and closing is the whole
 * idea, and there is no transform that expresses it (scaling a dot to pill size
 * would stretch its label). Both are held under `--dur-graceful` as §3.4 asks.
 *
 * §3.4 also says never to run these in lists. Only ONE bead animates geometry
 * at a time — the others cross-fade their fill, which is a colour change. A
 * step change therefore costs two geometry transitions, not N.
 *
 * The horizontal padding lives on the label's own wrapper rather than on the
 * pill, so a collapsed bead is a true circle. `overflow: hidden` at
 * `max-width: 0` clips the padding with the text, which is what keeps `padding`
 * off the animated-properties list (§3.4 forbids animating it).
 *
 * Reduced motion is handled globally (§3.6) — every transition here collapses
 * to 1ms, and the stepper still reads because the states differ in colour and
 * size, not only in how they arrived.
 *
 * ## Accessibility
 *
 * One `progressbar` carrying `aria-valuetext`, which is what `<Progress>`
 * announced before and is the right amount: a screen reader hears "Step 3 of
 * 7" once, not seven dots. The beads are `aria-hidden` because the pill's
 * visible label is the same sentence, and reading both would say it twice.
 *
 * ## Why the pale bead is `--kx-brand-20` and not `bg-primary/20`
 *
 * Tailwind's opacity modifier on a token colour compiles to a color-mix whose
 * pre-@supports fallback is bare `var(--primary)`. An old Android would draw
 * every unreached step at full brand strength, i.e. identical to the steps
 * already done, which is the one distinction this component exists to make.
 * The static tints live in `globals.css` beside the note explaining it.
 */

export type WizardStepperProps = {
  /** 0-based index of the step being answered. */
  stepIndex: number;
  stepCount: number;
  /**
   * What the pill says. Defaults to "Step 3 of 7".
   *
   * A flow with named steps can pass its own word here. Kept as a prop rather
   * than a labels array because the pill only ever shows ONE of them, and a
   * flow that has not decided on names should not have to invent seven.
   */
  label?: string;
  /** Spinner inside the pill: this step is working. */
  busy?: boolean;
  className?: string;
};

export function WizardStepper({
  stepIndex,
  stepCount,
  label,
  busy = false,
  className,
}: WizardStepperProps) {
  const text = label ?? `Step ${stepIndex + 1} of ${stepCount}`;

  return (
    <div
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={stepCount}
      aria-valuenow={stepIndex + 1}
      aria-valuetext={text}
      className={cn("kx-brand-tints flex items-center", className)}
    >
      {Array.from({ length: stepCount }, (_, i) => {
        const isCurrent = i === stepIndex;
        const isDone = i < stepIndex;

        return (
          <div
            key={i}
            aria-hidden
            className={cn(
              "flex items-center",
              // `flex-auto` and not `flex-1`: basis stays the content width, so
              // the pill keeps the room its label needs and only the leftover
              // space is shared. Under `flex-1` every segment gets an equal
              // share regardless of content and the pill's text overflows it.
              i > 0 && "min-w-0 flex-auto",
            )}
          >
            {i > 0 ? (
              <span
                className={cn(
                  "duration-graceful rounded-pill mx-1.5 h-0.5 min-w-2 flex-1 transition-colors ease-out",
                  isDone || isCurrent
                    ? "bg-primary"
                    : "bg-[var(--kx-brand-20)]",
                )}
              />
            ) : null}

            <span
              className={cn(
                "rounded-pill flex min-w-2.5 items-center justify-center",
                "duration-graceful transition-[height,background-color] ease-out",
                isCurrent ? "h-7" : "h-2.5",
                isCurrent || isDone ? "bg-primary" : "bg-[var(--kx-brand-20)]",
              )}
            >
              <span
                className={cn(
                  "duration-graceful flex items-center overflow-hidden transition-[max-width,opacity] ease-out",
                  isCurrent ? "max-w-48 opacity-100" : "max-w-0 opacity-0",
                )}
              >
                <span className="text-on-primary flex items-center gap-1.5 px-3 whitespace-nowrap">
                  {busy ? <Spinner size="xs" /> : null}
                  <span className="text-[0.6875rem] font-bold tracking-[0.1em] uppercase">
                    {text}
                  </span>
                </span>
              </span>
            </span>
          </div>
        );
      })}
    </div>
  );
}
