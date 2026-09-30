<script setup lang="ts" generic="T">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

/**
 * Horizontally swipeable, snap-to-slide carousel (native CSS scroll snap, so touch, trackpad
 * and scrollbar all work). Slide 0 is shown first; swiping left moves to the next slide.
 */
const props = defineProps<{ items: T[] }>()

defineSlots<{ default(props: { item: T; index: number }): unknown }>()

const index = defineModel<number>({ required: true })

const track = ref<HTMLElement>()
const slides = ref<HTMLElement[]>([])
const height = ref<number | null>(null)
let targetIndex: number | null = null
let heightObserver: ResizeObserver | undefined
let widthObserver: ResizeObserver | undefined

function measure() {
  const slide = slides.value[index.value]
  if (slide) height.value = slide.offsetHeight
}

function observeActiveSlide() {
  if (!heightObserver) return
  heightObserver.disconnect()
  const slide = slides.value[index.value]
  if (slide) heightObserver.observe(slide)
}

function scrollToIndex(i: number, behavior: ScrollBehavior) {
  if (!track.value) return
  // Jump instantly when skipping several slides; animate only between neighbours
  targetIndex = i
  track.value.scrollTo({ left: i * track.value.clientWidth, behavior })
}

function onScroll() {
  if (!track.value) return
  const { scrollLeft, clientWidth } = track.value
  if (targetIndex !== null) {
    // Ignore intermediate positions of a programmatic scroll until it arrives
    if (Math.abs(scrollLeft - targetIndex * clientWidth) > 2) return
    targetIndex = null
  }
  const current = Math.round(scrollLeft / clientWidth)
  if (current !== index.value && current >= 0 && current < props.items.length) {
    index.value = current
  }
}

watch(index, (i, previous) => {
  if (!track.value) return
  const current = Math.round(track.value.scrollLeft / track.value.clientWidth)
  if (current !== i) scrollToIndex(i, Math.abs(i - previous) > 1 ? 'instant' : 'smooth')
  nextTick(() => {
    observeActiveSlide()
    measure()
  })
})

onMounted(() => {
  heightObserver = new ResizeObserver(measure)
  // Keep the active slide aligned when the viewport width changes (rotation, resize)
  widthObserver = new ResizeObserver(() => {
    track.value?.scrollTo({ left: index.value * track.value.clientWidth, behavior: 'instant' })
  })
  if (track.value) widthObserver.observe(track.value)
  scrollToIndex(index.value, 'instant')
  observeActiveSlide()
  measure()
})

onBeforeUnmount(() => {
  heightObserver?.disconnect()
  widthObserver?.disconnect()
})
</script>

<template>
  <!-- Height follows the active slide (runtime value → dynamic :style is the documented exception) -->
  <div
    ref="track"
    class="flex snap-x snap-mandatory items-start overflow-x-auto overflow-y-hidden overscroll-x-contain transition-[height] duration-300 [scrollbar-width:none]"
    :style="{ height: height === null ? undefined : `${height}px` }"
    @scroll.passive="onScroll"
  >
    <section
      v-for="(item, i) in items"
      :key="i"
      ref="slides"
      class="w-full shrink-0 snap-center snap-always px-4"
    >
      <!-- Only render neighbours of the active slide -->
      <slot v-if="Math.abs(i - index) <= 1" :item="item" :index="i" />
      <div v-else class="h-96" />
    </section>
  </div>
</template>
