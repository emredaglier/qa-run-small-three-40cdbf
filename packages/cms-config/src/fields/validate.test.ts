import { describe, expect, it } from 'vitest'

import { httpsUrl, oneRowPerDay, timeOfDay } from './validate'
import { WEEKDAYS } from './weekdays'

describe('httpsUrl', () => {
  it('rejects anything that is not an https link', () => {
    for (const bad of [
      'http://maps.example.com/x',
      'javascript:alert(1)',
      'ftp://example.com',
      'maps.example.com',
      'https//missing-colon',
      ' ',
    ]) {
      expect(httpsUrl(bad), bad).toEqual(expect.any(String))
    }
  })

  it('accepts an https link, and empty (the field is optional)', () => {
    expect(httpsUrl('https://www.openstreetmap.org/#map=18/0/0')).toBe(true)
    expect(httpsUrl('')).toBe(true)
    expect(httpsUrl(null)).toBe(true)
  })
})

describe('timeOfDay', () => {
  const open = { siblingData: { closed: false } }
  it('rejects a missing or malformed time on an open day', () => {
    for (const bad of [undefined, '', '7:30', '24:00', '07:60', '0730', '07:30pm']) {
      expect(timeOfDay(bad, open), String(bad)).toEqual(expect.any(String))
    }
  })
  it('accepts HH:MM, and anything on a closed day', () => {
    expect(timeOfDay('07:30', open)).toBe(true)
    expect(timeOfDay('23:59', open)).toBe(true)
    expect(timeOfDay(undefined, { siblingData: { closed: true } })).toBe(true)
  })
})

describe('oneRowPerDay', () => {
  const week = WEEKDAYS.map(({ value }) => ({ day: value }))
  it('rejects a missing, repeated or extra day', () => {
    expect(oneRowPerDay(week.slice(1))).toEqual(expect.any(String))
    expect(oneRowPerDay([...week.slice(1), week[1]])).toEqual(expect.any(String))
    expect(oneRowPerDay([...week, week[0]])).toEqual(expect.any(String))
  })
  it('accepts each weekday once, or no rows yet', () => {
    expect(oneRowPerDay(week)).toBe(true)
    expect(oneRowPerDay([...week].reverse())).toBe(true)
    expect(oneRowPerDay([])).toBe(true)
  })
})
