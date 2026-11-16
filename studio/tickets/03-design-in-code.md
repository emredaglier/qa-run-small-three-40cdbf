---
author: producer
class: standard
assignee: frontend
blockedBy: 01-project-setup
---

# 03: Design in code, the key screens and the shell

There is no Figma. This ticket is the design: it sets the look that Home, Menu and Visit are built from. It should feel warm, simple and mobile first. There are no photos, so type, colour and layout carry the warmth.

## Do

- `packages/ui`:
  - tokens: type scale, colour, spacing, radii
  - fonts only in `packages/ui/fonts.ts`, open-licensed and self-hosted through the starter's font path
- Components the pages need:
  - site header with nav (Home, Menu, Visit, current page marked)
  - footer with the address and today's hours slot (props only)
  - page heading
  - bread item: name, description, day chips
  - hours table: day, open–close or "Closed", today highlighted
  - text link and button styles
- Layout shell in `apps/web/src/app/layout.tsx`: skip link, header, `<main id="main">`, footer. Restyle `not-found.tsx`.
- Light CSS transitions only (hover and focus), turned off under `prefers-reduced-motion`. No WebGL, no JS motion.
- Mobile first, then a desktop layout. A short note in `packages/ui/README.md` saying what each token is for.

## Out of scope

- Page content and CMS reads (tickets 04–06).

## Acceptance criteria

- Components render complete HTML with JavaScript off. Unit tests check structure, not look (`CODING_STANDARDS.md`).
- Contrast is AA for text tokens (state how you checked). Focus is visible on every interactive element.
- Fonts and assets stay within `pnpm check:assets` without raising the limit.
- `pnpm lint`, `pnpm typecheck`, `pnpm test` and `pnpm check:assets` pass, with each result reported.
- Owner's eyes: say what you changed and what you could not see. The look is the owner's call at G4.
