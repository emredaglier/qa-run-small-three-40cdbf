import { DAYS, type Day, type DayHours } from '@harbour/ui'

import type { OpeningHoursDoc } from '@harbour/cms-config'

/** The bakery is in Porto: "today" is the day there, whatever the server's own zone. */
const TIME_ZONE = 'Europe/Lisbon'

export const todayInPorto = (now: Date = new Date()): Day =>
  new Intl.DateTimeFormat('en-GB', { weekday: 'long', timeZone: TIME_ZONE })
    .format(now)
    .toLowerCase() as Day

/**
 * The seven days, Monday first, from the global. A day that is missing or marked closed has no
 * times, so the table reads "Closed". Returns `[]` when no hours are set at all, so the page can
 * show a fallback instead of a week of "Closed".
 */
export function weekRows(week: OpeningHoursDoc['week']): DayHours[] {
  if (!week?.length) return []
  return DAYS.map((day) => {
    const row = week.find((entry) => entry.day === day)
    if (!row || row.closed || !row.opens || !row.closes) return { day }
    return { day, open: row.opens, close: row.closes }
  })
}

/** One string per line, empty lines dropped. */
export const addressLines = (address: string | null | undefined): string[] =>
  (address ?? '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
