import { z } from "zod";

/**
 * Standard API error envelope (defined in contracts/api/).
 * Stable error codes follow `engine.specific_reason`.
 */
export const ApiErrorEnvelopeSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.record(z.string(), z.unknown()).optional(),
    request_id: z.string().optional(),
  }),
});

export type ApiErrorEnvelope = z.infer<typeof ApiErrorEnvelopeSchema>;

/**
 * Standard API success envelope.
 * Generic `data` is validated by the caller's Zod schema.
 */
export const ApiSuccessEnvelopeSchema = z.object({
  data: z.unknown(),
  // `meta` is opaque to the client (we only return `data`). Keep it lenient:
  // some endpoints serialise it as an object, others as an empty array
  // (`meta: []` from PHP) — neither should ever break response parsing.
  meta: z.unknown().optional(),
});

export type ApiSuccessEnvelope<T> = { data: T; meta?: Record<string, unknown> };

/**
 * Thrown for any non-2xx response. Carries the stable error code so callers
 * can switch on `error.code` without parsing messages.
 */
export class ApiError extends Error {
  override readonly name = "ApiError";

  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly details?: Record<string, unknown>,
    readonly requestId?: string,
  ) {
    super(message);
  }
}
