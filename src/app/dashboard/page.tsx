import type { ReactNode } from "react";

import Link from "next/link";
import { Button } from "@/components/ui";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold text-center">Dashboard</h1>
        <p className="text-center">
          This is a protected route that requires authentication.
          You would see your user information, activities, etc. here.
        </p>
        <div className="space-y-4">
          <Link href="/" className="w-full">
            <Button intent="ghost">← Home</Button>
          </Link>
          <Link href="/auth/login" className="w-full">
            <Button>Login</Button>
          </Link>
          <Link href="/auth/signup" className="w-full">
            <Button intent="secondary">Sign Up</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}