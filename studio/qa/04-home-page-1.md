---
author: qa
verdict: pass
---

# QA: 04-home-page (PR #7, commit c5852939)

Tested at https://emres-macbook-pro.tail201ea9.ts.net:4401/ in the Playwright browser, at 1440x900 and 390x844. Source read at `tickets/04-home-page/apps/web/src/app/page.tsx` and `page.test.tsx`.

## Acceptance criteria

1. **All content renders on the server and is complete with JavaScript off (ADR-0008): met.**
   I could not switch JavaScript off in these tools. As a stand-in I fetched `/` with `fetch` from the page and parsed the raw server HTML. It already holds the h1 "Harbour Bakery", the tagline, the intro paragraph, the h2 "This week" with 3 bread articles and their days, the link `/menu`, the h2 "Today" with "Open today (Monday), 07:00–15:00." and the link `/visit`. Title is "Harbour Bakery", description comes from the Site global ("Placeholder description for Harbour Bakery."). Exactly one h1. Response is 200 with `cache-control: private, no-cache, no-store` (consistent with `force-dynamic`). Not a true JS-off run.
2. **No breads or missing hours still renders with a sensible line and no empty block, covered by a unit test: met.**
   Read in `page.test.tsx`: "still renders on an unseeded database…" sets `site = {}`, `breads = []`, `hours = {}`. It expects an h1, "breads will be listed soon", "opening hours are on the Visit page" and no `<ul`. `page.tsx` has the matching branches (lines 51–65 and 78–82). Further tests cover closed day, a day without times, and the Lisbon day vs. server zone. I did not run the tests myself (my shell only reads); CI is stated green. On the live page I confirmed no empty element sits inside `<main>` (script returned an empty list). The empty-data states themselves I could not drive live, as the preview has seeded data.
3. **`page.test.tsx` updated for the new structure, no look or layout assertions: met.**
   Read the file: assertions are on text, `<h1`, `href` and `<ul` absence only. No class names, sizes or styles.
4. **`pnpm lint`, `typecheck`, `test`, `check:assets` pass with each result reported: not checked by me.**
   I do not run them in this role. CI is stated green in my prompt. The ticket's own report of each result is the builder's, which I did not review.
5. **Owner's eyes at mobile and desktop: pending the owner.**
   Screenshots for the owner: `studio/qa/04-home-page-1-desktop.png` (1440 wide) and `studio/qa/04-home-page-1-phone.png` (390 wide). Desktop shows 3 cards in a row; phone stacks them. On the phone, `scrollWidth` is 390 = `innerWidth` 390, so no horizontal overflow. The "See the full menu" button measures 182x44 px (page script). The inline "Visit us" link is 56x20 px, a link inside a sentence.

## Other observations (not failures)

- `/menu` and `/visit` both return 404 on this preview (fetch). The home page links to them with `prefetch: false`, per the builder's comment in `page.tsx:13` that tickets 05 and 06 will remove it. Expected until those merge.
- Console shows one error: `/favicon.ico` 404. The diff does not touch it, so it comes from the shared layout or starter.
- "Today" resolves to Monday, matching the Lisbon day from the browser (`toLocaleDateString` with `Europe/Lisbon`, 2026-11-16).
- Hours text "07:00–15:00" comes from `getOpeningHours()`. I could not compare it with the Visit page, since it does not exist yet.
- Not checked: iOS Safari / a real iPhone, and Firefox and WebKit engines (only the one browser in these tools was used). Motion: none was added by this diff.
