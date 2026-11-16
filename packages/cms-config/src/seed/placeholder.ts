/**
 * The placeholder content `pnpm seed` writes: the Site and Opening hours globals and a few breads.
 * Made up on purpose (no real address, hours or map); the owner replaces it in the admin.
 *
 * No Payload imports: the smoke spec imports this file from the root project, which has no
 * `payload`. The seed int test checks the data against the schema instead.
 */

export const PLACEHOLDER_SITE = {
  name: 'Harbour Bakery',
  tagline: 'Placeholder: bread baked by the harbour, every morning but one.',
  intro:
    'Placeholder text, stored in the CMS and rendered on the server, so it is visible with JavaScript turned off.',
  defaultDescription: 'Placeholder description for Harbour Bakery.',
} as const

const open = (day: string, opens: string, closes: string) => ({ day, closed: false, opens, closes })

export const PLACEHOLDER_HOURS = {
  week: [
    open('monday', '07:00', '15:00'),
    open('tuesday', '07:00', '15:00'),
    open('wednesday', '07:00', '15:00'),
    open('thursday', '07:00', '15:00'),
    open('friday', '07:00', '16:00'),
    open('saturday', '08:00', '14:00'),
    { day: 'sunday', closed: true },
  ],
  address: 'Placeholder address\n1 Example Quay\nExampletown',
  mapUrl: 'https://www.openstreetmap.org/',
}

export const PLACEHOLDER_BREADS = [
  {
    name: 'Placeholder sourdough',
    description: 'Placeholder: a long-fermented country loaf.',
    days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
  },
  {
    name: 'Placeholder rye',
    description: 'Placeholder: a dense seeded rye.',
    days: ['tuesday', 'friday'],
  },
  {
    name: 'Placeholder baguette',
    description: 'Placeholder: a thin, crisp white loaf.',
    days: ['monday', 'wednesday', 'friday', 'saturday'],
  },
  {
    name: 'Placeholder cardamom bun',
    description: 'Placeholder: a sweet knotted bun.',
    days: ['saturday'],
  },
]
