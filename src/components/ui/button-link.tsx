"use client";

import Link from "next/link";
import { forwardRef, type ComponentProps, type ReactNode } from "react";

import { buttonRecipe, type ButtonIntent, type ButtonSize } from "./button";

/**
 * `<ButtonLink>` — looks like `<Button>`, behaves like a link.
 *
 * The gap this fills: engineering-standards §5 requires `next/link` for every
 * internal route and forbids `<a href>`, but a CTA that navigates still has to
 * look like the primary action on the screen. Before this, the only ways to do
 * that were a `<Button onClick={router.push}>` (which loses the anchor, so no
 * middle-click, no open-in-new-tab, no prefetch, and nothing for a screen
 * reader to announce as a link) or restating the Button recipe by hand, which
 * DESIGN_LANGUAGE §4.2 forbids.
 *
 * `<LinkButton>` is a different thing and stays: that is a quiet textual link,
 * this is a filled control.
 *
 * No `loading` prop. A link navigates; it does not have a pending state to
 * report. If an action can be pending, it is a `<Button>`.
 */

export type ButtonLinkProps = ComponentProps<typeof Link> & {
  intent?: ButtonIntent;
  size?: ButtonSize;
  fullWidth?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
};

export const ButtonLink = forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  function ButtonLink(
    {
      intent = "primary",
      size = "md",
      fullWidth,
      leadingIcon,
      trailingIcon,
      className,
      children,
      ...rest
    },
    ref,
  ) {
    return (
      <Link
        ref={ref}
        className={buttonRecipe({ intent, size, fullWidth, className })}
        {...rest}
      >
        {leadingIcon}
        {children}
        {trailingIcon ? (
          <span
            aria-hidden
            className="inline-flex transition-transform duration-graceful ease-out motion-reduce:transition-none group-hover:translate-x-1.25"
          >
            {trailingIcon}
          </span>
        ) : null}
      </Link>
    );
  },
);
