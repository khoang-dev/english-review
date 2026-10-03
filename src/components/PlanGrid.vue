<script setup lang="ts">
import { computed } from 'vue'
import { CheckOutlined } from '@ant-design/icons-vue'
import { dayOfMonth, formatLongDate, todayKey, weekdayIndex } from '@/utils/date'
import { PLAN_MONTHS } from '@/utils/plan'

/** Every day of the Oct–Dec plan as month calendars of tappable cells, coloured by what was done. */
const props = defineProps<{
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

const weekdays = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

// Monday-first column of a month's first day; static strings so Tailwind detects them
const colStart = [
  'col-start-1',
  'col-start-2',
  'col-start-3',
  'col-start-4',
  'col-start-5',
  'col-start-6',
  'col-start-7',
]

const months = computed(() =>
  PLAN_MONTHS.map((month) => ({
    label: month.label,
    offset: colStart[weekdayIndex(month.days[0]!)],
    cells: month.days.map((day) => {
      const state: CellState =
        day > today
          ? 'future'
          : props.practiceDays.has(day)
            ? 'practised'
            : props.lessonDays.has(day)
              ? 'lesson'
              : 'missed'
      return { day, number: dayOfMonth(day), state, isToday: day === today }
    }),
  })),
)

const legend: { state: CellState; label: string }[] = [
  { state: 'practised', label: 'Practised' },
  { state: 'lesson', label: 'New writing' },
  { state: 'missed', label: 'No activity' },
  { state: 'future', label: 'Coming up' },
]
</script>

<template>
  <div class="flex flex-col gap-5">
    <section v-for="month in months" :key="month.label" class="flex flex-col gap-2">
      <h3 class="text-sm font-semibold text-slate-700">{{ month.label }}</h3>
      <div
        class="grid grid-cols-7 gap-1 text-center text-[10px] font-medium text-slate-400 sm:gap-2"
      >
        <span v-for="(weekday, i) in weekdays" :key="i">{{ weekday }}</span>
      </div>
      <ol class="grid grid-cols-7 gap-1 sm:gap-2">
        <li v-for="(cell, i) in month.cells" :key="cell.day" :class="i === 0 && month.offset">
          <span
            v-if="cell.state === 'future'"
            :class="[
              'flex aspect-square items-center justify-center rounded-xl text-sm font-semibold',
              cellClass.future,
            ]"
            :title="formatLongDate(cell.day)"
          >
            {{ cell.number }}
          </span>
          <RouterLink
            v-else
            :to="{ name: 'review', params: cell.isToday ? {} : { date: cell.day } }"
            :class="[
              'relative flex aspect-square flex-col items-center justify-center rounded-xl transition-colors',
              cellClass[cell.state],
              cell.isToday && 'ring-2 ring-indigo-600 ring-offset-2',
            ]"
            :aria-label="formatLongDate(cell.day)"
            :title="formatLongDate(cell.day)"
          >
            <span v-if="cell.isToday" class="text-[9px] leading-none font-medium opacity-80">
              Today
            </span>
            <span class="text-sm leading-tight font-semibold">{{ cell.number }}</span>
            <CheckOutlined
              v-if="cell.state === 'practised' && lessonDays.has(cell.day)"
              class="absolute top-1 right-1 text-[9px]"
            />
          </RouterLink>
        </li>
      </ol>
    </section>

    <ul class="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-500">
      <li v-for="item in legend" :key="item.state" class="flex items-center gap-1.5">
        <span :class="['size-3 rounded', cellClass[item.state]]" />
        {{ item.label }}
      </li>
    </ul>
  </div>
</template>
