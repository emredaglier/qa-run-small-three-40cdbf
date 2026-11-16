import { BreadItem, ButtonLink, DAYS, PageHeading, TextLink, dayName, type Day } from '@harbour/ui'
import type { Metadata } from 'next'

import { getBreads } from '../data/breads'
import { getOpeningHours } from '../data/opening-hours'
import { getSite } from '../data/site'

// Content comes from the database at request time (cached by tag), never at build time.
export const dynamic = 'force-dynamic'

const TEASER_COUNT = 3

// shortcut: no prefetch while /menu and /visit are missing (404s fail smoke); drop it with tickets 05, 06.
const noPrefetch = { prefetch: false } as const

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite()
  return {
    title: site.name,
    description: site.defaultDescription || undefined,
  }
}

/** The bakery is in Porto, so "today" is Lisbon's day, whatever the server's clock zone. */
function today(): Day {
  const name = new Date()
    .toLocaleDateString('en-GB', { weekday: 'long', timeZone: 'Europe/Lisbon' })
    .toLowerCase()
  return DAYS.find((day) => day === name) ?? 'monday'
}

/**
 * The home page. Everything on it is rendered on the server from the Site global, the breads and
 * the opening hours, so it is complete with JavaScript off (ADR-0008).
 */
export default async function Home() {
  const [site, breads, hours] = await Promise.all([getSite(), getBreads(), getOpeningHours()])
  const day = today()
  const row = hours.week?.find((d) => d.day === day)
  const teaser = breads.slice(0, TEASER_COUNT)

  return (
    <>
      <PageHeading title={site.name ?? ''} intro={site.tagline} />
      {site.intro ? <p className="max-w-prose">{site.intro}</p> : null}

      <section aria-labelledby="this-week" className="mt-12">
        <h2 id="this-week" className="text-2xl text-ink">
          This week
        </h2>
        {teaser.length > 0 ? (
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {teaser.map((bread) => (
              <li key={bread.id}>
                <BreadItem
                  name={bread.name}
                  description={bread.description ?? ''}
                  days={bread.days}
                />
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 max-w-prose">This week&rsquo;s breads will be listed soon.</p>
        )}
        <p className="mt-6">
          <ButtonLink href="/menu" {...noPrefetch}>
            See the full menu
          </ButtonLink>
        </p>
      </section>

      <section aria-labelledby="today" className="mt-12">
        <h2 id="today" className="text-2xl text-ink">
          Today
        </h2>
        <p className="mt-4 max-w-prose">
          {!row
            ? 'Our opening hours are on the Visit page.'
            : row.closed || !row.opens || !row.closes
              ? `Closed today (${dayName(day)}).`
              : `Open today (${dayName(day)}), ${row.opens}–${row.closes}.`}{' '}
          <TextLink href="/visit" {...noPrefetch}>
            Visit us
          </TextLink>
        </p>
      </section>
    </>
  )
}
