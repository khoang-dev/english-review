export interface CoursePart {
  name: string
  completed: boolean
}

export interface CourseWeek {
  week: number
  /** 12 parts: 1 speaking, 1 writing, 4 reading, 2 vocab, 4 listening. */
  platform: CoursePart[]
  /** 4 parts: writing, reading, listening, speaking. */
  doc: CoursePart[]
}

export interface Course {
  name: string
  weeks: CourseWeek[]
}
