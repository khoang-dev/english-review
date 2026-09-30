<script setup>
import { computed, ref } from 'vue'
import { CheckOutlined, CloseOutlined, ThunderboltFilled } from '@ant-design/icons-vue'
import { lessonMistakes } from '@/data/lessons'
import { formatLongDate, relativeDayLabel } from '@/utils/date'
import CategoryPill from './CategoryPill.vue'
import SentenceCard from './SentenceCard.vue'

const props = defineProps({
  lesson: { type: Object, required: true },
})

defineEmits(['practice'])

const mistakeCount = computed(() => lessonMistakes(props.lesson).length)

const openSentences = ref(new Set())
const allOpen = computed(() => openSentences.value.size === props.lesson.sentences.length)

function setOpen(label, value) {
  const next = new Set(openSentences.value)
  if (value) next.add(label)
  else next.delete(label)
  openSentences.value = next
}

function toggleAll() {
  openSentences.value = allOpen.value
    ? new Set()
    : new Set(props.lesson.sentences.map((s) => s.label))
}

const stats = computed(() => [
  { label: 'Score', value: props.lesson.score, suffix: '/10' },
  { label: 'Sentences', value: props.lesson.sentences.length },
  { label: 'Mistakes', value: mistakeCount.value },
])
</script>

<template>
  <article class="flex flex-col gap-6">
    <!-- Hero -->
    <div
      class="flex flex-col gap-4 rounded-3xl bg-linear-to-br from-indigo-600 to-violet-600 p-5 text-white shadow-lg shadow-indigo-600/20 sm:p-6"
    >
      <div>
        <p class="text-sm font-medium text-indigo-100">
          {{ relativeDayLabel(lesson.date) }} · {{ formatLongDate(lesson.date) }}
        </p>
        <h2 class="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">{{ lesson.title }}</h2>
      </div>

      <dl class="grid grid-cols-3 gap-2">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="rounded-2xl bg-white/12 px-3 py-2.5 ring-1 ring-white/15"
        >
          <dt class="text-xs text-indigo-100">{{ stat.label }}</dt>
          <dd class="text-xl font-bold">
            {{ stat.value
            }}<span v-if="stat.suffix" class="text-sm font-medium text-indigo-200">{{
              stat.suffix
            }}</span>
          </dd>
        </div>
      </dl>

      <button
        type="button"
        class="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-white px-5 font-semibold text-indigo-700 shadow-sm transition-colors hover:bg-indigo-50 active:bg-indigo-100 sm:self-start"
        @click="$emit('practice')"
      >
        <ThunderboltFilled /> Practice these sentences
      </button>
    </div>

    <p
      class="rounded-2xl bg-white p-4 leading-relaxed text-slate-700 shadow-sm ring-1 ring-slate-200"
    >
      {{ lesson.overview }}
    </p>

    <!-- Rules -->
    <section class="flex flex-col gap-3">
      <h3 class="px-1 text-xs font-semibold tracking-wider text-slate-500 uppercase">
        Remember these rules
      </h3>
      <div class="grid gap-3 md:grid-cols-2">
        <div
          v-for="point in lesson.focusPoints"
          :key="point.title"
          class="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200"
        >
          <div class="flex flex-col items-start gap-2">
            <CategoryPill :category="point.category" />
            <h4 class="font-semibold text-slate-900">{{ point.title }}</h4>
            <p class="text-sm leading-relaxed text-slate-600">{{ point.rule }}</p>
          </div>
          <ul class="mt-auto flex flex-col gap-2 border-t border-slate-100 pt-3 text-sm">
            <li v-for="(example, i) in point.examples" :key="i" class="flex flex-col gap-1">
              <span class="flex items-start gap-2 text-rose-600">
                <CloseOutlined class="mt-1 shrink-0 text-xs" />
                <span class="line-through decoration-rose-300">{{ example.wrong }}</span>
              </span>
              <span class="flex items-start gap-2 font-medium text-emerald-700">
                <CheckOutlined class="mt-1 shrink-0 text-xs" />
                {{ example.right }}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Sentences -->
    <section class="flex flex-col gap-3">
      <div class="flex items-center justify-between gap-2 px-1">
        <h3 class="text-xs font-semibold tracking-wider text-slate-500 uppercase">
          Your sentences
        </h3>
        <button
          type="button"
          class="h-11 rounded-lg px-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50"
          @click="toggleAll"
        >
          {{ allOpen ? 'Hide all' : 'Show all corrections' }}
        </button>
      </div>
      <p class="px-1 text-sm text-slate-500">
        Try to spot the mistakes before you open each correction.
      </p>
      <SentenceCard
        v-for="sentence in lesson.sentences"
        :key="sentence.label"
        :sentence="sentence"
        :open="openSentences.has(sentence.label)"
        @update:open="setOpen(sentence.label, $event)"
      />
    </section>

    <!-- Strengths -->
    <section class="flex flex-col gap-3">
      <h3 class="px-1 text-xs font-semibold tracking-wider text-slate-500 uppercase">
        What you did well
      </h3>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="item in lesson.strengths"
          :key="item"
          class="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-sm text-emerald-700 ring-1 ring-emerald-200 ring-inset"
        >
          <CheckOutlined class="text-xs" /> {{ item }}
        </span>
      </div>
    </section>
  </article>
</template>
