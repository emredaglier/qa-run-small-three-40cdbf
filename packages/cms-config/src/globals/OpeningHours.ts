import type { GlobalConfig } from 'payload'

import { anyone, authenticated } from '../access'
import { httpsUrl, oneRowPerDay, timeOfDay } from '../fields/validate'
import { WEEKDAYS } from '../fields/weekdays'

/** The week's opening hours and where to find the bakery. */
export const OpeningHours: GlobalConfig = {
  slug: 'opening-hours',
  label: 'Opening hours',
  access: {
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      name: 'week',
      type: 'array',
      labels: { singular: 'Day', plural: 'Days' },
      validate: oneRowPerDay,
      fields: [
        { name: 'day', type: 'select', required: true, options: WEEKDAYS },
        { name: 'closed', type: 'checkbox', defaultValue: false },
        {
          type: 'row',
          fields: [
            { name: 'opens', type: 'text', validate: timeOfDay, admin: { placeholder: '07:30' } },
            { name: 'closes', type: 'text', validate: timeOfDay, admin: { placeholder: '15:00' } },
          ],
        },
      ],
    },
    { name: 'address', type: 'textarea' },
    {
      name: 'mapUrl',
      type: 'text',
      label: 'Map link',
      validate: httpsUrl,
      admin: { description: 'A full https:// link to the map.' },
    },
  ],
}
