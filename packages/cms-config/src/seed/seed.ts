import type { Payload } from 'payload'

import { PLACEHOLDER_BREADS, PLACEHOLDER_HOURS, PLACEHOLDER_SITE } from './placeholder'

export type SeedStatus = 'seeded' | 'unchanged' | 'edited' | 'overwritten'
export type SeedResult = Record<'site' | 'opening-hours' | 'breads', SeedStatus>

export type SeedOptions = {
  /** Overwrite content that was edited in the admin. */
  force?: boolean
  log?: (message: string) => void
}

/** Drops row ids and key order, so a stored document compares equal to the data that made it. */
function normalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(normalize)
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([key, v]) => key !== 'id' && v !== undefined && v !== null)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, v]) => [key, normalize(v)]),
    )
  }
  return value
}

const sameContent = (current: Record<string, unknown>, seed: Record<string, unknown>) =>
  Object.keys(seed).every(
    (key) => JSON.stringify(normalize(current[key])) === JSON.stringify(normalize(seed[key])),
  )

const decide = (empty: boolean, same: boolean, force?: boolean): SeedStatus =>
  empty ? 'seeded' : same ? 'unchanged' : force ? 'overwritten' : 'edited'

const writes = (status: SeedStatus) => status === 'seeded' || status === 'overwritten'

async function seedGlobal(
  payload: Payload,
  slug: 'site' | 'opening-hours',
  data: Record<string, unknown>,
  force?: boolean,
): Promise<SeedStatus> {
  const current = (await payload.findGlobal({ slug, depth: 0 })) as unknown as Record<
    string,
    unknown
  >
  const status = decide(!current.createdAt, sameContent(current, data), force)
  if (writes(status)) await payload.updateGlobal({ slug, data: data as never, depth: 0 })
  return status
}

/**
 * Seeds the breads by name, in list order. `force` restores the placeholder breads (creating any
 * that were deleted) and never deletes a bread an editor added.
 */
async function seedBreads(payload: Payload, force?: boolean): Promise<SeedStatus> {
  const { docs } = await payload.find({ collection: 'breads', depth: 0, pagination: false })
  const byName = new Map(docs.map((doc) => [doc.name, doc]))
  const same = PLACEHOLDER_BREADS.every((bread) => {
    const doc = byName.get(bread.name)
    return doc !== undefined && sameContent(doc as unknown as Record<string, unknown>, bread)
  })
  const status = decide(docs.length === 0, same, force)
  if (!writes(status)) return status
  for (const bread of PLACEHOLDER_BREADS) {
    const doc = byName.get(bread.name)
    // `as never`: placeholder.ts is untyped on purpose; Payload validates the data on save.
    if (!doc) await payload.create({ collection: 'breads', data: bread as never, depth: 0 })
    else if (!sameContent(doc as unknown as Record<string, unknown>, bread)) {
      await payload.update({ collection: 'breads', id: doc.id, data: bread as never, depth: 0 })
    }
  }
  return status
}

/**
 * Fills the Site and Opening hours globals and the bread list with placeholder text. Safe to run
 * twice: content that already holds the seed is left alone, and content that differs (edited in
 * the admin) is refused unless `force`. Content that was never saved is simply seeded.
 */
export async function runSeed(payload: Payload, options: SeedOptions = {}): Promise<SeedResult> {
  const log = options.log ?? (() => undefined)
  const result: SeedResult = {
    site: await seedGlobal(payload, 'site', { ...PLACEHOLDER_SITE }, options.force),
    'opening-hours': await seedGlobal(
      payload,
      'opening-hours',
      { ...PLACEHOLDER_HOURS },
      options.force,
    ),
    breads: await seedBreads(payload, options.force),
  }
  for (const [name, status] of Object.entries(result)) log(`${name}: ${status}`)
  return result
}
