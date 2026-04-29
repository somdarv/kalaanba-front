"use client";

import { useKxTheme } from "@/components/showcase/theme-provider";
import { KxIconButton } from "@/components/showcase/primitives";

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}
function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
    </svg>
  );
}

export function KxThemeToggle() {
  const { mode, toggle } = useKxTheme();
  const isDark = mode === "dark";

  return (
    <KxIconButton
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      variant="soft"
      size="md"
      className="relative overflow-hidden"
    >
      <span
        key={mode}
        className="grid place-items-center"
        style={{ animation: "kx-pop-in 0.3s var(--kx-ease-out) both" }}
      >
        {isDark ? <SunIcon /> : <MoonIcon />}
      </span>
    </KxIconButton>
  );
}
