<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  BookOutlined,
  CalendarOutlined,
  FireFilled,
  ReadOutlined,
  ThunderboltFilled,
} from '@ant-design/icons-vue'
import { getLessonsByDate, lessons } from '@/data/lessons'
import { getExercises, mergeExercises } from '@/data/exercises'
import { useProgress } from '@/composables/useProgress'
import { formatLongDate, formatShortDate, relativeDayLabel, todayKey } from '@/utils/date'
import { PLAN_DAYS, PLAN_END, PLAN_LENGTH, PLAN_START, planDaysElapsed, streak } from '@/utils/plan'
import KnowledgeSummary from '@/components/KnowledgeSummary.vue'
import PlanGrid from '@/components/PlanGrid.vue'
import PracticeDrawer from '@/components/practice/PracticeDrawer.vue'
import type { ExerciseSet } from '@/types/exercise'

const { practiceDays } = useProgress()

const today = todayKey()
const elapsed = planDaysElapsed(today)
const lessonDays = new Set(lessons.map((lesson) => lesson.date))

const activeDays = computed(() => new Set([...lessonDays, ...practiceDays.value]))
const activeInRound = computed(
  () => PLAN_DAYS.filter((day) => day <= today && activeDays.value.has(day)).length,
)
const currentStreak = computed(() => streak(activeDays.value, today))
// Width is a runtime percentage (see :style below)
const roundPercent = Math.round((elapsed / PLAN_LENGTH) * 100)

const todaysLessons = getLessonsByDate(today)
const latestLesson = [...lessons].sort((a, b) => b.date.localeCompare(a.date))[0]
const featured = todaysLessons[0] ?? latestLesson

const stats = computed(() => [
  { label: 'Day streak', value: currentStreak.value, icon: FireFilled },
  {
    label: 'Active days',
    value: `${activeInRound.value}/${elapsed}`,
    icon: CalendarOutlined,
  },
  { label: 'Lessons', value: lessons.length, icon: ReadOutlined },
])

const drawer = ref<{ open: boolean; title: string; set: ExerciseSet | null }>({
  open: false,
  title: '',
  set: null,
})

function practice(title: string, set: ExerciseSet) {
  drawer.value = { open: true, title, set }
}

const allExercises = computed(() => mergeExercises(lessons.map(getExercises)))
</script>

<template>
  <div
    class="flex flex-col gap-5 px-4 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:items-start lg:gap-6"
  >
    <div class="flex flex-col gap-5">
      <!-- Plan hero -->
      <section
        class="flex flex-col gap-4 rounded-3xl bg-linear-to-br from-indigo-600 to-violet-600 p-5 text-white shadow-lg shadow-indigo-600/20 sm:p-6"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <p class="text-sm font-medium text-indigo-100">Oct – Dec 2026 review</p>
            <h1 class="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              Day {{ elapsed }} <span class="text-indigo-200">of {{ PLAN_LENGTH }}</span>
            </h1>
          </div>
          <span
            class="grid size-12 shrink-0 place-items-center rounded-2xl bg-white/15 text-2xl ring-1 ring-white/20"
          >
            <FireFilled class="text-amber-300!" />
          </span>
        </div>

        <!-- Width is a runtime percentage → dynamic :style is the documented exception -->
        <div class="h-2 overflow-hidden rounded-full bg-white/20">
          <div class="h-full rounded-full bg-white" :style="{ width: `${roundPercent}%` }" />
        </div>

        <dl class="grid grid-cols-3 gap-2">
          <div
            v-for="stat in stats"
            :key="stat.label"
            class="rounded-2xl bg-white/12 px-3 py-2.5 ring-1 ring-white/15"
          >
            <dt class="flex items-center gap-1 text-xs text-indigo-100">
              <component :is="stat.icon" class="text-[11px]" /> {{ stat.label }}
            </dt>
            <dd class="text-xl font-bold">{{ stat.value }}</dd>
          </div>
        </dl>
      </section>

      <!-- Today -->
      <section
        class="flex flex-col gap-3 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-5"
      >
        <template v-if="featured">
          <p class="text-xs font-semibold tracking-wider text-slate-500 uppercase">
            {{ todaysLessons.length ? "Today's writing" : 'Latest writing' }}
          </p>
          <div class="flex flex-col gap-1">
            <h2 class="text-lg font-bold text-slate-900">{{ featured.title }}</h2>
            <p class="text-sm text-slate-500">
              {{ relativeDayLabel(featured.date) }} · {{ formatLongDate(featured.date) }} · score
              {{ featured.score }}/10
            </p>
          </div>
          <div class="grid gap-2 sm:grid-cols-2">
            <RouterLink
              :to="{
                name: 'review',
                params: featured.date === today ? {} : { date: featured.date },
              }"
              class="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-slate-100 px-4 font-semibold text-slate-800 transition-colors hover:bg-slate-200 active:bg-slate-300"
            >
              <BookOutlined /> Read corrections
            </RouterLink>
            <button
              type="button"
              class="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 font-semibold text-white transition-colors hover:bg-indigo-700 active:bg-indigo-800"
              @click="
                practice(`Practice · ${formatShortDate(featured.date)}`, getExercises(featured))
              "
            >
              <ThunderboltFilled /> Practise this lesson
            </button>
          </div>
        </template>
        <p v-else class="text-sm text-slate-500">
          No writing yet. Add a lesson to <code class="text-xs">src/data/lessons.ts</code> to start
          your plan.
        </p>
      </section>

      <!-- Oct–Dec calendar -->
      <section
        class="flex flex-col gap-3 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-5"
      >
        <div class="flex items-baseline justify-between gap-2">
          <h2 class="text-lg font-bold text-slate-900">Your plan</h2>
          <span class="text-xs text-slate-400">
            {{ formatShortDate(PLAN_START) }} – {{ formatShortDate(PLAN_END) }} 2026
          </span>
        </div>
        <PlanGrid :lesson-days="lessonDays" :practice-days="practiceDays" />
      </section>
    </div>

    <div class="flex flex-col gap-5 lg:sticky lg:top-20">
      <KnowledgeSummary :lessons="lessons" @practice="practice('Review weak spots', $event)" />
      <a-button size="large" block @click="practice('Practise everything', allExercises)">
        Practise all lessons
      </a-button>
    </div>

    <PracticeDrawer v-model:open="drawer.open" :title="drawer.title" :set="drawer.set" />
  </div>
</template>
