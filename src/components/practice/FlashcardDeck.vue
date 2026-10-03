<script setup lang="ts">
import { computed, ref } from 'vue'
import { RetweetOutlined, SwapOutlined } from '@ant-design/icons-vue'
import { useProgress } from '@/composables/useProgress'
import { shuffle } from '@/utils/text'
import CategoryPill from '../CategoryPill.vue'
import PracticeResult from './PracticeResult.vue'
import ProgressHeader from './ProgressHeader.vue'
import type { Flashcard } from '@/types/exercise'

const props = defineProps<{ cards: Flashcard[] }>()

const { record } = useProgress()

const deck = ref<Flashcard[]>([...props.cards])
const index = ref(0)
const flipped = ref(false)
// Ids answered "Got it" in this round
const known = ref(new Set<string>())

const card = computed(() => deck.value[index.value])
const finished = computed(() => index.value >= deck.value.length)
const learning = computed(() => deck.value.filter((c) => !known.value.has(c.id)))

function answer(gotIt: boolean) {
  if (!card.value) return
  record(card.value.id, gotIt)
  if (gotIt) known.value = new Set(known.value).add(card.value.id)
  flipped.value = false
  index.value++
}

function restart(cards: Flashcard[]) {
  deck.value = cards
  index.value = 0
  flipped.value = false
  known.value = new Set()
}
</script>

<template>
  <div class="flex flex-col gap-5">
    <template v-if="card && !finished">
      <ProgressHeader
        :index="index"
        :total="deck.length"
        :done="known.size"
        done-label="known"
        label="Flashcards"
      />

      <!-- Tap to flip: both faces share one grid cell so the card takes the taller face's height -->
      <button
        type="button"
        class="group perspective-[1200px] text-left"
        :aria-label="flipped ? 'Show front' : 'Show answer'"
        @click="flipped = !flipped"
      >
        <div
          :class="[
            'grid transition-transform duration-500 transform-3d',
            flipped && 'rotate-y-180',
          ]"
        >
          <div
            class="flex min-h-56 flex-col gap-3 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 backface-hidden [grid-area:1/1]"
          >
            <div class="flex items-center justify-between gap-2">
              <CategoryPill v-if="card.category" :category="card.category" />
              <span class="ml-auto text-xs font-medium text-slate-400">Front</span>
            </div>
            <p
              class="my-auto text-center text-xl leading-snug font-semibold break-words text-slate-900"
            >
              {{ card.front }}
            </p>
            <p class="flex items-center justify-center gap-1.5 text-xs text-slate-400">
              <RetweetOutlined /> Tap to flip
            </p>
          </div>

          <div
            class="flex min-h-56 rotate-y-180 flex-col gap-3 rounded-3xl bg-linear-to-br from-emerald-50 to-teal-50 p-5 shadow-sm ring-1 ring-emerald-200 backface-hidden [grid-area:1/1]"
          >
            <span class="ml-auto text-xs font-medium text-emerald-600">Answer</span>
            <p
              class="my-auto text-center text-xl leading-snug font-semibold break-words text-emerald-800"
            >
              {{ card.back }}
            </p>
            <p v-if="card.note" class="text-center text-sm leading-relaxed text-slate-600">
              {{ card.note }}
            </p>
          </div>
        </div>
      </button>

      <div v-if="flipped" class="grid grid-cols-2 gap-2">
        <a-button size="large" block danger @click="answer(false)">Still learning</a-button>
        <a-button size="large" block type="primary" @click="answer(true)">Got it</a-button>
      </div>
      <a-button v-else size="large" block @click="flipped = true">Show answer</a-button>
    </template>

    <PracticeResult v-else :score="known.size" :total="deck.length" noun="known">
      <a-button v-if="learning.length" type="primary" size="large" @click="restart(learning)">
        Review {{ learning.length }} still learning
      </a-button>
      <a-button size="large" @click="restart(shuffle(cards))">
        <template #icon><SwapOutlined /></template>
        Shuffle &amp; start over
      </a-button>
    </PracticeResult>
  </div>
</template>
