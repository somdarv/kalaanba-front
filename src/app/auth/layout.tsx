import type { ReactNode } from "react";

import Link from "next/link";
import { Button } from "@/components/ui";

export default function AuthLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
      <div className="w-full max-w-md space-y-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-center flex-1">
            Kalaanba Auth
          </h1>
          <Link href="/" className="text-sm text-muted-foreground hover:text-primary">
            ← Home
          </Link>
        </div>
        <div className="space-y-4">{children}</div>
        <p className="text-xs text-muted-foreground text-center">
          Grassroots football platform — leagues, tournaments, and a verified
          record of every player&apos;s career.
        </p>
      </div>
    </div>
  );
}