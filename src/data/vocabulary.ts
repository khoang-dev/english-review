import type { VocabDay } from '@/types/vocabulary'
import type { BlankExercise, ExerciseSet, Flashcard, QuizQuestion } from '@/types/exercise'
import { parseBlanks } from '@/data/exercises'
import { shuffle } from '@/utils/text'

/**
 * Vocabulary per day (shape: `VocabDay` in src/types/vocabulary.ts). Add an object with the
 * `date` the words belong to and they appear on that day in the daily review.
 * - `focus`: the part of the word to call out (stress, prefix, suffix), e.g. 'UN' in 'unauthorised'
 * - `family`: forms leading to the word, e.g. little (adj) → less (adj) → lessen (v)
 * - `blanks`: gap-filling sentences, answers in square brackets
 */
export const vocabulary: VocabDay[] = [
  {
    date: '2026-10-07',
    title: 'School attendance',
    words: [
      {
        word: 'attendance',
        pos: 'n',
        meaning: 'sự tham gia / tham dự',
        family: [{ word: 'attend', pos: 'v', meaning: 'tham gia / tham dự' }],
      },
      {
        word: 'essential',
        focus: 'ial',
        ipa: 'ɪˈsenʃl',
        pos: 'adj',
        meaning: 'chính yếu / thiết yếu',
      },
      {
        word: 'register sb',
        ipa: 'ˈredʒɪstər',
        pos: 'v',
        meaning: 'đăng kí / ghi danh cho ai đó',
        note: 'Trong câu là passive voice (be registered).',
      },
      {
        word: 'on time',
        pos: 'idiom',
        meaning: 'đúng giờ',
        example: 'The train arrived right on time.',
      },
      {
        word: 'lessen',
        focus: 'en',
        ipa: 'ˈlesn',
        pos: 'v',
        meaning: 'làm cho ít đi / làm giảm đi',
        family: [
          { word: 'little', pos: 'adj', meaning: 'ít' },
          { word: 'less', pos: 'adj', meaning: 'ít hơn (so sánh hơn của little)' },
        ],
      },
      {
        word: 'unauthorised',
        focus: 'un',
        pos: 'adj',
        meaning: 'chưa được xác nhận',
        family: [
          { word: 'authorise sth', pos: 'v', meaning: 'xác nhận / phê duyệt' },
          { word: 'authorised', pos: 'adj', meaning: 'được xác nhận' },
        ],
        note: 'Unauthorised absence: đi học mà nghỉ không phép.',
      },
      {
        word: 'session',
        focus: 'ion',
        ipa: 'ˈseʃn',
        pos: 'n',
        meaning: 'một buổi / một phiên',
        example: 'The club held football coaching sessions for children in the area.',
      },
      {
        word: 'vital',
        ipa: 'ˈvaɪtl',
        pos: 'adj',
        meaning: 'cực kì quan trọng',
        example: 'the vitamins that are vital for health',
      },
      {
        word: 'unsatisfactory',
        focus: 'un',
        ipa: 'ˌʌnˌsætɪsˈfæktəri',
        pos: 'adj',
        meaning: 'chưa hài lòng',
        family: [
          { word: 'satisfy', pos: 'v', meaning: 'làm hài lòng / thoả mãn' },
          { word: 'satisfactory', pos: 'adj', meaning: 'hài lòng / thoả mãn' },
        ],
      },
      {
        word: 'religious',
        focus: 'ious',
        ipa: 'rɪˈlɪdʒəs',
        pos: 'adj',
        meaning: 'thuộc về tôn giáo',
        family: [{ word: 'religion', pos: 'n', meaning: 'tôn giáo' }],
      },
      {
        word: 'punctually',
        focus: 'ly',
        ipa: 'ˈpʌŋktʃuəli',
        pos: 'adv',
        meaning: 'một cách đúng giờ',
        family: [{ word: 'punctual', pos: 'adj', meaning: 'đúng giờ' }],
        example: 'Pupils are expected to arrive punctually every morning.',
      },
      {
        word: 'timekeeping',
        ipa: 'ˈtaɪmkiːpɪŋ',
        pos: 'n',
        meaning: 'việc giữ giờ giấc / sự đúng giờ',
        example: 'Good timekeeping is part of good attendance.',
      },
      {
        word: 'disruption',
        focus: 'ion',
        ipa: 'dɪsˈrʌpʃn',
        pos: 'n',
        meaning: 'sự gián đoạn / sự xáo trộn',
        family: [{ word: 'disrupt sth', pos: 'v', meaning: 'làm gián đoạn / làm xáo trộn' }],
        example: 'Arriving late causes disruption to the lesson.',
      },
      {
        word: 'truancy',
        focus: 'cy',
        ipa: 'ˈtruːənsi',
        pos: 'n',
        meaning: 'sự trốn học',
        family: [{ word: 'truant', pos: 'n', meaning: 'học sinh trốn học' }],
        note: 'Play truant: trốn học.',
      },
      {
        word: 'unavoidable',
        focus: 'un',
        ipa: 'ˌʌnəˈvɔɪdəbl',
        pos: 'adj',
        meaning: 'không thể tránh được',
        family: [
          { word: 'avoid sth', pos: 'v', meaning: 'tránh' },
          { word: 'avoidable', pos: 'adj', meaning: 'có thể tránh được' },
        ],
      },
      {
        word: 'bereavement',
        focus: 'ment',
        ipa: 'bɪˈriːvmənt',
        pos: 'n',
        meaning: 'sự mất người thân (có tang)',
        family: [{ word: 'bereaved', pos: 'adj', meaning: 'có người thân vừa qua đời' }],
      },
      {
        word: 'observance',
        focus: 'ance',
        ipa: 'əbˈzɜːvəns',
        pos: 'n',
        meaning: 'sự tuân thủ (luật lệ); việc cử hành (lễ tôn giáo)',
        family: [{ word: 'observe sth', pos: 'v', meaning: 'tuân thủ / cử hành' }],
        note: 'Religious observance: ngày lễ tôn giáo (nghỉ học vì lý do này được cho phép).',
      },
      {
        word: 'horoscope',
        ipa: 'ˈhɒrəskəʊp',
        pos: 'n',
        meaning: 'tử vi / lá số tử vi (dự đoán theo cung hoàng đạo)',
        example: 'She reads her horoscope in the newspaper every morning.',
        note: 'Liên quan: astrology (n): chiêm tinh học; star sign (n): cung hoàng đạo.',
      },
      {
        word: 'optimistic',
        focus: 'ic',
        ipa: 'ˌɒptɪˈmɪstɪk',
        pos: 'adj',
        meaning: 'lạc quan',
        family: [{ word: 'optimism', pos: 'n', meaning: 'sự lạc quan' }],
        example: 'She is optimistic about passing the exam.',
        note: 'Be optimistic about sth. Trái nghĩa: pessimistic (bi quan).',
      },
    ],
  },
  {
    date: '2026-10-21',
    title: 'Reading – Vocab revision 2 (ROOT Week 4)',
    words: [
      {
        word: 'ensure sth',
        focus: 'en',
        ipa: 'ɪnˈʃʊə(r)',
        pos: 'v',
        meaning: 'đảm bảo',
        family: [{ word: 'sure', pos: 'adj', meaning: 'chắc chắn' }],
        example: "To ensure his dog's safety, Tam built a strong fence around the yard.",
        note: 'Ensure (that) + mệnh đề: She ensured she had her IELTS certificate and passport.',
      },
      {
        word: 'certificate',
        focus: 'tif',
        ipa: 'səˈtɪfɪkət',
        pos: 'n',
        meaning: 'chứng chỉ / giấy chứng nhận',
        family: [{ word: 'certify sth', pos: 'v', meaning: 'chứng nhận' }],
        example: 'She received a certificate for completing the first training course last week.',
        note: 'Đuôi -ate trong danh từ đọc /ət/, không phải /eɪt/.',
      },
      {
        word: 'passport',
        ipa: 'ˈpɑːspɔːt',
        pos: 'n',
        meaning: 'hộ chiếu',
        example: 'You should not forget to bring your passport when you travel internationally.',
        note: 'To travel abroad, you must ensure your passport and visa are up-to-date.',
      },
      {
        word: 'value sth',
        ipa: 'ˈvæljuː',
        pos: 'v',
        meaning: 'coi trọng / trân trọng',
        family: [
          { word: 'value', pos: 'n', meaning: 'giá trị' },
          { word: 'valuable', pos: 'adj', meaning: 'quý giá' },
        ],
        example: 'We value honesty and trust in our family above all other qualities.',
        note: 'She valued this opportunity and couldn’t wait to experience a new country.',
      },
      {
        word: 'encounter sb/sth',
        focus: 'coun',
        ipa: 'ɪnˈkaʊntə(r)',
        pos: 'v',
        meaning: 'chạm trán / gặp phải (khó khăn, vấn đề)',
        example: 'At the airport, she encountered a problem: her suitcase was overweight.',
        note: 'Encounter a problem / difficulties / bad weather.',
      },
      {
        word: 'curious',
        focus: 'ious',
        ipa: 'ˈkjʊəriəs',
        pos: 'adj',
        meaning: 'tò mò / hiếu kì',
        family: [{ word: 'curiosity', pos: 'n', meaning: 'sự tò mò' }],
        example: 'Children are naturally curious and love to explore the world around them.',
        note: 'Be curious about sth: She was curious about what was in her suitcase.',
      },
      {
        word: 'cope with sth',
        ipa: 'kəʊp',
        pos: 'v',
        meaning: 'đương đầu / đối phó với',
        example:
          'He learned to cope with stress by practicing meditation and deep breathing exercises.',
        note: 'When Ngoc feels stressed, she finds it hard to cope with the pressure.',
      },
      {
        word: 'depend on sb/sth',
        focus: 'pend',
        ipa: 'dɪˈpend',
        pos: 'v',
        meaning: 'dựa vào / phụ thuộc vào',
        family: [
          { word: 'dependent', pos: 'adj', meaning: 'phụ thuộc' },
          { word: 'independent', pos: 'adj', meaning: 'độc lập' },
        ],
        example: 'You can depend on a good friend to help you in difficult times.',
        note: 'Luôn đi với "on": Nhi must depend on luck for this!',
      },
      {
        word: 'fence',
        ipa: 'fens',
        pos: 'n',
        meaning: 'hàng rào',
        example: "To ensure his dog's safety, Tam built a strong fence around the yard.",
      },
      {
        word: 'breathing exercises',
        ipa: 'ˈbriːðɪŋ ˈeksəsaɪzɪz',
        pos: 'n',
        meaning: 'bài tập hít thở',
        family: [
          { word: 'breath', pos: 'n', meaning: 'hơi thở (/breθ/)' },
          { word: 'breathe', pos: 'v', meaning: 'thở (/briːð/)' },
        ],
        example: 'Deep breathing exercises help you relax when you feel stressed.',
        note: 'Breath (n) /θ/ ≠ breathe (v) /ð/.',
      },
    ],
    blanks: [
      {
        text: "To [ensure] his dog's safety, Tam built a strong [fence] around the yard.",
        hint: 'đảm bảo · hàng rào',
      },
      {
        text: 'When Ngoc feels stressed, she finds it hard to [cope with] the pressure.',
        hint: 'đương đầu với',
      },
      {
        text: 'We [value] honesty and trust in our family above all other qualities.',
        hint: 'coi trọng',
      },
      {
        text: 'During our trip, we had to [encounter] bad weather because it was the rainy season.',
        hint: 'gặp phải',
      },
      {
        text: 'She received a [certificate] for completing the first training course last week.',
        hint: 'chứng chỉ',
      },
      {
        text: 'You should not forget to bring your [passport] when you travel internationally.',
        hint: 'hộ chiếu',
      },
      {
        text: 'Children are naturally [curious] and love to explore the world around them.',
        hint: 'tò mò',
      },
      {
        text: 'He learned to [cope with] stress by practicing meditation and deep [breathing exercises].',
        hint: 'đương đầu với · bài tập hít thở',
      },
      {
        text: 'To travel abroad, you must [ensure] your passport and visa are up-to-date.',
        hint: 'đảm bảo',
      },
      {
        text: 'You can [depend on] a good friend to help you in difficult times.',
        hint: 'dựa vào',
      },
    ],
  },
]

/** Vocabulary for one 'YYYY-MM-DD' day, if any. */
export function getVocabularyByDate(date: string): VocabDay | undefined {
  return vocabulary.find((day) => day.date === date)
}

/**
 * Practice for a day's words: flashcards (word → meaning) and "Which word means…?" questions
 * whose wrong options are other words from the same day, plus the day's gap-filling sentences.
 */
export function getVocabExercises(day: VocabDay): ExerciseSet {
  const lessonId = `vocab:${day.date}`
  const flashcards = day.words.map((w): Flashcard => ({
    id: `${lessonId}:card:${w.word}`,
    kind: 'flashcard',
    lessonId,
    front: w.word,
    back: w.meaning,
    note: [w.ipa && `/${w.ipa}/`, `(${w.pos})`, w.example].filter(Boolean).join(' · '),
  }))
  const quiz =
    day.words.length < 4
      ? []
      : day.words.map((w): QuizQuestion => {
          const others = shuffle(day.words.filter((o) => o !== w)).slice(0, 3)
          return {
            id: `${lessonId}:quiz:${w.word}`,
            kind: 'quiz',
            lessonId,
            prompt: `Which word means "${w.meaning}"?`,
            options: [w.word, ...others.map((o) => o.word)],
            answer: 0,
            explanation: w.family?.length
              ? [...w.family, w].map((f) => `${f.word} (${f.pos})`).join(' → ')
              : w.note,
          }
        })
  const blanks = (day.blanks ?? []).map((blank): BlankExercise => ({
    id: `${lessonId}:blank:${blank.text}`,
    kind: 'blank',
    lessonId,
    parts: parseBlanks(blank.text),
    hint: blank.hint,
    hintLabel: 'Meaning',
  }))
  return { flashcards, quiz, blanks, rewrite: [] }
}
