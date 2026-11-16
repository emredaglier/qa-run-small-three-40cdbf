---
author: qa
verdict: pass
---

# QA: ticket 11-map-link-tap-target (PR #11, commit fe74211)

Tested at https://emres-macbook-pro.tail201ea9.ts.net:4401/visit in the browser tools (Playwright Chromium), at 390x844 and 1280x800. The diff is one file, `apps/web/src/app/visit/page.tsx` (5 insertions, 1 deletion). It only adds `inline-flex min-h-11 items-center` to the link's classes. Read from the checkout.

## Acceptance criteria

1. **Link box at least 44 px tall at 390 px: met.**
   `getBoundingClientRect()` on the "Open the map to find Harbour Bakery" link via `browser_evaluate` at a 390 px viewport: height 44 px, width 284.75 px. Computed `min-height` is 44px and `display` is inline-flex. At 1280 px the height is also 44 px. In the same run the header nav links (Home, Menu, Visit) measure 44 px, so the link now matches them. The font size is unchanged (the diff only touches layout classes).
2. **Link still opens the map URL; fallback still renders; tests not loosened: met, with one limit.**
   - The rendered link is `<a href="https://www.openstreetmap.org/" rel="noopener noreferrer">`: a plain link, no `target`, 0 iframes on the page. That URL is what the preview's `opening-hours` global holds. I did not click it, because the browser reaches only the preview host.
   - The `href` attribute is still the first attribute, so `page.test.tsx:28` (`toContain('<a href="https://maps.example.com/harbour"')`) is unaffected.
   - The diff touches no test file, so no test was loosened. Source check: `page.test.tsx` still has "falls back when hours, address and map link are all missing" and "leaves the map link out when only that is missing". The code path `mapUrl ? (...) : null` is unchanged.
   - Limit: I could not set the global's map link to empty on the preview, so I did not see the missing-link fallback in the browser. It rests on the unchanged source and the unchanged unit tests. I did not run the tests myself (my shell only reads). CI is green per the prompt.
3. **No sideways scroll on /visit at 390 px: met.** `document.documentElement.scrollWidth` = 390 and `document.body.scrollWidth` = 390 against `innerWidth` 390. At 1280 px, scrollWidth is also 1280.
4. **`pnpm lint`, `typecheck`, `test`, `check:assets`: not run by me.** My shell may only read and I run no builds. CI is stated green in the prompt. I report no result of my own.
5. **Owner's eyes at phone width: left to the owner.** Full-page screenshot at 390 px with the link focused: `studio/qa/11-map-link-390.png`.

## Ticket "Do" constraints

- **Plain link, `noopener noreferrer`, no embed, no script:** the link has `rel="noopener noreferrer"` and there are 0 iframes. The diff adds no script.
- **Visible focus ring kept:** after `focus({focusVisible:true})` on the link, `:focus-visible` matches and the computed outline is solid 3px, offset 3px, rgb(143, 63, 18). The screenshot shows the ring around the 44 px box. The ring now surrounds the taller box, which is the expected consequence.
- **Colour transition off under reduced motion:** with `prefers-reduced-motion: reduce` emulated, computed `transition` is `all | 0s`. With `no-preference` it was `color, background-color, text-decoration-color | 0.15s` (the rule in `packages/ui/src/tokens.css:124-132`, unchanged).
- **Other links unchanged:** the diff touches only `page.tsx` and nothing in `packages/ui`. The new classes sit on this one link only.

## Not checked

- iOS Safari and WebKit: not checked. All runs were Chromium. A real iPhone is needed for the actual touch target and how the underline and focus ring sit in the taller box.
- How the link looks in the taller box is for the owner's eyes (the owner checks C1 in the G5 document).

## Tool runs

- Read of `page.tsx` and `tokens.css` in the branch checkout; Grep for `mapUrl` and `.link` in the checkout.
- `browser_evaluate` at 390 px: link height, href, rel, min-height, scrollWidth, iframe count.
- `browser_evaluate` with reduced motion emulated: computed transition.
- `browser_evaluate` focus check: outline style.
- `browser_evaluate` at 1280 px: heights of all links on the page, scrollWidth.
- `browser_take_screenshot`, full page at 390 px.
