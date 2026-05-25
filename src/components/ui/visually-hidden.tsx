import type { ReactNode } from "react";

/**
 * `<VisuallyHidden>` — content stays in the a11y tree but is invisible
 * on screen. Use for labels, status announcements, etc.
 */
export function VisuallyHidden({ children }: { children: ReactNode }) {
  return (
    <span
      style={{
        position: "absolute",
        width: 1,
        height: 1,
        padding: 0,
        margin: -1,
        overflow: "hidden",
        clip: "rect(0,0,0,0)",
        whiteSpace: "nowrap",
        borderWidth: 0,
      }}
    >
      {children}
    </span>
  );
}
