import { renderToStaticMarkup } from 'react-dom/server'
import { beforeEach, expect, it, vi } from 'vitest'

const data = vi.hoisted(() => ({ breads: [] as Record<string, unknown>[] }))
vi.mock('../../data/breads', () => ({ getBreads: async () => data.breads }))

import MenuPage, { dynamic, metadata } from './page'

beforeEach(() => {
  data.breads = []
})

it('renders each bread in the given order as a list item, as plain server HTML', async () => {
  data.breads = [
    { id: 1, name: 'Sourdough', description: 'Slow and sour.', days: ['monday', 'friday'] },
    { id: 2, name: 'Rye', description: null, days: ['sunday'] },
  ]
  const html = renderToStaticMarkup(await MenuPage())
  expect(html).toContain('<h1')
  expect(html).toMatch(/<ul[^>]*>\s*<li[^>]*><article/)
  expect(html.match(/<h2/g)).toHaveLength(2)
  expect(html.indexOf('Sourdough')).toBeLessThan(html.indexOf('Rye'))
  expect(html).toContain('Slow and sour.')
  expect(html).toContain('Friday')
})

it('shows an empty state, and no list, when there are no breads', async () => {
  const html = renderToStaticMarkup(await MenuPage())
  expect(html).toContain('<h1')
  expect(html).toContain('check back soon')
  expect(html).not.toContain('<ul')
})

it('is rendered per request and has page metadata', () => {
  expect(dynamic).toBe('force-dynamic')
  expect(metadata.title).toBe('Menu')
})
