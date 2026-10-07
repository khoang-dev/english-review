<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  ArrowRightOutlined,
  BookOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  QuestionCircleOutlined,
  RetweetOutlined,
} from '@ant-design/icons-vue'
import type { Component } from 'vue'
import { getVocabExercises } from '@/data/vocabulary'
import type { VocabDay, VocabWord } from '@/types/vocabulary'
import type { ExerciseSet, PracticeTab } from '@/types/exercise'

const props = defineProps<{ day: VocabDay }>()

const emit = defineEmits<{ practice: [set: ExerciseSet, tab?: PracticeTab] }>()

const exercises = computed(() => getVocabExercises(props.day))

const modes: { tab: PracticeTab; label: string; icon: Component }[] = [
  { tab: 'flashcards', label: 'Flashcards', icon: RetweetOutlined },
  { tab: 'quiz', label: 'Quiz', icon: QuestionCircleOutlined },
]

/** `word` split around its `focus` part (first match, case-insensitive). */
function wordParts(w: VocabWord): { text: string; focus: boolean }[] {
  const at = w.focus ? w.word.toLowerCase().indexOf(w.focus.toLowerCase()) : -1
  if (!w.focus || at < 0) return [{ text: w.word, focus: false }]
  const end = at + w.focus.length
  return [
    { text: w.word.slice(0, at), focus: false },
    { text: w.word.slice(at, end), focus: true },
    { text: w.word.slice(end), focus: false },
  ].filter((part) => part.text)
}

// Self-test: hide meanings and reveal them one word at a time
const hideMeanings = ref(false)
const revealed = ref(new Set<string>())

function toggleHide() {
  hideMeanings.value = !hideMeanings.value
  revealed.value = new Set()
}

function reveal(word: string) {
  revealed.value = new Set(revealed.value).add(word)
}
</script>

<template>
  <section class="flex flex-col gap-3">
    <div
      class="flex flex-col gap-4 rounded-3xl bg-linear-to-br from-amber-500 to-orange-500 p-5 text-white shadow-lg shadow-orange-500/20 sm:p-6"
    >
      <div class="flex items-start gap-3">
        <span class="grid size-11 shrink-0 place-items-center rounded-2xl bg-white/20 text-xl">
          <BookOutlined />
        </span>
        <div class="min-w-0">
          <p class="text-sm font-medium text-amber-50">Vocabulary · {{ day.words.length }} words</p>
          <h3 class="text-xl font-bold tracking-tight sm:text-2xl">
            {{ day.title ?? 'New words' }}
          </h3>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-2">
        <button
          v-for="mode in modes"
          :key="mode.tab"
          type="button"
          :disabled="!exercises[mode.tab].length"
          class="flex min-h-12 items-center gap-2 rounded-2xl bg-white px-3 text-left text-sm font-semibold text-orange-700 shadow-sm transition-colors hover:bg-orange-50 active:bg-orange-100 disabled:opacity-50"
          @click="emit('practice', exercises, mode.tab)"
        >
          <component :is="mode.icon" class="text-base" />
          <span class="min-w-0 flex-1 truncate">{{ mode.label }}</span>
          <span class="text-xs font-medium text-orange-400">{{ exercises[mode.tab].length }}</span>
        </button>
      </div>
    </div>

    <div class="flex items-center justify-between gap-2 px-1">
      <h3 class="text-xs font-semibold tracking-wider text-slate-500 uppercase">New words</h3>
      <button
        type="button"
        class="inline-flex h-11 items-center gap-1.5 rounded-lg px-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50"
        @click="toggleHide"
      >
        <component :is="hideMeanings ? EyeOutlined : EyeInvisibleOutlined" />
        {{ hideMeanings ? 'Show meanings' : 'Hide meanings' }}
      </button>
    </div>

    <ul class="grid gap-3 md:grid-cols-2">
      <li
        v-for="w in day.words"
        :key="w.word"
        class="flex flex-col gap-2 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200"
      >
        <div class="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span class="text-lg font-semibold break-words text-slate-900">
            <template v-for="(part, i) in wordParts(w)" :key="i">
              <span v-if="part.focus" class="text-orange-600 uppercase">{{ part.text }}</span>
              <template v-else>{{ part.text }}</template>
            </template>
          </span>
          <span class="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">{{
            w.pos
          }}</span>
          <span v-if="w.ipa" class="text-sm text-slate-500">/{{ w.ipa }}/</span>
        </div>

        <button
          v-if="hideMeanings && !revealed.has(w.word)"
          type="button"
          class="min-h-11 rounded-xl border border-dashed border-slate-300 px-3 text-sm text-slate-500 hover:bg-slate-50 active:bg-slate-100"
          @click="reveal(w.word)"
        >
          Tap to reveal the meaning
        </button>
        <template v-else>
          <p class="font-medium text-slate-700">{{ w.meaning }}</p>

          <ol
            v-if="w.family?.length"
            class="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm text-slate-500"
          >
            <li v-for="form in w.family" :key="form.word" class="flex items-center gap-1.5">
              <span
                ><span class="font-medium text-slate-700">{{ form.word }}</span> ({{
                  form.pos
                }})<template v-if="form.meaning">: {{ form.meaning }}</template></span
              >
              <ArrowRightOutlined class="text-xs text-slate-400" />
            </li>
            <li class="font-medium text-orange-600">{{ w.word }}</li>
          </ol>

          <p
            v-if="w.example"
            class="border-l-2 border-orange-200 pl-3 text-sm text-slate-600 italic"
          >
            {{ w.example }}
          </p>
          <p v-if="w.note" class="text-sm text-slate-500">{{ w.note }}</p>
        </template>
      </li>
    </ul>
  </section>
</template>
