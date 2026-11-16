---
author: qa
verdict: pass
---

# QA: 05-menu-page (PR #6, commit 78eb02d)

Tested at https://emres-macbook-pro.tail201ea9.ts.net:4400/menu in the browser tools, at 1280x800 and 390x844. I read the branch source in `tickets/05-menu-page`. I did not run the pnpm checks (my shell only reads). CI is green per the prompt.

## Acceptance criteria

1. **Content renders on the server and is complete with JavaScript off (ADR-0008): met.**
   - I did not run a JS-disabled browser. I fetched `/menu` from inside the page (`browser_evaluate`, `fetch` plus `DOMParser`) and read the raw server HTML.
   - It returned status 200 with one `h1` ("Menu"), the intro paragraph, 4 `article` elements and 4 `h2` bread names.
   - The `main` content has no `hidden` attribute and no inline `opacity:0`.
   - The bread names, descriptions and day chips are all in that HTML.
   - `page.tsx` is an async server component with no `'use client'`.
2. **Real list markup: met.**
   - The accessibility snapshot shows a `list` in `main` with 4 `listitem`s, each holding an `article`.
   - Inside each article, the days are a nested `list "Baked on"`.
   - Each day chip shows "Mon" with the full name "Monday" for screen readers.
3. **Empty state (unit test): met, checked by reading only.**
   - `page.test.tsx` renders with `breads = []` and expects the `h1`, the text "check back soon" and no `<ul`.
   - `page.tsx` shows a `<p>` when `breads.length` is 0.
   - I could not see the empty state in the preview, because it has seed breads. I did not run the unit test; CI covers it.
4. **Route sweep finds `/menu`: met, checked by reading only.**
   - `smoke/routes.ts` discovers every `page.tsx` under `apps/web/src/app`, and `menu/page.tsx` is there.
   - The diff adds no API or admin route, so `routes.test.ts` has nothing to trip on. I did not run it.
5. **`pnpm lint`, `typecheck`, `test`, `check:assets`: not checked by me.** CI is green per the prompt; I did not run them.
6. **Owner's eyes at mobile and desktop:** screenshots are in `studio/qa/05-menu-page-1-desktop.png` and `studio/qa/05-menu-page-1-mobile.png`. Whether the look is right is the owner's call.

## Ticket "Do" items

- **Set order:** `getBreads` sorts by `_order` (`apps/web/src/data/breads.ts`). The page lists sourdough, rye, baguette, cardamom bun, which is the order in the server HTML. I could not compare it with the editor's order in the CMS, so I only know the page keeps the order the read returns.
- **Name, description, days:** all three appear on every bread.
- **Heading, intro and metadata:**
  - The `title` is "Menu" and the meta description is set.
  - The page has one `h1`, and the bread names are `h2`, so the heading order is sound.
  - There is no canonical link and no `og:title` on this page. The ticket does not ask for them, so I raise no finding. That may come from the shared layout.
- **`force-dynamic`:** the page exports it, and the response header is `cache-control: private, no-cache, no-store, max-age=0, must-revalidate`. It reads `getBreads()`, which is wrapped in `unstable_cache` (tag-cached).

## Layout

- **Desktop, 1280 wide:** a two-column card grid. The nav marks "Menu" as the current page.
- **Phone, 390 wide:** one column. `scrollWidth` is 390 and `clientWidth` is 390, so nothing scrolls sideways. The grid column is 350px (a page script reading the computed style). Day chips wrap inside the card.
- **Emulation limits:** I ran Playwright's engine at a phone width. I did not check an iPhone or Safari.

## Observations (no finding)

- The console showed 1 error: a 404 for `/favicon.ico`. The diff does not touch it, and the branch has no `apps/web/public` folder, so it comes from the starter, not this ticket.
- The nav links to `/visit`. I did not test it, as it is outside this diff.
- Motion: the diff adds none.
