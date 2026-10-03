import type { CategoryKey, Issue, Sentence } from './lesson'

/* ---- Authoring shapes (optional `exercises` on a lesson in src/data/lessons.ts) ---- */

export interface FlashcardInput {
  /** Shown first, e.g. a wrong phrase or a question. */
  front: string
  /** Revealed when the card is flipped. */
  back: string
  /** Extra explanation under the answer. */
  note?: string
  category?: CategoryKey
}

export interface QuizInput {
  prompt: string
  /** Exactly four options. */
  options: [string, string, string, string]
  /** Index (0–3) of the correct option in `options` (shown shuffled). */
  answer: 0 | 1 | 2 | 3
  explanation?: string
  category?: CategoryKey
}

export interface BlankInput {
  /**
   * Sentence with each blank in square brackets; separate accepted answers with "|":
   * `'Poor people often face [a] high risk of serious [diseases].'`
   */
  text: string
  /** Shown above the sentence, e.g. the original wrong sentence or a Vietnamese prompt. */
  hint?: string
  category?: CategoryKey
}

export interface LessonExercises {
  flashcards?: FlashcardInput[]
  quiz?: QuizInput[]
  blanks?: BlankInput[]
}

/* ---- Ready-to-practise shapes (built by src/data/exercises.ts) ---- */

export type ExerciseKind = 'flashcard' | 'quiz' | 'blank' | 'rewrite'

interface ExerciseBase {
  /** Stable id used to store practice progress. */
  id: string
  kind: ExerciseKind
  lessonId: string
  category?: CategoryKey
}

export interface Flashcard extends ExerciseBase {
  kind: 'flashcard'
  front: string
  back: string
  note?: string
}

export interface QuizQuestion extends ExerciseBase {
  kind: 'quiz'
  prompt: string
  options: string[]
  answer: number
  explanation?: string
  /** Notes to show after answering (auto-generated questions reuse the sentence issues). */
  issues?: Issue[]
}

export type BlankPart = { text: string } | { answers: string[] }

export interface BlankExercise extends ExerciseBase {
  kind: 'blank'
  parts: BlankPart[]
  hint?: string
  /** What the hint is, e.g. 'Your original sentence' or 'Meaning'. */
  hintLabel?: string
}

export interface RewriteExercise extends ExerciseBase {
  kind: 'rewrite'
  sentence: Sentence
}

export type Exercise = Flashcard | QuizQuestion | BlankExercise | RewriteExercise

export interface ExerciseSet {
  flashcards: Flashcard[]
  quiz: QuizQuestion[]
  blanks: BlankExercise[]
  rewrite: RewriteExercise[]
}

export type PracticeTab = keyof ExerciseSet
