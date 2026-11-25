<script setup lang="ts">
import { computed, ref } from 'vue'
import { CloudOutlined, CloudSyncOutlined } from '@ant-design/icons-vue'
import { useMediaQuery } from '@/composables/useMediaQuery'
import { useSync } from '@/composables/useSync'
import type { SyncStatus } from '@/composables/useSync'

const { syncKey, status, lastSyncedAt, syncNow, setSyncKey } = useSync()
const isDesktop = useMediaQuery('(min-width: 768px)')

const open = ref(false)
const keyInput = ref(syncKey.value)

const statusInfo: Record<SyncStatus, { label: string; text: string; dot: string }> = {
  off: { label: 'Sync is off', text: 'text-slate-500', dot: 'bg-slate-300' },
  syncing: { label: 'Syncing…', text: 'text-indigo-600', dot: 'bg-indigo-500' },
  synced: { label: 'Synced', text: 'text-green-600', dot: 'bg-green-500' },
  offline: {
    label: 'Offline — syncs when you are back online',
    text: 'text-amber-600',
    dot: 'bg-amber-500',
  },
  unauthorized: { label: 'Wrong sync key', text: 'text-red-600', dot: 'bg-red-500' },
  error: { label: 'Sync failed — try again later', text: 'text-red-600', dot: 'bg-red-500' },
}

const info = computed(() => statusInfo[status.value])

const lastSynced = computed(() =>
  lastSyncedAt.value
    ? new Date(lastSyncedAt.value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '',
)

function openDrawer() {
  keyInput.value = syncKey.value
  open.value = true
}

function save() {
  setSyncKey(keyInput.value)
}

function disconnect() {
  keyInput.value = ''
  setSyncKey('')
}
</script>

<template>
  <button
    type="button"
    :aria-label="`Progress sync: ${info.label}`"
    :title="info.label"
    class="relative grid size-11 place-items-center rounded-lg text-lg text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200"
    @click="openDrawer"
  >
    <CloudSyncOutlined v-if="status === 'syncing'" />
    <CloudOutlined v-else />
    <span :class="['absolute top-2.5 right-2 size-2 rounded-full ring-2 ring-white', info.dot]" />
  </button>

  <a-drawer
    :open="open"
    :placement="isDesktop ? 'right' : 'bottom'"
    :width="420"
    height="auto"
    title="Sync progress"
    @close="open = false"
  >
    <div class="flex flex-col gap-4 pb-[env(safe-area-inset-bottom)]">
      <p class="text-sm text-slate-600">
        Your practice results are saved on this device. Enter the sync key to keep the same progress
        on your phone and computer.
      </p>

      <form class="flex flex-col gap-3" @submit.prevent="save">
        <label for="sync-key" class="text-sm font-medium text-slate-700">Sync key</label>
        <a-input-password
          id="sync-key"
          v-model:value="keyInput"
          size="large"
          autocomplete="off"
          placeholder="The SYNC_TOKEN set on Vercel"
          class="text-base!"
        />
        <a-button type="primary" size="large" html-type="submit" :disabled="!keyInput.trim()">
          Save and sync
        </a-button>
      </form>

      <div class="flex min-h-11 flex-wrap items-center justify-between gap-2">
        <span :class="['flex items-center gap-2 text-sm font-medium', info.text]">
          <span :class="['size-2 rounded-full', info.dot]" />
          {{ info.label }}
          <span v-if="status === 'synced' && lastSynced" class="font-normal text-slate-500">
            at {{ lastSynced }}
          </span>
        </span>
        <div v-if="syncKey" class="flex gap-2">
          <a-button size="large" :loading="status === 'syncing'" @click="syncNow">
            Sync now
          </a-button>
          <a-button size="large" danger @click="disconnect">Turn off</a-button>
        </div>
      </div>
    </div>
  </a-drawer>
</template>
