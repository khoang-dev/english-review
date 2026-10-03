<script setup lang="ts">
import { computed, ref } from 'vue'
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons-vue'
import { useProgress } from '@/composables/useProgress'
import { shuffle } from '@/utils/text'
import CategoryPill from '../CategoryPill.vue'
import IssueList from '../IssueList.vue'
import PracticeResult from './PracticeResult.vue'
import ProgressHeader from './ProgressHeader.vue'
import type { QuizQuestion } from '@/types/exercise'

const props = defineProps<{ questions: QuizQuestion[] }>()

const { record } = useProgress()

interface Round {
  question: QuizQuestion
  options: { text: string; correct: boolean }[]
}

// Options are shuffled once per round so the answer isn't always in the same place
function buildRounds(questions: QuizQuestion[]): Round[] {
  return questions.map((question) => ({
    question,
    options: shuffle(question.options.map((text, i) => ({ text, correct: i === question.answer }))),
  }))
}

const rounds = ref<Round[]>(buildRounds(props.questions))
const index = ref(0)
const selected = ref<number | null>(null)
const missed = ref<QuizQuestion[]>([])

const round = computed(() => rounds.value[index.value])
const finished = computed(() => index.value >= rounds.value.length)
const score = ref(0)
const answeredRight = computed(
  () => selected.value !== null && !!round.value?.options[selected.value]?.correct,
)

const letters = ['A', 'B', 'C', 'D']

function choose(i: number) {
  if (selected.value !== null || !round.value) return
  selected.value = i
  const correct = !!round.value.options[i]?.correct
  record(round.value.question.id, correct)
  if (correct) score.value++
  else missed.value.push(round.value.question)
}

function next() {
  selected.value = null
  index.value++
}

function restart(questions: QuizQuestion[]) {
  rounds.value = buildRounds(questions)
  index.value = 0
  selected.value = null
  score.value = 0
  missed.value = []
}

function optionClass(i: number, correct: boolean): string {
  if (selected.value === null) {
    return 'bg-white text-slate-800 ring-slate-200 hover:bg-slate-50 active:bg-indigo-50'
  }
  if (correct) return 'bg-emerald-50 text-emerald-900 ring-emerald-400'
  if (i === selected.value) return 'bg-rose-50 text-rose-900 ring-rose-400'
  return 'bg-white text-slate-400 ring-slate-200'
}

function badgeClass(i: number, correct: boolean): string {
  if (selected.value === null) return 'bg-slate-100 text-slate-600'
  if (correct) return 'bg-emerald-500 text-white'
  if (i === selected.value) return 'bg-rose-500 text-white'
  return 'bg-slate-100 text-slate-400'
}
</script>

<template>
  <div class="flex flex-col gap-5">
    <template v-if="round && !finished">
      <ProgressHeader :index="index" :total="rounds.length" :done="score" label="Quiz" />

      <div class="flex flex-col gap-2">
        <CategoryPill
          v-if="round.question.category"
          :category="round.question.category"
          class="self-start"
        />
        <p class="text-lg leading-snug font-semibold break-words text-slate-900">
          {{ round.question.prompt }}
        </p>
      </div>

      <div class="flex flex-col gap-2" role="radiogroup" :aria-label="round.question.prompt">
        <button
          v-for="(option, i) in round.options"
          :key="option.text"
          type="button"
          role="radio"
          :aria-checked="selected === i"
          :disabled="selected !== null"
          :class="[
            'flex min-h-12 items-center gap-3 rounded-2xl p-3 text-left text-[15px] leading-snug ring-1 transition-colors ring-inset',
            optionClass(i, option.correct),
          ]"
          @click="choose(i)"
        >
          <span
            :class="[
              'grid size-7 shrink-0 place-items-center rounded-lg text-sm font-semibold',
              badgeClass(i, option.correct),
            ]"
          >
            {{ letters[i] }}
          </span>
          <span class="min-w-0 flex-1 break-words">{{ option.text }}</span>
          <CheckCircleFilled
            v-if="selected !== null && option.correct"
            class="shrink-0 text-emerald-500!"
          />
          <CloseCircleFilled v-else-if="selected === i" class="shrink-0 text-rose-500!" />
        </button>
      </div>

      <template v-if="selected !== null">
        <div
          :class="[
            'flex flex-col gap-3 rounded-2xl p-4 ring-1',
            answeredRight ? 'bg-emerald-50 ring-emerald-100' : 'bg-amber-50 ring-amber-100',
          ]"
        >
          <p
            :class="[
              'text-sm font-semibold',
              answeredRight ? 'text-emerald-800' : 'text-amber-800',
            ]"
          >
            {{ answeredRight ? 'Correct!' : 'Not quite.' }}
          </p>
          <p v-if="round.question.explanation" class="text-sm leading-relaxed text-slate-700">
            {{ round.question.explanation }}
          </p>
          <IssueList v-if="round.question.issues" :issues="round.question.issues" />
        </div>
        <a-button type="primary" size="large" block @click="next">
          {{ index + 1 < rounds.length ? 'Next question' : 'See results' }}
        </a-button>
      </template>
    </template>

    <PracticeResult v-else :score="score" :total="rounds.length">
      <a-button v-if="missed.length" type="primary" size="large" @click="restart(missed)">
        Retry {{ missed.length }} missed
      </a-button>
      <a-button size="large" @click="restart(shuffle(questions))">Start over</a-button>
    </PracticeResult>
  </div>
</template>
