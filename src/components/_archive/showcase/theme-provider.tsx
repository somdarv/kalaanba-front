"use client";

/**
 * Inert stub — the live theme system was removed. Archived showcase
 * components keep importing `useKxTheme` / `KxThemeProvider` /
 * `KxThemeToggle`, so these no-op exports keep the archive routes
 * building. The toggle renders nothing; the hook returns a fixed
 * dark mode. Do NOT use in new code.
 */

export function useKxTheme() {
  return {
    mode: "dark" as const,
    toggle: () => {},
  };
}

export function KxThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
