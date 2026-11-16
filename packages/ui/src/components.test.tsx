import { renderToStaticMarkup } from 'react-dom/server'
import { expect, it } from 'vitest'

import { BreadItem } from './BreadItem'
import { HoursTable } from './HoursTable'
import { ButtonLink, TextLink } from './links'
import { isCurrent } from './nav'
import { PageHeading } from './PageHeading'
import { SiteFooter } from './SiteFooter'
import { SiteHeader } from './SiteHeader'

// Structure only: the markup a visitor gets with JavaScript off. Look is the owner's call.

it('header lists Home, Menu and Visit as links and marks only the current page', () => {
  const html = renderToStaticMarkup(<SiteHeader name="Test Bakery" pathname="/menu" />)
  expect(html).toContain('<nav')
  for (const label of ['Home', 'Menu', 'Visit']) expect(html).toContain(`>${label}</a>`)
  expect(html.match(/aria-current="page"/g)).toHaveLength(1)
  expect(html).toMatch(
    /href="\/menu"[^>]*aria-current="page"|aria-current="page"[^>]*href="\/menu"/,
  )
})

it('header marks nothing on a page outside the nav', () => {
  expect(renderToStaticMarkup(<SiteHeader name="x" pathname="/nope" />)).not.toContain(
    'aria-current',
  )
})

it('isCurrent matches Home only on "/" and sub-pages for the rest', () => {
  expect(isCurrent('/', '/')).toBe(true)
  expect(isCurrent('/', '/menu')).toBe(false)
  expect(isCurrent('/menu', '/menu/rye')).toBe(true)
  expect(isCurrent('/menu', '/menus')).toBe(false)
  expect(isCurrent('/menu', null)).toBe(false)
})

it('footer shows the address lines and today’s hours it is given, and no empty blocks', () => {
  const full = renderToStaticMarkup(
    <SiteFooter name="B" address={['1 Quay Road', 'Harbour Town']} todayHours="7:00–15:00" />,
  )
  expect(full).toContain('<address')
  expect(full).toContain('1 Quay Road')
  expect(full).toContain('Harbour Town')
  expect(full).toContain('7:00–15:00')
  const bare = renderToStaticMarkup(<SiteFooter name="B" />)
  expect(bare).not.toContain('<address')
  expect(bare).not.toContain('<h2')
})

it('page heading is one h1 with an optional intro', () => {
  const html = renderToStaticMarkup(<PageHeading title="Menu" intro="Fresh daily." />)
  expect(html.match(/<h1/g)).toHaveLength(1)
  expect(html).toContain('Fresh daily.')
  expect(renderToStaticMarkup(<PageHeading title="Menu" />)).not.toContain('<p')
})

it('bread item shows name, description and one named chip per day', () => {
  const html = renderToStaticMarkup(
    <BreadItem name="Rye" description="Dark and sour." days={['monday', 'saturday']} />,
  )
  expect(html).toContain('<h3')
  expect(html).toContain('Rye')
  expect(html).toContain('Dark and sour.')
  expect(html.match(/<li/g)).toHaveLength(2)
  expect(html).toContain('Monday')
  expect(html).toContain('Saturday')
})

it('hours table has a row per day, "Closed" for a day without hours, and one today row', () => {
  const html = renderToStaticMarkup(
    <HoursTable
      today="tuesday"
      hours={[
        { day: 'monday' },
        { day: 'tuesday', open: '7:00', close: '15:00' },
        { day: 'wednesday', open: '7:00', close: null },
      ]}
    />,
  )
  expect(html.match(/<tr/g)).toHaveLength(3)
  expect(html).toContain('Closed')
  expect(html.match(/Closed/g)).toHaveLength(2)
  expect(html).toContain('7:00–15:00')
  expect(html.match(/aria-current="date"/g)).toHaveLength(1)
  expect(html).toMatch(/aria-current="date"[^]*Tuesday[^]*Today/)
})

it('text link and button link render real anchors', () => {
  const html = renderToStaticMarkup(
    <>
      <TextLink href="/visit">Find us</TextLink>
      <ButtonLink href="/menu">See the menu</ButtonLink>
    </>,
  )
  expect(html).toContain('href="/visit"')
  expect(html).toContain('href="/menu"')
})
