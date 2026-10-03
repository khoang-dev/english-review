import { addDays, diffDays, fromKey, monthYear, toKey, todayKey } from './date'

/** The review plan covers every day of October, November and December 2026. */
export const PLAN_START = '2026-10-01'
export const PLAN_END = '2026-12-31'
export const PLAN_LENGTH = diffDays(PLAN_END, PLAN_START) + 1

/** Every day key of the plan, first day first. */
export const PLAN_DAYS: string[] = Array.from({ length: PLAN_LENGTH }, (_, i) =>
  toKey(addDays(fromKey(PLAN_START), i)),
)

export interface PlanMonth {
  /** e.g. 'October 2026'. */
  label: string
  /** Day keys of the month, in order. */
  days: string[]
}

/** The plan's days grouped by calendar month. */
export const PLAN_MONTHS: PlanMonth[] = PLAN_DAYS.reduce<PlanMonth[]>((months, day) => {
  const label = monthYear(day)
  const current = months.at(-1)
  if (current?.label === label) current.days.push(day)
  else months.push({ label, days: [day] })
  return months
}, [])

/** 1-based day of `day` within the plan, or undefined when it falls outside it. */
export function planDayNumber(day: string): number | undefined {
  const number = diffDays(day, PLAN_START) + 1
  return number >= 1 && number <= PLAN_LENGTH ? number : undefined
}

/** Days of the plan elapsed so far, today included (0 before it starts). */
export function planDaysElapsed(today: string = todayKey()): number {
  return Math.min(PLAN_LENGTH, Math.max(0, diffDays(today, PLAN_START) + 1))
}

/** Consecutive active days ending today (or yesterday, if today isn't done yet). */
export function streak(active: Set<string>, today: string = todayKey()): number {
  let day = fromKey(today)
  if (!active.has(today)) day = addDays(day, -1)
  let count = 0
  while (active.has(toKey(day))) {
    count++
    day = addDays(day, -1)
  }
  return count
}
