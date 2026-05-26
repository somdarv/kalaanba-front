/**
 * Sentry — Node.js runtime (Next.js server).
 * Phase 0.8 Observability Lite. Sample rates configurable via env so
 * non-prod stays cheap (Constitution §2 — Configurability over constants).
 */
import * as Sentry from "@sentry/nextjs";

if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.SENTRY_ENVIRONMENT ?? process.env.NODE_ENV,
    release: process.env.SENTRY_RELEASE,
    tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE ?? "0"),
    profilesSampleRate: Number(process.env.SENTRY_PROFILES_SAMPLE_RATE ?? "0"),
    sendDefaultPii: false,
  });
}
