"use client";

import Link from "next/link";
import type { ButtonHTMLAttributes, ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/cn";

/**
 * `<AuthLink>` — the small text control in an auth footer (resend, forgot
 * password, change number, use a different email).
 *
 * Two rules it exists to hold, which the five hand-rolled copies did not:
 *
 *   1. DESIGN_LANGUAGE §9.1 — 44px hit area, no exceptions. These were bare
 *      `<button>`s with a ~20px target. The box is grown to 44px here rather
 *      than expanded with `.kx-tap-expand`, because auth footers stack two of
 *      these: two 20px links with 44px *pseudo* targets would overlap, and the
 *      overlap would silently steal the other link's taps. There is room in a
 *      footer, so the real box takes it.
 *   2. §2.2 — `--primary` is the *fill* role; `--primary-ink` is the text
 *      role. These were `text-primary`, i.e. a fill colour used as ink.
 */

const TONES = {
  primary: "text-primary-ink",
  muted: "text-fg-muted hover:text-fg",
} as const;

export type AuthLinkTone = keyof typeof TONES;

const base = cn(
  "inline-flex min-h-11 items-center justify-center gap-1.5 rounded-pill px-3 py-2.5",
  "text-sm font-semibold underline-offset-4 hover:underline",
  "transition-colors duration-quick ease-out",
  "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring",
);

type AuthLinkProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> & {
  tone?: AuthLinkTone;
  children: ReactNode;
};

/** Button-flavoured link — for in-flow steps that never change the URL. */
export function AuthLink({
  tone = "muted",
  className,
  children,
  ...rest
}: AuthLinkProps) {
  return (
    <button
      type="button"
      className={cn(
        base,
        TONES[tone],
        "disabled:text-fg-subtle disabled:no-underline disabled:hover:no-underline",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

type AuthRouteLinkProps = ComponentProps<typeof Link> & {
  tone?: AuthLinkTone;
};

/** Anchor-flavoured link — for real routes (`next/link`, never `<a href>`). */
export function AuthRouteLink({
  tone = "primary",
  className,
  children,
  ...rest
}: AuthRouteLinkProps) {
  return (
    <Link className={cn(base, TONES[tone], className)} {...rest}>
      {children}
    </Link>
  );
}
