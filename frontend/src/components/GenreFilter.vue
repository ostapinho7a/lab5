<script setup lang="ts">
defineProps<{ genres: string[]; modelValue: string }>();
const emit = defineEmits<{ 'update:modelValue': [genre: string] }>();
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <button class="btn btn-sm" :class="!modelValue ? 'btn-primary' : 'btn-ghost'" @click="emit('update:modelValue', '')">
      Усі
    </button>
    <button
      v-for="genre in genres"
      :key="genre"
      class="btn btn-sm"
      :class="modelValue === genre ? 'btn-primary' : 'btn-ghost'"
      @click="emit('update:modelValue', genre)"
    >
      {{ genre }}
    </button>
  </div>
</template>
