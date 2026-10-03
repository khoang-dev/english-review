<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  CheckCircleFilled,
  ExclamationCircleFilled,
  ReadOutlined,
  RiseOutlined,
  WarningFilled,
} from '@ant-design/icons-vue'
import { courseProgress, courses, nextPart, overallProgress, snapshots } from '@/data/courses'
import { formatLongDate, formatShortDate, todayKey } from '@/utils/date'
import { paceSummary, withToday } from '@/utils/pace'
import { PLAN_END, PLAN_START } from '@/utils/plan'
import ProgressChart from '@/components/ProgressChart.vue'

/** Completed course parts out of all parts across ROOT, TRUNK and BULK, with pace to the deadline. */
const today = todayKey()
const overall = overallProgress()
const next = nextPart()
const rows = courses.map((course) => ({ name: course.name, ...courseProgress(course) }))

// The log plus today's live count from courses.json
const series = withToday(snapshots, { date: today, completed: overall.done })
const pace = paceSummary(series, overall.total, PLAN_END, today)
const chartStart = series[0] && series[0].date < PLAN_START ? series[0].date : PLAN_START

type Mode = 'current' | 'chart'
const modes: { value: Mode; label: string }[] = [
  { value: 'current', label: 'Current' },
  { value: 'chart', label: 'Chart' },
]
const mode = ref<Mode>(readMode())

function readMode(): Mode {
  try {
    return localStorage.getItem('course-progress-mode') === 'chart' ? 'chart' : 'current'
  } catch {
    return 'current'
  }
}
function setMode(value: Mode) {
  mode.value = value
  try {
    localStorage.setItem('course-progress-mode', value)
  } catch {
    // Storage unavailable: the choice just isn't remembered
  }
}

const one = (n: number) => (Math.round(n * 10) / 10).toString()

const statusView = computed(() => {
  const behind = Math.round(-pace.gap)
  if (pace.status === 'done')
    return { tone: 'good', icon: CheckCircleFilled, title: 'All parts completed 🎉', detail: '' }
  if (pace.willMiss)
    return {
      tone: 'critical',
      icon: WarningFilled,
      title: 'At risk of missing the deadline',
      detail: pace.projectedFinish
        ? `At your last-7-days pace (${one(pace.recentPerDay ?? 0)}/day) you'd finish on ${formatLongDate(pace.projectedFinish)}. Do ${one(pace.requiredPerDay)} parts/day to finish by ${formatShortDate(PLAN_END)}.`
        : `No parts completed recently. Do ${one(pace.requiredPerDay)} parts/day to finish by ${formatShortDate(PLAN_END)}.`,
    }
  if (pace.status === 'behind')
    return {
      tone: 'warning',
      icon: ExclamationCircleFilled,
      title: `Behind target by ${behind} ${behind === 1 ? 'part' : 'parts'}`,
      detail: `Catch up with ${one(pace.requiredPerDay)} parts/day until ${formatShortDate(PLAN_END)}.`,
    }
  return {
    tone: 'good',
    icon: pace.status === 'ahead' ? RiseOutlined : CheckCircleFilled,
    title:
      pace.status === 'ahead'
        ? `Ahead of target by ${Math.round(pace.gap)} parts`
        : 'On track for the deadline',
    detail: `Keep ${one(pace.requiredPerDay)} parts/day to finish by ${formatShortDate(PLAN_END)}.`,
  }
})

const toneClass: Record<string, string> = {
  good: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  warning: 'bg-amber-50 text-amber-900 ring-amber-200',
  critical: 'bg-red-50 text-red-800 ring-red-200',
}

const paceStats = [
  { label: 'Parts / day', value: pace.remaining ? one(pace.requiredPerDay) : '0' },
  { label: 'Remaining', value: pace.remaining },
  { label: 'Days left', value: pace.daysLeft },
]
</script>

<template>
  <section
    class="flex flex-col gap-4 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-5"
  >
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0">
        <p class="text-xs font-semibold tracking-wider text-slate-500 uppercase">Course progress</p>
        <h2 class="mt-1 text-2xl font-bold text-slate-900">
          {{ overall.done }} <span class="text-slate-400">of {{ overall.total }} parts</span>
        </h2>
      </div>
      <span
        class="grid size-12 shrink-0 place-items-center rounded-2xl bg-indigo-50 text-xl text-indigo-600"
      >
        <ReadOutlined />
      </span>
    </div>

    <!-- Width is a runtime percentage → dynamic :style is the documented exception -->
    <div class="flex items-center gap-3">
      <div class="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100">
        <div class="h-full rounded-full bg-indigo-600" :style="{ width: `${overall.percent}%` }" />
      </div>
      <span class="text-sm font-semibold text-indigo-600">{{ overall.percent }}%</span>
    </div>

    <!-- Pace needed to finish everything by the deadline -->
    <div class="grid grid-cols-3 gap-2">
      <div v-for="stat in paceStats" :key="stat.label" class="rounded-2xl bg-slate-50 px-3 py-2.5">
        <span class="block text-xs text-slate-500">{{ stat.label }}</span>
        <span class="block text-xl font-bold text-slate-900">{{ stat.value }}</span>
      </div>
    </div>

    <div
      :class="['flex gap-2.5 rounded-2xl px-3 py-2.5 text-sm ring-1', toneClass[statusView.tone]]"
    >
      <component :is="statusView.icon" class="mt-0.5 shrink-0" />
      <div class="min-w-0">
        <span class="font-semibold">{{ statusView.title }}</span>
        <span v-if="statusView.detail" class="block">{{ statusView.detail }}</span>
      </div>
    </div>

    <div class="flex rounded-2xl bg-slate-100 p-1" role="group" aria-label="Display mode">
      <button
        v-for="item in modes"
        :key="item.value"
        type="button"
        :aria-pressed="mode === item.value"
        :class="[
          'min-h-10 flex-1 rounded-xl text-sm font-semibold transition-colors',
          mode === item.value
            ? 'bg-white text-slate-900 shadow-sm'
            : 'text-slate-500 hover:text-slate-700 active:bg-slate-200',
        ]"
        @click="setMode(item.value)"
      >
        {{ item.label }}
      </button>
    </div>

    <template v-if="mode === 'current'">
      <ul class="flex flex-col gap-3">
        <li v-for="row in rows" :key="row.name" class="flex flex-col gap-1">
          <div class="flex items-baseline justify-between gap-2 text-sm">
            <span class="font-semibold text-slate-800">{{ row.name }}</span>
            <span class="text-xs text-slate-500">{{ row.done }}/{{ row.total }}</span>
          </div>
          <div class="h-1.5 overflow-hidden rounded-full bg-slate-100">
            <div class="h-full rounded-full bg-emerald-500" :style="{ width: `${row.percent}%` }" />
          </div>
        </li>
      </ul>

      <p class="rounded-2xl bg-slate-50 px-3 py-2.5 text-sm break-words text-slate-600">
        <template v-if="next">
          Next up: <span class="font-semibold text-slate-800">{{ next }}</span>
        </template>
        <template v-else>All courses completed 🎉</template>
      </p>
    </template>

    <ProgressChart
      v-else
      :series="series"
      :total="overall.total"
      :start="chartStart"
      :deadline="PLAN_END"
      :today="today"
    />
  </section>
</template>
