---
author: producer
class: mechanical
assignee: frontend
blockedBy: 04-home-page, 05-menu-page, 06-visit-page
gate-safe: no
---

# 09: Home links: drop the temporary `prefetch: false`

Source: QA report `studio/qa/04-home-page-1.md`. The home page links to `/menu` and `/visit` with `prefetch: false`, and the comment at `apps/web/src/app/page.tsx:13` says to remove it once 05 and 06 merge. 05 and 06 were built in parallel and do not touch that file, so the workaround stays on main after all three merge.

## Do

- Remove `prefetch: false` from the `/menu` and `/visit` links on the home page, and remove its comment.
- Search `apps/web` for any other `prefetch: false` left behind for the same reason, and remove it if you find one.

## Acceptance criteria

- No `prefetch: false` and no "remove when 05/06 merge" comment remains in `apps/web/src/app/page.tsx`.
- `page.test.tsx` still passes and was not loosened.
- `pnpm lint`, `pnpm typecheck`, `pnpm test` and `pnpm check:assets` pass, with each result reported.
