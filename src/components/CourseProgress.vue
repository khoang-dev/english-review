<script setup lang="ts">
import { ReadOutlined } from '@ant-design/icons-vue'
import { courseProgress, courses, nextPart, overallProgress } from '@/data/courses'

/** Completed course parts out of all parts across ROOT, TRUNK and BULK. */
const overall = overallProgress()
const next = nextPart()
const rows = courses.map((course) => ({ name: course.name, ...courseProgress(course) }))
</script>

<template>
  <section
    class="flex flex-col gap-4 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-5"
  >
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0">
        <p class="text-xs font-semibold tracking-wider text-slate-500 uppercase">Course progress</p>
        <h2 class="mt-1 text-2xl font-bold text-slate-900">
          {{ overall.done }} <span class="text-slate-400">of {{ overall.total }} parts</span>
        </h2>
      </div>
      <span
        class="grid size-12 shrink-0 place-items-center rounded-2xl bg-indigo-50 text-xl text-indigo-600"
      >
        <ReadOutlined />
      </span>
    </div>

    <!-- Width is a runtime percentage → dynamic :style is the documented exception -->
    <div class="flex items-center gap-3">
      <div class="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100">
        <div class="h-full rounded-full bg-indigo-600" :style="{ width: `${overall.percent}%` }" />
      </div>
      <span class="text-sm font-semibold text-indigo-600">{{ overall.percent }}%</span>
    </div>

    <ul class="flex flex-col gap-3">
      <li v-for="row in rows" :key="row.name" class="flex flex-col gap-1">
        <div class="flex items-baseline justify-between gap-2 text-sm">
          <span class="font-semibold text-slate-800">{{ row.name }}</span>
          <span class="text-xs text-slate-500">{{ row.done }}/{{ row.total }}</span>
        </div>
        <div class="h-1.5 overflow-hidden rounded-full bg-slate-100">
          <div class="h-full rounded-full bg-emerald-500" :style="{ width: `${row.percent}%` }" />
        </div>
      </li>
    </ul>

    <p class="rounded-2xl bg-slate-50 px-3 py-2.5 text-sm break-words text-slate-600">
      <template v-if="next">
        Next up: <span class="font-semibold text-slate-800">{{ next }}</span>
      </template>
      <template v-else>All courses completed 🎉</template>
    </p>
  </section>
</template>
