---
author: producer
class: mechanical
assignee: backend
blockedBy: 01-project-setup
gate-safe: yes
---

# 07: Starter docs leftovers after the glow removal

Source: QA report `studio/qa/01-project-setup-1.md`, "Leftovers, not blocking". These are docs on merged work.

## Do

- `infra/README.md:222`: the way it shows how to make the secrets check fail still uses `SMOKE_EXTRA_SECRETS='["Glow example"]'`, which was text on the deleted page. Point it at text that is still on the site (`smoke/run.ts:29` uses `"Harbour Bakery"`), or describe the step without the example.
- `smoke/webgl-fallback.spec.ts:1`: the header comment still says "against the example effect". Reword it to say the spec runs over `EFFECT_PAGES`, which is empty in this project.

## Out of scope

- `apps/web/src/lib/observability.test.ts`: `'glow'` is an arbitrary detail string there. Leave it.

## Acceptance criteria

- No reference to the glow example or "Glow example" is left in `infra/` or `smoke/`.
- The secrets-check instruction in `infra/README.md` names text that exists on the site. Whether it makes the check fail is listed for the lead to run (`pnpm smoke`); workers don't run it.
- `pnpm lint`, `pnpm typecheck`, `pnpm test` and `pnpm check:assets` pass, with each result reported.
