"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * A string preference that lives in the browser and nowhere else.
 *
 * Two of these exist now (the dismissed home pitch, the hub you are browsing)
 * and both are presentation state: which City Hub you are looking at is not a
 * fact about you, and Identity owns no column for either. Putting them on the
 * profile would make a rendering choice into backend truth, which is the wrong
 * direction across the boundary in Law 3.
 *
 * Read through `useSyncExternalStore` rather than mirrored into `useState` from
 * an effect. Mirroring means a setState inside an effect on every mount, which
 * is a cascading render, and it is the pattern `ThemeProvider` already avoids
 * the same way.
 *
 * The `storage` event only fires in OTHER tabs, so a write in this one is
 * broadcast through a module-level listener set. Both paths land on the same
 * snapshot, so two components reading the same key never disagree.
 */

type Listener = () => void;

const listeners = new Map<string, Set<Listener>>();

function listenersFor(key: string): Set<Listener> {
  let set = listeners.get(key);
  if (!set) {
    set = new Set();
    listeners.set(key, set);
  }
  return set;
}

function read(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    // Safari in private mode throws on localStorage. A preference that cannot
    // be stored is a preference at its default, never a crashed page.
    return null;
  }
}

export function writeLocalPreference(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // As above. The set is still broadcast so this tab reflects the choice
    // for as long as it is open.
  }
  listenersFor(key).forEach((listener) => listener());
}

/**
 * @param key       storage key, `kx:`-namespaced by convention.
 * @param serverValue what the server renders. It cannot read localStorage, so
 *                    this is the value baked into the prerendered HTML.
 */
export function useLocalPreference(
  key: string,
  serverValue: string | null = null,
) {
  const subscribe = useCallback(
    (onStoreChange: Listener) => {
      const set = listenersFor(key);
      set.add(onStoreChange);
      window.addEventListener("storage", onStoreChange);
      return () => {
        set.delete(onStoreChange);
        window.removeEventListener("storage", onStoreChange);
      };
    },
    [key],
  );

  const getSnapshot = useCallback(() => read(key), [key]);
  const getServerSnapshot = useCallback(() => serverValue, [serverValue]);

  const value = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const set = useCallback(
    (next: string) => writeLocalPreference(key, next),
    [key],
  );

  return [value, set] as const;
}
