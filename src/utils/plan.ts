import { addDays, diffDays, fromKey, toKey, todayKey } from './date'

/**
 * The 30-day review plan: day 1 is the first lesson's day. After 30 days a new round starts,
 * so the plan always shows the 30-day round that contains today.
 */
export const PLAN_LENGTH = 30

export interface PlanRound {
  /** 1-based round number. */
  round: number
  /** The round's 30 day keys, day 1 first. */
  days: string[]
  /** Today's 1-based day in the round. */
  todayNumber: number
}

export function planRound(firstDay: string, today: string = todayKey()): PlanRound {
  const elapsed = Math.max(0, diffDays(today, firstDay))
  const roundIndex = Math.floor(elapsed / PLAN_LENGTH)
  const start = addDays(fromKey(firstDay), roundIndex * PLAN_LENGTH)
  return {
    round: roundIndex + 1,
    days: Array.from({ length: PLAN_LENGTH }, (_, i) => toKey(addDays(start, i))),
    todayNumber: (elapsed % PLAN_LENGTH) + 1,
  }
}

/** 1-based day of `day` within its 30-day round. */
export function planDayNumber(firstDay: string, day: string): number {
  return (Math.max(0, diffDays(day, firstDay)) % PLAN_LENGTH) + 1
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
