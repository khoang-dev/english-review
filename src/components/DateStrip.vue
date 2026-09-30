<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue'
import { LeftOutlined, RightOutlined } from '@ant-design/icons-vue'
import { fromKey, monthYear, todayKey, weekdayShort } from '@/utils/date'

const props = defineProps<{
  /** Day keys, newest (today) first. */
  days: string[]
  /** Day keys that have a review. */
  reviewDays: Set<string>
}>()

const active = defineModel<string>({ required: true })

const today = todayKey()
const scroller = ref<HTMLElement>()
const chips = ref<HTMLButtonElement[]>([])

function step(direction: -1 | 1) {
  const day = props.days[props.days.indexOf(active.value) + direction]
  if (day) active.value = day
}

// Keep the active chip centred in the strip without scrolling the page
function centerActiveChip(behavior: ScrollBehavior = 'smooth') {
  const chip = chips.value[props.days.indexOf(active.value)]
  if (!chip || !scroller.value) return
  const left = chip.offsetLeft - (scroller.value.clientWidth - chip.offsetWidth) / 2
  scroller.value.scrollTo({ left, behavior })
}

watch(active, () => nextTick(() => centerActiveChip()))
onMounted(() => centerActiveChip('instant'))
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="flex items-center justify-between gap-2 px-4">
      <p class="text-sm font-semibold text-slate-900">{{ monthYear(active) }}</p>
      <div class="flex items-center gap-1">
        <button
          v-if="active !== today"
          type="button"
          class="h-11 rounded-lg px-3 text-sm font-medium text-indigo-600 hover:bg-indigo-50"
          @click="active = today"
        >
          Today
        </button>
        <button
          type="button"
          class="grid size-11 place-items-center rounded-lg text-slate-600 hover:bg-slate-200/70 disabled:opacity-30 disabled:hover:bg-transparent"
          :disabled="active === days[0]"
          aria-label="Newer day"
          @click="step(-1)"
        >
          <LeftOutlined />
        </button>
        <button
          type="button"
          class="grid size-11 place-items-center rounded-lg text-slate-600 hover:bg-slate-200/70 disabled:opacity-30 disabled:hover:bg-transparent"
          :disabled="active === days[days.length - 1]"
          aria-label="Older day"
          @click="step(1)"
        >
          <RightOutlined />
        </button>
      </div>
    </div>

    <div
      ref="scroller"
      class="flex gap-2 overflow-x-auto scroll-px-4 px-4 pb-1 [scrollbar-width:none]"
      role="tablist"
      aria-label="Choose a day"
    >
      <button
        v-for="day in days"
        :key="day"
        ref="chips"
        type="button"
        role="tab"
        :aria-selected="day === active"
        :class="[
          'relative flex h-16 w-13 shrink-0 flex-col items-center justify-center gap-0.5 rounded-2xl text-center transition-colors',
          day === active
            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
            : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100',
        ]"
        @click="active = day"
      >
        <span
          :class="[
            'text-[11px] font-medium uppercase',
            day === active ? 'text-indigo-100' : 'text-slate-400',
          ]"
        >
          {{ day === today ? 'Today' : weekdayShort(day) }}
        </span>
        <span class="text-lg leading-none font-semibold">{{ fromKey(day).getDate() }}</span>
        <span
          :class="[
            'size-1.5 rounded-full',
            reviewDays.has(day)
              ? day === active
                ? 'bg-white'
                : 'bg-indigo-500'
              : 'bg-transparent',
          ]"
        />
      </button>
    </div>
  </div>
</template>
