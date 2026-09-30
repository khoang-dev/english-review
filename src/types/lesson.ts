export type CategoryKey =
  'articles' | 'plurals' | 'comparatives' | 'collocations' | 'word-choice' | 'meaning'

export interface Category {
  label: string
  /** Full Tailwind class string for the category pill. */
  pill: string
}

export type IssueType = 'error' | 'warning' | 'tip' | 'correct'

export interface Issue {
  type: IssueType
  /** Omit for purely positive notes. */
  category?: CategoryKey
  /** The phrase in the original sentence this issue is about. */
  phrase?: string
  text: string
}

export interface Sentence {
  label: string
  original: string
  /** Phrases in `original` that were wrong (highlighted red). */
  highlights: string[]
  issues: Issue[]
  corrected: string
  /** Phrases in `corrected` that fixed them (highlighted green). */
  fixes: string[]
  /** A more natural rewrite, also accepted in practice mode. */
  alternative?: string
}

export interface FocusPoint {
  category: CategoryKey
  title: string
  rule: string
  examples: { wrong: string; right: string }[]
}

export interface Lesson {
  id: string
  title: string
  /** Local day 'YYYY-MM-DD' the lesson shows up on in the daily review. */
  date: string
  score: number
  overview: string
  strengths: string[]
  focusPoints: FocusPoint[]
  sentences: Sentence[]
}

export interface Mistake extends Issue {
  category: CategoryKey
  sentence: Sentence
  lesson: Lesson
}
