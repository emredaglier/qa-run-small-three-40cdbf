---
author: qa
verdict: pass
---

# QA: 10-header-nav-prefetch (PR #10, commit 78cc4fc)

Preview: https://emres-macbook-pro.tail201ea9.ts.net:4400/ — tested at a desktop width (the browser's default) and 390 x 844.

## Acceptance criteria

1. **No `prefetch={false}` and no "drop it with tickets 05, 06" comment in `packages/ui/src/SiteHeader.tsx`.** Met. I read the whole file in the branch checkout: the Menu and Visit links come from `nav.map`, and the `<Link>` has no `prefetch` prop and no `shortcut:` comment. A Grep for `prefetch|drop it with tickets|shortcut:` over the checkout (excluding node_modules, .next and .git) found nothing in `packages/ui` or `apps`. The only hits are in `smoke/failure-rules.ts` and `smoke/failure-rules.test.ts`, which handle cancelled `_rsc` prefetches and are unrelated to this ticket. The ticket's second "Do" item (no other `prefetch={false}` in `packages/ui`) is therefore met too.
2. **Existing `SiteHeader` tests still pass and were not loosened.** Glob for `*SiteHeader*` under `packages` found only `SiteHeader.tsx`, so no `SiteHeader` test exists. The diff is two deleted lines in one file, so no test was touched. I did not run the unit tests myself; CI is reported green.
3. **`pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm check:assets` pass.** Not run by me. My shell only reads, and the builder's results are not in my prompt. The only evidence is that CI is green, per my prompt. I did not verify the builder's per-command report.

## Visitor checks (browser)

- Home at desktop: the header nav has Home `/` (aria-current=page), Menu `/menu` and Visit `/visit`. A `fetch` of each returned 200 (page script).
- The network list after loading Home shows `/menu?_rsc=…` and `/visit?_rsc=…` prefetch requests, all 200. These are the behaviour the ticket enables, and no 404s appeared.
- Clicking Menu at desktop navigated to `/menu` (title "Menu").
- At 390 px: `/menu` has `aria-current=page` on Menu only, h1 "Menu", no horizontal overflow (`scrollWidth > innerWidth` is false). Clicking Visit navigated to `/visit` (title "Visit").
- Console messages (warning level and above) after these steps: 0 errors, 0 warnings.

## Not checked

- Real iPhone / iOS Safari. Playwright's engine is not an iPhone.
- Look and motion were not judged. The diff changes no styling.
- Whether the Next.js production build's prefetch timing differs from the preview. I did not measure prefetch timing.
