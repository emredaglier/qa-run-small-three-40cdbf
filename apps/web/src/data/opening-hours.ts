import { globalTag } from '@harbour/cms-config/tags'
import { unstable_cache } from 'next/cache'

import { getWebPayload } from '../lib/payload'
import type { OpeningHoursDoc } from '@harbour/cms-config'

/** The week's hours, address and map link. Pattern: `site.ts`. */
export const getOpeningHours = unstable_cache(
  async (): Promise<OpeningHoursDoc> => {
    const payload = await getWebPayload()
    return payload.findGlobal({ slug: 'opening-hours', overrideAccess: false, depth: 0 })
  },
  ['opening-hours'],
  { tags: [globalTag('opening-hours')] },
)
