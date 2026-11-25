<script setup lang="ts">
import { ThumbsUp, ThumbsDown, Send } from 'lucide-vue-next';
import { useReviewForm } from '@/composables/useReviewForm';
import type { NewReview } from '@/types';

const props = defineProps<{ send: (review: NewReview) => Promise<unknown> }>();

const { form, isSaving, errorOf, submit } = useReviewForm((review) => props.send(review));
</script>

<template>
  <form class="rounded-box bg-base-100 p-4" novalidate @submit.prevent="submit">
    <h3 class="font-bold">Залишити відгук</h3>

    <div class="mt-2 grid gap-x-4 sm:grid-cols-2">
      <fieldset class="fieldset">
        <legend class="fieldset-legend">Автор</legend>
        <input v-model="form.author" class="input w-full" :class="{ 'input-error': errorOf('author') }" placeholder="Нікнейм" />
        <p v-if="errorOf('author')" class="text-error">{{ errorOf('author') }}</p>
      </fieldset>

      <fieldset class="fieldset">
        <legend class="fieldset-legend">Награно годин</legend>
        <input
          v-model="form.hours_played"
          type="number"
          min="0"
          class="input w-full"
          :class="{ 'input-error': errorOf('hours_played') }"
          placeholder="12"
        />
        <p v-if="errorOf('hours_played')" class="text-error">{{ errorOf('hours_played') }}</p>
      </fieldset>
    </div>

    <fieldset class="fieldset">
      <legend class="fieldset-legend">Твоя оцінка</legend>
      <div class="join">
        <button
          type="button"
          class="btn join-item"
          :class="form.is_recommended ? 'btn-success' : ''"
          @click="form.is_recommended = true"
        >
          <ThumbsUp :size="16" /> Рекомендую
        </button>
        <button
          type="button"
          class="btn join-item"
          :class="!form.is_recommended ? 'btn-error' : ''"
          @click="form.is_recommended = false"
        >
          <ThumbsDown :size="16" /> Не рекомендую
        </button>
      </div>
    </fieldset>

    <fieldset class="fieldset">
      <legend class="fieldset-legend">Текст</legend>
      <textarea
        v-model="form.text"
        rows="3"
        class="textarea w-full"
        :class="{ 'input-error': errorOf('text') }"
        placeholder="Що сподобалось, а що ні?"
      />
      <p v-if="errorOf('text')" class="text-error">{{ errorOf('text') }}</p>
    </fieldset>

    <button type="submit" class="btn btn-primary mt-3" :disabled="isSaving">
      <span v-if="isSaving" class="loading loading-spinner loading-sm" />
      <Send v-else :size="16" />
      Опублікувати
    </button>
  </form>
</template>
