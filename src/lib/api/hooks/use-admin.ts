"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  approveAreaSuggestion,
  listAdminConfigs,
  listAreaSuggestions,
  rejectAreaSuggestion,
  type AreaSuggestionStatus,
  type ListAreaSuggestionsParams,
  type ListConfigsParams,
} from "../admin";

const AREA_SUGGESTIONS_KEY = ["admin", "zone", "area-suggestions"] as const;
const CONFIGS_KEY = ["admin", "configs"] as const;

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

export type { AreaSuggestionStatus };
