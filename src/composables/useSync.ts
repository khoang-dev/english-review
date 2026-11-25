import { ref, watch } from 'vue'
import { useProgress } from '@/composables/useProgress'
import { mergeProgress, sameProgress } from '@/utils/progressMerge'
import type { ProgressState } from '@/types/progress'

/**
 * Syncs practice progress with the Vercel function in api/progress.ts. Each sync downloads the
 * saved progress, merges it into this device's (newer copy of each item wins), and uploads the
 * result if it changed. Runs on start, after practising (debounced), when the tab comes back into
 * view, and when the device comes back online. Off until a sync key (SYNC_TOKEN) is entered.
 */

export type SyncStatus = 'off' | 'syncing' | 'synced' | 'offline' | 'unauthorized' | 'error'

const KEY_STORAGE = 'english-review:sync-key'
/** Same origin by default; set VITE_SYNC_API_URL to use a backend deployed elsewhere. */
const ENDPOINT = `${import.meta.env.VITE_SYNC_API_URL ?? ''}/api/progress`
const DEBOUNCE_MS = 2000

function readKey(): string {
  try {
    return localStorage.getItem(KEY_STORAGE) ?? ''
  } catch {
    return ''
  }
}

const syncKey = ref(readKey())
const status = ref<SyncStatus>(syncKey.value ? 'syncing' : 'off')
const lastSyncedAt = ref<number | null>(null)

let running: Promise<void> | null = null
let runAgain = false
let started = false

class AuthError extends Error {}

async function call(method: 'GET' | 'PUT', body?: ProgressState): Promise<unknown> {
  const response = await fetch(ENDPOINT, {
    method,
    cache: 'no-store',
    headers: {
      Authorization: `Bearer ${syncKey.value}`,
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (response.status === 401) throw new AuthError()
  if (!response.ok) throw new Error(`${method} /api/progress: ${response.status}`)
  return response.json()
}

async function runSync() {
  const { state } = useProgress()
  status.value = 'syncing'
  try {
    const remote = (await call('GET')) as ProgressState | null
    const local: ProgressState = {
      items: { ...state.items },
      practiceDays: [...state.practiceDays],
    }
    const merged = remote ? mergeProgress(local, remote) : local
    if (!sameProgress(merged, local)) {
      state.items = merged.items
      state.practiceDays = merged.practiceDays
    }
    if (!remote || !sameProgress(merged, remote)) await call('PUT', merged)
    status.value = 'synced'
    lastSyncedAt.value = Date.now()
  } catch (error) {
    if (error instanceof AuthError) status.value = 'unauthorized'
    else status.value = navigator.onLine ? 'error' : 'offline'
  }
}

/** Sync now; a request made while a sync runs is queued as one more sync. */
function syncNow(): Promise<void> {
  if (!syncKey.value) return Promise.resolve()
  if (running) {
    runAgain = true
    return running
  }
  running = runSync().finally(() => {
    running = null
    if (runAgain) {
      runAgain = false
      void syncNow()
    }
  })
  return running
}

function setSyncKey(value: string) {
  syncKey.value = value.trim()
  try {
    if (syncKey.value) localStorage.setItem(KEY_STORAGE, syncKey.value)
    else localStorage.removeItem(KEY_STORAGE)
  } catch {
    // Storage unavailable: the key lasts until the page is closed
  }
  status.value = syncKey.value ? 'syncing' : 'off'
  lastSyncedAt.value = null
  void syncNow()
}

/** Call once at app start. */
function startSync() {
  if (started) return
  started = true
  const { state } = useProgress()
  let timer: ReturnType<typeof setTimeout> | undefined
  watch(
    state,
    () => {
      clearTimeout(timer)
      timer = setTimeout(() => void syncNow(), DEBOUNCE_MS)
    },
    { deep: true },
  )
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') void syncNow()
  })
  window.addEventListener('online', () => void syncNow())
  void syncNow()
}

export function useSync() {
  return { syncKey, status, lastSyncedAt, syncNow, setSyncKey, startSync }
}
