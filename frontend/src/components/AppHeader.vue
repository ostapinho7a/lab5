<script setup lang="ts">
import { Wrench } from 'lucide-vue-next';
</script>

<template>
  <header class="navbar bg-base-200 px-4 shadow-sm">
    <RouterLink :to="{ name: 'catalog' }" class="btn btn-ghost text-xl">
      <Wrench :size="22" class="text-primary" />
      Gabe's Workshop
    </RouterLink>
    <span class="ml-2 hidden text-sm opacity-60 sm:inline">каталог інді-ігор</span>
  </header>
</template>
