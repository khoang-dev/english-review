<script setup lang="ts">
import {
  BulbFilled,
  CheckCircleFilled,
  CloseCircleFilled,
  ExclamationCircleFilled,
} from '@ant-design/icons-vue'
import type { Component } from 'vue'
import type { Issue, IssueType } from '@/types/lesson'
import CategoryPill from './CategoryPill.vue'

defineProps<{ issues: Issue[] }>()

// antd icons set their own colour, so the Tailwind colour needs `!`
const typeConfig: Record<IssueType, { icon: Component; class: string }> = {
  error: { icon: CloseCircleFilled, class: 'text-rose-500!' },
  warning: { icon: ExclamationCircleFilled, class: 'text-amber-500!' },
  tip: { icon: BulbFilled, class: 'text-sky-500!' },
  correct: { icon: CheckCircleFilled, class: 'text-emerald-500!' },
}
</script>

<template>
  <ul class="flex flex-col gap-3">
    <li v-for="(issue, index) in issues" :key="index" class="flex gap-2.5">
      <component
        :is="typeConfig[issue.type].icon"
        :class="['mt-1 shrink-0 self-start text-base', typeConfig[issue.type].class]"
      />
      <div class="flex min-w-0 flex-col gap-1.5 text-sm leading-relaxed text-slate-700">
        <div v-if="issue.category || issue.phrase" class="flex flex-wrap items-center gap-1.5">
          <CategoryPill v-if="issue.category" :category="issue.category" />
          <code
            v-if="issue.phrase"
            class="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs break-words text-slate-700"
            >{{ issue.phrase }}</code
          >
        </div>
        <p>{{ issue.text }}</p>
      </div>
    </li>
  </ul>
</template>
