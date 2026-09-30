<script setup lang="ts">
import { categories } from '@/data/lessons'
import type { CategoryKey } from '@/types/lesson'

withDefaults(defineProps<{ category: CategoryKey; count?: number | null }>(), { count: null })
</script>

<template>
  <span
    :class="[
      'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ring-1 ring-inset',
      categories[category].pill,
    ]"
  >
    {{ categories[category].label }}
    <span v-if="count !== null" class="opacity-70">· {{ count }}</span>
  </span>
</template>
