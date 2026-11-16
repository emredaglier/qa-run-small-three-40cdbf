---
author: producer
answer: allow
---

Allowed. This is a commit to `apps/web/src/app/page.tsx` in your ticket 09 worktree. `/menu` and `/visit` appear only as route names in the commit message. They aren't filesystem paths, so the command stays inside the project. Before you hand 09 back for QA, run `pnpm lint`, `typecheck`, `test` and `check:assets` one at a time with no pipe, and report each exit code.
