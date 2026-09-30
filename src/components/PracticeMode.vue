<script setup>
import { computed, ref, watch } from 'vue'
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

watch(
  mastered,
  (value) => {
    try {
      localStorage.setItem(storageKey.value, JSON.stringify([...value]))
    } catch {
      // Storage unavailable (e.g. private mode): progress just won't persist
    }
  },
  { deep: true },
)

const index = ref(0)
const answer = ref('')
const revealed = ref(false)
const result = ref(null) // 'match' | 'different' | null

const sentence = computed(() => props.lesson.sentences[index.value])
const total = computed(() => props.lesson.sentences.length)
const isMastered = computed(() => mastered.value.has(sentence.value.label))

function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/[^a-z0-9' ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function check() {
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

function resetProgress() {
  mastered.value = new Set()
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-wrap items-center gap-4">
      <span class="text-gray-500">Mastered {{ mastered.size }} / {{ total }}</span>
      <a-progress
        :percent="Math.round((mastered.size / total) * 100)"
        size="small"
        class="m-0! max-w-xs flex-1"
      />
      <a-button size="small" type="link" :disabled="!mastered.size" @click="resetProgress">
        Reset
      </a-button>
    </div>

    <a-card>
      <template #title>
        {{ sentence.label }}
        <span class="ml-2 text-sm font-normal text-gray-400">{{ index + 1 }} / {{ total }}</span>
      </template>
      <template #extra>
        <a-tag v-if="isMastered" color="green">Mastered</a-tag>
      </template>

      <p class="mb-1 text-sm text-gray-500">Rewrite this sentence correctly:</p>
      <p class="mb-4 rounded bg-gray-50 p-3 text-base">{{ sentence.original }}</p>

      <a-textarea
        v-model:value="answer"
        :auto-size="{ minRows: 2, maxRows: 5 }"
        placeholder="Type your corrected sentence…"
        :disabled="revealed"
        @press-enter.prevent="answer.trim() && check()"
      />

      <a-space class="mt-3" wrap>
        <a-button type="primary" :disabled="revealed || !answer.trim()" @click="check">
          Check
        </a-button>
        <a-button :disabled="revealed" @click="revealed = true">Show answer</a-button>
      </a-space>

      <div v-if="revealed" class="mt-4 flex flex-col gap-4">
        <a-alert
          v-if="result === 'match'"
          type="success"
          show-icon
          message="Correct! Your sentence matches the suggested answer."
        />
        <a-alert
          v-else-if="result === 'different'"
          type="warning"
          show-icon
          message="Not quite the same as the suggested answer — compare below."
        />

        <div>
          <p class="mb-1 text-sm text-gray-500">Suggested answer</p>
          <p class="rounded bg-green-50 p-3 text-base">
            <HighlightText :text="sentence.corrected" :phrases="sentence.fixes" variant="right" />
          </p>
          <p v-if="sentence.alternative" class="mt-2 text-sm text-gray-600">
            More natural: <em>{{ sentence.alternative }}</em>
          </p>
        </div>

        <div>
          <p class="mb-2 text-sm text-gray-500">Why</p>
          <IssueList :issues="sentence.issues" />
        </div>
      </div>

      <a-divider />

      <div class="flex flex-wrap items-center justify-between gap-2">
        <a-button @click="go(-1)">Previous</a-button>
        <a-button :type="isMastered ? 'default' : 'dashed'" @click="toggleMastered">
          {{ isMastered ? 'Unmark mastered' : 'Mark as mastered' }}
        </a-button>
        <a-button type="primary" ghost @click="go(1)">Next</a-button>
      </div>
    </a-card>
  </div>
</template>
