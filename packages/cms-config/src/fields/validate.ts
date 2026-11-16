/** Empty is allowed (the field is optional); anything else must parse as an `https:` URL. */
export function httpsUrl(value: string | null | undefined): true | string {
  if (!value) return true
  try {
    if (new URL(value).protocol === 'https:') return true
  } catch {
    // not a URL at all: same message
  }
  return 'Enter a full https:// link.'
}

const TIME = /^([01]\d|2[0-3]):[0-5]\d$/

/** Opening and closing times: `HH:MM`, 24-hour clock. Required unless the day is closed. */
export function timeOfDay(
  value: string | null | undefined,
  { siblingData }: { siblingData: Partial<{ closed: boolean | null }> },
): true | string {
  if (siblingData.closed) return true
  if (!value) return 'Required unless the day is closed.'
  return TIME.test(value) ? true : 'Use the 24-hour HH:MM format, e.g. 07:30.'
}

/** The week's rows: none yet, or each weekday exactly once. */
export function oneRowPerDay(rows: unknown): true | string {
  const days = Array.isArray(rows) ? rows.map((row) => (row as { day?: unknown }).day) : []
  if (days.length === 0) return true
  return days.length === 7 && new Set(days).size === 7 ? true : 'Add one row for each weekday.'
}
