"use client";

import { ButtonLink, BottomSheet, Divider } from "@/components/ui";

import { HubPicker } from "./hub-picker";
import { NavLink } from "./nav-link";
import { PRIMARY_NAV, UTILITY_NAV } from "./nav-items";

/**
 * The nav, on a phone.
 *
 * A sheet rather than a bottom tab bar. A tab bar is a bigger decision than a
 * menu: it commits every screen in the product to a persistent bottom row and
 * to exactly four or five top-level destinations, and five of the six here do
 * not exist yet, so there is nothing to commit to. `<AppShell>` keeps a
 * `bottomNav` slot for the day that call is made.
 *
 * `<BottomSheet>` because it opens from the thumb rather than from the top of
 * the screen, which is where the hand already is (§9.1). It brings its own
 * focus trap, Escape handling and swipe-to-dismiss.
 *
 * Order is deliberate: the hub first (it scopes everything below it), then
 * the football, then the audience doors, then the way in. Sign-up sits at the
 * bottom because it is the one thing here a signed-out visitor is most likely
 * to want and the thumb reaches the bottom first.
 */

export type MobileNavSheetProps = {
  open: boolean;
  onOpenChange: (next: boolean) => void;
  isSignedIn: boolean;
};

export function MobileNavSheet({
  open,
  onOpenChange,
  isSignedIn,
}: MobileNavSheetProps) {
  const close = () => onOpenChange(false);

  return (
    <BottomSheet open={open} onOpenChange={onOpenChange} title="Menu">
      <div className="flex flex-col gap-5 pb-2">
        <HubPicker className="self-start" />

        <nav aria-label="Primary">
          <ul className="flex flex-col">
            {PRIMARY_NAV.map((item) => (
              <li key={item.key}>
                <NavLink item={item} variant="stacked" onNavigate={close} />
              </li>
            ))}
          </ul>
        </nav>

        <Divider />

        <nav aria-label="More">
          <ul className="flex flex-col">
            {UTILITY_NAV.map((item) => (
              <li key={item.key}>
                <NavLink item={item} variant="stacked" onNavigate={close} />
              </li>
            ))}
          </ul>
        </nav>

        {isSignedIn ? null : (
          <div className="flex flex-col gap-2">
            <ButtonLink href="/auth/signup" size="lg" fullWidth onClick={close}>
              Get started
            </ButtonLink>
            <ButtonLink
              href="/auth/login"
              intent="secondary"
              size="lg"
              fullWidth
              onClick={close}
            >
              Sign in
            </ButtonLink>
          </div>
        )}
      </div>
    </BottomSheet>
  );
}
