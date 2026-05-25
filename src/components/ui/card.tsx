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
 * Verbatim port of the legacy `KxCard tone="surface"` recipe:
 *   `bg-surface  +  shadow-md  +  rounded-card`
 * No border. The surface + shadow define the card; adding a border
 * makes it look like a panel, not a card.
 *
 * The `tone` and `size` props are retained for backwards compatibility,
 * but every tone resolves to this one recipe. There is intentionally only
 * one card.
 */

export type CardTone = "flat" | "raised";
export type CardSize = "md" | "lg";

const CARD_BASE = "bg-surface text-fg shadow-md";

const TONES: Record<CardTone, string> = {
  flat: CARD_BASE,
  raised: CARD_BASE,
};

const SIZES: Record<CardSize, string> = {
  md: "rounded-[var(--radius-card)] p-5 sm:p-6",
  lg: "rounded-[var(--radius-card-lg)] p-7 sm:p-8",
};

const INTERACTIVE_HOVER = cn(
  "cursor-pointer",
  "hover:shadow-lg",
  "active:shadow-[var(--shadow-pressed)]",
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

function Card(props: DivCardProps, ref: React.Ref<HTMLDivElement>): JSX.Element;
function Card(
  props: ButtonCardProps,
  ref: React.Ref<HTMLButtonElement>,
): JSX.Element;
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
  const classes = cn(TONES[tone], SIZES[size], className);

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
) => JSX.Element;

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
