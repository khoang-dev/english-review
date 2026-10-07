/** One form in a word family, e.g. `satisfy (v)` on the way to `unsatisfactory`. */
export interface WordForm {
  word: string
  /** Part of speech: 'n', 'v', 'adj', 'adv', 'idiom'… */
  pos: string
  meaning?: string
}

export interface VocabWord extends WordForm {
  meaning: string
  /** The part of `word` to call out (stressed syllable, prefix or suffix), e.g. 'ial' in 'essential'. */
  focus?: string
  /** IPA without slashes, e.g. 'ɪˈsenʃl'. */
  ipa?: string
  /** Word family forms leading to `word`, in order (little → less → lessen). */
  family?: WordForm[]
  example?: string
  /** Usage note, e.g. 'trong câu là passive voice'. */
  note?: string
}

export interface VocabDay {
  /** Local day 'YYYY-MM-DD' the words show up on in the daily review. */
  date: string
  /** Topic of the words, e.g. the reading they came from. */
  title?: string
  words: VocabWord[]
}
