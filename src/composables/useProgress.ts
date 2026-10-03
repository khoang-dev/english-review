import { computed, reactive, watch } from 'vue'
import { todayKey } from '@/utils/date'

/**
 * Practice progress shared by every exercise and the knowledge summary, saved in
 * localStorage (per browser). Each exercise is tracked by its stable id (src/data/exercises.ts).
 */

export interface ItemStat {
  right: number
  wrong: number
  /** Day key of the last attempt. */
  last: string
  /** The last attempt was right (or the item was marked as known). */
  known: boolean
}

interface ProgressState {
  items: Record<string, ItemStat>
  /** Day keys on which something was practised. */
  practiceDays: string[]
}

const STORAGE_KEY = 'english-review:progress:v1'

function load(): ProgressState {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') as ProgressState | null
    if (saved?.items && Array.isArray(saved.practiceDays)) return saved
  } catch {
    // Corrupt or unavailable storage: start fresh
  }
  return { items: {}, practiceDays: [] }
}

const state = reactive<ProgressState>(load())

watch(
  state,
  (value) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
    } catch {
      // Storage unavailable (e.g. private mode): progress just won't persist
    }
  },
  { deep: true },
)

function markPracticedToday() {
  const today = todayKey()
  if (!state.practiceDays.includes(today)) state.practiceDays.push(today)
}

/** Record one attempt at an exercise. */
function record(id: string, correct: boolean) {
  const stat = state.items[id] ?? { right: 0, wrong: 0, last: '', known: false }
  if (correct) stat.right++
  else stat.wrong++
  stat.last = todayKey()
  stat.known = correct
  state.items[id] = stat
  markPracticedToday()
}

/** Mark an item as known / not known without counting an attempt (e.g. rewrite "mastered"). */
function setKnown(id: string, known: boolean) {
  const stat = state.items[id] ?? { right: 0, wrong: 0, last: todayKey(), known }
  stat.known = known
  state.items[id] = stat
  markPracticedToday()
}

function stat(id: string): ItemStat | undefined {
  return state.items[id]
}

/** Never practised, or the last attempt was wrong. */
function needsReview(id: string): boolean {
  return !state.items[id]?.known
}

function reset() {
  state.items = {}
  state.practiceDays = []
}

const practiceDays = computed(() => new Set(state.practiceDays))

export function useProgress() {
  return { state, practiceDays, record, setKnown, stat, needsReview, reset }
}
