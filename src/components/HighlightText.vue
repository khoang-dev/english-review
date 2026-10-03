<script setup lang="ts">
import { computed } from 'vue'
import { splitPhrases } from '@/utils/text'

type Variant = 'wrong' | 'right'

const props = withDefaults(
  defineProps<{
    text: string
    phrases?: string[]
    variant?: Variant
  }>(),
  { phrases: () => [], variant: 'wrong' },
)

const segments = computed(() => splitPhrases(props.text, props.phrases))

const markClass: Record<Variant, string> = {
  wrong: 'bg-rose-100 text-rose-700 line-through decoration-rose-400/70',
  right: 'bg-emerald-100 font-medium text-emerald-800',
}
</script>

<template>
  <span>
    <template v-for="(segment, index) in segments" :key="index">
      <span
        v-if="segment.mark"
        :class="['rounded px-0.5 box-decoration-clone', markClass[variant]]"
        >{{ segment.text }}</span
      >
      <template v-else>{{ segment.text }}</template>
    </template>
  </span>
</template>
