"use client";

import { X } from "@phosphor-icons/react";

import { ButtonLink, IconButton, Wordmark } from "@/components/ui";

/**
 * The first thing a new visitor reads on `/`.
 *
 * Kalaanba is an open home, not a walled dashboard (JOURNAL 2026-06-26): a
 * signed-out visitor gets the same shell as a signed-in one, and login is a
 * personalisation layer rather than a front door. So this cannot be a login
 * wall. It states what the product is, once, and offers the one action that
 * starts a career.
 *
 * Dismissible, and gone for good once dismissed. A pitch you have already read
 * is furniture, and the home's job the second time you open it is the football,
 * not the sales line. Dismissal is local state, not profile state: it is a
 * presentation preference, and Identity does not own a column for it.
 *
 * Per DESIGN_LANGUAGE §4.3 there is exactly one primary action here.
 */

export type HomeHeroProps = {
  /** Where the primary action goes. Differs signed-in vs signed-out. */
  ctaHref: string;
  ctaLabel: string;
  onDismiss: () => void;
};

export function HomeHero({ ctaHref, ctaLabel, onDismiss }: HomeHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-card bg-surface p-5 elev-raised sm:p-7">
      <IconButton
        className="absolute top-2 right-2"
        intent="ghost"
        size="sm"
        label="Hide this"
        icon={<X size={16} weight="bold" />}
        onClick={onDismiss}
      />

      <Wordmark size="md" className="text-primary" />

      <h1 className="mt-4 font-display text-2xl leading-[1.1] font-bold tracking-tight text-balance text-fg sm:text-3xl">
        Your game, on the record.
      </h1>
      <p className="mt-2 max-w-prose text-sm leading-relaxed text-fg-muted">
        Kalaanba keeps the record of the football you already play. Your
        matches, your goals, your club.
      </p>

      <ButtonLink className="mt-5" size="lg" href={ctaHref}>
        {ctaLabel}
      </ButtonLink>
    </section>
  );
}
