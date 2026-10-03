import dayjs from 'dayjs'

// Dates are handled as local-time 'YYYY-MM-DD' keys; dayjs parses and formats them in local time
export const KEY_FORMAT = 'YYYY-MM-DD'

export function todayKey(): string {
  return dayjs().format(KEY_FORMAT)
}

/** The key `amount` days after `key` (negative for before). */
export function addDays(key: string, amount: number): string {
  return dayjs(key).add(amount, 'day').format(KEY_FORMAT)
}

/** Whole days between two keys (a - b). */
export function diffDays(a: string, b: string): number {
  return dayjs(a).diff(dayjs(b), 'day')
}

/** Day of the month, 1–31. */
export function dayOfMonth(key: string): number {
  return dayjs(key).date()
}

/** Monday-first weekday index, 0 (Mon) – 6 (Sun). */
export function weekdayIndex(key: string): number {
  return (dayjs(key).day() + 6) % 7
}

/** 'Today', 'Yesterday', or the weekday name. */
export function relativeDayLabel(key: string, today: string = todayKey()): string {
  const diff = diffDays(today, key)
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Yesterday'
  return dayjs(key).format('dddd')
}

/** e.g. '3 October 2026'. */
export function formatLongDate(key: string): string {
  return dayjs(key).format('D MMMM YYYY')
}

/** e.g. '3 Oct'. */
export function formatShortDate(key: string): string {
  return dayjs(key).format('D MMM')
}

/** e.g. 'Sat'. */
export function weekdayShort(key: string): string {
  return dayjs(key).format('ddd')
}

/** e.g. 'October 2026'. */
export function monthYear(key: string): string {
  return dayjs(key).format('MMMM YYYY')
}
