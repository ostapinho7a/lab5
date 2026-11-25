<script setup lang="ts">
import { ref, watch } from 'vue';
import { Percent } from 'lucide-vue-next';

const props = defineProps<{ discount: number }>();
const emit = defineEmits<{ change: [discount: number] }>();

const value = ref<number | ''>(props.discount);
const dropdown = ref<HTMLDetailsElement | null>(null);

watch(
  () => props.discount,
  (discount) => (value.value = discount),
);

const isValid = () => value.value !== '' && Number.isInteger(value.value) && value.value >= 0 && value.value <= 90;

function apply(discount: number) {
  emit('change', discount);
  if (dropdown.value) dropdown.value.open = false;
}
</script>

<template>
  <details ref="dropdown" class="dropdown dropdown-end">
    <summary class="btn btn-ghost btn-sm" title="Змінити знижку">
      <Percent :size="16" /> Знижка
    </summary>
    <div class="dropdown-content z-10 mt-1 w-56 rounded-box bg-base-100 p-3 shadow-lg">
      <label class="text-xs opacity-70">Знижка, % (0–90)</label>
      <div class="join mt-1 w-full">
        <input
          v-model="value"
          type="number"
          min="0"
          max="90"
          class="input input-sm join-item w-full"
          :class="{ 'input-error': !isValid() }"
          @keyup.enter="isValid() && apply(Number(value))"
        />
        <button class="btn btn-sm btn-primary join-item" :disabled="!isValid()" @click="apply(Number(value))">OK</button>
      </div>
      <div class="mt-2 flex gap-1">
        <button v-for="preset in [25, 50, 75]" :key="preset" class="btn btn-xs" @click="apply(preset)">
          {{ preset }}%
        </button>
        <button class="btn btn-xs btn-ghost" @click="apply(0)">Прибрати</button>
      </div>
    </div>
  </details>
</template>
