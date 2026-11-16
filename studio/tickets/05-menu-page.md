---
author: producer
class: standard
assignee: frontend-2
blockedBy: [02-content-model, 03-design-in-code]
---

# 05: Menu page

Add `/menu`, the weekly bread list.

## Do

- `apps/web/src/app/menu/page.tsx` reads `getBreads()` in their set order.
- Each bread shows its name, description and the days it is baked (the bread item from 03).
- A page heading, a short intro line (placeholder text in code is fine), and metadata.
- `dynamic = 'force-dynamic'`, using the tag-cached reads.

## Acceptance criteria

- All content renders on the server and is complete with JavaScript off (ADR-0008).
- The list is real list markup. An empty state shows when there are no breads (unit test).
- The route sweep finds `/menu`. `routes.test.ts` still passes.
- `pnpm lint`, `pnpm typecheck`, `pnpm test` and `pnpm check:assets` pass, with each result reported.
- Owner's eyes at mobile and desktop.
