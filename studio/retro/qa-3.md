---
symptom: The browser console shows a failed request for the favicon on every page of a new site
detail: Until the app has an icon, browsers ask for /favicon.ico and get the 404 page, and every page logs a console error that muddies the real ones. In a Next.js app, putting an SVG at the app icon convention path (`app/icon.svg`) makes every page head carry one `<link rel="icon">`, so the browser stops asking for /favicon.ico. Make it the first ticket after setup, keep the file small and inside the asset-weight budget, and take the colours from the design tokens. Limits: a direct request to /favicon.ico still returns 404 for crawlers and tools that probe it, and a bare SVG opened as its own document has no head, so it still logs the error. Safari may prefer a PNG or touch icon; that needs a real device.
cause: observed
fix-verified: In a browser at desktop and 390 px, the home page and the 404 page each logged 0 console errors about the icon, the head held one icon link, and the icon request returned 200 with no /favicon.ico request in the network list.
date: 2026-11-16
form: check
source: ticket 08-favicon
principle: Check the console and network list of the first page of a new site for a favicon 404 before looking for other errors.
applies-to: Next.js app router
---
