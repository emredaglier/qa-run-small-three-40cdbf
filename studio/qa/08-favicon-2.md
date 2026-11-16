---
author: qa
verdict: pass
---

# QA 08-favicon, round 2

Ticket 08-favicon, PR #8, commit a98b7b7. Preview: https://emres-macbook-pro.tail201ea9.ts.net:4400/. Diff: one file, `apps/web/src/app/icon.svg`.

## Acceptance criteria

1. **No favicon 404 on `/` and on the 404 page: met.**
   - `/` at desktop width: console had 0 messages after load (browser_console_messages, all). The page head has one `<link rel="icon" type="image/svg+xml" sizes="any" href="/icon.svg?e0618f5982a25b9d">` (browser_evaluate). The network list shows `GET /icon.svg?e0618f5982a25b9d => 200`, and no `/favicon.ico` request.
   - `/` at phone width (390x844): reload, 0 console messages, the icon request is 200.
   - 404 page (`/no-such-page-qa`, HTTP 404, title "Not found") at desktop and at phone width: same `<link rel="icon">`, icon request 200, no `/favicon.ico` request. The one console error there is the document's own 404 status (`Failed to load resource ... /no-such-page-qa`). It is the intended not-found response, not a favicon error.
   - The icon route serves `image/svg+xml`, 200, `cache-control: public, max-age=0, must-revalidate` (fetch in the page).
2. **Asset-weight budget not raised: met by reading the diff.** The diff touches only `icon.svg`, so no budget file changed. The served icon is 493 characters long (fetch in the page, `text().length`). I did not run `pnpm check:assets` (my shell is read-only for this turn); CI is green per the prompt.
3. **`pnpm lint`, `typecheck`, `test`, `check:assets`: not run by me.** CI is green per the prompt. A direct run of these is not my check.
4. **Owner's eyes: the mark.** It is an "HB" monogram drawn as strokes on a rounded square. Fill `#8f3f12` and stroke `#fff8ec` equal `--color-crust` and `--color-on-crust` in `packages/ui/src/tokens.css` (Grep). The file has no `filter` element (Grep, 0 matches). How it looks is the owner's call at G4. I did not judge the look.

## Ticket requirements from "Do"

- Icon lives in `apps/web`, in the Next app icon convention (`app/icon.svg`). No Apple icon or manifest was added (Glob of `apps/web/src/app`).
- Served from the app icon route, so the browser no longer asks for `/favicon.ico` when a page has the link.

## Residual, not a failure

- `GET /favicon.ico` itself still returns 404 (fetch in the page, text/html, 404 page body). A document without a `<link rel="icon">` still logs the error: opening `/icon.svg` directly in the browser logged `Failed to load resource ... /favicon.ico 404`, because a bare SVG document has no head. Every HTML page checked has the link, so a visitor to a page does not see it. The ticket allowed "the app icon route", so this is not a bounce. Crawlers and tools that probe `/favicon.ico` directly will still get a 404.
- That direct navigation to `/icon.svg` timed out once at 30 s in browser_navigate, although the page then loaded (screenshot call ran on `/icon.svg`). The in-page fetch of the same URL returned 200 at once. I did not diagnose it. A page that links the icon loads it with 200, so I treat it as a navigation quirk of opening a bare SVG in this tool.

## Not checked

- Safari, Firefox and iOS Safari: not checked. Only the Playwright browser ran. Safari uses the SVG icon differently (it may prefer a PNG or an Apple touch icon), and a real iPhone needs the owner's eyes.
- Pages other than `/` and the 404 page: not visited, because the diff touches no shared layout.
- Showing the icon in a browser tab: headless, so not seen.
