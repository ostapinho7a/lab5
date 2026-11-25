<script setup lang="ts">
import { formatPrice } from '@/utils/format';

withDefaults(defineProps<{ price: number; finalPrice: number; discount: number; large?: boolean }>(), {
  large: false,
});
</script>

<template>
  <div class="flex items-center gap-2">
    <template v-if="discount > 0">
      <span class="badge badge-accent font-bold" :class="large ? 'badge-lg' : ''">-{{ discount }}%</span>
      <span class="text-sm line-through opacity-50">{{ formatPrice(price) }}</span>
      <span class="font-bold text-accent" :class="large ? 'text-3xl' : 'text-lg'">{{ formatPrice(finalPrice) }}</span>
    </template>
    <span v-else class="font-bold" :class="large ? 'text-3xl' : 'text-lg'">{{ formatPrice(price) }}</span>
  </div>
</template>
