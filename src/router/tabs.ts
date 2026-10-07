import { computed } from 'vue'
import { useRoute } from 'vue-router'
import type { RouteLocationRaw } from 'vue-router'

/**
 * Pages are tabs of the single `/` route, picked by the `?tab=` query (`/?tab=review`), so every
 * URL is the root path and works on any static host. The plan (`home`) is the default tab.
 */
export const TABS = ['home', 'review', 'mistakes', 'youpass'] as const

export type Tab = (typeof TABS)[number]

export function isTab(value: unknown): value is Tab {
  return TABS.includes(value as Tab)
}

/** Location of a tab, with extra query values (`tabRoute('review', { date })`). */
export function tabRoute(tab: Tab, query: Record<string, string> = {}): RouteLocationRaw {
  return { name: 'app', query: tab === 'home' ? query : { tab, ...query } }
}

/** Daily review on `date` ('YYYY-MM-DD'); today when omitted. */
export function reviewRoute(date?: string): RouteLocationRaw {
  return tabRoute('review', date ? { date } : {})
}

/** The current `?tab=` value: a known tab, `home` when missing, or `null` for an unknown one or path. */
export function useTab() {
  const route = useRoute()
  return computed<Tab | null>(() => {
    if (route.name !== 'app') return null
    const tab = route.query.tab
    if (tab === undefined || tab === '') return 'home'
    return isTab(tab) ? tab : null
  })
}
