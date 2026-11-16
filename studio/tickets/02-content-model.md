---
author: producer
class: hard
assignee: backend
blockedBy: [01-project-setup]
---

# 02: Content model, seed and web reads

The bakery edits its bread list and opening hours in Payload. `web` reads them through the Local API, read-only (ADR-0002).

## Do

- In `packages/cms-config`:
  - A `breads` collection with these fields:
    - `name` (required)
    - `description` (short textarea)
    - `days` (multi-select, Monday to Sunday, at least one)
    - an order field for the list
  - An `opening-hours` global with these fields:
    - one row per weekday: day, `closed` flag, opens, closes
    - `address` (textarea)
    - `mapUrl` (https URL only)
  - Access for both: `read: anyone`, `update`/`create`/`delete: authenticated`, matching `Site`.
  - Keep the `Site` global (name, tagline, intro, description) for Home.
- Add a new migration. Do not edit `20261109_152213_initial.ts`. Regenerate `payload-types.ts`.
- Revalidation: saving a bread sends `collectionTag('breads')` plus its `docTag`. Saving hours sends `globalTag('opening-hours')`.
- Seed, text only (ADR-0010):
  - replace `seed/placeholder.ts` with Harbour Bakery placeholder text: Site, a handful of breads, a week of hours with one closed day, an address and a map link
  - clearly placeholder; no real business data
- In `apps/web/src/data/`, add tag-cached read functions `getBreads()` and `getOpeningHours()`, next to `getSite()`.

## Acceptance criteria

- Migration runs on a fresh database. `pnpm seed` fills all three. The seed int test covers the new data.
- `web-readonly.int.test.ts` proves `web` cannot write `breads` or `opening-hours`.
- A unit test on broken input: `mapUrl` rejects a non-https value, and `days` rejects an empty list.
- A revalidation test sends the right tags for each save.
- `pnpm lint`, `pnpm typecheck`, `pnpm test` and `pnpm check:assets` pass, with each result reported.
