<script setup lang="ts">
import { ref } from 'vue';
import { Plus, RotateCw, SearchX } from 'lucide-vue-next';
import { useGames } from '@/composables/useGames';
import GameCard from '@/components/GameCard.vue';
import GenreFilter from '@/components/GenreFilter.vue';
import CreateGameModal from '@/components/CreateGameModal.vue';

const { games, genres, genre, isLoading, loadError, setGenre, load, createGame, setDiscount } = useGames();
const showModal = ref(false);
</script>

<template>
  <section>
    <div class="flex flex-wrap items-center justify-between gap-3">
      <h1 class="text-2xl font-bold">Каталог</h1>
      <button class="btn btn-primary" @click="showModal = true"><Plus :size="18" /> Додати гру</button>
    </div>

    <GenreFilter class="mt-4" :genres="genres" :model-value="genre" @update:model-value="setGenre" />

    <div v-if="isLoading" class="flex justify-center py-20">
      <span class="loading loading-spinner loading-lg" />
    </div>

    <div v-else-if="loadError" role="alert" class="alert alert-error mt-6">
      <span>{{ loadError }}</span>
      <button class="btn btn-sm" @click="load"><RotateCw :size="16" /> Ще раз</button>
    </div>

    <div v-else-if="!games.length" class="flex flex-col items-center gap-2 py-20 opacity-60">
      <SearchX :size="40" />
      <p>Тут поки порожньо</p>
    </div>

    <div v-else class="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <GameCard v-for="game in games" :key="game.id" :game="game" @discount="setDiscount" />
    </div>

    <CreateGameModal :open="showModal" :genres="genres" :create="createGame" @close="showModal = false" />
  </section>
</template>
