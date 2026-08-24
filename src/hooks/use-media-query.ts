"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Subscribe to a CSS media query from React.
 *
 * `useSyncExternalStore` rather than `useEffect` + `useState`, because a
 * media query IS an external store: the effect version renders once with the
 * wrong answer and then corrects itself, which is a visible flash when the
 * answer decides whether a control opens as a sheet or a popover.
 *
 * **The server snapshot is `false`, and that is a design decision.** Kalaanba
 * is mobile-first (DESIGN_LANGUAGE §9), so the pre-hydration answer to "is
 * this a desktop?" is no. Anything gated on this therefore renders its mobile
 * form first and never flashes the desktop one at a phone.
 *
 * Prefer a CSS media query wherever CSS can express it. This is for the cases
 * where the two forms are different COMPONENTS rather than different styles.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", onStoreChange);
      return () => media.removeEventListener("change", onStoreChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/**
 * The one breakpoint that decides sheet-versus-popover.
 *
 * 768 is `md`, which is where `<BottomSheet>` already says it degrades to a
 * centred dialog. Stated once here so two components cannot disagree about
 * where a phone stops being a phone.
 */
export const DESKTOP_QUERY = "(min-width: 768px)";
