---
author: producer
class: standard
assignee: frontend-3
blockedBy: [02-content-model, 03-design-in-code]
---

# 06: Visit page

Add `/visit`: hours, address and the map link.

## Do

- `apps/web/src/app/visit/page.tsx` reads `getOpeningHours()`.
- An hours table for the week (the component from 03). Closed days read "Closed" and today is marked.
- The address as `<address>`.
- The map as a plain `<a href={mapUrl}>` link out with a clear label. No embed, no iframe, no third-party script.
- A page heading and metadata. `dynamic = 'force-dynamic'`.

## Acceptance criteria

- All content renders on the server and is complete with JavaScript off (ADR-0008).
- Hours are a real table, or a list with labels, that a screen reader can follow.
- Missing hours or a missing map link render a sensible fallback (unit test).
- No third-party request on the page.
- The route sweep finds `/visit`.
- `pnpm lint`, `pnpm typecheck`, `pnpm test` and `pnpm check:assets` pass, with each result reported.
- Owner's eyes at mobile and desktop.
