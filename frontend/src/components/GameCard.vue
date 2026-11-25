<script setup lang="ts">
import type { Game } from '@/types';
import GameCover from './GameCover.vue';
import PriceBlock from './PriceBlock.vue';
import RatingBadge from './RatingBadge.vue';
import DiscountControl from './DiscountControl.vue';

defineProps<{ game: Game }>();
const emit = defineEmits<{ discount: [id: string, discount: number] }>();
</script>

<template>
  <div class="card bg-base-100 shadow-sm transition hover:shadow-lg">
    <RouterLink :to="{ name: 'game', params: { id: game.id } }">
      <figure class="aspect-video">
        <GameCover :src="game.image_url" :alt="game.title" />
      </figure>
    </RouterLink>
    <div class="card-body gap-2 p-4">
      <RouterLink :to="{ name: 'game', params: { id: game.id } }" class="card-title link-hover">
        {{ game.title }}
      </RouterLink>
      <p class="text-sm opacity-70">
        {{ game.developer || 'Невідомий розробник' }} · <span class="badge badge-outline badge-sm">{{ game.genre }}</span>
      </p>
      <RatingBadge :status="game.rating_status" :count="game.reviews_count" :percent="game.positive_percent" />
      <div class="mt-auto flex items-center justify-between pt-2">
        <PriceBlock :price="game.price" :final-price="game.final_price" :discount="game.discount" />
        <DiscountControl :discount="game.discount" @change="emit('discount', game.id, $event)" />
      </div>
    </div>
  </div>
</template>
