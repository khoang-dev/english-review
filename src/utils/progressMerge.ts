import type { ItemStat, ProgressState } from '@/types/progress'

/** `a` is the newer copy of the same item: latest change wins, then latest day, then most attempts. */
function isNewer(a: ItemStat, b: ItemStat): boolean {
  const changedA = a.updatedAt ?? 0
  const changedB = b.updatedAt ?? 0
  if (changedA !== changedB) return changedA > changedB
  if (a.last !== b.last) return a.last > b.last
  return a.right + a.wrong > b.right + b.wrong
}

/** Combine the progress of two devices: newer copy of each item, every practised day. */
export function mergeProgress(a: ProgressState, b: ProgressState): ProgressState {
  const items: Record<string, ItemStat> = { ...a.items }
  for (const [id, theirs] of Object.entries(b.items)) {
    const ours = items[id]
    if (!ours || isNewer(theirs, ours)) items[id] = theirs
  }
  const practiceDays = [...new Set([...a.practiceDays, ...b.practiceDays])].sort()
  return { items, practiceDays }
}

/** Same content, ignoring key order. */
export function sameProgress(a: ProgressState, b: ProgressState): boolean {
  const canonical = (state: ProgressState) =>
    JSON.stringify([
      Object.keys(state.items)
        .sort()
        .map((id) => {
          const s = state.items[id]!
          return [id, s.right, s.wrong, s.last, s.known, s.updatedAt ?? 0]
        }),
      [...state.practiceDays].sort(),
    ])
  return canonical(a) === canonical(b)
}
