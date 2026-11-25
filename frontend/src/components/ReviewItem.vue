<script setup lang="ts">
import { ThumbsUp, ThumbsDown, Clock, Trash2, User } from 'lucide-vue-next';
import { formatDate } from '@/utils/format';
import type { Review } from '@/types';

defineProps<{ review: Review }>();
const emit = defineEmits<{ delete: [id: string] }>();
</script>

<template>
  <li class="rounded-box bg-base-100 p-4">
    <div class="flex flex-wrap items-center gap-x-4 gap-y-1">
      <span
        class="flex items-center gap-1 font-semibold"
        :class="review.is_recommended ? 'text-success' : 'text-error'"
      >
        <ThumbsUp v-if="review.is_recommended" :size="18" />
        <ThumbsDown v-else :size="18" />
        {{ review.is_recommended ? 'Рекомендую' : 'Не рекомендую' }}
      </span>
      <span class="flex items-center gap-1 text-sm opacity-70"><User :size="14" /> {{ review.author }}</span>
      <span class="flex items-center gap-1 text-sm opacity-70"><Clock :size="14" /> {{ review.hours_played }} год.</span>
      <span class="text-sm opacity-50">{{ formatDate(review.created_at) }}</span>
      <button class="btn btn-ghost btn-xs ml-auto text-error" title="Видалити відгук" @click="emit('delete', review.id)">
        <Trash2 :size="16" />
      </button>
    </div>
    <p class="mt-2 whitespace-pre-line">{{ review.text }}</p>
  </li>
</template>
