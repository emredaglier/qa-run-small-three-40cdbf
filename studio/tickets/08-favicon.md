---
author: producer
class: standard
assignee: frontend
blockedBy: 03-design-in-code
gate-safe: no
---

# 08: Site icon (fixes the `/favicon.ico` 404)

Source: QA reports `studio/qa/01-project-setup-1.md`, `02-content-model-1.md`, `07-starter-docs-leftovers-1.md` and `03-design-in-code-1.md`. Each one logged the same console error on every page load: `GET /favicon.ico` 404.

## Do

- Add a site icon to `apps/web` using the colour tokens from 03 (`packages/ui`). No logo file is in the brief, so make a simple "HB" monogram or a plain mark. Use no SVG filters.
- Serve it from the path the browser asks for (`/favicon.ico` or the app icon route), so that the request no longer gets a 404.

## Out of scope

- An Apple touch icon and a web manifest, unless the starter already has them.

## Acceptance criteria

- On `/` and on the 404 page, the console shows no favicon 404. List this for the lead or QA to check in the browser; workers don't run browsers.
- The asset-weight budget is not raised (`pnpm check:assets`).
- `pnpm lint`, `pnpm typecheck`, `pnpm test` and `pnpm check:assets` pass, with each result reported.
- Owner's eyes: the mark is a placeholder until the owner sees it at G4.
