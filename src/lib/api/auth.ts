"use client";

import { z } from "zod";

import { getApiClient } from "./index";

// ─── Schemas ─────────────────────────────────────────────────────────

export const SessionResponseSchema = z.object({
  data: z.object({
    token: z.string(),
    token_type: z.enum(["Bearer"]),
    expires_at: z.string().datetime(),
    user: z.object({
      id: z.string().uuid(),
      name: z.string(),
      email: z.string().email().nullable().optional(),
      role: z.enum([
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
      ]),
    }),
  }),
  meta: z.object({
    request_id: z.string(),
    api_version: z.enum(["v1"]),
    idempotent_replay: z.boolean(),
  }),
});

export type SessionResponse = z.infer<typeof SessionResponseSchema>;

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
  data: z.object({
    message: z.string(),
  }),
  meta: z.object({
    request_id: z.string(),
    api_version: z.enum(["v1"]),
    idempotent_replay: z.boolean(),
  }),
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
  // Phone path response (includes token)
  z.object({
    data: z.object({
      token: z.string(),
      token_type: z.enum(["Bearer"]),
      expires_at: z.string().datetime(),
      user: z.object({
        id: z.string().uuid(),
        name: z.string(),
        email: z.string().email().nullable().optional(),
        role: z.enum([
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
        ]),
      }),
    }),
    meta: z.object({
      request_id: z.string(),
      api_version: z.enum(["v1"]),
      idempotent_replay: z.boolean(),
    }),
  }),
  // Email path response (no token, verification needed)
  z.object({
    data: z.object({
      user_id: z.string().uuid(),
      expires_at: z.string().datetime(),
      verification_token: z.string().nullable().optional(),
    }),
    meta: z.object({
      request_id: z.string(),
      api_version: z.enum(["v1"]),
      idempotent_replay: z.boolean(),
    }),
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
    area_id: string;
    device_name?: string | null;
  },
): Promise<RegistrationResponse> {
  const { phone_e164, otp, name, area_id, device_name } = input;
  return getApiClient().request({
    path: "/auth/registration",
    method: "POST",
    body: { phone_e164, otp, name, area_id, device_name },
    schema: RegistrationResponseSchema,
  });
}

export async function logout(): Promise<void> {
  await getApiClient().request({
    path: "/auth/sessions/current",
    method: "DELETE",
    schema: z.undefined(),
  });
}