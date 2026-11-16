---
author: qa
verdict: pass
---

# QA: 01-project-setup, PR #1, commit 9c7605a

Tested the preview at https://emres-macbook-pro.tail201ea9.ts.net:4400/ (desktop default width and a 390 x 844 phone width, Chromium) and read the branch checkout with Grep, Glob and Read. I did not run `pnpm` commands, `pnpm smoke` or any Playwright spec. This ticket changes no look or motion, so the screenshot (`studio/qa/01-project-setup-1-phone.png`) is only a record.

## Acceptance criteria

1. **`@house` and `Project name` no longer appear in tracked files. Lockfile regenerated, no dependency added or removed.**
   - Source: Grep for `@house|Project name` over the checkout (excluding `.git`, `node_modules`) found no file. Grep on `pnpm-lock.yaml` finds `@harbour/cms-config`, `@harbour/motion` and `@harbour/ui` and no `@house`.
   - `transpilePackages` in `apps/web/next.config.ts` lists `@harbour/ui`, `@harbour/motion`, `@harbour/cms-config`; `apps/cms/next.config.ts` lists `@harbour/cms-config`.
   - `layout.tsx` has `title: 'Harbour Bakery'`; the preview's home page title is `Harbour Bakery`. `MOTION_FAULT_EVENT` is `'harbour:motion-fault'` and `defaultFromName` is `'Harbour Bakery'`.
   - `packages/motion/package.json` exports only `.` and `./react`; `gsap` and the other dependencies are still there.
   - **Not checked:** that the lockfile adds or removes no dependency. That needs a comparison with main, and git is off limits to me; I was not allowed to read the `repo/` checkout. HQ or the lead should compare against `origin/main`.
2. **`/examples/glow` is gone from the app, the smoke routes and perf. Pass.**
   - Preview: `/examples/glow` and `/examples` both answer HTTP 404 with the title "Not found".
   - Source: no `examples` folder under `apps/web/src/app`. Smoke routes are discovered from the app folder (`smoke/routes.ts`), so the route left them with the page. `EFFECT_PAGES` is `[]` (`smoke/webgl.ts:23`). `perf/scenarios.ts` has `SCENARIOS = []` and `IDLE_PATH = null`. `perf/perf-budget.json` has `"frames": {}` and only the `idle` key. Grep for "glow" (case-insensitive) in `perf/` finds nothing.
3. **WebGL fallback spec with no pages: still passes, self-test still fails on a broken page. Read, not run.**
   - `smoke/webgl-fallback.spec.ts` loops over `EFFECT_PAGES`, so with an empty list it declares no tests.
   - `smoke/checks.selftest.spec.ts` does not use `EFFECT_PAGES`: it builds its own `EffectPage` (`effect()`, line 61) and serves its own broken pages. Its WebGL tests expect the specific problems (hidden content, a leftover canvas, transparent content, an effect that never asks for WebGL), so the self-test can still fail.
   - **Not run:** `pnpm smoke` is for the lead. I could not confirm that Playwright accepts the spec file with no tests, or that the self-test passes, by running it.
4. **`pnpm lint`, `typecheck`, `test`, `check:assets` pass, each result reported.** I did not run them. CI is green per my prompt. The builder's own report of each result is not in what I was given, so I did not check that it exists.
5. **Not run by workers: `pnpm smoke` and re-recording the perf budget, listed for the lead.** The builder's list is not in what I was given: not checked. For the lead, `pnpm smoke` and `pnpm perf:check --record` remain unrun.

## What the visitor gets

- Home page, desktop and 390 px: one `h1` "Harbour Bakery", two paragraphs of seeded text, `lang="en"`, 0 `canvas` elements, no horizontal overflow (page scroll width 390 at viewport width 390). Source: `browser_snapshot` and `browser_evaluate` on the preview.
- Console on the home page: one error, a 404 for `/favicon.ico`. The diff does not touch favicons, so I take it as pre-existing; it is the only console error I saw.

## Leftovers, not blocking (nothing in the criteria names them)

- `infra/README.md:222` still tells the reader to run `SMOKE_EXTRA_SECRETS='["Glow example"]' pnpm smoke -g "no server secret"` as the way to see the secrets check fail. "Glow example" was text on the deleted page, so that command may no longer fail as described. `smoke/run.ts:29` was updated to `"Harbour Bakery"` and the doc was not.
- `smoke/webgl-fallback.spec.ts:1` still describes itself as "against the example effect".
- `apps/web/src/lib/observability.test.ts` still passes `'glow'` as an arbitrary fault detail string. Harmless.

## Browsers

Chromium only. WebKit and a real iPhone not checked; nothing in this diff touches Safari-specific code.
