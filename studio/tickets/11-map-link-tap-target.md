---
author: producer
class: standard
assignee: frontend-3
blockedBy: 10-header-nav-prefetch
gate-safe: yes
---

# 11: Visit page: 44 px tap target for "Open the map" (G4 condition C1)

Source: G4-1 condition C1 from the owner, due before G5 (2026-12-09). QA rubric `studio/qa/rubric-1.md`, "Mobile": at phone width the "Open the map" link on `/visit` is 20 px tall. The header nav links are 44 px.

## Do

- Give the "Open the map" link on `/visit` (`apps/web/src/app/visit/page.tsx`, built in 06) a tap target of at least 44 px tall at phone width. Use padding or a min-height on the link itself, or reuse the style that gives the nav links 44 px. Do not just raise the font size.
- Keep it a plain `<a href={mapUrl}>` link out with `noopener noreferrer`. No embed and no script.
- Keep the visible focus ring, and keep the colour transition off under `prefers-reduced-motion`.
- Do not change the look of other links. If you move the style into `packages/ui`, use it only on this link (ticket 12 does the logo).

## Acceptance criteria

- The link's box is at least 44 px tall at a 390 px viewport. Report the height you measured and how. Do not add an automated spec for size or layout (`CODING_STANDARDS.md`).
- The link still opens the map URL from the `opening-hours` global, and the missing-link fallback from 06 still renders. Existing tests pass and were not loosened.
- No sideways scroll on `/visit` at 390 px.
- `pnpm lint`, `pnpm typecheck`, `pnpm test` and `pnpm check:assets` pass, with each result reported.
- Owner's eyes at phone width. The owner checks C1 in the G5 document.
