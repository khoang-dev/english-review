<script setup lang="ts">
import { ExportOutlined } from '@ant-design/icons-vue'

const URL = 'https://youpass.vn/'
</script>

<template>
  <div class="flex flex-col gap-3 px-4">
    <div class="flex items-center justify-between gap-3">
      <h1 class="m-0 text-lg font-bold text-slate-900">YouPass</h1>
      <a
        :href="URL"
        target="_blank"
        rel="noopener noreferrer"
        class="flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 active:bg-indigo-100"
      >
        Open in new tab <ExportOutlined />
      </a>
    </div>

    <!-- Fills the viewport below the top bar (and above the phone tab bar) -->
    <iframe
      :src="URL"
      title="YouPass"
      class="h-[calc(100dvh-15rem)] w-full rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 md:h-[calc(100dvh-10rem)]"
      referrerpolicy="strict-origin-when-cross-origin"
      sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
      allow="autoplay; microphone; fullscreen"
    />

    <p class="m-0 text-center text-xs text-slate-500">
      Page blank? Some sites block being shown inside other apps — use “Open in new tab”.
    </p>
  </div>
</template>
