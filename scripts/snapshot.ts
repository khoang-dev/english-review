// Records today's completed-part count from src/data/courses.json into src/data/progress-log.json.
// Run once a day after updating courses.json: npm run snapshot
import { readFileSync, writeFileSync } from 'node:fs'
import dayjs from 'dayjs'

interface Part {
  completed: boolean
}
interface Snapshot {
  date: string
  completed: number
}

const coursesPath = new URL('../src/data/courses.json', import.meta.url)
const logPath = new URL('../src/data/progress-log.json', import.meta.url)

const { courses } = JSON.parse(readFileSync(coursesPath, 'utf8')) as {
  courses: { weeks: { platform: Part[]; doc: Part[] }[] }[]
}
const completed = courses
  .flatMap((course) => course.weeks.flatMap((week) => [...week.platform, ...week.doc]))
  .filter((part) => part.completed).length

const date = dayjs().format('YYYY-MM-DD')

const log = JSON.parse(readFileSync(logPath, 'utf8')) as { snapshots: Snapshot[] }
const snapshots = [...log.snapshots.filter((s) => s.date !== date), { date, completed }].sort(
  (a, b) => a.date.localeCompare(b.date),
)
writeFileSync(logPath, JSON.stringify({ snapshots }, null, 2) + '\n')
console.log(`Saved ${date}: ${completed} parts completed`)
