"use client";

import { useEffect, useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { IconButton } from "@/components/ui/icon-button";

type ThemeMode = "dark" | "light";
const themeStorageKey = "kalaanba-theme";
const themeChangeEvent = "kalaanba-theme-change";

function getBrowserMode(): ThemeMode {
  if (typeof window === "undefined") return "dark";

  return localStorage.getItem(themeStorageKey) === "light" ? "light" : "dark";
}

function getServerMode(): ThemeMode {
  return "dark";
}

function subscribeToTheme(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(themeChangeEvent, onChange);

  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(themeChangeEvent, onChange);
  };
}

export function ThemeToggle() {
  const mode = useSyncExternalStore(subscribeToTheme, getBrowserMode, getServerMode);

  useEffect(() => {
    document.documentElement.classList.toggle("light", mode === "light");
  }, [mode]);

  function toggle() {
    const next = mode === "dark" ? "light" : "dark";
    document.documentElement.classList.toggle("light", next === "light");
    localStorage.setItem(themeStorageKey, next);
    window.dispatchEvent(new Event(themeChangeEvent));
  }

  return (
    <IconButton
      type="button"
      onClick={toggle}
      aria-label={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {mode === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </IconButton>
  );
}