import { addDays, diffDays } from './date'

/** Completed-part count recorded on one day. */
export interface Snapshot {
  date: string
  completed: number
}

export type PaceStatus = 'done' | 'ahead' | 'on-track' | 'behind'

export interface PaceSummary {
  remaining: number
  /** Days left until the deadline, today included. */
  daysLeft: number
  /** Parts per day needed from today to finish everything by the deadline. */
  requiredPerDay: number
  /** Where the target line says you should be today. */
  targetToday: number
  /** done − targetToday: positive is ahead, negative is behind. */
  gap: number
  status: PaceStatus
  /** Average parts per day over the last 7 logged days, when there are 2+ snapshots. */
  recentPerDay?: number
  /** Finish date at the recent pace (undefined when the pace is 0 or unknown). */
  projectedFinish?: string
  /** The recent pace would finish after the deadline. */
  willMiss: boolean
}

/**
 * Straight target line from the first snapshot to `total` parts on the deadline: the value
 * you should have reached by the end of `date`.
 */
export function targetAt(date: string, start: Snapshot, total: number, deadline: string): number {
  const span = Math.max(1, diffDays(deadline, start.date))
  const progress = Math.min(1, Math.max(0, diffDays(date, start.date) / span))
  return start.completed + (total - start.completed) * progress
}

/** Snapshots sorted by date, with today's entry replaced by the live count. */
export function withToday(snapshots: Snapshot[], today: Snapshot): Snapshot[] {
  return [...snapshots.filter((s) => s.date !== today.date), today].sort((a, b) =>
    a.date.localeCompare(b.date),
  )
}

export function paceSummary(
  series: Snapshot[],
  total: number,
  deadline: string,
  today: string,
): PaceSummary {
  const latest = series.at(-1)
  const done = latest?.completed ?? 0
  const start = series[0] ?? { date: today, completed: done }
  const remaining = Math.max(0, total - done)
  const daysLeft = Math.max(1, diffDays(deadline, today) + 1)
  const targetToday = targetAt(today, start, total, deadline)
  const gap = done - targetToday

  const weekAgo = addDays(today, -7)
  const base = series.find((s) => s.date >= weekAgo && s !== latest)
  const span = base && latest ? diffDays(latest.date, base.date) : 0
  const recentPerDay =
    base && latest && span > 0 ? (latest.completed - base.completed) / span : undefined
  const projectedFinish =
    recentPerDay && recentPerDay > 0
      ? addDays(today, Math.ceil(remaining / recentPerDay))
      : undefined

  const status: PaceStatus =
    remaining === 0 ? 'done' : gap >= 1 ? 'ahead' : gap > -1 ? 'on-track' : 'behind'
  const willMiss =
    remaining > 0 &&
    recentPerDay !== undefined &&
    (projectedFinish === undefined || projectedFinish > deadline)

  return {
    remaining,
    daysLeft,
    requiredPerDay: remaining / daysLeft,
    targetToday,
    gap,
    status,
    recentPerDay,
    projectedFinish,
    willMiss,
  }
}

export interface DailyChange {
  date: string
  /** Completed total at the end of the day (carried forward on days without a snapshot). */
  completed: number
  /** Parts completed that day; undefined on the first logged day. */
  parts?: number
  /** Increase of the completed total versus the previous day, in %; undefined when not computable. */
  percent?: number
}

/** One entry per calendar day from the first snapshot to `today`. */
export function dailyChanges(series: Snapshot[], today: string): DailyChange[] {
  const first = series[0]
  if (!first) return []
  const byDate = new Map(series.map((s) => [s.date, s.completed]))
  const days: DailyChange[] = []
  let previous: number | undefined
  for (let date = first.date; date <= today; date = addDays(date, 1)) {
    const completed = byDate.get(date) ?? previous ?? first.completed
    const parts = previous === undefined ? undefined : completed - previous
    const percent = parts === undefined || !previous ? undefined : (parts / previous) * 100
    days.push({ date, completed, parts, percent })
    previous = completed
  }
  return days
}
