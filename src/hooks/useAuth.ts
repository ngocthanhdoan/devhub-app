import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { prompt } from '@/api/client';
import type { Driver } from '@/types';

const AUTH_KEY = 'devhub_auth';

export interface AuthState {
  isLoggedIn: boolean;
  phone: string | null;
  driver: Driver | null;
}

function getStoredAuth(): AuthState {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return { isLoggedIn: false, phone: null, driver: null };
}

function setStoredAuth(state: AuthState): void {
  localStorage.setItem(AUTH_KEY, JSON.stringify(state));
}

export function clearStoredAuth(): void {
  localStorage.removeItem(AUTH_KEY);
}

export function useAuth(): AuthState {
  return getStoredAuth();
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (vars: { phone: string; password: string }) => {
      const res = await prompt<{ driver: Driver; token: string }>('LOGIN', 'login', vars);
      const authState: AuthState = { isLoggedIn: true, phone: vars.phone, driver: res.data.driver };
      setStoredAuth(authState);
      queryClient.invalidateQueries();
      return res;
    },
    retry: false,
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await prompt('LOGIN', 'logout');
      clearStoredAuth();
      queryClient.invalidateQueries();
    },
    retry: false,
  });
}

export function useIsLoggedIn(): boolean {
  return getStoredAuth().isLoggedIn;
}
