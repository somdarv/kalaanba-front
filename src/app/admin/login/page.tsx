"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { ApiError } from "@/lib/api";
import { useLogin, useLogout } from "@/lib/api/hooks/use-auth";

/**
 * Dedicated sign-in for the native `/admin` panel.
 *
 * Authenticates with email + password (`POST /auth/sessions`) and admits only
 * super admins. A non-admin who authenticates is immediately signed back out —
 * the token is never left usable for the panel.
 */
export default function AdminLoginPage() {
  const router = useRouter();
  const login = useLogin();
  const logout = useLogout();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    try {
      const session = await login.mutateAsync({ email: email.trim(), password });
      if (session.user.role !== "super_admin") {
        // Authenticated, but not an admin — revoke and refuse.
        await logout.mutateAsync().catch(() => {});
        setError("This account isn't an administrator.");
        return;
      }
      router.replace("/admin");
    } catch (err) {
      setError(
        err instanceof ApiError && err.status === 422
          ? "Email or password is incorrect."
          : err instanceof ApiError
            ? `${err.code}: ${err.message}`
            : "Sign-in failed. Try again.",
      );
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-sm flex-col gap-4 rounded-2xl border border-border bg-surface p-6"
      >
        <header className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold text-foreground">Admin sign-in</h1>
          <p className="text-sm text-muted-foreground">
            Super-admin access only.
          </p>
        </header>

        <label className="flex flex-col gap-1 text-sm font-medium text-muted-foreground">
          Email
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground"
            required
          />
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium text-muted-foreground">
          Password
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground"
            required
          />
        </label>

        {error ? (
          <p className="rounded-md border border-danger/40 bg-danger/5 px-3 py-2 text-xs text-danger">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={login.isPending}
          className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
        >
          {login.isPending ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
