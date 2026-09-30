<script setup>
import { computed, ref, watch } from 'vue'
import { CheckCircleFilled, InfoCircleFilled } from '@ant-design/icons-vue'
import HighlightText from './HighlightText.vue'
import IssueList from './IssueList.vue'

const props = defineProps({
  lesson: { type: Object, required: true },
})

const storageKey = computed(() => `mastered:${props.lesson.id}`)

function loadMastered() {
  try {
    return new Set(JSON.parse(localStorage.getItem(storageKey.value) ?? '[]'))
  } catch {
    return new Set()
  }
}

const mastered = ref(loadMastered())

watch(mastered, (value) => {
  try {
    localStorage.setItem(storageKey.value, JSON.stringify([...value]))
  } catch {
    // Storage unavailable (e.g. private mode): progress just won't persist
  }
})

const index = ref(0)
const answer = ref('')
const revealed = ref(false)
const result = ref(null) // 'match' | 'different' | null

const sentence = computed(() => props.lesson.sentences[index.value])
const total = computed(() => props.lesson.sentences.length)
const isMastered = computed(() => mastered.value.has(sentence.value.label))
const percent = computed(() => Math.round((mastered.value.size / total.value) * 100))

function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/[^a-z0-9' ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function check() {
  if (!answer.value.trim()) return
  const accepted = [sentence.value.corrected, sentence.value.alternative].filter(Boolean)
  const matches = accepted.some((text) => normalize(text) === normalize(answer.value))
  result.value = matches ? 'match' : 'different'
  revealed.value = true
}

function go(step) {
  index.value = (index.value + step + total.value) % total.value
  answer.value = ''
  revealed.value = false
  result.value = null
}

function toggleMastered() {
  const next = new Set(mastered.value)
  if (next.has(sentence.value.label)) next.delete(sentence.value.label)
  else next.add(sentence.value.label)
  mastered.value = next
}
</script>

<template>
  <div class="flex flex-col gap-5">
    <div class="flex flex-col gap-2">
      <div class="flex items-center justify-between text-sm">
        <span class="font-medium text-slate-700">
          {{ sentence.label }} <span class="text-slate-400">· {{ index + 1 }} of {{ total }}</span>
        </span>
        <span class="text-slate-500">{{ mastered.size }}/{{ total }} mastered</span>
      </div>
      <!-- Width is a runtime percentage → dynamic :style is the documented exception -->
      <div class="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          class="h-full rounded-full bg-emerald-500 transition-[width] duration-500"
          :style="{ width: `${percent}%` }"
        />
      </div>
    </div>

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
        @click="toggleMastered"
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
