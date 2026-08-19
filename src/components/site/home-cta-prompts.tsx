import Link from "next/link";
import { CaretRight, UserCirclePlus, UsersThree } from "@phosphor-icons/react/dist/ssr";

/**
 * HomeCtaPrompts — post-signup soft prompts on the live-activity home
 * (WP-20260702-home-rewire).
 *
 * Two optional entry points, never a forced wizard: become a player, or join a
 * club near you. "Create a club" is intentionally omitted in V1 — the product
 * direction is "join a club near you" first. The destinations (WP-B player
 * profile, WP-C club finder) don't exist yet, so both route to coming-soon
 * stubs.
 *
 * Design: composes tokens from the Card recipe (bg-surface + shadow-md +
 * rounded-card) per DESIGN_LANGUAGE §4; each card is a full next/link tap
 * target well above the 44×44 floor (§9.1); hover is a shadow cross-fade only
 * — no positional motion (§3.1). Server component (no interactivity).
 */

type Prompt = {
  href: string;
  title: string;
  subtitle: string;
  icon: typeof UserCirclePlus;
};

const PROMPTS: Prompt[] = [
  {
    href: "/player/setup",
    title: "Set up your player profile",
    subtitle: "Put your name, number and position on the record.",
    icon: UserCirclePlus,
  },
  {
    href: "/clubs/near-you",
    title: "Join a club near you",
    subtitle: "Find teams playing in your area and ask to join.",
    icon: UsersThree,
  },
];

export function HomeCtaPrompts() {
  return (
    <section
      aria-label="Get started"
      className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6"
    >
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-fg-muted">
        Get started
      </h2>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {PROMPTS.map(({ href, title, subtitle, icon: Icon }) => (
          <li key={href}>
            <Link
              href={href}
              className="group flex min-h-[4rem] items-center gap-4 rounded-[var(--radius-card)] bg-surface p-5 text-fg shadow-md outline-none transition-shadow duration-[var(--dur-quick)] ease-[var(--ease-out)] hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
            >
              <span
                aria-hidden
                className="grid size-11 shrink-0 place-items-center rounded-full bg-surface-2 text-primary"
              >
                <Icon size={22} weight="duotone" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold tracking-tight">
                  {title}
                </span>
                <span className="mt-0.5 block text-sm text-fg-muted">
                  {subtitle}
                </span>
              </span>
              <CaretRight
                aria-hidden
                size={18}
                weight="bold"
                className="shrink-0 text-fg-muted"
              />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
