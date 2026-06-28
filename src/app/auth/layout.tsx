import type { ReactNode } from "react";

/**
 * Auth routes render the full-bleed `<AuthShell>` themselves (hero + form
 * split), so this layout is a passthrough — no chrome, no padding.
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return children;
}
