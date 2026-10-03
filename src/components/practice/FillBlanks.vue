<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { CheckCircleFilled, InfoCircleFilled } from '@ant-design/icons-vue'
import { useProgress } from '@/composables/useProgress'
import { normalize, shuffle } from '@/utils/text'
import CategoryPill from '../CategoryPill.vue'
import PracticeResult from './PracticeResult.vue'
import ProgressHeader from './ProgressHeader.vue'
import type { BlankExercise } from '@/types/exercise'

const props = defineProps<{ items: BlankExercise[] }>()

const { record } = useProgress()

const queue = ref<BlankExercise[]>([...props.items])
const index = ref(0)
const inputs = ref<string[]>([])
const checked = ref(false)
const score = ref(0)
const missed = ref<BlankExercise[]>([])
const sentenceEl = ref<HTMLElement>()

const item = computed(() => queue.value[index.value])
const finished = computed(() => index.value >= queue.value.length)

// Parts with the running blank number, so each input binds to its own answer slot
const parts = computed(() => {
  let blank = 0
  return (item.value?.parts ?? []).map((part) =>
    'answers' in part
      ? { key: `b${blank}`, blank: blank++, answers: part.answers, text: '' }
      : { key: `t${blank}-${part.text}`, blank: -1, answers: [], text: part.text },
  )
})
const blankCount = computed(() => parts.value.filter((p) => p.blank >= 0).length)

const results = computed(() =>
  parts.value
    .filter((p) => p.blank >= 0)
    .map((p) => p.answers.some((a) => normalize(a) === normalize(inputs.value[p.blank] ?? ''))),
)
const allRight = computed(() => checked.value && results.value.every(Boolean))
const anyFilled = computed(() => inputs.value.some((value) => value?.trim()))

/** Input width follows the answer length (runtime value → documented :style exception). */
function widthFor(answers: string[]): string {
  const longest = Math.max(...answers.map((a) => a.length))
  return `${Math.max(5, longest + 3)}ch`
}

function focusBlank(i: number) {
  sentenceEl.value?.querySelectorAll<HTMLInputElement>('input')[i]?.focus()
}

function onEnter(blank: number) {
  if (blank < blankCount.value - 1) focusBlank(blank + 1)
  else check()
}

function check() {
  if (checked.value || !item.value) return
  checked.value = true
  const right = results.value.every(Boolean)
  record(item.value.id, right)
  // A retry after a miss still counts as missed for this round
  if (missed.value.includes(item.value)) return
  if (right) score.value++
  else missed.value.push(item.value)
}

function reveal() {
  if (!checked.value) check()
}

function retry() {
  checked.value = false
  nextTick(() => focusBlank(results.value.findIndex((r) => !r)))
}

function next() {
  index.value++
  inputs.value = []
  checked.value = false
}

function restart(items: BlankExercise[]) {
  queue.value = items
  index.value = 0
  inputs.value = []
  checked.value = false
  score.value = 0
  missed.value = []
}
</script>

<template>
  <div class="flex flex-col gap-5">
    <template v-if="item && !finished">
      <ProgressHeader
        :index="index"
        :total="queue.length"
        :done="score"
        label="Fill in the blanks"
      />

      <div v-if="item.hint" class="flex flex-col gap-1.5 rounded-2xl bg-slate-50 p-4">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <p class="text-xs font-semibold tracking-wide text-slate-500 uppercase">
            {{ item.hintLabel ?? 'Hint' }}
          </p>
          <CategoryPill v-if="item.category" :category="item.category" />
        </div>
        <p class="text-[15px] leading-relaxed text-slate-700">{{ item.hint }}</p>
      </div>

      <div class="flex flex-col gap-2">
        <p class="text-sm font-medium text-slate-500">Complete the corrected sentence</p>
        <p ref="sentenceEl" class="text-lg leading-[2.6] break-words text-slate-800">
          <template v-for="part in parts" :key="part.key">
            <template v-if="part.blank < 0">{{ part.text }}</template>
            <a-input
              v-else
              v-model:value="inputs[part.blank]"
              size="large"
              :readonly="checked"
              :status="checked && !results[part.blank] ? 'error' : undefined"
              :class="[
                'mx-0.5 inline-flex max-w-full align-baseline text-base!',
                checked && results[part.blank] && 'bg-emerald-50! text-emerald-800!',
              ]"
              :style="{ width: widthFor(part.answers) }"
              :aria-label="`Blank ${part.blank + 1}`"
              autocomplete="off"
              autocapitalize="off"
              spellcheck="false"
              @press-enter="onEnter(part.blank)"
            />
          </template>
        </p>
      </div>

      <template v-if="checked">
        <p
          v-if="allRight"
          class="flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-sm font-medium text-emerald-800"
        >
          <CheckCircleFilled class="text-emerald-500!" /> All blanks are correct.
        </p>
        <div v-else class="flex flex-col gap-2 rounded-2xl bg-amber-50 p-4 ring-1 ring-amber-100">
          <p class="flex items-center gap-2 text-sm font-medium text-amber-800">
            <InfoCircleFilled class="text-amber-500!" /> Answer
          </p>
          <p class="text-[15px] leading-relaxed text-slate-800">
            <template v-for="part in parts" :key="part.key">
              <template v-if="part.blank < 0">{{ part.text }}</template>
              <span
                v-else
                class="rounded bg-emerald-100 px-0.5 font-medium text-emerald-800 box-decoration-clone"
                >{{ part.answers.join(' / ') }}</span
              >
            </template>
          </p>
        </div>

        <div :class="['grid gap-2', allRight ? 'grid-cols-1' : 'grid-cols-2']">
          <a-button v-if="!allRight" size="large" block @click="retry">Try again</a-button>
          <a-button type="primary" size="large" block @click="next">
            {{ index + 1 < queue.length ? 'Next' : 'See results' }}
          </a-button>
        </div>
      </template>

      <div v-else class="grid grid-cols-2 gap-2">
        <a-button size="large" block @click="reveal">Show answer</a-button>
        <a-button type="primary" size="large" block :disabled="!anyFilled" @click="check">
          Check
        </a-button>
      </div>
    </template>

    <PracticeResult v-else :score="score" :total="queue.length">
      <a-button v-if="missed.length" type="primary" size="large" @click="restart(missed)">
        Retry {{ missed.length }} missed
      </a-button>
      <a-button size="large" @click="restart(shuffle(items))">Start over</a-button>
    </PracticeResult>
  </div>
</template>
