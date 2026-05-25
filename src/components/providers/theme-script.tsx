import { THEME_STORAGE_KEY } from "@/lib/theme";

/**
 * Inline pre-paint script that resolves the user's theme choice from
 * localStorage (`auto` | `light` | `dark`) and sets `data-theme` +
 * `data-theme-choice` on `<html>` before React hydrates. Prevents a
 * light/dark flash on first paint.
 *
 * Must be rendered inside `<head>` (or at the very top of `<body>`).
 */
export function ThemeScript() {
  const code = `(() => {
  try {
    var key = ${JSON.stringify(THEME_STORAGE_KEY)};
    var stored = null;
    try { stored = window.localStorage.getItem(key); } catch (_) {}
    var choice = stored === "light" || stored === "dark" || stored === "auto" ? stored : "auto";
    var resolved = choice;
    if (resolved === "auto") {
      resolved = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    }
    var root = document.documentElement;
    root.setAttribute("data-theme", resolved);
    root.dataset.themeChoice = choice;
  } catch (_) {}
})();`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
