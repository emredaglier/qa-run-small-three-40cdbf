---
author: qa
verdict: pass
---

# QA report: 03-design-in-code (PR #2, commit 7b30d6c)

Preview: https://emres-macbook-pro.tail201ea9.ts.net:4400/ at 1280x720 and 390x844 in the browser tools (Chromium). Pages reachable: `/` and the 404 page (`/menu` and `/visit` do not exist yet, tickets 05 and 06). Verdict: **pass**. Nothing failed an acceptance criterion; what I could not check is listed below.

## Acceptance criteria

### 1. Components render complete HTML with JavaScript off. Unit tests check structure, not look.
- Fetched `/` as raw server HTML and removed the `<script>` tags. It holds the skip link (`href="#main"`), `<header>`, one `<main id="main">` (1 `<main>` found), one `<h1>` ("Harbour Bakery"), the nav links Home, Menu and Visit, `<footer>`, and the page intro text. Home carries `aria-current="page"` in the server HTML. Pass.
- The same fetch of `/menu` returns status 404 with `<h1>Page not found</h1>` in the server HTML. Pass.
- Read `packages/ui/src/components.test.tsx`. It uses `renderToStaticMarkup` and asserts structure only (nav links, `aria-current`, address block left out when empty, one h1, one chip per day, one row per day, "Closed", one today row). No look, layout or motion specs. Pass. I read the tests; I did not run them.
- Not checked in the browser: `BreadItem`, `HoursTable`, `ButtonLink` and a footer with address and hours are not rendered by any page yet (pages are tickets 04 to 06). I read their source (`BreadItem.tsx`, `HoursTable.tsx`, `SiteFooter.tsx`, `links.tsx`) and the unit tests above, but never saw them in a browser.
- Not checked: `aria-current` on Menu and Visit. `/menu` 404s, and on the 404 page no nav item is marked (expected, since it is outside the nav). `isCurrent` is covered by the unit test, which I read and did not run.

### 2. Contrast is AA for text tokens (state how you checked). Focus is visible on every interactive element.
- README states its method: ratios computed from the hex values. I recomputed all 14 pairs in its table in the page with a script (relative luminance from the hex values). All 14 match the README to two decimals (for example ink on cream 15.31, ink-soft on cream 7.78, crust on cream 6.70, on-crust on crust 6.89, crust on highlight 5.56, sand on ink 11.64). The lowest text pairing is crust on highlight at 5.56, above 4.5. `line` on cream is 1.57; the README limits it to dividers and the code uses it only for borders. The 10 `--color-*` custom properties read from the live page equal the hex values used.
- Rendered text, measured against the real background found by walking up the ancestors (playbook lesson on transparent backgrounds): h1 `rgb(42,27,18)` on `rgb(251,245,234)` = 15.31; intro `rgb(94,73,56)` on the same = 7.78; body paragraph 15.31; inactive nav link 7.78; current nav link 15.31; footer name `rgb(251,245,234)` on `rgb(42,27,18)` = 15.31; skip link 15.31; the 404 text link `rgb(143,63,18)` on `rgb(251,245,234)` = 6.70. All above 4.5.
- Focus: Tab from the page start puts focus on "Skip to content" and it slides into view (top 12px, `transform: none`) with a `3px solid rgb(143,63,18)` ring offset 3px (screenshot `studio/qa/03-skip-focus.png`). Focusing each link in turn (Skip to content, Harbour Bakery, Home, Menu, Visit): `:focus-visible` matches and the outline is `solid 3px rgb(143,63,18)` on all 5. That ring is 6.70 against cream (3:1 is needed for a UI outline). The nav links measured 44px high at 390px wide (Home 71, Menu 67, Visit 58 px wide).
- Not checked: the footer ring override (`--focus-ring` = flour on ink). The footer has no interactive element on any page yet. The `.btn` focus ring has no page to show it on, but it is the same global `:focus-visible` rule.

### 3. Fonts and assets stay within `pnpm check:assets` without raising the limit.
- I did not run `pnpm check:assets`: my shell only reads and this turn may not start builds or checks. Not run, not claimed as passed. CI is green per the prompt.
- What I could check: the diff list holds no image or video file and does not touch `scripts/assets-budget.ts`, so the limits are not raised. The fonts are variable woff2 files from `next/font/google` (`packages/ui/fonts.ts`, the only font definition in the diff). The page loads 2 woff2 files, 36560 and 20184 bytes, and 1 stylesheet of 15227 bytes (page script fetching each loaded resource and reading the byte length). They come from the preview's own origin (`/_next/static/media/...`), and no other host was called. `document.fonts` shows Fraunces and Figtree loaded; h1 computes to Fraunces and body to Figtree. The asset budget in `assets-budget.ts` covers images and videos only, so these files are outside it.

### 4. `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm check:assets` pass, each result reported.
- I did not run any of the four (read-only shell, no builds). Not run by me. CI green is the only evidence, and it comes from the prompt. The producer's own reported results are not in what I was given.

### 5. Owner's eyes.
- Looks as intended in my screenshots (`studio/qa/03-home-desktop.png`, `03-home-phone.png`, `03-404-phone.png`): warm cream page, dark serif headings, current nav item bold with a crust underline, dark footer. At 390px the page is 390px wide (`scrollWidth` 390 = `clientWidth` 390), with no horizontal scroll.
- The look is the owner's call at G4. I did not judge taste.

## Other checks
- Light transitions only: with `prefers-reduced-motion: reduce` emulated, transition duration on the link, nav link and skip link computes to 0s, and 0 elements have an animation. Without it, the link and nav link transition colour, background-color and text-decoration-color over 0.15s. Hover was not exercised with a pointer, and how the fade feels needs the owner's eyes.
- No WebGL or JS motion in the diff.
- Console: 1 error on every load, `GET /favicon.ico` 404. The diff does not touch icons, so I treat it as present on main and did not check main. Not a finding for this ticket.
- Tab order checked on `/`: skip link, site name, Home, Menu, Visit.

## Not checked
- iOS Safari and WebKit: not opened. Only Chromium was used.
- The components not yet used by any page (see criterion 1).
- Menu and Visit current-page marking in the browser (pages missing).
- `pnpm lint`, `typecheck`, `test`, `check:assets` (not run by me).
