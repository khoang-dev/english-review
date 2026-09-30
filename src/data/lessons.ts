import type { Category, CategoryKey, Lesson, Mistake } from '@/types/lesson'

/**
 * Writing review lessons (shape: `Lesson` in src/types/lesson.ts).
 *
 * To add a new lesson, append an object to `lessons` with the same shape.
 * `date` is the local day ('YYYY-MM-DD') the lesson shows up on in the daily review carousel.
 * - `issues[].type`: 'error' | 'warning' | 'tip' | 'correct'
 * - `issues[].category`: a key of `categories` (omit for purely positive notes)
 * - `highlights`: phrases in `original` that were wrong (highlighted red)
 * - `fixes`: phrases in `corrected` that fixed them (highlighted green)
 */

// Full class strings per category so Tailwind can detect them (see tailwind-styling skill)
export const categories: Record<CategoryKey, Category> = {
  articles: { label: 'Articles (a/an)', pill: 'bg-rose-50 text-rose-700 ring-rose-200' },
  plurals: { label: 'Plural nouns', pill: 'bg-amber-50 text-amber-700 ring-amber-200' },
  comparatives: { label: 'Comparatives', pill: 'bg-lime-50 text-lime-700 ring-lime-200' },
  collocations: { label: 'Collocations', pill: 'bg-sky-50 text-sky-700 ring-sky-200' },
  'word-choice': { label: 'Word choice', pill: 'bg-violet-50 text-violet-700 ring-violet-200' },
  meaning: { label: 'Missing meaning', pill: 'bg-teal-50 text-teal-700 ring-teal-200' },
}

export const lessons: Lesson[] = [
  {
    id: 'health-and-lifestyle',
    title: 'Health & Lifestyle',
    date: '2026-09-30',
    score: 6.5,
    overview:
      'Nhìn chung bạn nắm được ý và cấu trúc, lỗi chủ yếu nằm ở mạo từ (a/an), số nhiều và vài collocation.',
    strengths: [
      'Đủ ý',
      'because + S + V',
      'such as + V-ing',
      'do household chores',
      'too much + uncountable noun',
    ],
    focusPoints: [
      {
        category: 'articles',
        title: 'Mạo từ a/an trước danh từ đếm được số ít',
        rule: 'Danh từ đếm được số ít luôn cần mạo từ (a/an/the) hoặc từ hạn định đứng trước.',
        examples: [
          { wrong: 'face high risk of', right: 'face a high risk of' },
          { wrong: 'lead unhealthy lifestyle', right: 'lead an unhealthy lifestyle' },
        ],
      },
      {
        category: 'plurals',
        title: 'Danh từ đếm được không đứng trơ trọi',
        rule: 'Khi nói chung chung, dùng số nhiều (apps, diseases); khi nói một cái, thêm a/an.',
        examples: [
          { wrong: 'Using food delivery app', right: 'Using food delivery apps' },
          { wrong: 'serious disease', right: 'serious diseases' },
        ],
      },
      {
        category: 'comparatives',
        title: 'So sánh hơn của tính từ ngắn',
        rule: 'Tính từ một âm tiết thêm -er (fast → faster). Chỉ dùng "more" với tính từ dài.',
        examples: [
          { wrong: 'more fast', right: 'faster' },
          { wrong: 'more convenient', right: 'more convenient ✓ (tính từ dài)' },
        ],
      },
      {
        category: 'word-choice',
        title: 'hard-working ≠ work hard',
        rule: '"hard-working" tả người (siêng năng). Muốn nói làm việc vất vả, dùng "work hard" hoặc "a hard day at work".',
        examples: [
          { wrong: 'a hard-working day', right: 'a hard day at work' },
          { wrong: 'a hard-working day', right: 'after working hard all day' },
        ],
      },
    ],
    sentences: [
      {
        label: 'Câu 1',
        original: 'The poor persons often face high risk of serious disease.',
        highlights: ['The poor persons', 'high risk', 'disease'],
        issues: [
          {
            type: 'error',
            category: 'word-choice',
            phrase: 'The poor persons',
            text: '"persons" rất trang trọng, dùng trong văn bản pháp lý. Nên viết "Poor people" hoặc "The poor".',
          },
          {
            type: 'error',
            category: 'articles',
            phrase: 'face high risk',
            text: 'Thiếu mạo từ, phải là "face a high risk of".',
          },
          {
            type: 'warning',
            category: 'plurals',
            phrase: 'disease',
            text: '"Các bệnh" nên dùng số nhiều "diseases".',
          },
        ],
        corrected: 'Poor people often face a high risk of serious diseases.',
        fixes: ['Poor people', 'a high risk', 'diseases'],
        alternative: 'Poor people are often at high risk of developing serious diseases.',
      },
      {
        label: 'Câu 2',
        original: 'Office workers often drink bubble tea and eat too much fast food.',
        highlights: [],
        issues: [
          {
            type: 'correct',
            text: 'Đúng ngữ pháp, dùng "too much fast food" chuẩn.',
          },
          {
            type: 'warning',
            category: 'meaning',
            text: 'Bỏ mất ý "thích" trong đề. "Trà sữa" thường dịch là "milk tea", nhưng "bubble tea" vẫn chấp nhận được.',
          },
        ],
        corrected: 'Office workers often like drinking milk tea and eating too much fast food.',
        fixes: ['like drinking', 'milk tea', 'eating'],
      },
      {
        label: 'Câu 3',
        original:
          "Doing part-time jobs in the evening can cause students stress because they don't have enough time to sleep.",
        highlights: ['cause students stress'],
        issues: [
          {
            type: 'correct',
            text: 'Câu đúng, dùng "because + S + V" đúng yêu cầu.',
          },
          {
            type: 'warning',
            category: 'collocations',
            phrase: 'cause students stress',
            text: 'Không sai, nhưng collocation tự nhiên hơn là "cause stress for students" hoặc "make students stressed".',
          },
        ],
        corrected:
          "Doing part-time jobs in the evening can cause stress for students because they don't have enough time to sleep.",
        fixes: ['cause stress for students'],
      },
      {
        label: 'Câu 4–5',
        original:
          "After a hard-working day, I don't want to cook or do household chores. Using food delivery app is more fast and convenient.",
        highlights: ['a hard-working day', 'food delivery app', 'more fast'],
        issues: [
          {
            type: 'error',
            category: 'word-choice',
            phrase: 'hard-working day',
            text: '"hard-working" dùng để tả người (siêng năng), không dùng cho "ngày". Nên viết "After a hard day at work" hoặc "After working hard all day" (dùng adv "hard").',
          },
          {
            type: 'correct',
            text: '"do household chores" đúng collocation.',
          },
          {
            type: 'error',
            category: 'plurals',
            phrase: 'Using food delivery app',
            text: 'Danh từ đếm được, cần "food delivery apps" hoặc "a food delivery app".',
          },
          {
            type: 'error',
            category: 'comparatives',
            phrase: 'more fast',
            text: '"fast" là tính từ ngắn, so sánh hơn phải là "faster".',
          },
        ],
        corrected:
          "After working hard all day, I don't want to cook or do household chores. Using food delivery apps is faster and more convenient.",
        fixes: ['working hard all day', 'food delivery apps', 'faster'],
      },
      {
        label: 'Câu 6',
        original:
          'Working overtime leads young people to unhealthy lifestyle, such as staying up late or not eating breakfast.',
        highlights: ['leads young people to unhealthy lifestyle'],
        issues: [
          {
            type: 'error',
            category: 'articles',
            phrase: 'leads young people to unhealthy lifestyle',
            text: 'Thiếu mạo từ "an", và cấu trúc "lead sb to + N" không tự nhiên ở đây.',
          },
          {
            type: 'tip',
            category: 'collocations',
            text: 'Theo Ozdic, động từ đi với "lifestyle" là lead / live / adopt (tránh dùng "have").',
          },
          {
            type: 'correct',
            text: '"such as + V-ing" dùng đúng.',
          },
        ],
        corrected:
          'Working overtime causes young people to lead an unhealthy lifestyle, such as staying up late or skipping breakfast.',
        fixes: ['causes young people to lead an unhealthy lifestyle', 'skipping'],
      },
    ],
  },
]

/** Lessons for one 'YYYY-MM-DD' day. */
export function getLessonsByDate(date: string): Lesson[] {
  return lessons.filter((lesson) => lesson.date === date)
}

/** Mistakes (non-correct issues with a category) in a lesson. */
export function lessonMistakes(lesson: Lesson): Mistake[] {
  return lesson.sentences.flatMap((sentence) =>
    sentence.issues.flatMap((issue) =>
      issue.category && issue.type !== 'correct'
        ? [{ ...issue, category: issue.category, sentence, lesson }]
        : [],
    ),
  )
}
