<script setup lang="ts">
import { ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-vue-next';
import { ratingBadge } from '@/utils/format';
import type { RatingStatus } from '@/types';

defineProps<{ status: RatingStatus; count: number; percent: number }>();
</script>

<template>
  <div class="flex flex-wrap items-center gap-2 text-sm">
    <span class="badge gap-1 whitespace-nowrap" :class="ratingBadge[status]">
      <MessageSquare v-if="status === 'No Reviews'" :size="14" />
      <ThumbsDown v-else-if="status === 'Negative'" :size="14" />
      <ThumbsUp v-else :size="14" />
      {{ status }}
    </span>
    <span v-if="count" class="opacity-60">{{ percent }}% з {{ count }}</span>
  </div>
</template>
