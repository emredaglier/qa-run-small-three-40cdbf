---
author: qa
verdict: pass
---

# QA report: 02-content-model (PR #3, commit e9c9123)

Preview: https://emres-macbook-pro.tail201ea9.ts.net:4400/

## What I could and could not run

The diff has no visitor-facing page: it adds the schema, a migration, the seed and two `web` read
functions (`getBreads`, `getOpeningHours`) that no page calls yet. So a visitor sees only Home.
Most criteria are about source and tests. I checked those by reading the checkout.

**I did not run any test or command.** The shell hook refused my first read-only `ls`, and there is
no install in my turn, so I never ran `pnpm lint`, `typecheck`, `test` or `check:assets`, and I did
not run the migration or `pnpm seed`. The prompt says CI is green. That is the only evidence for
those commands, and it is not mine. Where a criterion rests on a test passing, I say that I read
the test and did not see it run.

## Acceptance criteria

1. **Migration runs on a fresh database. `pnpm seed` fills all three. The seed int test covers the new data.**
   - Read `migrations/20261116_125604_breads_opening_hours.ts`: a new file, and it is listed in
     `migrations/index.ts` after the unchanged `20261109_152213_initial`. It creates `breads`,
     `breads_days`, `opening_hours` and `opening_hours_week`, with a `down`.
   - Read `seed/seed.ts` and `apps/cms/scripts/seed.ts`: `runSeed` seeds `site`, `opening-hours`
     and `breads`, and logs all three.
   - Read `seed/seed.int.test.ts`: it migrates a fresh database, seeds, and asserts Site, the
     seven-day week with one closed day, the address, the map link and the bread names in order.
     It then checks a second run, an edited run and a forced run.
   - Not run by me: the migration, `pnpm seed` and the test. Status: read and consistent; not
     executed.

2. **`web-readonly.int.test.ts` proves `web` cannot write `breads` or `opening-hours`.**
   - Read the new test, "reads breads and opening hours, and fails every write to them". It makes
     raw `UPDATE breads` and `UPDATE opening_hours` through the web connection and expects a
     readonly error. It also expects `web.create`, `update` and `delete` on breads and
     `web.updateGlobal` on opening-hours to reject, then re-reads through `cms` to confirm nothing
     changed. The test covers the criterion. I did not see it run.

3. **Unit test on broken input: `mapUrl` rejects a non-https value, `days` rejects an empty list.**
   - `fields/validate.test.ts` covers `httpsUrl`. It rejects http, `javascript:`, ftp, a bare host,
     a missing colon and a blank. It also tests `timeOfDay` and `oneRowPerDay`.
   - The empty `days` case is **not** in that unit file. It is in `content.int.test.ts`, "refuses a
     bread with no days". That test goes through `payload.create` and relies on Payload's
     `required` on a `hasMany` select to reject `[]`. The int test also covers `mapUrl` through
     `updateGlobal`. Both inputs are tested; the `days` one is an int test, not a pure unit test.
     I did not fail on this, since the criterion's point (rejection is tested) holds. I could not
     confirm Payload's behaviour by running it.

4. **A revalidation test sends the right tags for each save.**
   - Read `content.int.test.ts`, "revalidation". A bread create, update and delete each post
     `[doc:breads:<id>, collection:breads]`. An opening-hours save posts `['global:opening-hours']`.
     The ticket asks for the collection tag plus the doc tag on a bread save, and the global tag on
     a hours save; both are met.
   - Read `tags.ts`: `TAG_PATTERN` matches `global:opening-hours`, `collection:breads` and
     `doc:breads:12`, so the web revalidation route does not drop them.
   - Read `config.ts`: `Breads` gets the collection hooks, and `OpeningHours` and `Site` get the
     global hook appended to any hooks they already had.

5. **`pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm check:assets` pass, each result reported.**
   - Not checked by me, as above. The prompt says CI is green. I had no builder report to read.

## The "Do" list

- Breads: `name` required; `description` textarea (maxLength 280); `days` multi-select,
  Monday to Sunday, `required` (read in `collections/Breads.ts`); `orderable: true` adds `_order`.
  Access is `anyone` for read and `authenticated` for create, update and delete. Matches.
- Opening hours: `week` array with `day`, `closed`, `opens`, `closes`; `address` textarea; `mapUrl`
  with the https validator. Access is `anyone` for read and `authenticated` for update. Matches `Site`.
- `Site` is unchanged (name, tagline, intro, defaultDescription).
- `payload-types.ts` has `Bread` (with `_order` and `days`) and `OpeningHour` with `mapUrl`. These
  are exported from `index.ts` as `Bread` and `OpeningHoursDoc`.
- Seed text (`seed/placeholder.ts`): "Harbour Bakery" Site text, four breads all named
  "Placeholder ...", a week with Sunday closed, address "Placeholder address / 1 Example Quay /
  Exampletown", and a map link to `https://www.openstreetmap.org/`. It reads as placeholder, and I
  saw no real business data.
- `apps/web/src/data/breads.ts` and `opening-hours.ts`: `unstable_cache` with
  `collectionTag('breads')` and `globalTag('opening-hours')`, read-only Local API calls with
  `overrideAccess: false`, bread sort `_order`. Same pattern as `site.ts`. Neither is called by any
  page, so I could not see them work in the browser.

## What a visitor gets (browser, `browser_navigate`, `browser_snapshot`, `browser_evaluate`)

- Home at desktop width (the default window): title "Harbour Bakery", an h1, and the tagline and
  intro paragraphs from the CMS. Snapshot read; no layout problems seen.
- Home at 390 x 844: the same three text blocks, wrapped, nothing cut off or overlapping. I took a
  screenshot (`studio/qa/02-content-model-1-phone.png`). This is Playwright Chromium, not an
  iPhone, and I did not test WebKit or iOS Safari.
- Server HTML (`fetch('/')` in the page): status 200, and the raw HTML contains both the name and
  the intro text. Content does not depend on JavaScript.
- `fetch` on `/admin`, `/api/breads` and `/api/globals/opening-hours` each returned 404, so `web`
  still has no admin or API routes. `/internal/revalidate` answered 405 to a GET, as a POST-only
  route should. `/breads` and `/opening-hours` are 404, since the ticket adds no pages.
- Console: one 404 for `/favicon.ico` on load. The diff does not touch it, so I treat it as
  already there. The other console errors in my run came from my own 404 probes.

## Not checked

- Any command or test run (see the top).
- The admin UI (drag-to-reorder, validation messages): `cms` is not at the preview URL and the
  browser reaches only that URL.
- That `getBreads` and `getOpeningHours` return data at runtime: no page uses them.
- Any number such as a size or timing: none measured, none reported.

## Observations (no bounce)

- The empty-`days` rejection is tested at integration level, not in `validate.test.ts` (see
  criterion 3). A builder who wants it as a pure unit test could add one.
