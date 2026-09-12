import axios from 'axios';
import type { ApiResponse } from '@/types';
import { getScreenUrl, type ScreenCode } from '@/constants/screens';
import { mockPrompt } from './mock/handlers';

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function prompt<T = unknown>(
  screenCode: ScreenCode | string,
  action: string,
  payload?: Record<string, unknown>,
): Promise<ApiResponse<T>> {
  if (USE_MOCK) {
    const ms = 300 + Math.random() * 200;
    await delay(ms);
    const result = mockPrompt(screenCode, action, payload);
    if (result.code >= 400) {
      throw result;
    }
    return result as ApiResponse<T>;
  }

  const url = getScreenUrl(screenCode as ScreenCode);
  const body = { action, ...payload };
  const response = await apiClient.post<ApiResponse<T>>(url, body);
  if (response.data.code >= 400) {
    throw response.data;
  }
  return response.data;
}

export { USE_MOCK };
