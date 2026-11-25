import axios, { type AxiosError } from 'axios';
import { useToastStore } from '@/stores/toast.store';
import type { FieldErrors } from '@/types';

export class ApiError extends Error {
  status: number;
  errors: FieldErrors;

  constructor(message: string, status = 0, errors: FieldErrors = {}) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// усі помилки сервера ловимо тут і показуємо тостом
httpClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; errors?: FieldErrors }>) => {
    const toast = useToastStore();

    if (!error.response) {
      toast.error('Сервер недоступний. Перевір, чи запущено бекенд');
      return Promise.reject(new ApiError('Сервер недоступний'));
    }

    const { status, data, config } = error.response;
    const message = data?.message ?? `Помилка сервера (${status})`;

    // 404 при відкритті сторінки гри показує сама сторінка, тост там зайвий
    if (!(status === 404 && config.method === 'get')) toast.error(message);

    return Promise.reject(new ApiError(message, status, data?.errors));
  },
);
