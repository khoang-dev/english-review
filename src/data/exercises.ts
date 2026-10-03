import type { CategoryKey, Lesson, Sentence } from '@/types/lesson'
import type {
  BlankExercise,
  BlankPart,
  ExerciseSet,
  Flashcard,
  QuizQuestion,
  RewriteExercise,
} from '@/types/exercise'
import { splitPhrases, wordCount } from '@/utils/text'

/**
 * Practice exercises for a lesson: the hand-written `lesson.exercises` plus ones generated from
 * the lesson's rules and corrected sentences, so every new lesson gets practice for free.
 */

// Longer fixes make poor blanks (too much to guess) — they stay in the rewrite exercise
const MAX_BLANK_WORDS = 4

/** Main category of a sentence: its first real mistake. */
function sentenceCategory(sentence: Sentence): CategoryKey | undefined {
  return sentence.issues.find((i) => i.category && i.type !== 'correct')?.category
}

/** `'face [a] high risk of [diseases|illnesses]'` → text and blank parts. */
export function parseBlanks(text: string): BlankPart[] {
  const parts: BlankPart[] = []
  const pattern = /\[([^\]]+)\]/g
  let cursor = 0
  for (const match of text.matchAll(pattern)) {
    if (match.index > cursor) parts.push({ text: text.slice(cursor, match.index) })
    parts.push({ answers: match[1]!.split('|').map((answer) => answer.trim()) })
    cursor = match.index + match[0].length
  }
  if (cursor < text.length) parts.push({ text: text.slice(cursor) })
  return parts
}

function buildFlashcards(lesson: Lesson): Flashcard[] {
  const fromRules = lesson.focusPoints.flatMap((point) =>
    point.examples
      // Skip "this one is already right" examples — nothing to flip
      .filter((example) => !example.right.startsWith(example.wrong))
      .map((example): Flashcard => ({
        id: `${lesson.id}:card:${example.wrong}→${example.right}`,
        kind: 'flashcard',
        lessonId: lesson.id,
        category: point.category,
        front: example.wrong,
        back: example.right,
        note: point.title,
      })),
  )
  const authored = (lesson.exercises?.flashcards ?? []).map((card): Flashcard => ({
    id: `${lesson.id}:card:${card.front}`,
    kind: 'flashcard',
    lessonId: lesson.id,
    ...card,
  }))
  return [...fromRules, ...authored]
}

/**
 * "Which sentence is correct?" from sentences whose `highlights` and `fixes` line up one-to-one:
 * the distractors put one (then two…) of the original mistakes back into the corrected sentence.
 */
function autoQuestion(lesson: Lesson, sentence: Sentence): QuizQuestion | null {
  const { corrected, highlights, fixes } = sentence
  if (highlights.length < 2 || highlights.length !== fixes.length) return null
  if (!fixes.every((fix) => corrected.includes(fix))) return null

  // Every non-empty subset of the mistakes, fewest mistakes first
  const subsets: number[][] = []
  for (let mask = 1; mask < 1 << fixes.length; mask++) {
    subsets.push(fixes.map((_, i) => i).filter((i) => mask & (1 << i)))
  }
  subsets.sort((a, b) => a.length - b.length)

  const distractors = new Set<string>()
  for (const subset of subsets) {
    let text = corrected
    for (const i of subset) text = text.replace(fixes[i]!, highlights[i]!)
    if (text !== corrected) distractors.add(text)
    if (distractors.size === 3) break
  }
  if (distractors.size < 3) return null

  return {
    id: `${lesson.id}:quiz:${sentence.label}`,
    kind: 'quiz',
    lessonId: lesson.id,
    category: sentenceCategory(sentence),
    prompt: 'Which sentence is correct?',
    options: [corrected, ...distractors],
    answer: 0,
    issues: sentence.issues,
  }
}

function buildQuiz(lesson: Lesson): QuizQuestion[] {
  const authored = (lesson.exercises?.quiz ?? []).map((question): QuizQuestion => ({
    id: `${lesson.id}:quiz:${question.prompt}`,
    kind: 'quiz',
    lessonId: lesson.id,
    ...question,
    options: [...question.options],
  }))
  const generated = lesson.sentences.flatMap((sentence) => autoQuestion(lesson, sentence) ?? [])
  return [...authored, ...generated]
}

function buildBlanks(lesson: Lesson): BlankExercise[] {
  const generated = lesson.sentences.flatMap((sentence): BlankExercise[] => {
    const fixes = sentence.fixes.filter((fix) => wordCount(fix) <= MAX_BLANK_WORDS)
    if (!fixes.length) return []
    const parts = splitPhrases(sentence.corrected, fixes).map((segment): BlankPart =>
      segment.mark ? { answers: [segment.text] } : { text: segment.text },
    )
    return [
      {
        id: `${lesson.id}:blank:${sentence.label}`,
        kind: 'blank',
        lessonId: lesson.id,
        category: sentenceCategory(sentence),
        parts,
        hint: sentence.original,
        hintLabel: 'Your original sentence',
      },
    ]
  })
  const authored = (lesson.exercises?.blanks ?? []).map((blank): BlankExercise => ({
    id: `${lesson.id}:blank:${blank.text}`,
    kind: 'blank',
    lessonId: lesson.id,
    category: blank.category,
    parts: parseBlanks(blank.text),
    hint: blank.hint,
    hintLabel: 'Meaning',
  }))
  return [...generated, ...authored]
}

function buildRewrite(lesson: Lesson): RewriteExercise[] {
  return lesson.sentences.map((sentence) => ({
    id: `${lesson.id}:rewrite:${sentence.label}`,
    kind: 'rewrite',
    lessonId: lesson.id,
    category: sentenceCategory(sentence),
    sentence,
  }))
}

export function getExercises(lesson: Lesson): ExerciseSet {
  return {
    flashcards: buildFlashcards(lesson),
    quiz: buildQuiz(lesson),
    blanks: buildBlanks(lesson),
    rewrite: buildRewrite(lesson),
  }
}

/** All exercises of several lessons in one set. */
export function mergeExercises(sets: ExerciseSet[]): ExerciseSet {
  return {
    flashcards: sets.flatMap((set) => set.flashcards),
    quiz: sets.flatMap((set) => set.quiz),
    blanks: sets.flatMap((set) => set.blanks),
    rewrite: sets.flatMap((set) => set.rewrite),
  }
}

/** Keep only exercises matching `keep`. */
export function filterExercises(
  set: ExerciseSet,
  keep: (exercise: { id: string; category?: CategoryKey }) => boolean,
): ExerciseSet {
  return {
    flashcards: set.flashcards.filter(keep),
    quiz: set.quiz.filter(keep),
    blanks: set.blanks.filter(keep),
    rewrite: set.rewrite.filter(keep),
  }
}

export function exerciseCount(set: ExerciseSet): number {
  return set.flashcards.length + set.quiz.length + set.blanks.length + set.rewrite.length
}
