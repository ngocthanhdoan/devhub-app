import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { prompt } from '@/api/client';
import type { ScreenCode } from '@/constants/screens';
import type { ApiResponse } from '@/types';

export function usePrompt<T = unknown>(
  screenCode: ScreenCode | string,
  action: string,
  payload: Record<string, unknown>,
  options?: { refetchInterval?: number; enabled?: boolean },
) {
  return useQuery<ApiResponse<T>, Error, T>({
    queryKey: [screenCode, action, payload],
    queryFn: async () => prompt<T>(screenCode, action, payload),
    select: (res) => res.data,
    refetchInterval: options?.refetchInterval,
    enabled: options?.enabled,
    retry: false,
  });
}

export function usePromptMutation<T = unknown, V extends Record<string, unknown> = Record<string, unknown>>(
  screenCode: ScreenCode | string,
  action: string,
  options?: { invalidateKeys?: unknown[][] },
) {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<T>, ApiResponse<never>, V>({
    mutationFn: async (vars) => prompt<T>(screenCode, action, vars),
    onSuccess: () => {
      if (options?.invalidateKeys) {
        options.invalidateKeys.forEach((key) => queryClient.invalidateQueries({ queryKey: key }));
      }
    },
    retry: false,
  });
}
