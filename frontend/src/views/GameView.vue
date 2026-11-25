<script setup lang="ts">
import { computed, ref } from 'vue';
import { ArrowLeft, Trash2, Code } from 'lucide-vue-next';
import { useGameDetails } from '@/composables/useGameDetails';
import GameCover from '@/components/GameCover.vue';
import PriceBlock from '@/components/PriceBlock.vue';
import RatingBadge from '@/components/RatingBadge.vue';
import DiscountControl from '@/components/DiscountControl.vue';
import ReviewItem from '@/components/ReviewItem.vue';
import ReviewForm from '@/components/ReviewForm.vue';
import NotFoundView from './NotFoundView.vue';

const props = defineProps<{ id: string }>();
const id = computed(() => props.id);

const { game, reviews, isLoading, notFound, addReview, deleteReview, setDiscount, deleteGame } = useGameDetails(id);
const confirmDelete = ref(false);
</script>

<template>
  <div v-if="isLoading" class="flex justify-center py-20">
    <span class="loading loading-spinner loading-lg" />
  </div>

  <NotFoundView v-else-if="notFound || !game" />

  <article v-else>
    <RouterLink :to="{ name: 'catalog' }" class="btn btn-ghost btn-sm mb-3"><ArrowLeft :size="16" /> До каталогу</RouterLink>

    <figure class="h-56 overflow-hidden rounded-box sm:h-80">
      <GameCover :src="game.image_url" :alt="game.title" />
    </figure>

    <div class="mt-5 grid gap-6 lg:grid-cols-3">
      <div class="lg:col-span-2">
        <h1 class="text-3xl font-bold">{{ game.title }}</h1>
        <p class="mt-1 flex items-center gap-2 opacity-70">
          <Code :size="16" /> {{ game.developer || 'Невідомий розробник' }}
          <span class="badge badge-outline">{{ game.genre }}</span>
        </p>
        <p class="mt-4 whitespace-pre-line">{{ game.description || 'Опису поки немає.' }}</p>
      </div>

      <aside class="flex flex-col gap-3 rounded-box bg-base-200 p-4">
        <PriceBlock :price="game.price" :final-price="game.final_price" :discount="game.discount" large />
        <RatingBadge :status="game.rating_status" :count="game.reviews_count" :percent="game.positive_percent" />
        <div class="mt-auto flex flex-wrap gap-2">
          <DiscountControl :discount="game.discount" @change="setDiscount" />
          <button class="btn btn-ghost btn-sm text-error" @click="confirmDelete = true">
            <Trash2 :size="16" /> Видалити гру
          </button>
        </div>
      </aside>
    </div>

    <section class="mt-8 grid gap-6 lg:grid-cols-3">
      <div class="lg:col-span-2">
        <h2 class="text-xl font-bold">Відгуки ({{ reviews.length }})</h2>
        <p v-if="!reviews.length" class="mt-3 opacity-60">Ще ніхто не написав відгук. Будь першим!</p>
        <TransitionGroup v-else tag="ul" class="mt-3 flex flex-col gap-3" leave-active-class="transition duration-200" leave-to-class="opacity-0">
          <ReviewItem v-for="review in reviews" :key="review.id" :review="review" @delete="deleteReview" />
        </TransitionGroup>
      </div>
      <ReviewForm :send="addReview" />
    </section>

    <div v-if="confirmDelete" class="modal modal-open" role="dialog">
      <div class="modal-box">
        <h3 class="text-lg font-bold">Видалити «{{ game.title }}»?</h3>
        <p class="py-3">Разом з грою зникнуть і всі її відгуки ({{ reviews.length }}).</p>
        <div class="modal-action">
          <button class="btn" @click="confirmDelete = false">Ні</button>
          <button class="btn btn-error" @click="deleteGame">Так, видалити</button>
        </div>
      </div>
      <div class="modal-backdrop" @click="confirmDelete = false" />
    </div>
  </article>
</template>
