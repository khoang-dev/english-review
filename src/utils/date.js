// Dates are handled as local-time 'YYYY-MM-DD' keys (never toISOString, which is UTC)

export function toKey(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function fromKey(key) {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function addDays(date, amount) {
  const result = new Date(date)
  result.setDate(result.getDate() + amount)
  return result
}

export function todayKey() {
  return toKey(new Date())
}

/** Whole days between two keys (a - b). */
export function diffDays(a, b) {
  return Math.round((fromKey(a) - fromKey(b)) / 86_400_000)
}

/** 'Today', 'Yesterday', or the weekday name. */
export function relativeDayLabel(key, today = todayKey()) {
  const diff = diffDays(today, key)
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Yesterday'
  return fromKey(key).toLocaleDateString('en-GB', { weekday: 'long' })
}

export function formatLongDate(key) {
  return fromKey(key).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function formatShortDate(key) {
  return fromKey(key).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

export function weekdayShort(key) {
  return fromKey(key).toLocaleDateString('en-GB', { weekday: 'short' })
}

export function monthYear(key) {
  return fromKey(key).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
}
