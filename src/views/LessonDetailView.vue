<script setup>
import { computed, ref } from 'vue'
import { ArrowLeftOutlined, CheckOutlined } from '@ant-design/icons-vue'
import { categories, getLesson } from '@/data/lessons'
import HighlightText from '@/components/HighlightText.vue'
import IssueList from '@/components/IssueList.vue'
import PracticeMode from '@/components/PracticeMode.vue'

const props = defineProps({
  id: { type: String, required: true },
})

const lesson = computed(() => getLesson(props.id))
const activeTab = ref('summary')
const categoryFilter = ref('all')

const filterOptions = computed(() => {
  const used = new Set(
    lesson.value.sentences.flatMap((s) => s.issues.map((i) => i.category).filter(Boolean)),
  )
  return [
    { label: 'All', value: 'all' },
    ...[...used].map((key) => ({ label: categories[key].label, value: key })),
  ]
})

const filteredSentences = computed(() =>
  categoryFilter.value === 'all'
    ? lesson.value.sentences
    : lesson.value.sentences.filter((s) =>
        s.issues.some((i) => i.category === categoryFilter.value),
      ),
)
</script>

<template>
  <div v-if="lesson" class="mx-auto flex max-w-4xl flex-col gap-4">
    <RouterLink :to="{ name: 'lessons' }" class="inline-flex items-center gap-1 text-sm">
      <ArrowLeftOutlined /> All lessons
    </RouterLink>

    <div class="flex flex-wrap items-center justify-between gap-4">
      <div class="min-w-0">
        <a-typography-title :level="2" class="mb-1!">{{ lesson.title }}</a-typography-title>
        <a-typography-text type="secondary">{{ lesson.date }}</a-typography-text>
      </div>
      <a-statistic title="Score" :value="lesson.score" suffix="/ 10" />
    </div>

    <a-tabs v-model:active-key="activeTab">
      <a-tab-pane key="summary" tab="Summary">
        <div class="flex flex-col gap-4">
          <a-alert type="info" :message="lesson.overview" show-icon />

          <a-card title="Strengths" size="small">
            <div class="flex flex-wrap gap-2">
              <a-tag v-for="item in lesson.strengths" :key="item" color="green">
                <CheckOutlined /> {{ item }}
              </a-tag>
            </div>
          </a-card>

          <h3 class="pt-2 text-lg font-semibold">Remember these rules</h3>
          <div class="grid gap-4 md:grid-cols-2">
            <a-card v-for="point in lesson.focusPoints" :key="point.title" size="small">
              <template #title>
                <span class="whitespace-normal">{{ point.title }}</span>
              </template>
              <template #extra>
                <a-tag :color="categories[point.category].color" class="mr-0">
                  {{ categories[point.category].label }}
                </a-tag>
              </template>
              <p class="mb-3 text-gray-700">{{ point.rule }}</p>
              <ul class="space-y-1 text-sm">
                <li v-for="(example, i) in point.examples" :key="i">
                  <span class="text-red-600 line-through">{{ example.wrong }}</span>
                  <span class="mx-2 text-gray-400">→</span>
                  <span class="font-medium text-green-700">{{ example.right }}</span>
                </li>
              </ul>
            </a-card>
          </div>
        </div>
      </a-tab-pane>

      <a-tab-pane key="sentences" tab="Sentence by sentence">
        <div class="flex flex-col gap-4">
          <a-segmented v-model:value="categoryFilter" :options="filterOptions" block />

          <a-card v-for="sentence in filteredSentences" :key="sentence.label" size="small">
            <template #title>{{ sentence.label }}</template>
            <div class="flex flex-col gap-3">
              <div>
                <p class="mb-1 text-xs text-gray-500 uppercase">Your sentence</p>
                <p class="text-base">
                  <HighlightText :text="sentence.original" :phrases="sentence.highlights" />
                </p>
              </div>
              <IssueList :issues="sentence.issues" />
              <div class="rounded bg-green-50 p-3">
                <p class="mb-1 text-xs text-gray-500 uppercase">Corrected</p>
                <p class="text-base">
                  <HighlightText
                    :text="sentence.corrected"
                    :phrases="sentence.fixes"
                    variant="right"
                  />
                </p>
                <p v-if="sentence.alternative" class="mt-2 text-sm text-gray-600">
                  More natural: <em>{{ sentence.alternative }}</em>
                </p>
              </div>
            </div>
          </a-card>
        </div>
      </a-tab-pane>

      <a-tab-pane key="practice" tab="Practice">
        <PracticeMode :lesson="lesson" />
      </a-tab-pane>
    </a-tabs>
  </div>

  <a-result v-else status="404" title="Lesson not found">
    <template #extra>
      <RouterLink :to="{ name: 'lessons' }">
        <a-button type="primary">All lessons</a-button>
      </RouterLink>
    </template>
  </a-result>
</template>
