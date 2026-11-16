export const DAYS = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const

export type Day = (typeof DAYS)[number]

/** "monday" -> "Monday". */
export const dayName = (day: Day) => day.charAt(0).toUpperCase() + day.slice(1)

/** "monday" -> "Mon". */
export const dayShort = (day: Day) => dayName(day).slice(0, 3)
