<script setup lang="ts">
import { computed } from 'vue'
import { DownOutlined } from '@ant-design/icons-vue'
import CategoryPill from './CategoryPill.vue'
import HighlightText from './HighlightText.vue'
import IssueList from './IssueList.vue'
import type { CategoryKey, Sentence } from '@/types/lesson'

const props = defineProps<{ sentence: Sentence }>()

const open = defineModel<boolean>('open', { default: false })

const sentenceCategories = computed(() => [
  ...new Set(
    props.sentence.issues.flatMap((i): CategoryKey[] =>
      i.category && i.type !== 'correct' ? [i.category] : [],
    ),
  ),
])
</script>

<template>
  <div class="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
    <div class="flex flex-wrap items-center gap-1.5">
      <span class="mr-1 text-xs font-semibold text-slate-400">{{ sentence.label }}</span>
      <CategoryPill v-for="key in sentenceCategories" :key="key" :category="key" />
    </div>

    <p class="text-[15px] leading-relaxed text-slate-800">
      <HighlightText :text="sentence.original" :phrases="sentence.highlights" />
    </p>

    <button
      type="button"
      class="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-slate-50 px-3 text-sm font-medium text-indigo-600 transition-colors hover:bg-indigo-50 active:bg-indigo-100"
      :aria-expanded="open"
      @click="open = !open"
    >
      {{ open ? 'Hide correction' : 'Show correction' }}
      <DownOutlined :class="['text-xs transition-transform', open && 'rotate-180']" />
    </button>

    <div v-if="open" class="flex flex-col gap-4">
      <div class="rounded-xl bg-emerald-50 p-3 ring-1 ring-emerald-100">
        <p class="mb-1 text-xs font-semibold tracking-wide text-emerald-700 uppercase">Corrected</p>
        <p class="text-[15px] leading-relaxed text-slate-800">
          <HighlightText :text="sentence.corrected" :phrases="sentence.fixes" variant="right" />
        </p>
        <p v-if="sentence.alternative" class="mt-2 text-sm text-slate-600">
          <span class="font-medium">More natural:</span> <em>{{ sentence.alternative }}</em>
        </p>
      </div>
      <IssueList :issues="sentence.issues" />
    </div>
  </div>
</template>
