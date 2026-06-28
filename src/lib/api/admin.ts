"use client";

/**
 * Admin API surface — typed wrappers around the four endpoints used by
 * the native `/admin` panel:
 *
 *   GET    /admin/configs
 *   GET    /admin/zone/area-suggestions
 *   POST   /admin/zone/area-suggestions/{id}/approve
 *   POST   /admin/zone/area-suggestions/{id}/reject
 *
 * Contracts: `contracts/api/admin/get-configs.v1.yaml`,
 * `contracts/api/admin/zone/*.v1.yaml`. Backend is the source of truth
 * (Constitution Law 3) — this module only validates and forwards.
 */

import { z } from "zod";

import { getApiClient } from "./index";

// ─── Schemas ─────────────────────────────────────────────────────────

export const AdminConfigSchema = z.object({
  key: z.string(),
  scope: z.string(),
  scope_id: z.string().nullable(),
  value: z.unknown(),
  version: z.number().int(),
  approval_level: z.string(),
  change_reason: z.string().nullable(),
  effective_from: z.string(),
  effective_until: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type AdminConfig = z.infer<typeof AdminConfigSchema>;

export const AdminConfigListSchema = z.array(AdminConfigSchema);

export const AreaSuggestionStatusSchema = z.enum([
  "pending",
  "approved",
  "rejected",
]);
export type AreaSuggestionStatus = z.infer<typeof AreaSuggestionStatusSchema>;

export const AreaSuggestionSchema = z.object({
  id: z.string(),
  city_hub_id: z.string(),
  proposed_zone_id: z.string().nullable(),
  proposed_name: z.string(),
  note: z.string().nullable(),
  submitted_by_user_id: z.string(),
  status: AreaSuggestionStatusSchema,
  reviewed_by_user_id: z.string().nullable(),
  review_note: z.string().nullable(),
  resulting_area_id: z.string().nullable(),
  submitted_at: z.string(),
  reviewed_at: z.string().nullable(),
});

export type AreaSuggestion = z.infer<typeof AreaSuggestionSchema>;

export const AreaSuggestionListSchema = z.array(AreaSuggestionSchema);

const ApproveResultSchema = z.object({
  id: z.string(),
  status: AreaSuggestionStatusSchema,
  resulting_area_id: z.string().nullable().optional(),
  reviewed_by_user_id: z.string(),
  reviewed_at: z.string(),
  review_note: z.string().nullable(),
});

const RejectResultSchema = z.object({
  id: z.string(),
  status: AreaSuggestionStatusSchema,
  reviewed_by_user_id: z.string(),
  reviewed_at: z.string(),
  review_note: z.string().nullable(),
});

// ─── Calls ───────────────────────────────────────────────────────────

export type ListConfigsParams = {
  engine?: string;
  approval_level?: string;
  limit?: number;
};

export async function listAdminConfigs(
  params: ListConfigsParams = {},
): Promise<AdminConfig[]> {
  return getApiClient().request({
    path: "/admin/configs",
    method: "GET",
    query: params,
    schema: AdminConfigListSchema,
  });
}

export type ListAreaSuggestionsParams = {
  status?: AreaSuggestionStatus;
  limit?: number;
};

export async function listAreaSuggestions(
  params: ListAreaSuggestionsParams = {},
): Promise<AreaSuggestion[]> {
  return getApiClient().request({
    path: "/admin/zone/area-suggestions",
    method: "GET",
    query: params,
    schema: AreaSuggestionListSchema,
  });
}

export type ApproveAreaSuggestionInput = {
  id: string;
  final_name?: string;
  review_note?: string;
  zone_id?: string;
  idempotencyKey: string;
};

export async function approveAreaSuggestion(
  input: ApproveAreaSuggestionInput,
): Promise<z.infer<typeof ApproveResultSchema>> {
  const { id, idempotencyKey, ...body } = input;
  return getApiClient().request({
    path: `/admin/zone/area-suggestions/${id}/approve`,
    method: "POST",
    body,
    idempotencyKey,
    schema: ApproveResultSchema,
  });
}

export type RejectAreaSuggestionInput = {
  id: string;
  review_note?: string;
  idempotencyKey: string;
};

export async function rejectAreaSuggestion(
  input: RejectAreaSuggestionInput,
): Promise<z.infer<typeof RejectResultSchema>> {
  const { id, idempotencyKey, ...body } = input;
  return getApiClient().request({
    path: `/admin/zone/area-suggestions/${id}/reject`,
    method: "POST",
    body,
    idempotencyKey,
    schema: RejectResultSchema,
  });
}

// ─── Users section (WP-20260624) ─────────────────────────────────────

export const AdminUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().nullable(),
  phone_masked: z.string().nullable(),
  auth_method: z.enum(["phone", "email", "both"]),
  status: z.enum(["active", "unverified", "disabled", "archived"]),
  phone_verified: z.boolean(),
  email_verified: z.boolean(),
  role: z.string(),
  created_at: z.string().nullable(),
  last_seen_at: z.string().nullable(),
});

export type AdminUser = z.infer<typeof AdminUserSchema>;
export type AdminUserStatus = AdminUser["status"];

export const AdminUserListSchema = z.array(AdminUserSchema);

export type ListAdminUsersParams = {
  search?: string;
  status?: AdminUserStatus;
  auth_method?: "phone" | "email" | "both";
  sort?: "created_at" | "last_seen_at";
  per_page?: number;
  page?: number;
};

export async function listAdminUsers(
  params: ListAdminUsersParams = {},
): Promise<AdminUser[]> {
  return getApiClient().request({
    path: "/admin/users",
    method: "GET",
    query: params,
    schema: AdminUserListSchema,
  });
}

/** All mutations return the refreshed admin-safe projection. */
export type AdminUserActionInput = {
  id: string;
  /** Required for destructive actions (set password, force-verify). */
  accessCode?: string;
  /** Action-specific payload. */
  body?: Record<string, unknown>;
};

type ActionConfig = {
  path: string;
  method: "POST" | "PATCH";
};

async function runUserAction(
  { id, accessCode, body }: AdminUserActionInput,
  { path, method }: ActionConfig,
): Promise<AdminUser> {
  return getApiClient().request({
    path: `/admin/users/${id}/${path}`,
    method,
    body: body ?? {},
    headers: accessCode ? { "X-Admin-Access-Code": accessCode } : undefined,
    schema: AdminUserSchema,
  });
}

export const adminUserActions = {
  setPassword: (id: string, password: string, accessCode: string) =>
    runUserAction({ id, accessCode, body: { password } }, { path: "password", method: "POST" }),
  forceVerify: (id: string, channel: "phone" | "email", accessCode: string) =>
    runUserAction({ id, accessCode, body: { channel } }, { path: "force-verify", method: "POST" }),
  updatePhone: (id: string, phone_e164: string) =>
    runUserAction({ id, body: { phone_e164 } }, { path: "phone", method: "PATCH" }),
  updateEmail: (id: string, email: string) =>
    runUserAction({ id, body: { email } }, { path: "email", method: "PATCH" }),
  disable: (id: string) => runUserAction({ id }, { path: "disable", method: "POST" }),
  enable: (id: string) => runUserAction({ id }, { path: "enable", method: "POST" }),
  archive: (id: string, accessCode: string) =>
    runUserAction({ id, accessCode }, { path: "archive", method: "POST" }),
  resendOtp: (id: string, phone_e164: string) =>
    runUserAction({ id, body: { phone_e164 } }, { path: "resend-otp", method: "POST" }),
  clearLockout: (id: string) =>
    runUserAction({ id }, { path: "clear-lockout", method: "POST" }),
};
