<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { CircleCheck, CircleAlert } from 'lucide-vue-next';
import { useToastStore } from '@/stores/toast.store';

const toastStore = useToastStore();
const { toasts } = storeToRefs(toastStore);
</script>

<template>
  <div class="toast toast-end z-50">
    <TransitionGroup
      enter-active-class="transition duration-300"
      enter-from-class="translate-x-8 opacity-0"
      leave-active-class="transition duration-200"
      leave-to-class="opacity-0"
    >
      <div
        v-for="toast in toasts"
        :key="toast.id"
        role="status"
        class="alert max-w-sm cursor-pointer"
        :class="toast.type === 'success' ? 'alert-success' : 'alert-error'"
        @click="toastStore.remove(toast.id)"
      >
        <CircleCheck v-if="toast.type === 'success'" :size="18" />
        <CircleAlert v-else :size="18" />
        <span>{{ toast.message }}</span>
      </div>
    </TransitionGroup>
  </div>
</template>
