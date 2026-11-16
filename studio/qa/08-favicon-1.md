---
author: qa
verdict: bounce
---

# QA 08-favicon, commit 4ffc41d

Preview: https://emres-macbook-pro.tail201ea9.ts.net:4400/ at 1280-wide desktop default and 390x844 phone. Diff: one new file, `apps/web/src/app/icon.svg`. Playbook: no topic matched (no Playwright specs, view transitions or focus work).

## Findings

### F1: the icon is not valid XML, so it does not render (criterion: "a site icon … served from the path the browser asks for")

- Page: `/icon.svg`, the file the `<link rel="icon">` on `/` and on the 404 page points to. Viewport: both widths, same file.
- Steps:
  1. Open `/`. The head holds `<link rel="icon" href="/icon.svg?fd22b027af3418cc" type="image/svg+xml" sizes="any">`. It answers 200, `image/svg+xml`, 449 bytes (page `fetch`).
  2. Open `/icon.svg` directly. Run in the page: `new DOMParser().parseFromString(text, 'image/svg+xml')`, then load the URL into `new Image()`.
- Expected: the HB monogram on a crust-coloured tile, decoding as an image.
- Saw: the browser shows "This page contains the following errors: error on line 2 at column 82: Unexpected token '--' before 'c'". The parser returns a `parsererror`, and `Image.onerror` fires (`loaded: false`). Screenshot: `studio/qa/08-favicon-icon.png`.
- Cause: line 2 of `icon.svg` is the comment `<!-- Placeholder "HB" monogram … Colours: --color-crust, --color-on-crust. -->`. XML forbids `--` inside a comment, and the comment names the CSS tokens `--color-crust` and `--color-on-crust`. The shapes on lines 3 and 4 are never reached. The fix belongs to the builder (reword the comment without `--`, or drop it).
- Effect: no visitor gets the mark. A tab that cannot decode the icon may fall back to asking `/favicon.ico`, which is still a 404 (see F2).

### F2: `/favicon.ico` still answers 404 (observed, not a separate failure of the criterion)

- `fetch('/favicon.ico')` from `/` returned 404, `text/html`, 9038 bytes. That is expected: the branch serves `/icon.svg` and adds no `/favicon.ico`.
- Console on a plain load of `/` (desktop and phone width) and on `/does-not-exist-qa`: no favicon 404. The only console error on the 404 page is the page's own 404 document. The `/favicon.ico` errors I did see came from my own `fetch` and from opening the bare `/icon.svg` document, which has no icon link of its own.
- Caveat: this browser did not request `/favicon.ico` by itself while an icon link was present. Because the icon fails to decode (F1), I could not check what a headed Chrome, Safari or Firefox tab does. That is not checked. Once F1 is fixed, the console check should be run again on `/` and on the 404 page.

## Criteria

- Console shows no favicon 404 on `/` and on the 404 page: no favicon 404 seen at either width (see F2 caveat). Passes in this browser only because it never requests the fallback; the icon itself is broken, so I do not count the ticket as met.
- Colour tokens from 03: the fills `#8f3f12` and `#fff8ec` equal `--color-crust` and `--color-on-crust` in `packages/ui/src/tokens.css` lines 9 and 11 (Grep). No SVG filters (read the 5-line file). Met on the source, but the file does not render (F1).
- Asset-weight budget not raised: the diff touches one file, `icon.svg`, and no budget script. Met by diff. I did not run `pnpm check:assets` (my shell only reads, and CI is reported green).
- `pnpm lint`, `typecheck`, `test`, `check:assets`: CI is green per the prompt. I did not run them. Note that none of them parse the SVG, which is how F1 got through.
- Owner's eyes: the mark could not be seen, so there is nothing yet to judge at G4.

## Not checked

- Real tab icon display in headed Chrome, Safari, Firefox. Playwright's WebKit is not an iPhone: iOS Safari and Apple touch icon behaviour are not checked (touch icon is out of scope).
