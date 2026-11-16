import { PageHeading, TextLink } from '@harbour/ui'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Not found' }

/** A missing page. Server-rendered inside the layout shell; Next answers with status 404. */
export default function NotFound() {
  return (
    <>
      <PageHeading title="Page not found" intro="That page is not on our shelves." />
      <p>
        <TextLink href="/">Back to the home page</TextLink>
      </p>
    </>
  )
}
