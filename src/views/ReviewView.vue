<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { lessons, getLessonsByDate } from '@/data/lessons'
import { addDays, diffDays, formatShortDate, fromKey, toKey, todayKey } from '@/utils/date'
import { useMediaQuery } from '@/composables/useMediaQuery'
import DateStrip from '@/components/DateStrip.vue'
import DayCarousel from '@/components/DayCarousel.vue'
import DayEmpty from '@/components/DayEmpty.vue'
import LessonReview from '@/components/LessonReview.vue'
import PracticeMode from '@/components/PracticeMode.vue'

const MIN_DAYS = 14

const route = useRoute()
const router = useRouter()
const isDesktop = useMediaQuery('(min-width: 768px)')

const today = todayKey()
const reviewDays = new Set(lessons.map((lesson) => lesson.date))

// Every day from the newest (today, or a later lesson) back to the oldest lesson — newest first
const days = computed(() => {
  const dates = [...reviewDays, today].sort()
  const newest = dates[dates.length - 1]
  const count = Math.max(MIN_DAYS, diffDays(newest, dates[0]) + 1)
  return Array.from({ length: count }, (_, i) => toKey(addDays(fromKey(newest), -i)))
})

const activeDay = computed({
  get: () => (days.value.includes(route.params.date) ? route.params.date : today),
  set: (day) => {
    router.replace({ name: 'review', params: day === today ? {} : { date: day } })
  },
})

const activeIndex = computed({
  get: () => days.value.indexOf(activeDay.value),
  set: (i) => (activeDay.value = days.value[i]),
})

/** Closest day with a review to `day` (searching older days first). */
function nearestReview(day) {
  const i = days.value.indexOf(day)
  const older = days.value.slice(i + 1).find((d) => reviewDays.has(d))
  return (
    older ??
    days.value
      .slice(0, i)
      .reverse()
      .find((d) => reviewDays.has(d)) ??
    null
  )
}

// Bring the top of the new day into view when switching from far down the page
const stickyBar = ref()
const carouselTop = ref()
function scrollToDayTop() {
  const top = carouselTop.value.getBoundingClientRect().top
  const offset = 56 + stickyBar.value.offsetHeight + 8
  if (top < offset) window.scrollTo({ top: window.scrollY + top - offset, behavior: 'smooth' })
}

function changeDay(day) {
  activeDay.value = day
  scrollToDayTop()
}

function onKeydown(event) {
  if (practiceLesson.value || event.target.closest('input, textarea, [contenteditable]')) return
  if (event.key === 'ArrowLeft' && activeIndex.value > 0) activeIndex.value--
  if (event.key === 'ArrowRight' && activeIndex.value < days.value.length - 1) activeIndex.value++
}
onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))

const practiceLesson = ref(null)
</script>

<template>
  <div class="flex flex-col gap-4">
    <div
      ref="stickyBar"
      class="sticky top-14 z-20 -mt-4 border-b border-slate-200/70 bg-slate-50/90 pt-3 pb-2 backdrop-blur-md md:-mt-6 md:pt-4"
    >
      <DateStrip
        :model-value="activeDay"
        :days="days"
        :review-days="reviewDays"
        @update:model-value="changeDay"
      />
    </div>

    <div ref="carouselTop">
      <DayCarousel v-model="activeIndex" :items="days">
        <template #default="{ item: day }">
          <div class="flex flex-col gap-10 pb-2">
            <LessonReview
              v-for="lesson in getLessonsByDate(day)"
              :key="lesson.id"
              :lesson="lesson"
              @practice="practiceLesson = lesson"
            />
            <DayEmpty
              v-if="!reviewDays.has(day)"
              :day="day"
              :nearest="nearestReview(day)"
              @go="changeDay"
            />
          </div>
        </template>
      </DayCarousel>
    </div>

    <p class="px-4 text-center text-xs text-slate-400">
      <span class="md:hidden">Swipe left for older days</span>
      <span class="hidden md:inline">Use ← → keys or swipe to move between days</span>
    </p>

    <a-drawer
      :open="!!practiceLesson"
      :placement="isDesktop ? 'right' : 'bottom'"
      :width="480"
      height="92%"
      :title="practiceLesson && `Practice · ${formatShortDate(practiceLesson.date)}`"
      destroy-on-close
      @close="practiceLesson = null"
    >
      <PracticeMode v-if="practiceLesson" :lesson="practiceLesson" />
    </a-drawer>
  </div>
</template>
