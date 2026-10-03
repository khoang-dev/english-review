<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  /** 0-based position in the set. */
  index: number
  total: number
  /** Items done right so far (fills the bar). */
  done: number
  doneLabel?: string
  label?: string
}>()

const percent = computed(() => (props.total ? Math.round((props.done / props.total) * 100) : 0))
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="flex items-center justify-between gap-2 text-sm">
      <span class="min-w-0 truncate font-medium text-slate-700">
        <template v-if="label">{{ label }} · </template>
        <span class="text-slate-400">{{ Math.min(index + 1, total) }} of {{ total }}</span>
      </span>
      <span class="shrink-0 text-slate-500"
        >{{ done }}/{{ total }} {{ doneLabel ?? 'correct' }}</span
      >
    </div>
    <!-- Width is a runtime percentage → dynamic :style is the documented exception -->
    <div class="h-2 overflow-hidden rounded-full bg-slate-100">
      <div
        class="h-full rounded-full bg-emerald-500 transition-[width] duration-500"
        :style="{ width: `${percent}%` }"
      />
    </div>
  </div>
</template>
