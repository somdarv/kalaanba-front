"use client";

import {
  forwardRef,
  type HTMLAttributes,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";
import { pressableBase } from "./pressable";

/**
 * `<Card>` — the canonical surface primitive.
 *
 * Three real tiers, per DESIGN_LANGUAGE §2.4. Each is a *prescription* —
 * ground + line + (highlight | blur) — not a loose shadow:
 *
 *   flat      inline regions, list rows      surface      + hairline
 *   raised    cards, panels, sticky bars     surface-elev + hairline + inset highlight
 *   floating  modals, popovers, dropdowns    surface-overlay + strong line + blur
 *
 * The recipes live in globals.css as `.elev-*` so non-Card surfaces
 * (sheets, popovers) compose the same thing instead of re-deriving it.
 *
 * History: v2 declared `flat | raised` and resolved BOTH to one string
 * (`bg-surface shadow-md`) — the prop was a no-op. It also dropped the
 * border entirely, inverting §4.3 ("border-strong carries depth before
 * shadow does"), and never implemented the inset top highlight that §2.4
 * calls "what separates this from flat web". The underlying ramp couldn't
 * have carried three tiers anyway: surface→elev was ΔL 0.022. The v3 token
 * migration made the steps uniform, so the tiers are now expressible.
 */

export type CardTone = "flat" | "raised" | "floating";
export type CardSize = "md" | "lg";

const TONES: Record<CardTone, string> = {
  flat: "elev-flat",
  raised: "elev-raised",
  floating: "elev-floating",
};

const SIZES: Record<CardSize, string> = {
  md: "rounded-card p-5 sm:p-6",
  lg: "rounded-panel p-7 sm:p-8",
};

const INTERACTIVE_HOVER = cn(
  "cursor-pointer",
  "hover:border-border-strong hover:bg-[var(--secondary-hover)]",
  "active:shadow-(--shadow-pressed)",
);

type DivCardProps = HTMLAttributes<HTMLDivElement> & {
  tone?: CardTone;
  size?: CardSize;
  interactive?: false;
};

type ButtonCardProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> & {
  tone?: CardTone;
  size?: CardSize;
  interactive: true;
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
};

export type CardProps = DivCardProps | ButtonCardProps;

function Card(props: DivCardProps, ref: React.Ref<HTMLDivElement>): React.JSX.Element;
function Card(
  props: ButtonCardProps,
  ref: React.Ref<HTMLButtonElement>,
): React.JSX.Element;
function Card(
  {
    tone = "raised",
    size = "md",
    interactive,
    className,
    children,
    ...rest
  }: CardProps,
  ref: React.Ref<HTMLDivElement | HTMLButtonElement>,
) {
  const classes = cn("text-fg", TONES[tone], SIZES[size], className);

  if (interactive) {
    const { type = "button", ...buttonRest } =
      rest as ButtonHTMLAttributes<HTMLButtonElement>;
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type={type}
        className={cn(
          pressableBase,
          // Pressable enforces 44px floor — fine for cards too.
          "block w-full text-left",
          classes,
          INTERACTIVE_HOVER,
        )}
        {...buttonRest}
      >
        {children}
      </button>
    );
  }

  return (
    <div
      ref={ref as React.Ref<HTMLDivElement>}
      className={classes}
      {...(rest as HTMLAttributes<HTMLDivElement>)}
    >
      {children}
    </div>
  );
}

const CardWithRef = forwardRef(Card) as <T extends CardProps>(
  props: T & {
    ref?: T extends { interactive: true }
      ? React.Ref<HTMLButtonElement>
      : React.Ref<HTMLDivElement>;
  },
) => React.JSX.Element;

export type CardSectionProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
};

function CardHeader({ className, ...rest }: CardSectionProps) {
  return (
    <div
      className={cn(
        "mb-3 flex items-start justify-between gap-3",
        "[&_h2]:text-base [&_h2]:font-semibold [&_h2]:tracking-tight",
        "[&_h3]:text-[0.95rem] [&_h3]:font-semibold [&_h3]:tracking-tight",
        className,
      )}
      {...rest}
    />
  );
}

function CardContent({ className, ...rest }: CardSectionProps) {
  return (
    <div
      className={cn("text-fg-muted text-sm leading-relaxed", className)}
      {...rest}
    />
  );
}

function CardFooter({ className, ...rest }: CardSectionProps) {
  return (
    <div
      className={cn(
        "mt-4 flex items-center justify-end gap-2 pt-3",
        "border-t border-divider",
        className,
      )}
      {...rest}
    />
  );
}

const Exported = Object.assign(CardWithRef, {
  Header: CardHeader,
  Content: CardContent,
  Footer: CardFooter,
});

export { Exported as Card };
