---
author: qa
---

# QA rubric report

Merged main at commit e5902467ab747eb38d1114698b1762fdf82dc7af, tested on the live preview at https://emres-macbook-pro.tail201ea9.ts.net:4400/. Pages in the diff-free sweep: home, menu, visit and the 404 page. All lab runs come from one headless Chromium on the studio machine, reached over the tailnet, so timings say nothing about a visitor's network. Each figure is a single run, not a median.

Two early page scripts ran on a blank page after the browser reset, so I threw their output away and re-ran everything on the real page. A byte-sum script I ran late read zero for cached files, so I threw that away too. The byte totals below are my own sum of the per-file sizes from t2.

## Tool runs

- t1: browser_navigate to the home page, then read the accessibility snapshot file it saved.
- t2: browser_evaluate on the home page: navigation timing, LCP and layout-shift observers (buffered, half a second), paint entries, per-file resource transfer sizes.
- t3: browser_evaluate on the home page: head meta and link tags, JSON-LD, heading counts, landmarks, images, script tags, DOM node count.
- t4: browser_evaluate on the home page: fetch of the home, menu, visit, robots.txt, sitemap.xml, a missing page, /admin and /api/x, reading status, headers, title, h1 and description.
- t5: browser_evaluate on the home page: text contrast for sampled elements, walking up each element's parents to the first opaque background and flattening any translucent layers (the playbook lesson on transparent backgrounds).
- t6: Bash cat of the browser console log saved after t4.
- t7: browser_resize to the phone viewport, then browser_evaluate on the home page: horizontal overflow and the size of each link.
- t8: browser_take_screenshot, full page, home page, phone viewport, saved under studio/qa/.
- t9: browser_navigate to /menu at the phone viewport, then browser_evaluate: overflow, headings, link sizes, transitions.
- t10: browser_navigate to /visit at the phone viewport, then browser_evaluate: overflow, headings, link sizes and attributes, main text.
- t11: browser_press_key Tab on /visit, then browser_evaluate on the focused element: outline, focus-visible state.
- t12: browser_emulate_media reduced motion on, then browser_evaluate on /visit: stylesheet fetch and scan for media queries, keyframes, transitions, view transitions, canvas elements, and which elements still transition.
- t13: browser_resize to the desktop viewport, then browser_take_screenshot of the home page, saved under studio/qa/.
- t14: browser_evaluate installing an event-timing observer on the home page, then two Tab key presses and a read-back of the observer.
- t15: browser_evaluate on the home page: user agent, raw server HTML checked for content text and script tags, the 404 page's markup, font loading state.

## Performance (20)

- Score: 17 of 20 [t2, t3, t15]
- First paint and first contentful paint both came at 84 ms, and the LCP element is a paragraph, so no image or heavy asset sets the LCP. Lab figure, single run [t2].
- Time to first byte 37 ms, DOMContentLoaded 56 ms, load 103 ms, on a local tailnet link [t2].
- Page weight on a fresh load, summing the per-file sizes: HTML 4,425 bytes, CSS 4,591 bytes, fonts 57,344 bytes (two woff2 files), icon 793 bytes, JavaScript 141,228 bytes across seven files; total 208,381 bytes [t2].
- The two largest JS chunks are 64,355 bytes and 67,353 bytes of the 141,228 bytes. For a page with no interactive widgets that is most of the weight, and it is where I took points off [t2].
- No images on any page I loaded, so no image format, sizing or lazy-loading to judge [t3, t9, t10].
- Both font files are preloaded from the HTML and use font-display swap, and no layout shift was recorded [t3, t15, t2].
- Every page I fetched, the 404 included, answers with a no-store cache header, so the HTML is never cached by the browser. I did not read the cache headers of the static files, so I make no claim about them [t4].
- Not measured: a throttled-network run, a Lighthouse score, real-user field data.

## Mobile (20)

- Score: 17 of 20 [t7, t9, t10, t8]
- The viewport meta tag is present and sets the device width [t3].
- Home, menu and visit have no horizontal overflow at the phone width: the page scroll width equals the viewport width on each [t7, t9, t10].
- The cards stack to one column, the day chips wrap cleanly and nothing is cut off in the full-page phone screenshot [t8].
- Body text is 17 px, so it needs no zoom [t7].
- Taps: the nav links are 44 px tall and the "See the full menu" button is 44 px tall [t7]. Two links are shorter. The "Open the map" link on the visit page is 20 px tall, and the logo link in the header is 31 px tall. The map link is the one below the common 44 px target size [t10, t7].
- Not checked: touch behaviour, scroll feel and safe-area insets on a real phone; Playwright's browser is not an iPhone.

## Semantics and SEO (20)

- Score: 13 of 20 [t3, t4, t9, t10]
- The html element carries a language, and each page has its own title and its own meta description: Harbour Bakery, Menu, Visit [t3, t4].
- Each page has exactly one h1 and the heading order holds without skipped levels: home h1, h2, h3; menu h1, h2; visit h1, h2 [t3, t9, t10].
- Landmarks are in place: header, nav, main and footer, and a skip link comes first [t3, t1].
- A missing URL returns a real 404 status with a "Not found" title, an h1 and a way back home, and /admin and /api/x also return 404 [t4, t15].
- Missing: robots.txt and sitemap.xml both return 404; no canonical link; no Open Graph tags; no structured data, though a bakery with opening hours and an address is a natural fit for LocalBusiness data [t4, t3].
- The home description reads "Placeholder description for Harbour Bakery.", so it is still placeholder copy [t4].
- Content is in the server HTML without JavaScript: the bread names, "This week" and the opening line are all present in the raw response [t15].

## Animation (15)

- Score: 7 of 15 [t12, t9]
- There is almost no motion to judge. No canvas or WebGL element, no keyframe animations and no view transitions [t12].
- The one effect is a short colour, background and underline transition on interactive elements; it is switched off under reduced motion [t12, t9].
- With reduced motion on, no element transitions [t12].
- The score reflects how little there is, not a fault. Whether a motion concept is wanted is the owner's call.
- Frame times: not measured.
- How the motion feels, its easing, timing and polish: needs your eyes.

## Markup (15)

- Score: 12 of 15 [t3, t15, t9, t10]
- The page is a small, clean tree: 107 elements on the home page, real lists for the breads and the baking days, real links, an article per bread [t3, t1].
- No images, so no alt or size attributes to get wrong [t3].
- The external map link carries noopener and noreferrer [t10].
- I did not run an HTML validator, so the score rests on reading the structure, not on a validation result. Not checked.
- On /visit the main text reads "Opening hours" twice in a row. I did not look into the cause; it may be a visually hidden table caption under the heading [t10].
- Each baking day appears as a short and a full name ("Mon", "Monday"). Whether a screen reader reads both was not checked [t1].

## Accessibility (10)

- Score: 9 of 10 [t5, t11, t12, t7, t10]
- Contrast, each measured against the opaque background found by walking up the parents, so no ratio was taken against a transparent value [t5]:
  - Headings, nav and body text, dark brown on cream (rgb 251, 245, 234): 15.31 to 1 [t5].
  - Intro paragraph under the h1, on the same cream: 7.78 to 1 [t5].
  - Bread description, on the card colour (rgb 243, 232, 211): 6.96 to 1 [t5].
  - Day chips, rust on the card colour: 5.99 to 1, the lowest I sampled, at 15 px semibold [t5].
  - "See the full menu" button, cream text on rust (rgb 143, 63, 18): 6.89 to 1 [t5].
  - Footer name, cream on dark brown (rgb 42, 27, 18): 15.31 to 1 [t5].
- All sampled text is above 4.5 to 1. I sampled the first element of each kind, not every element [t5].
- The first Tab stop is the skip link, and it shows a 3 px rust outline with a 3 px offset; the focus ring on the logo is also visible in the screenshot [t11, t13].
- Reduced motion is respected [t12].
- Not checked: an axe run, a screen reader, zoom to a large size, forced colours.

## Core Web Vitals

- LCP: 84 ms in a lab run on the home page, a paragraph element; under the 2.5 s target. Lab figure, one run [t2].
- CLS: 0 over the page load, under the 0.1 target [t2].
- INP: not measured. A short Tab-key sample logged one keydown event at the observer's minimum threshold, which is not an INP, and the page has no click handlers worth timing [t14].

## Browsers

- Chrome latest: HeadlessChrome 157 run through the browser tools; every measurement above comes from it [t15].
- Chrome previous: not checked, only one Chromium build was available.
- Safari: not checked, the browser tools only gave Chromium.
- Firefox: not checked, the browser tools only gave Chromium.
- iOS Safari: not checked, needs your eyes on a real iPhone.
