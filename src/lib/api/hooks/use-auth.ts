"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  loginWithEmailPassword,
  logout as logoutApi,
  requestOtp,
  verifyOtpForLogin,
  registerWithOtp,
  type SessionResponse,
  type OtpRequest,
} from "../auth";

export function useLogin() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: loginWithEmailPassword,
    onSuccess: (data) => {
      // Store token in localStorage for API client
      if (typeof window !== "undefined") {
        window.localStorage.setItem("kalaanba-auth-token", data.data.token);
      }
      // Invalidate any user-related queries
      qc.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error) => {
      // Clear token on error
      if (typeof window !== "undefined") {
        window.localStorage.removeItem("kalaanba-auth-token");
      }
    },
  });
}

export function useLogout() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      // Remove token from localStorage
      if (typeof window !== "undefined") {
        window.localStorage.removeItem("kalaanba-auth-token");
      }
      // Invalidate user queries
      qc.invalidateQueries({ queryKey: ["user"] });
    },
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
      // Store token in localStorage for API client
      if (typeof window !== "undefined") {
        window.localStorage.setItem("kalaanba-auth-token", data.data.token);
      }
      // Invalidate any user-related queries
      qc.invalidateQueries({ queryKey: ["user"] });
    },
  });
}

export function useRegister() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: registerWithOtp,
    onSuccess: (data) => {
      // If we got a token (phone path), store it
      if ("token" in data.data) {
        if (typeof window !== "undefined") {
          window.localStorage.setItem("kalaanba-auth-token", data.data.token);
        }
        qc.invalidateQueries({ queryKey: ["user"] });
      }
      // For email path, we don't get a token yet - user needs to verify email
    },
  });
}

export function useUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      // TODO: Implement /me endpoint when available
      // For now, we'll return null and handle auth state via token presence
      return null;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}