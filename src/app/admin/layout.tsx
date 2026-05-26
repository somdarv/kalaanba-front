import type { ReactNode } from "react";

import { AdminNav } from "./_components/admin-nav";

/**
 * `/admin` shell — minimal native admin panel for Super Admins.
 *
 * Auth gating is server-side at the API (`super_admin` middleware). The
 * client-side surface is intentionally simple: anyone hitting `/admin`
 * without a Super Admin token will see 401/403 errors in the lists.
 * Constitution Law 3 — backend owns truth, including auth verdicts.
 *
 * Scope: read-only configs + Zone area-suggestion approve/reject queue.
 * Filament's God-Mode panel remains the full admin surface; this is the
 * operations queue Super Admins need without leaving the Next.js shell.
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col gap-6 px-4 py-8 sm:px-8 lg:flex-row lg:gap-10">
      <aside className="lg:w-64 lg:shrink-0">
        <AdminNav />
      </aside>
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
