<script setup>
import { computed } from 'vue'
import { categories, lessons } from '@/data/lessons'

function countMistakes(lesson) {
  const counts = {}
  for (const sentence of lesson.sentences) {
    for (const issue of sentence.issues) {
      if (issue.category && issue.type !== 'correct') {
        counts[issue.category] = (counts[issue.category] ?? 0) + 1
      }
    }
  }
  return counts
}

// Mistake totals per category across all lessons, most frequent first
const totals = computed(() => {
  const sum = {}
  for (const lesson of lessons) {
    for (const [key, count] of Object.entries(countMistakes(lesson))) {
      sum[key] = (sum[key] ?? 0) + count
    }
  }
  return Object.entries(sum).sort((a, b) => b[1] - a[1])
})
</script>

<template>
  <div class="mx-auto flex max-w-4xl flex-col gap-6">
    <div>
      <a-typography-title :level="2" class="mb-1!">Knowledge Review</a-typography-title>
      <a-typography-text type="secondary">
        Your writing corrections, grouped so you can review and avoid repeating mistakes.
      </a-typography-text>
    </div>

    <a-card title="Most frequent mistakes" size="small">
      <div class="flex flex-wrap gap-2">
        <a-tag v-for="[key, count] in totals" :key="key" :color="categories[key].color">
          {{ categories[key].label }} · {{ count }}
        </a-tag>
      </div>
    </a-card>

    <div class="grid gap-4 sm:grid-cols-2">
      <RouterLink
        v-for="lesson in lessons"
        :key="lesson.id"
        :to="{ name: 'lesson', params: { id: lesson.id } }"
      >
        <a-card hoverable class="h-full">
          <div class="flex items-start justify-between gap-4">
            <div class="min-w-0">
              <h3 class="mb-1 text-base font-semibold">{{ lesson.title }}</h3>
              <p class="text-sm text-gray-500">
                {{ lesson.date }} · {{ lesson.sentences.length }} sentences
              </p>
            </div>
            <a-progress
              type="circle"
              :size="56"
              :percent="lesson.score * 10"
              :format="() => lesson.score"
            />
          </div>
          <div class="mt-3 flex flex-wrap gap-1">
            <a-tag
              v-for="(count, key) in countMistakes(lesson)"
              :key="key"
              :color="categories[key].color"
            >
              {{ categories[key].label }} · {{ count }}
            </a-tag>
          </div>
        </a-card>
      </RouterLink>
    </div>
  </div>
</template>
