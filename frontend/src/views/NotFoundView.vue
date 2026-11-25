<script setup lang="ts">
import { Ghost } from 'lucide-vue-next';
</script>

<template>
  <div class="flex flex-col items-center gap-3 py-20 text-center">
    <Ghost :size="56" class="opacity-40" />
    <h1 class="text-2xl font-bold">Тут нічого немає</h1>
    <p class="opacity-60">Можливо гру вже видалили або посилання неправильне</p>
    <RouterLink :to="{ name: 'catalog' }" class="btn btn-primary">До каталогу</RouterLink>
  </div>
</template>
