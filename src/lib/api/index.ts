import { createApiClient, type ApiClient } from "./client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

let cached: ApiClient | null = null;

function readBrowserToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("kalaanba-auth-token");
}

export function getApiClient(): ApiClient {
  if (!cached) {
    cached = createApiClient({
      baseUrl: `${API_BASE_URL}/api/v1`,
      getToken: readBrowserToken,
    });
  }
  return cached;
}

export { ApiError } from "./envelope";
export type { ApiClient } from "./client";
