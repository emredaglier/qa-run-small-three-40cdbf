import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

import { getPayload, type Payload } from 'payload'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { buildSiteConfig } from '../config'
import { PLACEHOLDER_BREADS, PLACEHOLDER_HOURS, PLACEHOLDER_SITE } from './placeholder'
import { runSeed } from './seed'

let dir: string
let payload: Payload

beforeAll(async () => {
  dir = fs.mkdtempSync(path.join(os.tmpdir(), 'house-seed-'))
  payload = await getPayload({
    config: await buildSiteConfig({
      role: 'cms',
      databasePath: path.join(dir, 'seed.db'),
      secret: 'test-secret',
      push: false,
    }),
  })
  await payload.db.migrate()
}, 30_000)

afterAll(async () => {
  await payload?.db.destroy?.()
  fs.rmSync(dir, { recursive: true, force: true })
})

const all = (status: string) => ({ site: status, 'opening-hours': status, breads: status })
const breadNames = async () =>
  (
    await payload.find({ collection: 'breads', sort: '_order', depth: 0, pagination: false })
  ).docs.map((doc) => doc.name)

describe('runSeed', () => {
  it('fills Site, Opening hours and the breads, then leaves them alone on a second run', async () => {
    expect(await runSeed(payload)).toEqual(all('seeded'))
    const site = await payload.findGlobal({ slug: 'site', depth: 0 })
    expect(site.name).toBe(PLACEHOLDER_SITE.name)
    expect(site.intro).toBe(PLACEHOLDER_SITE.intro)

    const hours = await payload.findGlobal({ slug: 'opening-hours', depth: 0 })
    expect(hours.week?.map((row) => row.day)).toEqual(PLACEHOLDER_HOURS.week.map((row) => row.day))
    expect(hours.week?.filter((row) => row.closed)).toHaveLength(1)
    expect(hours.address).toBe(PLACEHOLDER_HOURS.address)
    expect(hours.mapUrl).toBe(PLACEHOLDER_HOURS.mapUrl)

    // In seed order, which `_order` keeps.
    expect(await breadNames()).toEqual(PLACEHOLDER_BREADS.map((bread) => bread.name))

    expect(await runSeed(payload)).toEqual(all('unchanged'))
  })

  it('refuses to overwrite edited content unless forced', async () => {
    await payload.updateGlobal({ slug: 'site', data: { name: 'Edited in the admin' } })
    await payload.updateGlobal({ slug: 'opening-hours', data: { address: 'Edited address' } })
    const [first, second] = (await payload.find({ collection: 'breads', sort: '_order', depth: 0 }))
      .docs
    await payload.update({ collection: 'breads', id: first!.id, data: { days: ['sunday'] } })
    await payload.delete({ collection: 'breads', id: second!.id })
    await payload.create({
      collection: 'breads',
      data: { name: 'Added by an editor', days: ['monday'] },
    })

    expect(await runSeed(payload)).toEqual(all('edited'))
    expect((await payload.findGlobal({ slug: 'site', depth: 0 })).name).toBe('Edited in the admin')
    expect((await payload.findGlobal({ slug: 'opening-hours', depth: 0 })).address).toBe(
      'Edited address',
    )
    expect(await breadNames()).not.toContain(PLACEHOLDER_BREADS[1]!.name)

    expect(await runSeed(payload, { force: true })).toEqual(all('overwritten'))
    expect((await payload.findGlobal({ slug: 'site', depth: 0 })).name).toBe(PLACEHOLDER_SITE.name)
    expect((await payload.findGlobal({ slug: 'opening-hours', depth: 0 })).address).toBe(
      PLACEHOLDER_HOURS.address,
    )
    const names = await breadNames()
    for (const bread of PLACEHOLDER_BREADS) expect(names).toContain(bread.name)
    // Force restores the placeholders and never deletes an editor's bread.
    expect(names).toContain('Added by an editor')
    const restored = await payload.find({
      collection: 'breads',
      where: { name: { equals: PLACEHOLDER_BREADS[0]!.name } },
      depth: 0,
    })
    expect(restored.docs[0]?.days).toEqual(PLACEHOLDER_BREADS[0]!.days)
  })
})
