"use client";

import { useSyncExternalStore } from "react";

/**
 * Whether the home pitch has been dismissed.
 *
 * localStorage is external state, so it is read with `useSyncExternalStore`
 * rather than mirrored into `useState` from an effect. Mirroring it would mean
 * a setState inside an effect on every mount, which is a cascading render and
 * a lint error, and it is the pattern `ThemeProvider` already avoids the same
 * way.
 *
 * The `storage` event only fires in OTHER tabs, so dismissing in this one is
 * broadcast through a module-level listener set. Both paths land on the same
 * snapshot.
 *
 * The server snapshot is `false` (shown), which is the opposite of where this
 * started. Hiding it server-side kept a dismissed pitch from flashing back on
 * a returning visitor, but the build output showed what it cost: the page's
 * `<h1>` was absent from the prerendered HTML entirely, because the only `<h1>`
 * on `/` lives inside the pitch. On a landing page that is the wrong half of
 * the trade. A crawler and a first-time visitor both get the headline in the
 * first byte now; a returning visitor who dismissed it may see it for the one
 * frame between paint and hydration.
 */

const KEY = "kx:home:hero-dismissed";

let listeners: Array<() => void> = [];

function subscribe(onStoreChange: () => void) {
  listeners = [...listeners, onStoreChange];
  window.addEventListener("storage", onStoreChange);
  return () => {
    listeners = listeners.filter((listener) => listener !== onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function getSnapshot() {
  return window.localStorage.getItem(KEY) === "1";
}

function getServerSnapshot() {
  return false;
}

export function useHeroDismissed() {
  const isDismissed = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const dismiss = () => {
    window.localStorage.setItem(KEY, "1");
    listeners.forEach((listener) => listener());
  };

  return { isDismissed, dismiss };
}
