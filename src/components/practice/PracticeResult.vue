<script setup lang="ts">
import { computed } from 'vue'
import { SmileFilled, TrophyFilled } from '@ant-design/icons-vue'

const props = defineProps<{ score: number; total: number; noun?: string }>()

const perfect = computed(() => props.total > 0 && props.score === props.total)
const message = computed(() => {
  const ratio = props.total ? props.score / props.total : 0
  if (ratio === 1) return 'Perfect! You know all of these.'
  if (ratio >= 0.7) return 'Nice work — just a few left to review.'
  return 'Keep going — practise the missed ones again.'
})
</script>

<template>
  <div class="flex flex-col items-center gap-4 py-6 text-center">
    <span
      :class="[
        'grid size-16 place-items-center rounded-2xl text-3xl',
        perfect ? 'bg-amber-50 text-amber-500' : 'bg-indigo-50 text-indigo-500',
      ]"
    >
      <TrophyFilled v-if="perfect" />
      <SmileFilled v-else />
    </span>
    <p class="text-3xl font-bold text-slate-900">
      {{ score }}<span class="text-lg font-medium text-slate-400">/{{ total }}</span>
    </p>
    <p class="text-sm text-slate-500">{{ noun ?? 'correct' }} · {{ message }}</p>
    <div class="flex w-full flex-col gap-2 sm:flex-row sm:justify-center">
      <slot />
    </div>
  </div>
</template>
