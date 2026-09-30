<script setup>
import { computed, ref } from 'vue'
import { CheckOutlined, CloseOutlined, RightOutlined } from '@ant-design/icons-vue'
import { categories, lessonMistakes, lessons } from '@/data/lessons'
import { formatShortDate, relativeDayLabel } from '@/utils/date'
import CategoryPill from '@/components/CategoryPill.vue'

const filter = ref('all')

// Every mistake and rule across all lessons, grouped by category, most frequent first
const groups = computed(() => {
  const byCategory = {}
  for (const lesson of lessons) {
    for (const mistake of lessonMistakes(lesson)) {
      byCategory[mistake.category] ??= { key: mistake.category, mistakes: [], rules: [] }
      byCategory[mistake.category].mistakes.push(mistake)
    }
    for (const point of lesson.focusPoints) {
      byCategory[point.category] ??= { key: point.category, mistakes: [], rules: [] }
      if (!byCategory[point.category].rules.some((r) => r.title === point.title)) {
        byCategory[point.category].rules.push(point)
      }
    }
  }
  return Object.values(byCategory).sort((a, b) => b.mistakes.length - a.mistakes.length)
})

const visibleGroups = computed(() =>
  filter.value === 'all' ? groups.value : groups.value.filter((g) => g.key === filter.value),
)

const filterClass = (active) =>
  active
    ? 'bg-slate-900 text-white ring-slate-900'
    : 'bg-white text-slate-600 ring-slate-200 hover:bg-slate-100'
</script>

<template>
  <div class="flex flex-col gap-5">
    <div class="px-4">
      <h1 class="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Mistakes</h1>
      <p class="mt-1 text-sm text-slate-500">
        Every mistake you've made, grouped by type — the ones at the top come up most often.
      </p>
    </div>

    <div class="flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
      <button
        type="button"
        :class="[
          'h-10 shrink-0 rounded-full px-4 text-sm font-medium ring-1 transition-colors ring-inset',
          filterClass(filter === 'all'),
        ]"
        @click="filter = 'all'"
      >
        All
      </button>
      <button
        v-for="group in groups"
        :key="group.key"
        type="button"
        :class="[
          'h-10 shrink-0 rounded-full px-4 text-sm font-medium whitespace-nowrap ring-1 transition-colors ring-inset',
          filterClass(filter === group.key),
        ]"
        @click="filter = group.key"
      >
        {{ categories[group.key].label }} · {{ group.mistakes.length }}
      </button>
    </div>

    <section v-for="group in visibleGroups" :key="group.key" class="flex flex-col gap-3 px-4">
      <div class="flex items-center gap-2">
        <CategoryPill :category="group.key" />
        <span class="text-sm text-slate-500">
          {{ group.mistakes.length }} {{ group.mistakes.length === 1 ? 'mistake' : 'mistakes' }}
        </span>
      </div>

      <div
        v-for="rule in group.rules"
        :key="rule.title"
        class="flex flex-col gap-2 rounded-2xl bg-indigo-50/60 p-4 ring-1 ring-indigo-100"
      >
        <h2 class="font-semibold text-slate-900">{{ rule.title }}</h2>
        <p class="text-sm leading-relaxed text-slate-600">{{ rule.rule }}</p>
        <ul class="flex flex-col gap-1.5 text-sm">
          <li
            v-for="(example, i) in rule.examples"
            :key="i"
            class="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:gap-x-3"
          >
            <span class="inline-flex items-center gap-1.5 text-rose-600">
              <CloseOutlined class="text-xs" />
              <span class="line-through decoration-rose-300">{{ example.wrong }}</span>
            </span>
            <span class="inline-flex items-center gap-1.5 font-medium text-emerald-700">
              <CheckOutlined class="text-xs" /> {{ example.right }}
            </span>
          </li>
        </ul>
      </div>

      <ul
        v-if="group.mistakes.length"
        class="divide-y divide-slate-100 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200"
      >
        <li v-for="(mistake, i) in group.mistakes" :key="i">
          <RouterLink
            :to="{ name: 'review', params: { date: mistake.lesson.date } }"
            class="flex items-center gap-3 p-4 transition-colors hover:bg-slate-50"
          >
            <div class="flex min-w-0 flex-1 flex-col gap-1">
              <code
                v-if="mistake.phrase"
                class="self-start rounded bg-rose-50 px-1.5 py-0.5 font-mono text-xs break-words text-rose-700"
                >{{ mistake.phrase }}</code
              >
              <p class="text-sm leading-relaxed text-slate-700">{{ mistake.text }}</p>
              <p class="text-xs text-slate-400">
                {{ relativeDayLabel(mistake.lesson.date) }} ·
                {{ formatShortDate(mistake.lesson.date) }} · {{ mistake.sentence.label }}
              </p>
            </div>
            <RightOutlined class="shrink-0 text-xs text-slate-300" />
          </RouterLink>
        </li>
      </ul>
    </section>
  </div>
</template>
