<script setup lang="ts">
import { computed, ref } from 'vue'
import FillBlanks from './FillBlanks.vue'
import FlashcardDeck from './FlashcardDeck.vue'
import QuizExercise from './QuizExercise.vue'
import RewriteExercise from './RewriteExercise.vue'
import type { ExerciseSet, PracticeTab } from '@/types/exercise'

const props = withDefaults(defineProps<{ set: ExerciseSet; initialTab?: PracticeTab }>(), {
  initialTab: 'flashcards',
})

const tabLabels: Record<PracticeTab, string> = {
  flashcards: 'Cards',
  quiz: 'Quiz',
  blanks: 'Blanks',
  rewrite: 'Rewrite',
}

const tabs = computed(() =>
  (Object.keys(tabLabels) as PracticeTab[]).filter((key) => props.set[key].length),
)

const tab = ref<PracticeTab>(
  props.set[props.initialTab].length ? props.initialTab : (tabs.value[0] ?? 'flashcards'),
)

const options = computed(() =>
  // Counts are in each exercise's progress header — labels stay short enough for 360px
  tabs.value.map((key) => ({ value: key, label: tabLabels[key] })),
)
</script>

<template>
  <div class="flex flex-col gap-5">
    <template v-if="tabs.length">
      <a-segmented v-model:value="tab" :options="options" block size="large" />

      <!-- Keyed by tab so each exercise starts fresh when you switch -->
      <FlashcardDeck v-if="tab === 'flashcards'" key="flashcards" :cards="set.flashcards" />
      <QuizExercise v-else-if="tab === 'quiz'" key="quiz" :questions="set.quiz" />
      <FillBlanks v-else-if="tab === 'blanks'" key="blanks" :items="set.blanks" />
      <RewriteExercise v-else key="rewrite" :items="set.rewrite" />
    </template>

    <p v-else class="py-10 text-center text-sm text-slate-500">Nothing to practise here yet.</p>
  </div>
</template>
