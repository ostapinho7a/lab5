import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error';
}

export const useToastStore = defineStore('toast', () => {
  const toasts = ref<Toast[]>([]);
  let nextId = 1;

  function remove(id: number) {
    toasts.value = toasts.value.filter((toast) => toast.id !== id);
  }

  function show(message: string, type: Toast['type']) {
    const id = nextId++;
    toasts.value.push({ id, message, type });
    setTimeout(() => remove(id), 3500);
  }

  return {
    toasts,
    remove,
    success: (message: string) => show(message, 'success'),
    error: (message: string) => show(message, 'error'),
  };
});
