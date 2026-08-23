"use client";

import { useEffect, useMemo } from "react";

/**
 * A previewable URL for a Blob held in memory, revoked when it is no longer
 * needed.
 *
 * Used where an image has been chosen but not yet uploaded — a club badge
 * picked during creation, before there is a club id to attach it to. The
 * preview is local, so it is instant and works with no signal.
 *
 * **Derived in `useMemo`, not assigned in an effect.** Setting state from an
 * effect makes React render once with the wrong value and again with the right
 * one, which for an image means a visible flash of the fallback; the compiler
 * lint rejects it for the same reason. The effect here only cleans up.
 *
 * The revoke matters. An object URL is a handle into the document, and one that
 * outlives its preview keeps the decoded image alive for the life of the tab.
 */
export function useObjectUrl(blob: Blob | null | undefined): string | null {
  const url = useMemo(
    () => (blob ? URL.createObjectURL(blob) : null),
    [blob],
  );

  useEffect(() => {
    if (!url) return;

    return () => URL.revokeObjectURL(url);
  }, [url]);

  return url;
}
