/**
 * Next.js instrumentation hook — runs once per runtime (nodejs / edge).
 *
 * Phase 0.8 Observability Lite. Sentry boot is gated on
 * NEXT_PUBLIC_SENTRY_DSN so dev/test builds stay silent until the DSN
 * is provisioned in env.
 */
export async function register(): Promise<void> {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) {
    return;
  }

  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

export { captureRequestError as onRequestError } from "@sentry/nextjs";
