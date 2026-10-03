import data from './courses.json'
import type { Course, CoursePart } from '@/types/course'

/** ROOT, TRUNK and BULK — 9 weeks each. Mark a part done by setting `completed: true` in courses.json. */
export const courses: Course[] = data.courses

export interface PartCount {
  done: number
  total: number
  percent: number
}

function count(parts: CoursePart[]): PartCount {
  const done = parts.filter((part) => part.completed).length
  const total = parts.length
  return { done, total, percent: total ? Math.round((done / total) * 100) : 0 }
}

function courseParts(course: Course): CoursePart[] {
  return course.weeks.flatMap((week) => [...week.platform, ...week.doc])
}

export function courseProgress(course: Course): PartCount {
  return count(courseParts(course))
}

export function overallProgress(): PartCount {
  return count(courses.flatMap(courseParts))
}

/** The first part not yet completed, in course → week → platform → doc order. */
export function nextPart(): string | undefined {
  for (const course of courses) {
    for (const week of course.weeks) {
      for (const [section, parts] of [
        ['Platform', week.platform],
        ['Doc', week.doc],
      ] as const) {
        const part = parts.find((p) => !p.completed)
        if (part) return `${course.name} · Week ${week.week} · ${section} ${part.name}`
      }
    }
  }
  return undefined
}
