import { HoursTable, PageHeading } from '@harbour/ui'
import type { Metadata } from 'next'

import { getOpeningHours } from '../../data/opening-hours'
import { addressLines, todayInPorto, weekRows } from './hours'

// Content comes from the database at request time (cached by tag), never at build time.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Visit',
  description: 'Opening hours, address and a map link for Harbour Bakery.',
}

const H2 = 'font-display text-2xl font-semibold text-ink'

/** Complete on the server: no client component, no embed, no third-party request (ADR-0008). */
export default async function VisitPage() {
  const { week, address, mapUrl } = await getOpeningHours()
  const rows = weekRows(week)
  const lines = addressLines(address)

  return (
    <>
      <PageHeading title="Visit" intro="Come in for fresh bread." />
      <div className="mt-10 grid gap-12 md:grid-cols-2">
        <section aria-labelledby="hours-heading">
          <h2 id="hours-heading" className={H2}>
            Opening hours
          </h2>
          <div className="mt-4">
            {rows.length > 0 ? (
              <HoursTable hours={rows} today={todayInPorto()} />
            ) : (
              <p>Opening hours are not available right now. Please check back soon.</p>
            )}
          </div>
        </section>
        <section aria-labelledby="find-heading">
          <h2 id="find-heading" className={H2}>
            Find us
          </h2>
          {lines.length > 0 ? (
            <address className="mt-4 not-italic">
              {lines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
          ) : (
            <p className="mt-4">Our address is not available right now.</p>
          )}
          {mapUrl ? (
            <p className="mt-4">
              {/* A plain link out: no embed, no iframe, no third-party script. */}
              <a
                href={mapUrl}
                className="link inline-flex min-h-11 items-center"
                rel="noopener noreferrer"
              >
                Open the map to find Harbour Bakery
              </a>
            </p>
          ) : null}
        </section>
      </div>
    </>
  )
}
