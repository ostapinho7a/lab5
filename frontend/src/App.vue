<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue';
import AppToasts from '@/components/AppToasts.vue';
</script>

<template>
  <div class="min-h-screen bg-base-100">
    <AppHeader />
    <main class="mx-auto max-w-7xl p-4 sm:p-6">
      <RouterView />
    </main>
    <AppToasts />
  </div>
</template>
