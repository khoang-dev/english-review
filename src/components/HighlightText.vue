<script setup lang="ts">
import { computed } from 'vue'

type Variant = 'wrong' | 'right'

const props = withDefaults(
  defineProps<{
    text: string
    phrases?: string[]
    variant?: Variant
  }>(),
  { phrases: () => [], variant: 'wrong' },
)

// Split `text` into plain and highlighted segments (first match of each phrase, no overlaps)
const segments = computed(() => {
  const ranges = props.phrases
    .map((phrase) => ({ start: props.text.indexOf(phrase), length: phrase.length }))
    .filter((r) => r.start !== -1)
    .sort((a, b) => a.start - b.start)

  const result: { text: string; mark: boolean }[] = []
  let cursor = 0
  for (const { start, length } of ranges) {
    if (start < cursor) continue
    if (start > cursor) result.push({ text: props.text.slice(cursor, start), mark: false })
    result.push({ text: props.text.slice(start, start + length), mark: true })
    cursor = start + length
  }
  if (cursor < props.text.length) result.push({ text: props.text.slice(cursor), mark: false })
  return result
})

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
