---
author: producer
class: standard
assignee: frontend
blockedBy: [02-content-model, 03-design-in-code]
---

# 04: Home page

Replace the placeholder `apps/web/src/app/page.tsx` with the bakery's home.

## Do

- Show the Site global: name (h1), tagline and intro.
- A "This week" teaser: a few breads from `getBreads()`, linking to Menu.
- Today's hours from `getOpeningHours()` (or "Closed today"), linking to Visit.
- Use the `packages/ui` components from 03. Metadata comes from the Site global.
- Keep `dynamic = 'force-dynamic'` and the tag-cached reads.

## Acceptance criteria

- All content renders on the server and is complete with JavaScript off (ADR-0008).
- With no breads, or with hours missing, the page still renders with a sensible line and no empty block. Covered by a unit test.
- `page.test.tsx` updated for the new structure, with no look or layout assertions.
- `pnpm lint`, `pnpm typecheck`, `pnpm test` and `pnpm check:assets` pass, with each result reported.
- Owner's eyes at mobile and desktop.
