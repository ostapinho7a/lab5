<script setup lang="ts">
import { ref, watch } from 'vue';
import { Gamepad2 } from 'lucide-vue-next';

const props = defineProps<{ src: string; alt: string }>();

// якщо картинка не завантажилась — показуємо заглушку з іконкою
const broken = ref(false);
watch(
  () => props.src,
  () => (broken.value = false),
);
</script>

<template>
  <div class="flex h-full w-full items-center justify-center bg-base-300">
    <img v-if="src && !broken" :src="src" :alt="alt" class="h-full w-full object-cover" @error="broken = true" />
    <Gamepad2 v-else :size="48" class="opacity-30" />
  </div>
</template>
