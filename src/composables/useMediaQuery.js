import { onBeforeUnmount, ref } from 'vue'

/** Reactive `matchMedia`, e.g. useMediaQuery('(min-width: 768px)') — matches Tailwind's `md`. */
export function useMediaQuery(query) {
  const media = window.matchMedia(query)
  const matches = ref(media.matches)
  const update = (event) => (matches.value = event.matches)

  media.addEventListener('change', update)
  onBeforeUnmount(() => media.removeEventListener('change', update))

  return matches
}
