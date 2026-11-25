<script setup lang="ts">
import { X } from 'lucide-vue-next';
import { useGameForm } from '@/composables/useGameForm';
import type { NewGame } from '@/types';

const props = defineProps<{ open: boolean; genres: string[]; create: (game: NewGame) => Promise<unknown> }>();
const emit = defineEmits<{ close: [] }>();

// запит робить батько, а тут тільки форма з перевірками
const { form, isSaving, errorOf, submit, reset } = useGameForm((game) => props.create(game));

async function onSubmit() {
  if (await submit()) emit('close');
}

function close() {
  reset();
  emit('close');
}
</script>

<template>
  <div v-if="open" class="modal modal-open" role="dialog" @keydown.esc="close">
    <form class="modal-box max-w-2xl" novalidate @submit.prevent="onSubmit">
      <button type="button" class="btn btn-circle btn-ghost btn-sm absolute top-3 right-3" @click="close">
        <X :size="18" />
      </button>
      <h3 class="text-lg font-bold">Нова гра</h3>

      <div class="mt-4 grid gap-x-4 sm:grid-cols-2">
        <fieldset class="fieldset sm:col-span-2">
          <legend class="fieldset-legend">Назва *</legend>
          <input v-model="form.title" class="input w-full" :class="{ 'input-error': errorOf('title') }" placeholder="Hollow Knight" />
          <p v-if="errorOf('title')" class="text-error">{{ errorOf('title') }}</p>
        </fieldset>

        <fieldset class="fieldset">
          <legend class="fieldset-legend">Жанр *</legend>
          <input
            v-model="form.genre"
            list="genres"
            class="input w-full"
            :class="{ 'input-error': errorOf('genre') }"
            placeholder="Roguelike"
          />
          <datalist id="genres">
            <option v-for="genre in genres" :key="genre" :value="genre" />
          </datalist>
          <p v-if="errorOf('genre')" class="text-error">{{ errorOf('genre') }}</p>
        </fieldset>

        <fieldset class="fieldset">
          <legend class="fieldset-legend">Розробник</legend>
          <input v-model="form.developer" class="input w-full" placeholder="Team Cherry" />
        </fieldset>

        <fieldset class="fieldset">
          <legend class="fieldset-legend">Ціна, $ *</legend>
          <input
            v-model="form.price"
            type="number"
            min="0"
            step="0.01"
            class="input w-full"
            :class="{ 'input-error': errorOf('price') }"
            placeholder="14.99"
          />
          <p v-if="errorOf('price')" class="text-error">{{ errorOf('price') }}</p>
        </fieldset>

        <fieldset class="fieldset">
          <legend class="fieldset-legend">Знижка, %</legend>
          <input
            v-model="form.discount"
            type="number"
            min="0"
            max="90"
            class="input w-full"
            :class="{ 'input-error': errorOf('discount') }"
          />
          <p v-if="errorOf('discount')" class="text-error">{{ errorOf('discount') }}</p>
        </fieldset>

        <fieldset class="fieldset sm:col-span-2">
          <legend class="fieldset-legend">Посилання на обкладинку</legend>
          <input v-model="form.image_url" type="url" class="input w-full" placeholder="https://..." />
        </fieldset>

        <fieldset class="fieldset sm:col-span-2">
          <legend class="fieldset-legend">Опис</legend>
          <textarea v-model="form.description" class="textarea w-full" rows="3" placeholder="Про що гра?" />
        </fieldset>
      </div>

      <div class="modal-action">
        <button type="button" class="btn" @click="close">Скасувати</button>
        <button type="submit" class="btn btn-primary" :disabled="isSaving">
          <span v-if="isSaving" class="loading loading-spinner loading-sm" />
          Додати гру
        </button>
      </div>
    </form>
    <div class="modal-backdrop" @click="close" />
  </div>
</template>
