---
author: producer
class: setup
assignee: backend
blockedBy:
---

# 01: Project setup, starter cleanup

Turn the house starter into the Harbour Bakery project by following `README.md` "Starting a project from the template", step 2.

## Do

- Rename the `@house/*` workspace scope to `@harbour/*` everywhere: every `package.json`, every import, and the `transpilePackages` lists.
- Rename the `house:motion-fault` event (`packages/motion/src/fault.ts`) and the email adapter's `defaultFromName` (`packages/cms-config/src/config.ts`).
- Change the `'Project name'` title in `apps/web/src/app/layout.tsx` to `Harbour Bakery`.
- Delete the glow example, since this project has no WebGL. Remove every place the README lists:
  - `packages/motion/src/glow` and its package export
  - `apps/web/src/app/examples/glow`
  - its entry in `EFFECT_PAGES` (`smoke/webgl.ts`)
  - the `glow-sweep` scenario in `perf/scenarios.ts`, with `IDLE_PATH` set to `null`
  - the `glow-sweep` keys in `perf/perf-budget.json`

## Out of scope

- `infra/project.env`: the domain stays a placeholder because there is no public domain.
- `reportFault` stays as it is.

## Acceptance criteria

- `@house` and `Project name` no longer appear in tracked files. The lockfile is regenerated with `pnpm install`, with no dependency added or removed.
- `/examples/glow` is gone from the app, the smoke routes and perf.
- If the WebGL fallback spec has no pages left, it still passes, and its self-test still fails on a broken page.
- `pnpm lint`, `pnpm typecheck`, `pnpm test` and `pnpm check:assets` pass, with each result reported.
- Not run by workers: `pnpm smoke`, and re-recording the perf budget. List these for the lead.
