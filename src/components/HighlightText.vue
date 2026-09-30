<script setup>
import { computed } from 'vue'

const props = defineProps({
  text: { type: String, required: true },
  phrases: { type: Array, default: () => [] },
  variant: { type: String, default: 'wrong', validator: (v) => ['wrong', 'right'].includes(v) },
})

// Split `text` into plain and highlighted segments (first match of each phrase, no overlaps)
const segments = computed(() => {
  const ranges = props.phrases
    .map((phrase) => ({ start: props.text.indexOf(phrase), length: phrase.length }))
    .filter((r) => r.start !== -1)
    .sort((a, b) => a.start - b.start)

  const result = []
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

const markClass = {
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
