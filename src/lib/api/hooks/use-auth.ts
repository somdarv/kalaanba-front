"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { ApiError } from "@/lib/api";
import {
  getMe,
  loginWithEmailPassword,
  logout as logoutApi,
  lookupAccount,
  requestOtp,
  updateMyProfile,
  verifyOtpForLogin,
  registerWithOtp,
  registerWithEmail,
  verifyEmail,
} from "../auth";

const TOKEN_KEY = "kalaanba-auth-token";

function storeToken(token: string) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(TOKEN_KEY, token);
  }
}

function clearToken() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(TOKEN_KEY);
  }
}

function hasToken(): boolean {
  return typeof window !== "undefined" && !!window.localStorage.getItem(TOKEN_KEY);
}

export function useLogin() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: loginWithEmailPassword,
    onSuccess: (data) => {
      storeToken(data.token);
      qc.removeQueries({ queryKey: ["user"] });
    },
    onError: () => {
      clearToken();
    },
  });
}

export function useLogout() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      clearToken();
      qc.removeQueries({ queryKey: ["user"] });
    },
  });
}

/** Identifier-first branch signal — resolves returning-vs-new before action. */
export function useLookup() {
  return useMutation({
    mutationFn: lookupAccount,
  });
}

export function useRequestOtp() {
  return useMutation({
    mutationFn: requestOtp,
  });
}

export function useVerifyOtp() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: verifyOtpForLogin,
    onSuccess: (data) => {
      storeToken(data.token);
      qc.removeQueries({ queryKey: ["user"] });
    },
  });
}

export function useRegister() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: registerWithOtp,
    onSuccess: (data) => {
      // Phone path returns a token; email path does not (verify first).
      if ("token" in data) {
        storeToken(data.token);
        qc.removeQueries({ queryKey: ["user"] });
      }
    },
  });
}

export function useRegisterEmail() {
  // Email signup returns no token — the user must verify their email first.
  return useMutation({
    mutationFn: registerWithEmail,
  });
}

export function useVerifyEmail() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: verifyEmail,
    onSuccess: (data) => {
      storeToken(data.token);
      qc.removeQueries({ queryKey: ["user"] });
    },
  });
}

/**
 * Update the signed-in user's profile (name / area / avatar). On success the
 * cached `["user"]` query is refreshed so guards and screens see the new state.
 */
export function useUpdateProfile() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: updateMyProfile,
    onSuccess: (user) => {
      qc.setQueryData(["user"], user);
    },
  });
}

/**
 * The authenticated user, or `null` when there is no valid session. Reads
 * `GET /users/me` when a token is present; a 401 clears the stale token and
 * resolves to `null` (so guards can redirect to login).
 */
export function useUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      if (!hasToken()) return null;
      try {
        return await getMe();
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          clearToken();
          return null;
        }
        throw error;
      }
    },
    staleTime: 60 * 1000,
    retry: false,
  });
}