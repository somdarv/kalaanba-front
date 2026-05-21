"use client";

import Echo from "laravel-echo";
import Pusher from "pusher-js";

declare global {
  interface Window {
    Pusher?: typeof Pusher;
    Echo?: Echo<"reverb">;
  }
}

let echo: Echo<"reverb"> | null = null;

/**
 * Lazy Reverb (laravel-echo + pusher-js) initialiser. Reverb arrives in
 * Stage 4; until then this is a configured-but-dormant stub that no part
 * of the app subscribes to. Components MUST NOT call this at import time —
 * call it inside an effect / event handler.
 */
export function getEcho(): Echo<"reverb"> | null {
  if (typeof window === "undefined") return null;
  if (echo) return echo;

  const key = process.env.NEXT_PUBLIC_REVERB_APP_KEY;
  const host = process.env.NEXT_PUBLIC_REVERB_HOST;
  if (!key || !host) return null;

  window.Pusher ??= Pusher;
  echo = new Echo({
    broadcaster: "reverb",
    key,
    wsHost: host,
    wsPort: Number(process.env.NEXT_PUBLIC_REVERB_PORT ?? 8080),
    wssPort: Number(process.env.NEXT_PUBLIC_REVERB_PORT ?? 8080),
    forceTLS: process.env.NEXT_PUBLIC_REVERB_SCHEME === "https",
    enabledTransports: ["ws", "wss"],
  });
  return echo;
}
