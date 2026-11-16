---
author: qa
verdict: pass
---

# QA 09-home-links-prefetch, round 1

Commit 8085e014a9ba6e4f4d4d4b7b4c8e78ffac02cb0a, PR #9, preview https://emres-macbook-pro.tail201ea9.ts.net:4400/

## Acceptance criteria

1. **No `prefetch: false` and no "remove when 05/06 merge" comment in `apps/web/src/app/page.tsx`: met.**
   I read the whole file in the branch checkout. The `ButtonLink href="/menu"` (line 64) and `TextLink href="/visit"` (line 78) carry no `prefetch` prop, and no comment about 05/06 remains. A Grep of `apps/web/src` (case-insensitive) for `prefetch`, `05/06` and `merge` found no match.
2. **`page.test.tsx` still passes and was not loosened: partly checked.**
   I read `apps/web/src/app/page.test.tsx`. It still asserts `href="/menu"`, `href="/visit"`, the teaser count, the Lisbon day and the unseeded fallback. The diff touches only `page.tsx`, so the test file is unchanged by this branch. I did not run the test: my shell is read-only and I do not start the test runner. I rely on the green CI for the pass itself.
3. **`pnpm lint`, `typecheck`, `test` and `check:assets` pass, each result reported: not checked by me.**
   I ran none of them. CI is green according to my prompt, and I have not seen the builder's per-command results. HQ should look for them in the PR.

## What a visitor gets (browser, preview URL)

- **Desktop, 1280x720 default viewport:** the home page loads and the title is "Harbour Bakery". The only console error is `favicon.ico` 404. The diff does not touch that, so it is not a finding for this ticket.
- **Prefetch is back on the home links.**
  - On load, the browser makes two `/menu?_rsc=…` requests with the `next-router-prefetch: 1` header (network requests 12 and 13). That is the "See the full menu" button prefetching.
  - The `Visit us` link sits at y=936, below the 720 px fold. After I scrolled it into view and waited 2 s, `performance.getEntriesByType('resource')` listed two `/visit?_rsc=…` requests, with the same ids as the `/menu` ones. So both home links prefetch once they are visible.
  - The header Menu and Visit links did not prefetch. `packages/ui/src/SiteHeader.tsx:27` still sets `prefetch={false}` (see the observation below).
- **Navigation:** clicking "Visit us" on desktop landed on `/visit` (title "Visit"). At 390x844 I clicked "See the full menu" and landed on `/menu` (title "Menu"), then "Visit us" and landed on `/visit`. The console showed no errors on the phone-width run.
- **Not checked:** iOS Safari and WebKit. I ran Chromium only. I took a full-page desktop screenshot (`studio/qa/09-home-desktop.png`) but did not judge visuals, since the diff changes no markup or styles.

## Observation, not a bounce

`packages/ui/src/SiteHeader.tsx:26-27` still has `prefetch={false}` with the comment "shortcut: no prefetch while /menu and /visit are missing (404s fail smoke); drop it with tickets 05, 06." It is the same workaround for the same reason, and 05 and 06 are now merged. The ticket's search instruction covers `apps/web` only, so this is outside its criteria and I did not bounce. The producer may want a follow-up ticket, or to widen 09, so the header nav prefetches too.
