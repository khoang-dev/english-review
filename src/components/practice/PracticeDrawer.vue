<script setup lang="ts">
import { useMediaQuery } from '@/composables/useMediaQuery'
import PracticeHub from './PracticeHub.vue'
import type { ExerciseSet, PracticeTab } from '@/types/exercise'

defineProps<{ title: string; set: ExerciseSet | null; initialTab?: PracticeTab }>()

const open = defineModel<boolean>('open', { required: true })

const isDesktop = useMediaQuery('(min-width: 768px)')
</script>

<template>
  <a-drawer
    :open="open"
    :placement="isDesktop ? 'right' : 'bottom'"
    :width="520"
    height="92%"
    :title="title"
    destroy-on-close
    @close="open = false"
  >
    <PracticeHub v-if="set" :set="set" :initial-tab="initialTab" />
  </a-drawer>
</template>
