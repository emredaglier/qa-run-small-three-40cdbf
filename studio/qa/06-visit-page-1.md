---
author: qa
verdict: pass
---

# QA: 06-visit-page, PR #5, commit f2cbd0e

Tested at https://emres-macbook-pro.tail201ea9.ts.net:4402/visit in the browser tools, desktop 1280x900 and phone 390x844 (Playwright Chromium). Source read in the branch checkout `tickets/06-visit-page`. The diff touches only `apps/web/src/app/visit/*`, so I judged `/visit` and did not re-test shared layout.

## Acceptance criteria

1. **All content renders on the server, complete with JavaScript off (ADR-0008).** Pass.
   I did not switch JS off in the browser. I fetched `/visit` from the page (`fetch`, then `DOMParser`, so no scripts ran) and found the h1 "Visit", the table with all seven rows, the `<address>` and the map link in the server HTML. The "Today" marker (`aria-current="date"` on the Monday row) is in that HTML too. The page source (`page.tsx`) has no `'use client'` and no client component of its own. The response carries `cache-control: private, no-cache, no-store`, which fits `force-dynamic`.
2. **Hours are a real table a screen reader can follow.** Pass.
   The accessibility snapshot shows `table "Opening hours"` with a caption, seven rows, each with a `rowheader` (the day) and a `cell` (the times). Sunday reads "Closed". Today's row reads "MondayToday" in the row header, and its highlight is not the only cue: it also has a visible "Today" chip. Headings run h1, then h2 "Opening hours" and h2 "Find us". Each section is a labelled region.
3. **Missing hours or a missing map link render a sensible fallback (unit test).** Pass, by reading the code.
   `page.test.tsx` covers: all fields missing (fallback texts, no `<table`, no `<a `), only the map link missing (table stays, no link), address splitting, and the Porto day boundary. `weekRows` returns `[]` for no hours, so the page shows a message and not seven "Closed" rows. I did not run the tests: my shell only reads and the repo rules keep workers from starting browser or Next processes. I also could not put the live preview into a missing-data state, since I cannot edit its content. The fallback is therefore checked in the test source and the component code, not in the browser. An empty address gets its own fallback line, which the ticket did not ask for but which is sensible.
4. **No third-party request on the page.** Pass.
   `browser_network_requests` (static included) listed 13 requests, all to the preview origin. A page script reading `performance.getEntriesByType('resource')` returned one origin only, the preview's. The server HTML has 0 `<iframe>` and no script, link or image from another origin. The map link is a plain `<a href="https://www.openstreetmap.org/" rel="noopener noreferrer">` labelled "Open the map to find Harbour Bakery". Following it is the visitor's own choice, and I did not follow it (the browser reaches only the preview).
5. **The route sweep finds `/visit`.** Pass, by reading the code.
   `smoke/routes.ts` discovers routes from `page.tsx` files under `apps/web/src/app`, so `apps/web/src/app/visit/page.tsx` becomes `/visit`. It is static, so it needs no `DYNAMIC_ROUTE_SAMPLES` entry. I did not run the sweep (it needs Playwright specs, `pnpm smoke`). CI is reported green.
6. **`pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm check:assets` pass, each result reported.** Not checked by me.
   I cannot run them from this role. Your prompt says CI is green. The builder's own report of each result is not something I have seen. The diff adds no asset, so `check:assets` has nothing new to weigh.
7. **Owner's eyes at mobile and desktop.** Left to the owner. Screenshots for the owner: `studio/qa/06-visit-desktop.png` and `studio/qa/06-visit-phone.png`.
   - Desktop: two columns, hours on the left and address and map link on the right. Today's row is highlighted.
   - Phone: one column, hours first, then "Find us". `scrollWidth` 390 equals `clientWidth` 390, so there is no horizontal scroll. The table is 350 px wide.

## Page head

Title "Visit", description "Opening hours, address and a map link for Harbour Bakery.", `lang="en"`, h1 "Visit" (all read from the fetched server HTML).

## Observations (not bounces)

- The map link measures 20 px tall at 390 px (`getBoundingClientRect`). The nav links use a taller target (`min-h-11` in the source). It is its own line, so the owner may want a bigger tap target on a phone. No acceptance criterion covers it.
- The console shows one error: `/favicon.ico` returns 404. This is outside the diff (the file is not among the three the diff touches) and I did not check whether main has it too.
- The live data is the seed placeholder ("Placeholder address, 1 Example Quay, Exampletown", map link `https://www.openstreetmap.org/`). Real content is the owner's to supply.
- "Today" is computed in the Europe/Lisbon zone. The preview showed Monday marked, which matches today's date, 2026-11-16. I did not test a day boundary in the browser (the unit test covers it).

## Not checked

- Real iPhone and Safari: I tested Chromium only, and Playwright's WebKit is not an iPhone.
- JavaScript turned off in the browser (the server-HTML fetch stands in for it).
- Motion, since the page adds none.
