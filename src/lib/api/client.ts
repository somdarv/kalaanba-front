import type { ZodType } from "zod";
import {
  ApiError,
  ApiErrorEnvelopeSchema,
  ApiSuccessEnvelopeSchema,
} from "./envelope";

const MUTATING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

export type ApiClientOptions = {
  baseUrl: string;
  getToken?: () => string | null;
  generateIdempotencyKey?: () => string;
  fetchImpl?: typeof fetch;
};

export type RequestOptions<T> = {
  path: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  query?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
  schema: ZodType<T>;
  idempotencyKey?: string;
  headers?: Record<string, string>;
  signal?: AbortSignal;
};

function buildUrl(
  baseUrl: string,
  path: string,
  query?: Record<string, string | number | boolean | undefined>,
): string {
  const trimmedBase = baseUrl.replace(/\/+$/, "");
  const trimmedPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`${trimmedBase}${trimmedPath}`);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

function defaultIdempotencyKey(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `idem-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function createApiClient(options: ApiClientOptions) {
  const fetchImpl = options.fetchImpl ?? fetch;
  const generateIdempotencyKey =
    options.generateIdempotencyKey ?? defaultIdempotencyKey;

  async function request<T>(opts: RequestOptions<T>): Promise<T> {
    const method = opts.method ?? "GET";
    const url = buildUrl(options.baseUrl, opts.path, opts.query);
    const headers: Record<string, string> = {
      Accept: "application/json",
      ...opts.headers,
    };

    // `FormData` sets its own `Content-Type`, and it has to: the header must
    // carry the multipart boundary the browser generated. Naming the type here
    // would omit the boundary and the server would read an empty upload.
    const isMultipart =
      typeof FormData !== "undefined" && opts.body instanceof FormData;

    if (opts.body !== undefined && !isMultipart) {
      headers["Content-Type"] = "application/json";
    }

    const token = options.getToken?.();
    if (token) headers["Authorization"] = `Bearer ${token}`;

    if (MUTATING_METHODS.has(method)) {
      headers["Idempotency-Key"] =
        opts.idempotencyKey ?? generateIdempotencyKey();
    }

    const response = await fetchImpl(url, {
      method,
      headers,
      body: isMultipart
        ? (opts.body as FormData)
        : opts.body !== undefined
          ? JSON.stringify(opts.body)
          : undefined,
      signal: opts.signal,
    });

    const raw: unknown =
      response.status === 204 ? null : await response.json().catch(() => null);

    if (!response.ok) {
      const parsed = ApiErrorEnvelopeSchema.safeParse(raw);
      if (parsed.success) {
        const { code, message, details, request_id } = parsed.data.error;
        throw new ApiError(response.status, code, message, details, request_id);
      }
      throw new ApiError(
        response.status,
        "api.unknown_error",
        `Request failed with status ${response.status}`,
      );
    }

    if (raw === null) return undefined as T;

    const envelope = ApiSuccessEnvelopeSchema.safeParse(raw);
    if (!envelope.success) {
      throw new ApiError(
        response.status,
        "api.invalid_envelope",
        "Response did not match API envelope",
      );
    }

    return opts.schema.parse(envelope.data.data);
  }

  return { request };
}

export type ApiClient = ReturnType<typeof createApiClient>;
