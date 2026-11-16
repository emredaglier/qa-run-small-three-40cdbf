---
author: producer
class: standard
assignee: frontend
blockedBy: 11-map-link-tap-target
gate-safe: yes
---

# 12: Header: 44 px tap target for the logo link

Source: QA rubric `studio/qa/rubric-1.md`, "Mobile": at phone width the logo link in the header is 31 px tall. The nav links next to it are 44 px. This is not a G4 condition. It is the same fault as C1, found by the same check.

## Do

- Give the header logo link (`packages/ui/src/SiteHeader.tsx`) a tap target of at least 44 px tall at phone width, with padding or min-height. If 11 added a shared tap-target style, reuse it.
- Keep the logo's look and the header's height as they are, unless 44 px cannot fit. If it cannot, stop and ask the producer.
- Keep the visible focus ring.

## Acceptance criteria

- The logo link's box is at least 44 px tall at a 390 px viewport. Report the height you measured and how. Do not add an automated spec for size or layout (`CODING_STANDARDS.md`).
- The header nav links are still 44 px. There is no sideways scroll at 390 px on `/`, `/menu` or `/visit`.
- Existing `SiteHeader` tests pass and were not loosened.
- `pnpm lint`, `pnpm typecheck`, `pnpm test` and `pnpm check:assets` pass, with each result reported.
- Owner's eyes at phone width.
