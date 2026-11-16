import type { CollectionConfig } from 'payload'

import { anyone, authenticated } from '../access'
import { WEEKDAYS } from '../fields/weekdays'

/** The bread list. Editors drag rows in the admin list to set the order the site shows. */
export const Breads: CollectionConfig = {
  slug: 'breads',
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'days'],
    useAsTitle: 'name',
  },
  // Adds Payload's `_order` field and drag-to-reorder in the admin list.
  orderable: true,
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'description', type: 'textarea', maxLength: 280 },
    {
      name: 'days',
      type: 'select',
      label: 'Baked on',
      hasMany: true,
      // On a `hasMany` select, `required` also rejects an empty list.
      required: true,
      options: WEEKDAYS,
    },
  ],
  timestamps: true,
}
