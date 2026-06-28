"use client";

import { z } from "zod";

import { getApiClient } from "./index";

// ─── Schemas ─────────────────────────────────────────────────────────

// The API client unwraps the `{ data, meta }` envelope and validates the
// caller's schema against the INNER `data` (see client.ts + client.test.ts).
// All response schemas below therefore describe the inner payload only.

const RoleSchema = z.enum([
  "user",
  "fan",
  "player",
  "club_rep",
  "club_admin",
  "comp_org",
  "referee",
  "officiator",
  "facility_mgr",
  "hub_admin",
  "kalaanba_admin",
  "super_admin",
]);

const SessionUserSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email().nullable().optional(),
  role: RoleSchema,
});

export const SessionResponseSchema = z.object({
  token: z.string(),
  token_type: z.enum(["Bearer"]),
  expires_at: z.string(),
  user: SessionUserSchema,
});

export type SessionResponse = z.infer<typeof SessionResponseSchema>;

/**
 * Account-lookup result — the identifier-first branch signal (ADR-0004).
 * The API envelope's inner `data` is `{ exists, channel }`; the client
 * unwraps the envelope, so this schema validates that inner shape directly.
 */
export const LookupResultSchema = z.object({
  exists: z.boolean(),
  channel: z.enum(["phone", "email"]),
});

export type LookupResult = z.infer<typeof LookupResultSchema>;

/** The authenticated user's own profile (`GET /users/me`). */
export const CurrentUserSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  role: RoleSchema,
  area_id: z.string().nullable().optional(),
  avatar_url: z.string().nullable().optional(),
  email: z.string().email().nullable().optional(),
  email_verified_at: z.string().nullable().optional(),
  phone_e164_last4: z.string().nullable().optional(),
  archived_at: z.string().nullable().optional(),
  last_seen_at: z.string().nullable().optional(),
});

export type CurrentUser = z.infer<typeof CurrentUserSchema>;

export const EmailPasswordCredentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  device_name: z.string().max(64).nullable().optional(),
});

export type EmailPasswordCredentials = z.infer<
  typeof EmailPasswordCredentialsSchema
>;

export const OtpRequestSchema = z.object({
  phone_e164: z
    .string()
    .regex(/^\+[1-9]\d{6,14}$/, "Invalid phone number format"),
  device_name: z.string().max(64).nullable().optional(),
});

export type OtpRequest = z.infer<typeof OtpRequestSchema>;

export const OtpRequestResponseSchema = z.object({
  expires_at: z.string(),
  masked_phone: z.string(),
  otp_length: z.number(),
});

export type OtpRequestResponse = z.infer<typeof OtpRequestResponseSchema>;

export const OtpVerifySchema = z.object({
  phone_e164: z
    .string()
    .regex(/^\+[1-9]\d{6,14}$/, "Invalid phone number format"),
  otp: z.string().regex(/^[0-9]{4,10}$/, "OTP must be 4-10 digits"),
  name: z.string().min(2).max(80).optional(),
  area_id: z.string().uuid().optional(),
  device_name: z.string().max(64).nullable().optional(),
});

export type OtpVerify = z.infer<typeof OtpVerifySchema>;

export const RegistrationResponseSchema = z.union([
  // Phone path — inner data matches the session shape (token issued).
  SessionResponseSchema,
  // Email path — no token; verification pending.
  z.object({
    status: z.string().optional(),
    user_id: z.string().uuid(),
    expires_at: z.string(),
    verification_token: z.string().nullable().optional(),
  }),
]);

export type RegistrationResponse = z.infer<
  typeof RegistrationResponseSchema
>;

export const ErrorResponseSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.unknown().optional(),
    request_id: z.string(),
  }),
});

// ─── Calls ───────────────────────────────────────────────────────────

/**
 * Resolve whether an identifier (phone E.164 or email) has an existing active
 * account, so the entry screen can branch returning-vs-new. Read-only; the
 * server infers the channel from the identifier's shape. Returns no PII.
 */
export async function lookupAccount(
  identifier: string,
): Promise<LookupResult> {
  return getApiClient().request({
    path: "/auth/lookup",
    method: "POST",
    body: { identifier },
    schema: LookupResultSchema,
  });
}

/** Fetch the authenticated user's own profile (requires a stored token). */
export async function getMe(): Promise<CurrentUser> {
  return getApiClient().request({
    path: "/users/me",
    method: "GET",
    schema: CurrentUserSchema,
  });
}

/**
 * Update the authenticated user's profile (partial). Identity §8 —
 * `PATCH /users/me` accepts `name`, `area_id`, `avatar_url`; any other keys are
 * dropped server-side. Used by the post-signup area-onboarding step.
 */
export async function updateMyProfile(
  input: {
    name?: string;
    area_id?: string | null;
    avatar_url?: string | null;
  },
): Promise<CurrentUser> {
  return getApiClient().request({
    path: "/users/me",
    method: "PATCH",
    body: input,
    schema: CurrentUserSchema,
  });
}

export async function loginWithEmailPassword(
  credentials: EmailPasswordCredentials,
): Promise<SessionResponse> {
  const { email, password, device_name } = credentials;
  return getApiClient().request({
    path: "/auth/sessions",
    method: "POST",
    body: { email, password, device_name },
    schema: SessionResponseSchema,
  });
}

export async function requestOtp(
  input: OtpRequest,
): Promise<OtpRequestResponse> {
  const { phone_e164, device_name } = input;
  return getApiClient().request({
    path: "/auth/otp/request",
    method: "POST",
    body: { phone_e164, device_name },
    schema: OtpRequestResponseSchema,
  });
}

export async function verifyOtpForLogin(
  input: { phone_e164: string; otp: string; device_name?: string | null },
): Promise<SessionResponse> {
  const { phone_e164, otp, device_name } = input;
  return getApiClient().request({
    path: "/auth/otp/verify",
    method: "POST",
    body: { phone_e164, otp, device_name },
    schema: SessionResponseSchema,
  });
}

export async function registerWithOtp(
  input: {
    phone_e164: string;
    otp: string;
    name: string;
    /** Optional — area is set later on the profile screen. */
    area_id?: string | null;
    device_name?: string | null;
  },
): Promise<RegistrationResponse> {
  const { phone_e164, otp, name, area_id, device_name } = input;
  return getApiClient().request({
    path: "/auth/registration",
    method: "POST",
    // `channel` is a required discriminator on the registration contract.
    body: { channel: "phone", phone_e164, otp, name, area_id, device_name },
    schema: RegistrationResponseSchema,
  });
}

export async function registerWithEmail(
  input: {
    email: string;
    password: string;
    name: string;
    /** Optional — area is set later on the profile screen. */
    area_id?: string | null;
    device_name?: string | null;
  },
): Promise<RegistrationResponse> {
  const { email, password, name, area_id, device_name } = input;
  return getApiClient().request({
    path: "/auth/registration",
    method: "POST",
    body: { channel: "email", email, password, name, area_id, device_name },
    schema: RegistrationResponseSchema,
  });
}

/**
 * Confirm an email verification token. On the registration path this returns
 * a full session (token + user); the API client stores the token.
 */
export async function verifyEmail(
  input: { token: string },
): Promise<SessionResponse> {
  return getApiClient().request({
    path: "/auth/email/verify",
    method: "POST",
    body: { token: input.token },
    schema: SessionResponseSchema,
  });
}

export async function logout(): Promise<void> {
  await getApiClient().request({
    path: "/auth/sessions/current",
    method: "DELETE",
    schema: z.undefined(),
  });
}