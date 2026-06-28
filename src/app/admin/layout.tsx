"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import { AdminNav } from "./_components/admin-nav";
import { AdminGuard } from "./_components/admin-guard";

/**
 * `/admin` shell — native admin panel for Super Admins.
 *
 * Access is gated client-side by {@link AdminGuard} (redirects non-admins to
 * `/admin/login`) and server-side by the API's `super_admin` middleware
 * (Constitution Law 3 — the backend remains the source of truth). The login
 * route renders bare, outside the guard + chrome, to avoid a redirect loop.
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <AdminGuard>
      <div className="flex min-h-screen flex-col gap-6 px-4 py-8 sm:px-8 lg:flex-row lg:gap-10">
        <aside className="lg:w-64 lg:shrink-0">
          <AdminNav />
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </AdminGuard>
  );
}
