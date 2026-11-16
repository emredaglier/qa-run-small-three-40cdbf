import { BreadItem, PageHeading } from '@harbour/ui'
import type { Metadata } from 'next'

import { getBreads } from '../../data/breads'

// Content comes from the database at request time (cached by tag), never at build time.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Menu',
  description: 'The breads we bake each week, and the days each one comes out of the oven.',
}

/** The weekly bread list in the order editors set. Server-rendered, so it needs no JavaScript (ADR-0008). */
export default async function MenuPage() {
  const breads = await getBreads()
  return (
    <>
      <PageHeading title="Menu" intro="Our breads, and the days each one is baked." />
      {breads.length > 0 ? (
        <ul className="grid gap-4 sm:grid-cols-2">
          {breads.map((bread) => (
            <li key={bread.id}>
              <BreadItem
                as="h2"
                name={bread.name}
                description={bread.description ?? ''}
                days={bread.days}
              />
            </li>
          ))}
        </ul>
      ) : (
        <p className="max-w-prose text-ink-soft">
          The menu is being written. Please check back soon.
        </p>
      )}
    </>
  )
}
