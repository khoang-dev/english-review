<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { addDays, diffDays, formatLongDate, formatShortDate } from '@/utils/date'
import { targetAt, type Snapshot } from '@/utils/pace'

/** Completed parts over time (solid) against the straight target line to the deadline (dashed). */
const props = defineProps<{
  series: Snapshot[]
  total: number
  start: string
  deadline: string
  today: string
}>()

const HEIGHT = 220
const PAD = { top: 12, right: 52, bottom: 26, left: 36 }

const box = ref<HTMLDivElement>()
const width = ref(320)
let observer: ResizeObserver | undefined
onMounted(() => {
  observer = new ResizeObserver(([entry]) => {
    if (entry) width.value = Math.max(240, entry.contentRect.width)
  })
  if (box.value) observer.observe(box.value)
})
onBeforeUnmount(() => observer?.disconnect())

const span = computed(() => Math.max(1, diffDays(props.deadline, props.start)))
const x = (date: string) =>
  PAD.left + (diffDays(date, props.start) / span.value) * (width.value - PAD.left - PAD.right)
const y = (value: number) => PAD.top + (1 - value / props.total) * (HEIGHT - PAD.top - PAD.bottom)

const first = computed(() => props.series[0])
const target = (date: string) =>
  first.value ? targetAt(date, first.value, props.total, props.deadline) : 0

const actualPath = computed(() =>
  props.series.map((s, i) => `${i ? 'L' : 'M'}${x(s.date)},${y(s.completed)}`).join(''),
)
const targetPath = computed(() =>
  first.value
    ? `M${x(first.value.date)},${y(first.value.completed)}L${x(props.deadline)},${y(props.total)}`
    : '',
)
const last = computed(() => props.series.at(-1))

const yTicks = computed(() => [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(f * props.total)))
const xTicks = computed(() => {
  const ticks = [props.start]
  for (let day = props.start; day <= props.deadline; day = addDays(day, 1)) {
    if (day.endsWith('-01') && day !== props.start) ticks.push(day)
  }
  return [...ticks, props.deadline]
})

// Hover / keyboard crosshair snaps to a day
const hover = ref<string>()
function onPointer(event: PointerEvent) {
  const rect = (event.currentTarget as SVGElement).getBoundingClientRect()
  const ratio = (event.clientX - rect.left - PAD.left) / (width.value - PAD.left - PAD.right)
  const offset = Math.round(Math.min(1, Math.max(0, ratio)) * span.value)
  hover.value = addDays(props.start, offset)
}
function onKey(event: KeyboardEvent) {
  const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0
  if (!step) return
  event.preventDefault()
  const next = addDays(hover.value ?? props.today, step)
  if (next >= props.start && next <= props.deadline) hover.value = next
}

const readout = computed(() => {
  if (!hover.value) return undefined
  const logged = props.series.find((s) => s.date === hover.value)
  const hasTarget = first.value && hover.value >= first.value.date
  return {
    date: hover.value,
    left: x(hover.value),
    actual: logged?.completed,
    target: hasTarget ? Math.round(target(hover.value)) : undefined,
  }
})
</script>

<template>
  <div class="flex flex-col gap-2">
    <ul class="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
      <li class="flex items-center gap-1.5">
        <span class="h-0.5 w-4 rounded-full bg-indigo-600" /> Completed
      </li>
      <li class="flex items-center gap-1.5">
        <span class="w-4 border-t-2 border-dashed border-teal-600" /> Target
      </li>
    </ul>

    <div ref="box" class="relative w-full">
      <svg
        :width="width"
        :height="HEIGHT"
        class="block touch-pan-y outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
        role="img"
        tabindex="0"
        :aria-label="`Completed parts versus target. ${last?.completed ?? 0} of ${total} done; target reaches ${total} on ${formatLongDate(deadline)}. Use left and right arrow keys to read values.`"
        @pointermove="onPointer"
        @pointerdown="onPointer"
        @pointerleave="hover = undefined"
        @keydown="onKey"
        @blur="hover = undefined"
      >
        <!-- Grid + y axis -->
        <g class="text-[10px]">
          <template v-for="tick in yTicks" :key="tick">
            <line
              :x1="PAD.left"
              :x2="width - PAD.right"
              :y1="y(tick)"
              :y2="y(tick)"
              class="stroke-slate-100"
            />
            <text
              :x="PAD.left - 6"
              :y="y(tick)"
              dy="0.32em"
              text-anchor="end"
              class="fill-slate-400"
            >
              {{ tick }}
            </text>
          </template>
          <text
            v-for="(tick, i) in xTicks"
            :key="tick"
            :x="x(tick)"
            :y="HEIGHT - 8"
            :text-anchor="i === 0 ? 'start' : i === xTicks.length - 1 ? 'end' : 'middle'"
            class="fill-slate-400"
          >
            {{ formatShortDate(tick) }}
          </text>
        </g>

        <!-- Today -->
        <line
          :x1="x(today)"
          :x2="x(today)"
          :y1="PAD.top"
          :y2="HEIGHT - PAD.bottom"
          class="stroke-slate-300"
          stroke-dasharray="2 3"
        />

        <!-- Target -->
        <path
          :d="targetPath"
          fill="none"
          class="stroke-teal-600"
          stroke-width="2"
          stroke-dasharray="6 4"
          stroke-linecap="round"
        />
        <text
          :x="x(deadline) + 6"
          :y="y(total)"
          dy="0.32em"
          class="fill-slate-600 text-[10px] font-semibold"
        >
          Target
        </text>

        <!-- Completed -->
        <path
          :d="actualPath"
          fill="none"
          class="stroke-indigo-600"
          stroke-width="2"
          stroke-linejoin="round"
          stroke-linecap="round"
        />
        <circle
          v-for="s in series"
          :key="s.date"
          :cx="x(s.date)"
          :cy="y(s.completed)"
          r="4"
          class="fill-indigo-600 stroke-white"
          stroke-width="2"
        />
        <text
          v-if="last"
          :x="x(last.date) + 8"
          :y="y(last.completed) - 8"
          class="fill-slate-800 text-[11px] font-semibold"
        >
          {{ last.completed }}
        </text>

        <!-- Crosshair -->
        <line
          v-if="readout"
          :x1="readout.left"
          :x2="readout.left"
          :y1="PAD.top"
          :y2="HEIGHT - PAD.bottom"
          class="stroke-slate-400"
        />
      </svg>

      <!-- Left is a runtime pixel position → dynamic :style is the documented exception -->
      <div
        v-if="readout"
        class="pointer-events-none absolute top-2 z-10 flex min-w-32 -translate-x-1/2 flex-col gap-1 rounded-xl bg-white px-3 py-2 text-xs shadow-lg ring-1 ring-slate-200"
        :style="{ left: `${Math.min(Math.max(readout.left, 72), width - 72)}px` }"
      >
        <span class="text-slate-500">{{ formatLongDate(readout.date) }}</span>
        <span class="flex items-center gap-2">
          <span class="h-0.5 w-3 rounded-full bg-indigo-600" />
          <strong class="text-slate-900">{{ readout.actual ?? '—' }}</strong>
          <span class="text-slate-500">completed</span>
        </span>
        <span class="flex items-center gap-2">
          <span class="w-3 border-t-2 border-dashed border-teal-600" />
          <strong class="text-slate-900">{{ readout.target ?? '—' }}</strong>
          <span class="text-slate-500">target</span>
        </span>
      </div>
    </div>

    <details class="group rounded-2xl bg-slate-50 px-3 py-2 text-sm">
      <summary class="flex min-h-9 cursor-pointer items-center font-semibold text-slate-700">
        Daily log ({{ series.length }} {{ series.length === 1 ? 'day' : 'days' }})
      </summary>
      <table class="mt-1 w-full text-left text-xs">
        <thead class="text-slate-500">
          <tr>
            <th class="py-1 font-medium">Date</th>
            <th class="py-1 text-right font-medium">Completed</th>
            <th class="py-1 text-right font-medium">Target</th>
            <th class="py-1 text-right font-medium">+/−</th>
          </tr>
        </thead>
        <tbody class="text-slate-700">
          <tr v-for="s in [...series].reverse()" :key="s.date" class="border-t border-slate-200">
            <td class="py-1.5">{{ formatShortDate(s.date) }}</td>
            <td class="py-1.5 text-right font-semibold">{{ s.completed }}</td>
            <td class="py-1.5 text-right">{{ Math.round(target(s.date)) }}</td>
            <td
              :class="[
                'py-1.5 text-right',
                s.completed - target(s.date) <= -1 ? 'text-red-600' : 'text-emerald-700',
              ]"
            >
              {{ Math.round(s.completed - target(s.date)) >= 0 ? '+' : ''
              }}{{ Math.round(s.completed - target(s.date)) }}
            </td>
          </tr>
        </tbody>
      </table>
    </details>
  </div>
</template>
