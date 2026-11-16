import { collectionTag } from '@harbour/cms-config/tags'
import { unstable_cache } from 'next/cache'

import { getWebPayload } from '../lib/payload'
import type { Bread } from '@harbour/cms-config'

/** The whole bread list, in the order editors set in the admin. Pattern: `site.ts`. */
export const getBreads = unstable_cache(
  async (): Promise<Bread[]> => {
    const payload = await getWebPayload()
    const { docs } = await payload.find({
      collection: 'breads',
      sort: '_order',
      pagination: false,
      overrideAccess: false,
      depth: 0,
    })
    return docs
  },
  ['breads'],
  { tags: [collectionTag('breads')] },
)
