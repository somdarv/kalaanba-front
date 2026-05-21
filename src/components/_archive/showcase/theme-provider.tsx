"use client";

/**
 * Compat shim — the original archive `KxThemeProvider` was deleted in
 * WP-20260522-theme-rebuild. This file exists ONLY so archived
 * components (`theme-toggle.tsx`, etc.) continue to compile and run by
 * delegating to the new `ThemeProvider` at
 * `@/components/providers/theme-provider`.
 *
 * Do NOT use these exports in new code. New code uses `useTheme()`
 * from `@/components/providers/theme-provider` directly.
 */

import { useTheme } from "@/components/providers/theme-provider";

export function useKxTheme() {
  const { resolvedTheme, setTheme } = useTheme();
  return {
    mode: resolvedTheme,
    toggle: () => setTheme(resolvedTheme === "dark" ? "light" : "dark"),
  };
}

export function KxThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
