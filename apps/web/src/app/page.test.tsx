import { renderToStaticMarkup } from 'react-dom/server'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'

const data = vi.hoisted(() => ({
  site: {} as Record<string, unknown>,
  breads: [] as Record<string, unknown>[],
  hours: {} as Record<string, unknown>,
}))
vi.mock('../data/site', () => ({ getSite: async () => data.site }))
vi.mock('../data/breads', () => ({ getBreads: async () => data.breads }))
vi.mock('../data/opening-hours', () => ({ getOpeningHours: async () => data.hours }))

import Home from './page'

const render = async () => renderToStaticMarkup(await Home())

beforeEach(() => {
  // A Monday at noon in Lisbon.
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(new Date('2026-11-16T12:00:00Z'))
  data.site = { name: 'Test name', tagline: 'A tagline.', intro: 'An intro paragraph.' }
  data.breads = [1, 2, 3, 4].map((id) => ({
    id,
    name: `Bread ${id}`,
    description: `About ${id}.`,
    days: ['monday'],
  }))
  data.hours = { week: [{ day: 'monday', closed: false, opens: '07:30', closes: '15:00' }] }
})

afterEach(() => vi.useRealTimers())

it('renders the Site global as plain server HTML, so it needs no JavaScript', async () => {
  const html = await render()
  expect(html).toContain('<h1')
  expect(html).toContain('Test name')
  expect(html).toContain('A tagline.')
  expect(html).toContain('An intro paragraph.')
})

it('teases a few breads and links to Menu', async () => {
  const html = await render()
  expect(html).toContain('Bread 1')
  expect(html).toContain('Bread 3')
  expect(html).not.toContain('Bread 4')
  expect(html).toContain('href="/menu"')
})

it("shows today's hours and links to Visit", async () => {
  const html = await render()
  expect(html).toContain('07:30–15:00')
  expect(html).toContain('href="/visit"')
})

it('says closed today for a closed day, and for a day without times', async () => {
  data.hours = { week: [{ day: 'monday', closed: true, opens: '07:30', closes: '15:00' }] }
  expect(await render()).toContain('Closed today')
  data.hours = { week: [{ day: 'monday' }] }
  expect(await render()).toContain('Closed today')
})

it('uses the Lisbon day, not the server clock zone', async () => {
  // Summer: 23:30 UTC on Sunday is 00:30 on Monday in Lisbon (UTC+1).
  vi.setSystemTime(new Date('2026-07-12T23:30:00Z'))
  data.hours = {
    week: [
      { day: 'sunday', closed: true },
      { day: 'monday', opens: '07:30', closes: '15:00' },
    ],
  }
  expect(await render()).toContain('Open today (Monday)')
})

it('still renders on an unseeded database, with a line and no empty block', async () => {
  data.site = {}
  data.breads = []
  data.hours = {}
  const html = await render()
  expect(html).toContain('<h1')
  expect(html).toContain('breads will be listed soon')
  expect(html).toContain('opening hours are on the Visit page')
  expect(html).not.toContain('<ul')
})
