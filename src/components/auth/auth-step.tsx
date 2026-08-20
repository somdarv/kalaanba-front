"use client";

import type { FormEvent, ReactNode } from "react";

import { KeyboardFooter } from "@/components/ui";
import { cn } from "@/lib/cn";

/**
 * `<AuthStep>` — the frame every step of the auth flow renders into.
 *
 * Six steps were each re-deriving the same header + `gap-6` stack + submit
 * button, which is how they drifted apart (three different link treatments,
 * two different CTA positions). Rule of three: extracted.
 *
 * The shape it enforces, per DESIGN_LANGUAGE:
 *   - §9.3 — a single-CTA form wraps its action in `<KeyboardFooter>` so the
 *     button rides above the on-screen keyboard rather than under it.
 *   - §9.1 — the action is `size="lg"` (56px). Secondary controls in `footer`
 *     must carry their own 44px target.
 *   - §4.3 — exactly one primary action per viewport: `action` is one slot.
 *   - §2.6 — display type, tight tracking, on the headline.
 *
 * Mobile: the body scrolls inside the sheet and the footer sits on the floor
 * of the viewport. Desktop: both are static inside the card, top-aligned, and
 * the panel scrolls as one if the content ever outgrows it.
 */
export type AuthStepProps = {
  /** Optional glyph plate above the headline (confirmation-style steps). */
  icon?: ReactNode;
  /** Headline. Display type, tight tracking — the loudest thing on screen. */
  title: ReactNode;
  /** One line of orienting copy under the headline. */
  subtitle?: ReactNode;
  /** The fields. */
  children: ReactNode;
  /** The single primary action. */
  action: ReactNode;
  /** Secondary controls under the action — channel swap, resend, back. */
  footer?: ReactNode;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  className?: string;
};

export function AuthStep({
  icon,
  title,
  subtitle,
  children,
  action,
  footer,
  onSubmit,
  className,
}: AuthStepProps) {
  return (
    <form
      onSubmit={onSubmit}
      className={cn("flex min-h-0 flex-1 flex-col lg:flex-none", className)}
    >
      <div
        className={cn(
          // Tighter vertical rhythm on a phone than on a desk: the sheet now
          // hugs its content (see `<AuthShell>`), so this stack IS the
          // distance between the headline and the CTA. `gap-7` + `pb-6` put
          // ~68px of nothing between a single field and the button.
          "kx-scroll flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto overscroll-contain",
          "px-5 pt-1 pb-3",
          "lg:flex-none lg:gap-7 lg:overflow-visible lg:px-8 lg:pt-0 lg:pb-0",
        )}
      >
        <header className="space-y-2">
          {icon ? (
            <span className="mb-4 grid size-12 place-items-center rounded-full bg-primary/10 text-primary-ink">
              {icon}
            </span>
          ) : null}
          <h1 className="font-display text-[1.75rem] leading-[1.12] font-bold tracking-tight text-balance text-fg lg:text-[2.5rem]">
            {title}
          </h1>
          {subtitle ? (
            <p className="text-base leading-relaxed text-fg-muted">{subtitle}</p>
          ) : null}
        </header>

        <div className="flex flex-col gap-5">{children}</div>
      </div>

      <KeyboardFooter
        bordered={false}
        className={cn(
          // The sheet's own ground, not the footer bar's — this is the floor
          // of the form, not a separate surface stacked on top of it.
          "shrink-0 bg-bg px-5 pt-3 pb-[max(1.25rem,env(safe-area-inset-bottom))] backdrop-blur-none",
          "lg:static lg:bg-transparent lg:px-8 lg:pt-8 lg:pb-0",
        )}
      >
        <div className="flex flex-col items-center gap-3 lg:gap-4">
          {action}
          {footer}
        </div>
      </KeyboardFooter>
    </form>
  );
}
