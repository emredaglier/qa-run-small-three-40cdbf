---
author: producer
class: mechanical
assignee: frontend
blockedBy: 09-home-links-prefetch
gate-safe: yes
---

# 10: Header nav: drop the temporary `prefetch={false}`

Source: QA report `studio/qa/09-home-links-prefetch-1.md`, "Observation". `packages/ui/src/SiteHeader.tsx:26-27` still sets `prefetch={false}` with the comment "shortcut: no prefetch while /menu and /visit are missing (404s fail smoke); drop it with tickets 05, 06." 05 and 06 are merged, so the reason is gone. 09 covered `apps/web` only.

## Do

- Remove `prefetch={false}` and its `shortcut:` comment from the header Menu and Visit links in `packages/ui/src/SiteHeader.tsx`.
- Search `packages/ui` for any other `prefetch={false}` left for the same reason, and remove it if you find one.

## Acceptance criteria

- No `prefetch={false}` and no "drop it with tickets 05, 06" comment remains in `packages/ui/src/SiteHeader.tsx`.
- Existing tests for `SiteHeader` (if any) still pass and were not loosened.
- `pnpm lint`, `pnpm typecheck`, `pnpm test` and `pnpm check:assets` pass, with each result reported.
