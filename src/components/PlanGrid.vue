<script setup lang="ts">
import { computed } from 'vue'
import { CheckOutlined } from '@ant-design/icons-vue'
import { formatLongDate, todayKey } from '@/utils/date'

/** The 30 days of the current plan round as a tappable grid, coloured by what was done. */
const props = defineProps<{
  days: string[]
  lessonDays: Set<string>
  practiceDays: Set<string>
}>()

type CellState = 'practised' | 'lesson' | 'missed' | 'future'

const today = todayKey()

const cellClass: Record<CellState, string> = {
  practised: 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/30 active:bg-emerald-600',
  lesson: 'bg-indigo-100 text-indigo-800 active:bg-indigo-200',
  missed: 'bg-white text-slate-500 ring-1 ring-slate-200 ring-inset active:bg-slate-100',
  future: 'border border-dashed border-slate-200 text-slate-300',
}

const cells = computed(() =>
  props.days.map((day, i) => {
    const state: CellState =
      day > today
        ? 'future'
        : props.practiceDays.has(day)
          ? 'practised'
          : props.lessonDays.has(day)
            ? 'lesson'
            : 'missed'
    return { day, number: i + 1, state, isToday: day === today }
  }),
)

const legend: { state: CellState; label: string }[] = [
  { state: 'practised', label: 'Practised' },
  { state: 'lesson', label: 'New writing' },
  { state: 'missed', label: 'No activity' },
  { state: 'future', label: 'Coming up' },
]
</script>

<template>
  <div class="flex flex-col gap-3">
    <ol class="grid grid-cols-6 gap-1.5 sm:grid-cols-10 sm:gap-2">
      <li v-for="cell in cells" :key="cell.day">
        <span
          v-if="cell.state === 'future'"
          :class="[
            'flex aspect-square flex-col items-center justify-center rounded-xl',
            cellClass.future,
          ]"
          :title="formatLongDate(cell.day)"
        >
          <span class="text-[10px] font-medium">Day</span>
          <span class="text-sm leading-none font-semibold">{{ cell.number }}</span>
        </span>
        <RouterLink
          v-else
          :to="{ name: 'review', params: cell.isToday ? {} : { date: cell.day } }"
          :class="[
            'relative flex aspect-square flex-col items-center justify-center rounded-xl transition-colors',
            cellClass[cell.state],
            cell.isToday && 'ring-2 ring-indigo-600 ring-offset-2',
          ]"
          :aria-label="`Day ${cell.number}, ${formatLongDate(cell.day)}`"
          :title="formatLongDate(cell.day)"
        >
          <span class="text-[10px] font-medium opacity-80">
            {{ cell.isToday ? 'Today' : 'Day' }}
          </span>
          <span class="text-sm leading-none font-semibold">{{ cell.number }}</span>
          <CheckOutlined
            v-if="cell.state === 'practised' && lessonDays.has(cell.day)"
            class="absolute top-1 right-1 text-[9px]"
          />
        </RouterLink>
      </li>
    </ol>

    <ul class="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-500">
      <li v-for="item in legend" :key="item.state" class="flex items-center gap-1.5">
        <span :class="['size-3 rounded', cellClass[item.state]]" />
        {{ item.label }}
      </li>
    </ul>
  </div>
</template>
