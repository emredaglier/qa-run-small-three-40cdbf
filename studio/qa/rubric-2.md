---
author: qa
---

# QA rubric report

Merged main at commit c8d1db47815cd469588728641d6e970dbf3afb02, tested on the live preview at https://emres-macbook-pro.tail201ea9.ts.net:4400/. Pages swept: home, menu, visit and the 404 page. All lab runs come from one headless Chromium on the studio machine, reached over the tailnet, so timings say nothing about a visitor's network. Each figure is a single run, not a median.

Contrast was measured with the playbook lesson in mind: each ratio is taken against the opaque background found by walking up the parents (t6), never against a transparent value. The text colours and backgrounds are written next to each ratio.

Page weights are my own sum of the per-file transfer sizes from t3. Phone-width runs use a 375 px wide viewport; desktop runs use 1440 px.

## Tool runs

- t1: browser_navigate to the home page at desktop width, then read the accessibility snapshot file it saved.
- t2: browser_evaluate on the home page: navigation timing, paint entries, LCP and layout-shift observers (buffered, half a second), per-file resource transfer sizes, user agent.
- t3: browser_evaluate on the home page: sum of transfer sizes by file type, head meta and link tags, JSON-LD, headings, landmarks, images, script tags, DOM node count.
- t4: browser_evaluate on the home page: fetch of the home, menu, visit, robots.txt, sitemap.xml, a missing page, /admin, /api/x, a web manifest, favicon.ico, icon.svg, an Open Graph image path and llms.txt, reading status, headers, title, h1, description, canonical, Open Graph and JSON-LD.
- t5: Bash cat of the browser console log saved after t4.
- t6: browser_evaluate on the home page: text contrast for sampled elements, walking up each element's parents to the first opaque background and flattening translucent layers.
- t7: browser_evaluate on the home page: fetch of the stylesheet and scan for media queries, keyframes, transitions, view transitions and focus styles; fetch of the raw server HTML checked for content text with script tags removed; font loading state.
- t8: browser_evaluate on the home page installing an event-timing observer.
- t9: browser_press_key Tab on the home page.
- t10: browser_evaluate reading the focused element: text, outline, focus-visible state, observer entries.
- t11: browser_resize to the phone viewport.
- t12: browser_evaluate on the home page at phone width: horizontal overflow, link sizes, body font size, smallest text size, viewport meta.
- t13: browser_take_screenshot, full page, home page, phone width, saved as studio/qa/rubric-2-home-375.png.
- t14: browser_navigate to /menu at phone width, then browser_evaluate: overflow, headings, link sizes, images, node count, landmarks.
- t15: browser_navigate to /visit at phone width, then browser_evaluate: overflow, headings, link sizes and attributes, table, caption and address elements, main text.
- t16: browser_emulate_media reduced motion on, then browser_evaluate on /visit: caption size and position, how many links, buttons and list items still transition, the map link's transition duration; then reduced motion back to no preference.
- t17: browser_resize to the desktop viewport, then browser_evaluate on /visit installing an event-timing observer and dispatching a synthetic hover.
- t18: browser_take_screenshot, full page, /visit, desktop width, saved as studio/qa/rubric-2-visit-1440.png.
- t19: browser_click on the Menu nav link from /visit, then browser_evaluate reading the observer from t17.

## Performance (20)

- Score: 17 of 20 [t2, t3, t7]
- First paint and first contentful paint both came at 184 ms, and the LCP element is a paragraph of 29,952 px² area, so no image or heavy asset sets the LCP. Lab figure, single run [t2].
- Time to first byte 149 ms, DOMContentLoaded 175 ms, load 197 ms, over the tailnet link [t2].
- Page weight on a fresh load, summing per-file transfer sizes: HTML 4,408 bytes, CSS 4,597 bytes, fonts 57,344 bytes (two woff2 files), icon 793 bytes, JavaScript 141,228 bytes across seven files; total 208,370 bytes [t2, t3].
- The two largest JS chunks are 64,355 bytes and 67,353 bytes of the 141,228 bytes. For a page with no interactive widgets that is most of the weight, and it is where I took points off [t2].
- No images on any page I loaded, so no image format, sizing or lazy-loading to judge [t3, t14, t15].
- Both font files are preloaded from the HTML and use font-display swap, and no layout shift was recorded [t3, t7, t2].
- The HTML of every page I fetched answers with cache-control "private, no-cache, no-store", so the browser never caches the HTML and each visit pays the full HTML response [t4]. The icon answers "public, max-age=0, must-revalidate" [t4]. I did not read the cache headers of the hashed static files, so I make no claim about them.
- The HTML is gzip-compressed [t4].
- Not measured: a throttled-network run, a Lighthouse score, real-user field data.

## Mobile (20)

- Score: 18 of 20 [t12, t14, t15, t13]
- The viewport meta tag is present and sets the device width with an initial scale of 1 [t12].
- Home, menu and visit have no horizontal overflow at the phone width: the page scroll width equals the viewport width of 375 px on each [t12, t14, t15].
- The cards stack to one column, the day chips wrap cleanly and nothing is cut off in the full-page phone screenshot [t13].
- Body text is 17 px and the smallest text on the home page is 15 px, so none of it needs zoom [t12].
- Tap targets: the nav links are 44 px tall, the "See the full menu" button is 44 px tall, the "Visit us" link is 48 px tall and the map link on /visit is now 44 px tall (it was 20 px in the previous rubric report) [t12, t15]. The one short target left is the logo link in the header, 31 px tall by 335 px wide [t12, t14, t15].
- In the phone screenshot the skip link overlaps the logo. That is the skip link showing because my Tab press had focused it, which is expected behaviour, not a bug [t9, t13].
- Not checked: touch behaviour, scroll feel and safe-area insets on a real phone; Playwright's browser is not an iPhone.

## Semantics and SEO (20)

- Score: 13 of 20 [t3, t4, t14, t15]
- The html element carries a language, and each page has its own title and its own meta description: Harbour Bakery, Menu, Visit [t3, t4].
- Each page has exactly one h1 and the heading order holds without skipped levels: home h1, h2, h3, h2; menu h1 and four h2; visit h1 and two h2 [t3, t14, t15].
- Landmarks are in place: header, nav labelled Main, main and footer, with a skip link first [t3, t1].
- A missing URL returns a real 404 status with a "Not found" title, an h1 and a way back, and /admin and /api/x also return 404 [t4].
- Missing: robots.txt, sitemap.xml and a web manifest all return 404; no canonical link; no Open Graph or Twitter tags; no structured data, though a bakery with opening hours and an address is a natural fit for LocalBusiness data [t4, t3].
- The home description still reads "Placeholder description for Harbour Bakery." and the home page body copy still says "Placeholder", so it is placeholder copy [t4, t1].
- Content is in the server HTML without JavaScript: the bread name, "This week", the opening line and the skip link are all present in the raw response with script tags removed [t7].
- /visit uses a real table with a caption for the opening hours and an address element for the address [t15].

## Animation (15)

- Score: 7 of 15 [t7, t16]
- There is almost no motion to judge. No canvas, WebGL, video or iframe element, no keyframe animations and no view transitions [t3, t7].
- The one effect is a short (0.15 s) colour, background and underline transition on interactive elements, declared only inside a no-preference reduced-motion media query [t7].
- With reduced motion on, no link, button or list item transitions and the map link's transition duration is 0 s [t16].
- The score reflects how little there is, not a fault. Whether a motion concept is wanted is the owner's call.
- Frame times: not measured.
- How the motion feels, its easing, timing and polish: needs your eyes.

## Markup (15)

- Score: 12 of 15 [t3, t14, t15, t4]
- The page is a small, clean tree: 107 elements on the home page, 105 on menu and 82 on visit; real lists for the breads and the baking days, real links, an article per bread, a real table on visit [t3, t14, t15].
- No images, so no alt or size attributes to get wrong [t3].
- The external map link carries noopener and noreferrer [t15].
- On /visit the heading "Opening hours" is followed by a table caption with the same words. The caption is visually hidden (1 px by 1 px, absolutely positioned) so sighted visitors see it once, but a screen reader may announce it twice. I did not test with a screen reader [t15, t16, t18].
- Each baking day appears as a short and a full name ("Mon", "Monday") in the home page cards; whether a screen reader reads both was not checked [t1].
- I did not run an HTML validator, so the score rests on reading the structure, not on a validation result. Not checked.

## Accessibility (10)

- Score: 9 of 10 [t6, t10, t16, t12, t15]
- Contrast, each measured against the opaque background found by walking up the parents, so no ratio was taken against a transparent value. The page uses a cream background (rgb 251, 245, 234), the cards a darker cream (rgb 243, 232, 211) [t6]:
  - Headings, nav links, logo and body text, dark brown (rgb 42, 27, 18) on cream: 15.31 to 1 [t6].
  - Card headings, dark brown on card colour: 13.68 to 1 [t6].
  - Intro paragraph under the h1 and the inactive nav links, brown (rgb 94, 73, 56) on cream: 7.78 to 1 [t6].
  - Bread description, the same brown on the card colour: 6.96 to 1 [t6].
  - Day chips, rust (rgb 143, 63, 18) on the card colour: 5.99 to 1, the lowest I sampled, at 15 px semibold [t6].
  - "See the full menu" button, cream text (rgb 255, 248, 236) on rust (rgb 143, 63, 18): 6.89 to 1 [t6].
  - Footer name, cream on dark brown (rgb 42, 27, 18): 15.31 to 1; footer body text: 13.68 to 1 [t6].
- All sampled text is above 4.5 to 1. I sampled the first element of each kind, not every element. I did not measure the "Today" badge and highlighted row on /visit, nor the map link colour [t6, t18].
- The first Tab stop is the skip link, and it shows a 3 px rust outline with a 3 px offset; the stylesheet has one global focus-visible rule of the same size [t10, t7].
- Reduced motion is respected [t16].
- Link text is descriptive ("Open the map to find Harbour Bakery", "See the full menu") [t15, t1].
- Not checked: an axe run, a screen reader, zoom to a large size, forced colours.

## Core Web Vitals

- LCP: 184 ms in a lab run on the home page, a paragraph element; under the 2.5 s target. Lab figure, one run [t2].
- CLS: 0 over the page load, under the 0.1 target [t2].
- INP: not measured as a real INP. A single synthetic click on the Menu nav link logged an event duration of 16 ms, which is the observer's floor, not a worst-case interaction; the page has almost nothing interactive to time [t19].

## Browsers

- Chrome latest: HeadlessChrome 157 run through the browser tools; every measurement above comes from it [t2].
- Chrome previous: not checked, only one Chromium build was available.
- Safari: not checked, the browser tools only gave Chromium.
- Firefox: not checked, the browser tools only gave Chromium.
- iOS Safari: not checked, needs your eyes on a real iPhone.

## Console

- Loading the home page raised no console errors. The nine errors in the log are the 404 responses from my own fetches of missing URLs in t4 [t4, t5].
