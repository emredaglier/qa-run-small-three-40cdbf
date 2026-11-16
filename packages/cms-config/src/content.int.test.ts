import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

import { getPayload, type Payload } from 'payload'
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

import { buildSiteConfig } from './config'

// Breads and Opening hours through the cms Local API: validation, access and the revalidation tags.
let dir: string
let payload: Payload
const posted: string[][] = []

beforeAll(async () => {
  // The revalidate hooks call the global fetch; record the tags instead of sending them.
  vi.stubGlobal('fetch', async (_url: string, init: RequestInit) => {
    posted.push((JSON.parse(String(init.body)) as { tags: string[] }).tags)
    return new Response('{}', { status: 200 })
  })
  dir = fs.mkdtempSync(path.join(os.tmpdir(), 'house-content-'))
  payload = await getPayload({
    key: 'content',
    config: await buildSiteConfig({
      role: 'cms',
      databasePath: path.join(dir, 'content.db'),
      secret: 's',
      push: false,
      revalidate: { urls: ['http://web.test/internal/revalidate'], secret: 'r' },
    }),
  })
  await payload.db.migrate()
}, 30_000)

beforeEach(() => {
  posted.length = 0
})

afterAll(async () => {
  vi.unstubAllGlobals()
  await payload?.db.destroy?.()
  fs.rmSync(dir, { recursive: true, force: true })
})

describe('validation', () => {
  it('refuses a bread with no days', async () => {
    await expect(
      payload.create({ collection: 'breads', data: { name: 'No days', days: [] } }),
    ).rejects.toThrow(/days|Baked on/i)
    expect((await payload.find({ collection: 'breads' })).totalDocs).toBe(0)
  })

  it('refuses a map link that is not https', async () => {
    await expect(
      payload.updateGlobal({ slug: 'opening-hours', data: { mapUrl: 'http://maps.example.com' } }),
    ).rejects.toThrow(/map/i)
    expect((await payload.findGlobal({ slug: 'opening-hours' })).mapUrl).toBeFalsy()
  })
})

describe('access', () => {
  it('lets anyone read, and only a signed-in user write', async () => {
    const asVisitor = { overrideAccess: false } as const
    await expect(payload.find({ collection: 'breads', ...asVisitor })).resolves.toBeTruthy()
    await expect(payload.findGlobal({ slug: 'opening-hours', ...asVisitor })).resolves.toBeTruthy()
    await expect(
      payload.create({ collection: 'breads', data: { name: 'x', days: ['monday'] }, ...asVisitor }),
    ).rejects.toThrow()
    await expect(
      payload.updateGlobal({ slug: 'opening-hours', data: { address: 'x' }, ...asVisitor }),
    ).rejects.toThrow()
    const { id } = await payload.create({
      collection: 'breads',
      data: { name: 'Kept', days: ['monday'] },
    })
    await expect(
      payload.update({ collection: 'breads', id, data: { name: 'x' }, ...asVisitor }),
    ).rejects.toThrow()
    await expect(payload.delete({ collection: 'breads', id, ...asVisitor })).rejects.toThrow()
    await payload.delete({ collection: 'breads', id })
  })
})

describe('revalidation', () => {
  it('a bread save or delete sends the breads list tag and its own doc tag', async () => {
    const { id } = await payload.create({
      collection: 'breads',
      data: { name: 'Rye', days: ['friday'] },
    })
    await payload.update({ collection: 'breads', id, data: { name: 'Dark rye' } })
    await payload.delete({ collection: 'breads', id })
    const expected = [`doc:breads:${id}`, 'collection:breads']
    expect(posted).toEqual([expected, expected, expected])
  })

  it('an opening-hours save sends its global tag', async () => {
    await payload.updateGlobal({ slug: 'opening-hours', data: { address: 'Placeholder quay' } })
    expect(posted).toEqual([['global:opening-hours']])
  })
})
