"use client";

import { useEffect, useState } from "react";

/**
 * The fragment currently in the address bar, without the `#`.
 *
 * The rail on `/me/v2` is a set of in-page anchors, so "which one is current"
 * is a fact the browser already holds. Reading it beats a scroll observer here
 * for three reasons: a deep link paints the right tile on arrival, the back
 * button works, and at `lg` every region is on screen at once, which makes
 * "what am I scrolled to" meaningless and "what did I jump to" the honest
 * question.
 *
 * Read inside the effect rather than during render, so the server and the
 * first client paint agree and nothing hydrates twice.
 */
export function useActiveHash(): string | null {
  const [hash, setHash] = useState<string | null>(null);

  useEffect(() => {
    const read = () => setHash(window.location.hash.slice(1) || null);
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);

  return hash;
}
