<script setup>
import {
  BulbOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons-vue'
import { categories } from '@/data/lessons'

defineProps({
  issues: { type: Array, required: true },
})

const typeConfig = {
  error: { icon: CloseCircleOutlined, color: '#ef4444' },
  warning: { icon: ExclamationCircleOutlined, color: '#f97316' },
  tip: { icon: BulbOutlined, color: '#3b82f6' },
  correct: { icon: CheckCircleOutlined, color: '#16a34a' },
}
</script>

<template>
  <ul class="flex flex-col gap-2">
    <li v-for="(issue, index) in issues" :key="index" class="flex gap-2">
      <component
        :is="typeConfig[issue.type].icon"
        :style="{ color: typeConfig[issue.type].color }"
        class="mt-1 shrink-0"
      />
      <div class="min-w-0">
        <a-tag v-if="issue.category" :color="categories[issue.category].color" class="mb-1">
          {{ categories[issue.category].label }}
        </a-tag>
        <code v-if="issue.phrase" class="mr-1 rounded bg-gray-100 px-1 text-sm">
          {{ issue.phrase }}
        </code>
        <span>{{ issue.text }}</span>
      </div>
    </li>
  </ul>
</template>
