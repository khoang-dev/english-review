// Dates are handled as local-time 'YYYY-MM-DD' keys (never toISOString, which is UTC)

export function toKey(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function fromKey(key: string): Date {
  const [y = 1970, m = 1, d = 1] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function addDays(date: Date, amount: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + amount)
  return result
}

export function todayKey(): string {
  return toKey(new Date())
}

/** Whole days between two keys (a - b). */
export function diffDays(a: string, b: string): number {
  return Math.round((fromKey(a).getTime() - fromKey(b).getTime()) / 86_400_000)
}

/** 'Today', 'Yesterday', or the weekday name. */
export function relativeDayLabel(key: string, today: string = todayKey()): string {
  const diff = diffDays(today, key)
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Yesterday'
  return fromKey(key).toLocaleDateString('en-GB', { weekday: 'long' })
}

export function formatLongDate(key: string): string {
  return fromKey(key).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function formatShortDate(key: string): string {
  return fromKey(key).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

export function weekdayShort(key: string): string {
  return fromKey(key).toLocaleDateString('en-GB', { weekday: 'short' })
}

export function monthYear(key: string): string {
  return fromKey(key).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
}
