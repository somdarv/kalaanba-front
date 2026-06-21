"use client";

import { useEffect, useState } from "react";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // Check if we have a token in localStorage
    const token = typeof window !== "undefined"
      ? window.localStorage.getItem("kalaanba-auth-token")
      : null;

    setIsAuthenticated(!!token);
    setCheckingAuth(false);
  }, []);

  if (checkingAuth) {
    return <div>Checking authentication...</div>;
  }

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    // Note: In a real app, we'd use Next.js redirect here
    // For now, we'll show a message and link
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
        <div className="w-full max-w-md space-y-6 text-center">
          <h2 className="text-2xl font-bold text-center">Authentication Required</h2>
          <p className="text-muted-foreground">
            Please log in to access the dashboard.
          </p>
          <a href="/auth/login" className="text-primary underline">
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return <div>{children}</div>;
}