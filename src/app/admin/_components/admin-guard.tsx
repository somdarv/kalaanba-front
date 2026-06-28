"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { useUser } from "@/lib/api/hooks/use-auth";

/**
 * Gates the native `/admin` panel: only a signed-in super admin sees the
 * children. Anyone else is redirected to `/admin/login`. While the session
 * is resolving we show a neutral loading state rather than flashing content.
 */
export function AdminGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { data: user, isLoading } = useUser();
  const allowed = user?.role === "super_admin";

  useEffect(() => {
    if (!isLoading && !allowed) {
      router.replace("/admin/login");
    }
  }, [isLoading, allowed, router]);

  if (isLoading) {
    return (
      <div className="grid min-h-screen place-items-center text-sm text-muted-foreground">
        Checking access…
      </div>
    );
  }

  if (!allowed) return null; // redirecting

  return <>{children}</>;
}
