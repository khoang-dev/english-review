<script setup lang="ts">
import { computed } from 'vue'
import { CoffeeOutlined } from '@ant-design/icons-vue'
import { formatLongDate, formatShortDate, relativeDayLabel } from '@/utils/date'

const props = defineProps<{
  day: string
  /** Nearest day that has a review, if any. */
  nearest: string | null
}>()

defineEmits<{ go: [day: string] }>()

const nearestLabel = computed(() => {
  if (!props.nearest) return ''
  const label = relativeDayLabel(props.nearest)
  return ['Today', 'Yesterday'].includes(label)
    ? label.toLowerCase()
    : formatShortDate(props.nearest)
})
</script>

<template>
  <div
    class="flex flex-col items-center gap-3 rounded-3xl border-2 border-dashed border-slate-200 bg-white px-6 py-14 text-center"
  >
    <span class="grid size-14 place-items-center rounded-2xl bg-slate-100 text-2xl text-slate-400">
      <CoffeeOutlined />
    </span>
    <p class="text-lg font-semibold text-slate-900">
      No review {{ relativeDayLabel(day) === 'Today' ? 'yet today' : 'on this day' }}
    </p>
    <p class="max-w-xs text-sm text-slate-500">
      {{ relativeDayLabel(day) }}, {{ formatLongDate(day) }}. Add your corrected writing for this
      day to <code class="text-xs">src/data/lessons.ts</code> to review it here.
    </p>
    <a-button v-if="nearest" type="primary" size="large" class="mt-2" @click="$emit('go', nearest)">
      Go to {{ nearestLabel }}'s review
    </a-button>
  </div>
</template>
