<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { formatLongDate, formatShortDate } from '@/utils/date'

/** One bar per day with an optional dashed reference line; hover, tap or arrow keys read a day. */
const props = defineProps<{
  title: string
  points: { date: string; value?: number; detail?: string }[]
  format: (value: number) => string
  reference?: { value: number; label: string }
}>()

const HEIGHT = 180
const PAD = { top: 16, right: 8, bottom: 24, left: 40 }

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

/** 1, 2 or 5 × 10ⁿ step so 4 ticks cover `max`. */
function niceStep(max: number): number {
  const raw = Math.max(max, 1e-9) / 4
  const power = 10 ** Math.floor(Math.log10(raw))
  return ([1, 2, 5, 10].find((m) => m * power >= raw) ?? 10) * power
}

const values = computed(() => props.points.flatMap((p) => (p.value === undefined ? [] : [p.value])))
const step = computed(() =>
  niceStep(Math.max(...values.value.map(Math.abs), props.reference?.value ?? 0, 1)),
)
const yMax = computed(
  () =>
    step.value *
    Math.ceil(Math.max(...values.value, props.reference?.value ?? 0, step.value) / step.value),
)
const yMin = computed(() => step.value * Math.floor(Math.min(0, ...values.value) / step.value))
const yTicks = computed(() => {
  const ticks: number[] = []
  for (let t = yMin.value; t <= yMax.value + step.value / 2; t += step.value) ticks.push(t)
  return ticks
})

const plotWidth = computed(() => width.value - PAD.left - PAD.right)
const slot = computed(() => plotWidth.value / Math.max(1, props.points.length))
const barWidth = computed(() => Math.max(2, Math.min(28, slot.value - 2)))
const xCenter = (i: number) => PAD.left + slot.value * (i + 0.5)
const y = (value: number) =>
  PAD.top + ((yMax.value - value) / (yMax.value - yMin.value)) * (HEIGHT - PAD.top - PAD.bottom)

// Data-end rounded 4px, base square on the zero line
function barPath(i: number, value: number): string {
  const x0 = xCenter(i) - barWidth.value / 2
  const x1 = x0 + barWidth.value
  const base = y(0)
  const end = y(value)
  const r = Math.min(4, barWidth.value / 2, Math.abs(base - end))
  if (value >= 0)
    return `M${x0},${base}V${end + r}Q${x0},${end} ${x0 + r},${end}H${x1 - r}Q${x1},${end} ${x1},${end + r}V${base}Z`
  return `M${x0},${base}V${end - r}Q${x0},${end} ${x0 + r},${end}H${x1 - r}Q${x1},${end} ${x1},${end - r}V${base}Z`
}

// A handful of evenly spaced date labels
const xLabels = computed(() => {
  const n = props.points.length
  const every = Math.max(1, Math.ceil(n / Math.max(2, Math.floor(plotWidth.value / 56))))
  return props.points.flatMap((p, i) =>
    i % every === 0 || i === n - 1 ? [{ i, text: formatShortDate(p.date) }] : [],
  )
})

const lastIndex = computed(() =>
  props.points.reduce((last, p, i) => (p.value === undefined ? last : i), -1),
)

const active = ref<number>()
function onPointer(event: PointerEvent) {
  const rect = (event.currentTarget as SVGElement).getBoundingClientRect()
  const i = Math.floor((event.clientX - rect.left - PAD.left) / slot.value)
  active.value = Math.min(props.points.length - 1, Math.max(0, i))
}
function onKey(event: KeyboardEvent) {
  const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0
  if (!step) return
  event.preventDefault()
  const next = (active.value ?? props.points.length) + step
  active.value = Math.min(props.points.length - 1, Math.max(0, next))
}
const readout = computed(() => {
  const point = active.value === undefined ? undefined : props.points[active.value]
  if (!point || active.value === undefined) return undefined
  return { ...point, left: xCenter(active.value) }
})
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
      <span class="text-sm font-semibold text-slate-800">{{ title }}</span>
      <span v-if="reference" class="flex items-center gap-1.5 text-xs text-slate-500">
        <span class="w-4 border-t-2 border-dashed border-teal-600" /> {{ reference.label }}
      </span>
    </div>

    <div ref="box" class="relative w-full">
      <svg
        :width="width"
        :height="HEIGHT"
        class="block touch-pan-y rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
        role="img"
        tabindex="0"
        :aria-label="`${title}. Use left and right arrow keys to read each day.`"
        @pointermove="onPointer"
        @pointerdown="onPointer"
        @pointerleave="active = undefined"
        @keydown="onKey"
        @blur="active = undefined"
      >
        <g class="text-[10px]">
          <template v-for="tick in yTicks" :key="tick">
            <line
              :x1="PAD.left"
              :x2="width - PAD.right"
              :y1="y(tick)"
              :y2="y(tick)"
              :class="tick === 0 ? 'stroke-slate-300' : 'stroke-slate-100'"
            />
            <text
              :x="PAD.left - 6"
              :y="y(tick)"
              dy="0.32em"
              text-anchor="end"
              class="fill-slate-400"
            >
              {{ format(tick) }}
            </text>
          </template>
          <text
            v-for="label in xLabels"
            :key="label.i"
            :x="xCenter(label.i)"
            :y="HEIGHT - 8"
            text-anchor="middle"
            class="fill-slate-400"
          >
            {{ label.text }}
          </text>
        </g>

        <!-- Hovered column -->
        <rect
          v-if="readout"
          :x="readout.left - slot / 2"
          :y="PAD.top"
          :width="slot"
          :height="HEIGHT - PAD.top - PAD.bottom"
          class="fill-slate-100"
        />

        <template v-for="(point, i) in points" :key="point.date">
          <path
            v-if="point.value !== undefined && point.value !== 0"
            :d="barPath(i, point.value)"
            :class="point.value < 0 ? 'fill-red-500' : 'fill-indigo-600'"
          />
        </template>

        <!-- Reference -->
        <template v-if="reference">
          <line
            :x1="PAD.left"
            :x2="width - PAD.right"
            :y1="y(reference.value)"
            :y2="y(reference.value)"
            class="stroke-teal-600"
            stroke-width="2"
            stroke-dasharray="6 4"
          />
        </template>

        <!-- Latest value -->
        <text
          v-if="lastIndex >= 0 && !readout"
          :x="xCenter(lastIndex)"
          :y="y(Math.max(0, points[lastIndex]!.value!)) - 6"
          text-anchor="middle"
          class="fill-slate-800 stroke-white text-[11px] font-semibold"
          stroke-width="3"
          paint-order="stroke"
        >
          {{ format(points[lastIndex]!.value!) }}
        </text>
      </svg>

      <!-- Left is a runtime pixel position → dynamic :style is the documented exception -->
      <div
        v-if="readout"
        class="pointer-events-none absolute top-1 z-10 flex min-w-32 -translate-x-1/2 flex-col gap-0.5 rounded-xl bg-white px-3 py-2 text-xs shadow-lg ring-1 ring-slate-200"
        :style="{ left: `${Math.min(Math.max(readout.left, 72), width - 72)}px` }"
      >
        <span class="text-slate-500">{{ formatLongDate(readout.date) }}</span>
        <strong class="text-sm text-slate-900">
          {{ readout.value === undefined ? '—' : format(readout.value) }}
        </strong>
        <span v-if="readout.detail" class="text-slate-500">{{ readout.detail }}</span>
      </div>
    </div>
  </div>
</template>
