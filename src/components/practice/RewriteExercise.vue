<script setup lang="ts">
import { computed, ref } from 'vue'
import { CheckCircleFilled, InfoCircleFilled } from '@ant-design/icons-vue'
import { useProgress } from '@/composables/useProgress'
import { normalize } from '@/utils/text'
import HighlightText from '../HighlightText.vue'
import IssueList from '../IssueList.vue'
import ProgressHeader from './ProgressHeader.vue'
import type { RewriteExercise } from '@/types/exercise'

const props = defineProps<{ items: RewriteExercise[] }>()

const { record, setKnown, stat } = useProgress()

const index = ref(0)
const answer = ref('')
const revealed = ref(false)
const result = ref<'match' | 'different' | null>(null)

// `index` always stays within 0..total-1
const item = computed(() => props.items[index.value]!)
const sentence = computed(() => item.value.sentence)
const total = computed(() => props.items.length)
const isMastered = computed(() => !!stat(item.value.id)?.known)
const masteredCount = computed(() => props.items.filter((i) => stat(i.id)?.known).length)

function check() {
  if (!answer.value.trim()) return
  const accepted = [sentence.value.corrected, sentence.value.alternative].filter(
    (text): text is string => !!text,
  )
  const matches = accepted.some((text) => normalize(text) === normalize(answer.value))
  record(item.value.id, matches)
  result.value = matches ? 'match' : 'different'
  revealed.value = true
}

function go(step: -1 | 1) {
  index.value = (index.value + step + total.value) % total.value
  answer.value = ''
  revealed.value = false
  result.value = null
}
</script>

<template>
  <div class="flex flex-col gap-5">
    <ProgressHeader
      :index="index"
      :total="total"
      :done="masteredCount"
      done-label="mastered"
      :label="sentence.label"
    />

    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium text-slate-500">Rewrite this sentence correctly</p>
      <p class="rounded-2xl bg-slate-50 p-4 text-[15px] leading-relaxed text-slate-800">
        {{ sentence.original }}
      </p>
    </div>

    <a-textarea
      v-model:value="answer"
      :auto-size="{ minRows: 3, maxRows: 6 }"
      placeholder="Type your corrected sentence…"
      :disabled="revealed"
      class="text-base!"
      @press-enter.prevent="check"
    />

    <div v-if="!revealed" class="grid grid-cols-2 gap-2">
      <a-button size="large" block @click="revealed = true">Show answer</a-button>
      <a-button type="primary" size="large" block :disabled="!answer.trim()" @click="check">
        Check
      </a-button>
    </div>

    <div v-else class="flex flex-col gap-4">
      <p
        v-if="result === 'match'"
        class="flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-sm font-medium text-emerald-800"
      >
        <CheckCircleFilled class="text-emerald-500!" /> Correct — it matches the suggested answer.
      </p>
      <p
        v-else-if="result === 'different'"
        class="flex items-center gap-2 rounded-xl bg-amber-50 p-3 text-sm font-medium text-amber-800"
      >
        <InfoCircleFilled class="text-amber-500!" /> Not quite the same — compare with the answer.
      </p>

      <div class="rounded-2xl bg-emerald-50 p-4 ring-1 ring-emerald-100">
        <p class="mb-1 text-xs font-semibold tracking-wide text-emerald-700 uppercase">
          Suggested answer
        </p>
        <p class="text-[15px] leading-relaxed text-slate-800">
          <HighlightText :text="sentence.corrected" :phrases="sentence.fixes" variant="right" />
        </p>
        <p v-if="sentence.alternative" class="mt-2 text-sm text-slate-600">
          <span class="font-medium">More natural:</span> <em>{{ sentence.alternative }}</em>
        </p>
      </div>

      <IssueList :issues="sentence.issues" />

      <a-button
        size="large"
        block
        :type="isMastered ? 'default' : 'dashed'"
        @click="setKnown(item.id, !isMastered)"
      >
        {{ isMastered ? '✓ Mastered — undo' : 'I know this now — mark as mastered' }}
      </a-button>
    </div>

    <div class="grid grid-cols-2 gap-2 border-t border-slate-100 pt-4">
      <a-button size="large" block @click="go(-1)">Previous</a-button>
      <a-button size="large" block type="primary" ghost @click="go(1)">Next</a-button>
    </div>
  </div>
</template>
