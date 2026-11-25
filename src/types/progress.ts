/** Practice result for one exercise, keyed by its stable id (src/data/exercises.ts). */
export interface ItemStat {
  right: number
  wrong: number
  /** Day key of the last attempt. */
  last: string
  /** The last attempt was right (or the item was marked as known). */
  known: boolean
  /** Time of the last change (ms since epoch), used to pick the newer copy when syncing. */
  updatedAt?: number
}

export interface ProgressState {
  items: Record<string, ItemStat>
  /** Day keys on which something was practised. */
  practiceDays: string[]
}
