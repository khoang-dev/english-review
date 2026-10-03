<script setup lang="ts">
import { computed } from 'vue'
import { ArrowRightOutlined, CheckOutlined, CloseOutlined, FireFilled } from '@ant-design/icons-vue'
import { categories, lessonMistakes } from '@/data/lessons'
import { exerciseCount, filterExercises, getExercises, mergeExercises } from '@/data/exercises'
import { useProgress } from '@/composables/useProgress'
import CategoryPill from './CategoryPill.vue'
import type { CategoryKey, FocusPoint, Lesson } from '@/types/lesson'
import type { ExerciseSet } from '@/types/exercise'

/**
 * What still needs reviewing across `lessons`: mastery per mistake type (from practice
 * results), the rules behind the weakest types and the phrases not mastered yet.
 */
const props = withDefaults(
  defineProps<{ lessons: Lesson[]; title?: string; compact?: boolean }>(),
  { title: 'What to review', compact: false },
)

defineEmits<{ practice: [set: ExerciseSet] }>()

const { needsReview } = useProgress()

type Status = 'review' | 'improving' | 'solid'

const statusConfig: Record<Status, { label: string; pill: string; bar: string }> = {
  review: { label: 'Needs review', pill: 'bg-rose-50 text-rose-700', bar: 'bg-rose-400' },
  improving: { label: 'Improving', pill: 'bg-amber-50 text-amber-700', bar: 'bg-amber-400' },
  solid: { label: 'Solid', pill: 'bg-emerald-50 text-emerald-700', bar: 'bg-emerald-500' },
}

const exercises = computed(() => mergeExercises(props.lessons.map(getExercises)))
const allItems = computed(() => [
  ...exercises.value.flashcards,
  ...exercises.value.quiz,
  ...exercises.value.blanks,
  ...exercises.value.rewrite,
])

const toReview = computed(() => filterExercises(exercises.value, (e) => needsReview(e.id)))
const toReviewCount = computed(() => exerciseCount(toReview.value))
const mastery = computed(() => {
  const total = allItems.value.length
  return total ? Math.round(((total - toReviewCount.value) / total) * 100) : 0
})

interface CategoryRow {
  key: CategoryKey
  mistakes: number
  items: number
  known: number
  percent: number
  status: Status
}

const rows = computed<CategoryRow[]>(() => {
  const byKey = new Map<CategoryKey, CategoryRow>()
  const row = (key: CategoryKey) => {
    if (!byKey.has(key)) {
      byKey.set(key, { key, mistakes: 0, items: 0, known: 0, percent: 0, status: 'review' })
    }
    return byKey.get(key)!
  }
  for (const lesson of props.lessons) {
    for (const mistake of lessonMistakes(lesson)) row(mistake.category).mistakes++
  }
  for (const item of allItems.value) {
    if (!item.category) continue
    const r = row(item.category)
    r.items++
    if (!needsReview(item.id)) r.known++
  }
  for (const r of byKey.values()) {
    r.percent = r.items ? Math.round((r.known / r.items) * 100) : 0
    r.status = r.percent >= 85 ? 'solid' : r.percent >= 50 ? 'improving' : 'review'
  }
  // Weakest first, then the most frequent mistakes
  return [...byKey.values()].sort((a, b) => a.percent - b.percent || b.mistakes - a.mistakes)
})

const weakKeys = computed(
  () => new Set(rows.value.filter((r) => r.status !== 'solid').map((r) => r.key)),
)

// Rules behind the weak mistake types, weakest type first
const rules = computed(() => {
  const order = rows.value.map((r) => r.key)
  const seen = new Set<string>()
  const result: FocusPoint[] = []
  for (const lesson of props.lessons) {
    for (const point of lesson.focusPoints) {
      if (weakKeys.value.has(point.category) && !seen.has(point.title)) {
        seen.add(point.title)
        result.push(point)
      }
    }
  }
  result.sort((a, b) => order.indexOf(a.category) - order.indexOf(b.category))
  return result.slice(0, props.compact ? 2 : 4)
})

// Flashcards not mastered yet = the phrases to remember
const phrases = computed(() => toReview.value.flashcards.slice(0, props.compact ? 4 : 8))
</script>

<template>
  <section
    class="flex flex-col gap-4 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-5"
  >
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0">
        <h2 class="text-lg font-bold text-slate-900">{{ title }}</h2>
        <p class="text-sm text-slate-500">
          <template v-if="toReviewCount">
            {{ toReviewCount }} of {{ allItems.length }} items still need practice
          </template>
          <template v-else-if="allItems.length">Everything here is mastered — great job!</template>
          <template v-else>Nothing to review yet.</template>
        </p>
      </div>
      <div class="flex shrink-0 flex-col items-end">
        <span class="text-2xl font-bold text-indigo-600">{{ mastery }}%</span>
        <span class="text-xs text-slate-400">mastered</span>
      </div>
    </div>

    <!-- Mastery per mistake type -->
    <ul v-if="rows.length" class="flex flex-col gap-3">
      <li v-for="row in rows" :key="row.key" class="flex flex-col gap-1.5">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <span class="text-sm font-medium text-slate-700">{{ categories[row.key].label }}</span>
          <span class="flex items-center gap-2 text-xs text-slate-500">
            <span v-if="row.mistakes">
              {{ row.mistakes }} {{ row.mistakes === 1 ? 'mistake' : 'mistakes' }}
            </span>
            <span :class="['rounded-full px-2 py-0.5 font-medium', statusConfig[row.status].pill]">
              {{ statusConfig[row.status].label }}
            </span>
          </span>
        </div>
        <!-- Width is a runtime percentage → dynamic :style is the documented exception -->
        <div class="h-1.5 overflow-hidden rounded-full bg-slate-100">
          <div
            :class="[
              'h-full rounded-full transition-[width] duration-500',
              statusConfig[row.status].bar,
            ]"
            :style="{ width: `${Math.max(row.percent, 3)}%` }"
          />
        </div>
      </li>
    </ul>

    <!-- Rules to re-read -->
    <div v-if="rules.length" class="flex flex-col gap-2">
      <h3 class="text-xs font-semibold tracking-wider text-slate-500 uppercase">Key rules</h3>
      <div :class="['grid gap-2', !compact && 'sm:grid-cols-2 lg:grid-cols-1']">
        <div
          v-for="rule in rules"
          :key="rule.title"
          class="flex flex-col gap-1.5 rounded-2xl bg-indigo-50/60 p-3 ring-1 ring-indigo-100"
        >
          <CategoryPill :category="rule.category" class="self-start" />
          <p class="text-sm font-semibold text-slate-900">{{ rule.title }}</p>
          <p class="text-sm leading-relaxed text-slate-600">{{ rule.rule }}</p>
        </div>
      </div>
    </div>

    <!-- Phrases not mastered yet -->
    <div v-if="phrases.length" class="flex flex-col gap-2">
      <h3 class="text-xs font-semibold tracking-wider text-slate-500 uppercase">
        Phrases to remember
      </h3>
      <ul class="flex flex-col divide-y divide-slate-100 rounded-2xl ring-1 ring-slate-200">
        <li
          v-for="card in phrases"
          :key="card.id"
          class="flex flex-col gap-1 px-3 py-2.5 text-sm sm:flex-row sm:items-center sm:gap-3"
        >
          <span class="flex min-w-0 items-start gap-1.5 text-rose-600 sm:flex-1">
            <CloseOutlined class="mt-1 shrink-0 text-xs" />
            <span class="break-words">{{ card.front }}</span>
          </span>
          <span class="flex min-w-0 items-start gap-1.5 font-medium text-emerald-700 sm:flex-1">
            <CheckOutlined class="mt-1 shrink-0 text-xs" />
            <span class="break-words">{{ card.back }}</span>
          </span>
        </li>
      </ul>
    </div>

    <a-button
      v-if="toReviewCount"
      type="primary"
      size="large"
      block
      @click="$emit('practice', toReview)"
    >
      <template #icon><FireFilled /></template>
      Practise {{ toReviewCount }} weak {{ toReviewCount === 1 ? 'item' : 'items' }}
      <ArrowRightOutlined />
    </a-button>
  </section>
</template>
