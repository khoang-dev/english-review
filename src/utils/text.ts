export interface Segment {
  text: string
  mark: boolean
}

/** Split `text` into plain and marked segments (first match of each phrase, no overlaps). */
export function splitPhrases(text: string, phrases: string[]): Segment[] {
  const ranges = phrases
    .map((phrase) => ({ start: phrase ? text.indexOf(phrase) : -1, length: phrase.length }))
    .filter((r) => r.start !== -1)
    .sort((a, b) => a.start - b.start)

  const result: Segment[] = []
  let cursor = 0
  for (const { start, length } of ranges) {
    if (start < cursor) continue
    if (start > cursor) result.push({ text: text.slice(cursor, start), mark: false })
    result.push({ text: text.slice(start, start + length), mark: true })
    cursor = start + length
  }
  if (cursor < text.length) result.push({ text: text.slice(cursor), mark: false })
  return result
}

/** Lower-case, unify apostrophes, drop punctuation and extra spaces — for comparing answers. */
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/[^a-z0-9' ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length
}

/** Fisher–Yates shuffle into a new array. */
export function shuffle<T>(items: readonly T[]): T[] {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j]!, result[i]!]
  }
  return result
}
