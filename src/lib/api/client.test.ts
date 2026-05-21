import { describe, it, expect, vi } from "vitest";
import { z } from "zod";
import { createApiClient } from "./client";
import { ApiError } from "./envelope";

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function mockFetch(
  impl: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>,
) {
  return vi.fn<typeof fetch>(impl as unknown as typeof fetch);
}

function headersFromCall(
  mock: ReturnType<typeof mockFetch>,
  index = 0,
): Record<string, string> {
  const call = mock.mock.calls[index];
  if (!call) throw new Error(`no call at index ${index}`);
  const init = call[1];
  return (init?.headers ?? {}) as Record<string, string>;
}

describe("createApiClient", () => {
  const baseUrl = "https://api.test/api/v1";

  it("attaches Bearer token when getToken returns a value", async () => {
    const fetchImpl = mockFetch(async () =>
      jsonResponse(200, { data: { ok: true } }),
    );
    const client = createApiClient({
      baseUrl,
      getToken: () => "abc123",
      fetchImpl,
    });

    await client.request({
      path: "/me",
      schema: z.object({ ok: z.boolean() }),
    });

    expect(headersFromCall(fetchImpl).Authorization).toBe("Bearer abc123");
  });

  it("omits Authorization header when no token is available", async () => {
    const fetchImpl = mockFetch(async () =>
      jsonResponse(200, { data: { ok: true } }),
    );
    const client = createApiClient({
      baseUrl,
      getToken: () => null,
      fetchImpl,
    });

    await client.request({
      path: "/me",
      schema: z.object({ ok: z.boolean() }),
    });

    expect(headersFromCall(fetchImpl).Authorization).toBeUndefined();
  });

  it("adds an Idempotency-Key on POST/PUT/PATCH/DELETE", async () => {
    const fetchImpl = mockFetch(async () =>
      jsonResponse(200, { data: { ok: true } }),
    );
    const client = createApiClient({
      baseUrl,
      generateIdempotencyKey: () => "idem-fixed-key",
      fetchImpl,
    });

    for (const method of ["POST", "PUT", "PATCH", "DELETE"] as const) {
      await client.request({
        path: "/things",
        method,
        body: {},
        schema: z.object({ ok: z.boolean() }),
      });
    }

    for (let i = 0; i < fetchImpl.mock.calls.length; i += 1) {
      expect(headersFromCall(fetchImpl, i)["Idempotency-Key"]).toBe(
        "idem-fixed-key",
      );
    }
  });

  it("does NOT add Idempotency-Key on GET", async () => {
    const fetchImpl = mockFetch(async () =>
      jsonResponse(200, { data: { ok: true } }),
    );
    const client = createApiClient({ baseUrl, fetchImpl });

    await client.request({
      path: "/things",
      schema: z.object({ ok: z.boolean() }),
    });

    expect(headersFromCall(fetchImpl)["Idempotency-Key"]).toBeUndefined();
  });

  it("throws ApiError with stable code on standardized error envelope", async () => {
    const fetchImpl = mockFetch(async () =>
      jsonResponse(403, {
        error: {
          code: "auth.super_admin_only",
          message: "Super Admin required",
          request_id: "req-1",
        },
      }),
    );
    const client = createApiClient({ baseUrl, fetchImpl });

    await expect(
      client.request({
        path: "/admin/audit-log",
        schema: z.unknown(),
      }),
    ).rejects.toMatchObject({
      name: "ApiError",
      status: 403,
      code: "auth.super_admin_only",
      requestId: "req-1",
    });
  });

  it("throws ApiError with api.unknown_error for non-envelope error bodies", async () => {
    const fetchImpl = mockFetch(
      async () => new Response("oops", { status: 500 }),
    );
    const client = createApiClient({ baseUrl, fetchImpl });

    await expect(
      client.request({ path: "/x", schema: z.unknown() }),
    ).rejects.toBeInstanceOf(ApiError);
  });

  it("validates response data with the caller-supplied Zod schema", async () => {
    const fetchImpl = mockFetch(async () =>
      jsonResponse(200, { data: { name: 42 } }),
    );
    const client = createApiClient({ baseUrl, fetchImpl });

    await expect(
      client.request({
        path: "/me",
        schema: z.object({ name: z.string() }),
      }),
    ).rejects.toBeInstanceOf(z.ZodError);
  });

  it("serialises query params and respects baseUrl", async () => {
    const fetchImpl = mockFetch(async () =>
      jsonResponse(200, { data: { ok: true } }),
    );
    const client = createApiClient({ baseUrl, fetchImpl });

    await client.request({
      path: "/items",
      query: { cursor: "abc", limit: 25 },
      schema: z.object({ ok: z.boolean() }),
    });

    const firstCall = fetchImpl.mock.calls[0];
    if (!firstCall) throw new Error("expected one fetch call");
    expect(firstCall[0]).toBe(
      "https://api.test/api/v1/items?cursor=abc&limit=25",
    );
  });
});
