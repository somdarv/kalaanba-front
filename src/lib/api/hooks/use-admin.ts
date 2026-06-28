"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  adminUserActions,
  approveAreaSuggestion,
  listAdminConfigs,
  listAdminUsers,
  listAreaSuggestions,
  rejectAreaSuggestion,
  type AdminUser,
  type AreaSuggestionStatus,
  type ListAdminUsersParams,
  type ListAreaSuggestionsParams,
  type ListConfigsParams,
} from "../admin";

const AREA_SUGGESTIONS_KEY = ["admin", "zone", "area-suggestions"] as const;
const CONFIGS_KEY = ["admin", "configs"] as const;
const USERS_KEY = ["admin", "users"] as const;

export function useAdminConfigs(params: ListConfigsParams = {}) {
  return useQuery({
    queryKey: [...CONFIGS_KEY, params],
    queryFn: () => listAdminConfigs(params),
    staleTime: 30_000,
  });
}

export function useAreaSuggestions(params: ListAreaSuggestionsParams = {}) {
  return useQuery({
    queryKey: [...AREA_SUGGESTIONS_KEY, params],
    queryFn: () => listAreaSuggestions(params),
    staleTime: 15_000,
  });
}

export function useApproveAreaSuggestion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: approveAreaSuggestion,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: AREA_SUGGESTIONS_KEY });
    },
  });
}

export function useRejectAreaSuggestion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: rejectAreaSuggestion,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: AREA_SUGGESTIONS_KEY });
    },
  });
}

// ─── Users section ───────────────────────────────────────────────────

export function useAdminUsers(params: ListAdminUsersParams = {}) {
  return useQuery({
    queryKey: [...USERS_KEY, params],
    queryFn: () => listAdminUsers(params),
    staleTime: 10_000,
  });
}

/**
 * One mutation per admin user action. Each invalidates the users list so the
 * table reflects the new state. `mutationFn` receives the action's arguments.
 */
function useUserActionMutation<TArgs extends unknown[]>(
  action: (...args: TArgs) => Promise<AdminUser>,
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: TArgs) => action(...args),
    onSuccess: () => qc.invalidateQueries({ queryKey: USERS_KEY }),
  });
}

export const useSetUserPassword = () =>
  useUserActionMutation(adminUserActions.setPassword);
export const useForceVerifyUser = () =>
  useUserActionMutation(adminUserActions.forceVerify);
export const useUpdateUserPhone = () =>
  useUserActionMutation(adminUserActions.updatePhone);
export const useUpdateUserEmail = () =>
  useUserActionMutation(adminUserActions.updateEmail);
export const useDisableUser = () => useUserActionMutation(adminUserActions.disable);
export const useEnableUser = () => useUserActionMutation(adminUserActions.enable);
export const useArchiveUser = () => useUserActionMutation(adminUserActions.archive);
export const useResendUserOtp = () =>
  useUserActionMutation(adminUserActions.resendOtp);
export const useClearUserLockout = () =>
  useUserActionMutation(adminUserActions.clearLockout);

export type { AreaSuggestionStatus, AdminUser };
