"use client";

import Link from "next/link";
import { forwardRef, type ComponentProps, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export type LinkButtonProps = ComponentProps<typeof Link> & {
  /** Tonal vs. plain. Tonal gets a subtle background hover. */
  tone?: "plain" | "tonal";
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
};

/**
 * `<LinkButton>` — a textual link styled like a quiet button.
 * No translate / no scale; only color + (optional) bg cross-fade.
 * The underline grows from center via CSS transform on a pseudo-element.
 */
export const LinkButton = forwardRef<HTMLAnchorElement, LinkButtonProps>(
  function LinkButton(
    { tone = "plain", leadingIcon, trailingIcon, className, children, ...rest },
    ref,
  ) {
    return (
      <Link
        ref={ref}
        className={cn(
          "relative inline-flex items-center gap-2 min-h-11 px-2",
          "text-fg font-medium",
          "transition-[color,background-color] duration-[var(--dur-quick)] ease-[var(--ease-out)]",
          "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring rounded-md",
          "hover:text-primary",
          tone === "tonal" &&
            "hover:bg-[color-mix(in_oklab,transparent,var(--fg)_6%)]",
          className,
        )}
        {...rest}
      >
        {leadingIcon}
        <span className="link-underline">{children}</span>
        {trailingIcon}
      </Link>
    );
  },
);
