import { renderToStaticMarkup } from 'react-dom/server'
import { beforeEach, expect, it, vi } from 'vitest'

const data = vi.hoisted(() => ({ doc: {} as Record<string, unknown> }))
vi.mock('../../data/opening-hours', () => ({ getOpeningHours: async () => data.doc }))

import { addressLines, todayInPorto, weekRows } from './hours'
import VisitPage from './page'

beforeEach(() => {
  data.doc = {
    week: [
      { day: 'monday', closed: true },
      { day: 'tuesday', opens: '07:00', closes: '15:00' },
    ],
    address: 'Rua das Flores 1\n\n4050 Porto',
    mapUrl: 'https://maps.example.com/harbour',
  }
})

it('renders hours, address and a plain map link as server HTML', async () => {
  const html = renderToStaticMarkup(await VisitPage())
  expect(html).toContain('<h1')
  expect(html).toContain('<table')
  expect(html).toContain('07:00–15:00')
  expect(html).toContain('<address')
  expect(html).toContain('4050 Porto')
  expect(html).toContain('<a href="https://maps.example.com/harbour"')
  expect(html).not.toContain('<iframe')
  expect(html).not.toContain('<script')
})

it('shows Closed for closed and missing days: all seven rows', () => {
  const rows = weekRows((data.doc as { week: never }).week)
  expect(rows.map((r) => r.day)).toHaveLength(7)
  expect(rows.filter((r) => !r.open)).toHaveLength(6)
})

it('falls back when hours, address and map link are all missing', async () => {
  data.doc = {}
  const html = renderToStaticMarkup(await VisitPage())
  expect(html).toContain('<h1')
  expect(html).toContain('Opening hours are not available')
  expect(html).toContain('address is not available')
  expect(html).not.toContain('<table')
  expect(html).not.toContain('<a ')
})

it('leaves the map link out when only that is missing', async () => {
  data.doc = { ...data.doc, mapUrl: null }
  const html = renderToStaticMarkup(await VisitPage())
  expect(html).toContain('<table')
  expect(html).not.toContain('<a ')
})

it('splits an address into trimmed non-empty lines', () => {
  expect(addressLines(' A \n\n B ')).toEqual(['A', 'B'])
  expect(addressLines(null)).toEqual([])
})

it('names today by the day in Porto, not the server zone', () => {
  // 23:30 UTC on a Monday in July is already Tuesday 00:30 in Lisbon (UTC+1).
  expect(todayInPorto(new Date('2026-07-06T23:30:00Z'))).toBe('tuesday')
})
