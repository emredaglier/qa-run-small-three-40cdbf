---
author: qa
verdict: pass
---

# QA 07-starter-docs-leftovers, round 1

Commit tested: ad48acbfee5810149d128fa2cf8a52c181636cbd (PR #4). The diff is two documentation/comment lines in `infra/README.md` and `smoke/webgl-fallback.spec.ts`. It changes nothing a visitor sees, so I did not test page layout at desktop and phone widths. I checked the source criteria by reading the checkout, and the one site-facing claim in the preview.

## Acceptance criteria

1. **No reference to the glow example or "Glow example" is left in `infra/` or `smoke/`.** Met. A case-insensitive Grep for `glow` over `infra/**` and `smoke/**` in the checkout returned no matches. `smoke/webgl-fallback.spec.ts:1-2` now reads "run over every page in EFFECT_PAGES (smoke/webgl.ts). That list is empty in this project, so the spec has no cases until an effect is added". That matches the ticket, and `smoke/webgl.ts:23` has `EFFECT_PAGES: EffectPage[] = []`.

2. **The secrets-check instruction in `infra/README.md` names text that exists on the site.** Met. `infra/README.md:222` now says `SMOKE_EXTRA_SECRETS='["Harbour Bakery"]' pnpm smoke -g "no server secret"`. It is identical to the example at `smoke/run.ts:29`. "Harbour Bakery" is in `apps/web/src/app/layout.tsx:10` (the page title). On the preview at `/`, a `browser_evaluate` read showed the title is "Harbour Bakery" and the text is in the rendered page body and the HTML. The README line also says "name a string the pages serve", which fits.
   - Not checked, as the ticket says: whether it makes the check fail. That needs `pnpm smoke` (Docker), which is for the lead to run. I did not run it.

3. **`pnpm lint`, `pnpm typecheck`, `pnpm test` and `pnpm check:assets` pass, with each result reported.** Not checked by me. My shell is read-only and I may not run these. The prompt states CI is green; the ticket's builder is the one who reports each result.

## Other observations (not findings against this ticket)

- The preview `/` logs one console error: `favicon.ico` returns 404 (`browser_console_messages`, level error). The diff does not touch this. I did not compare it against main, so I cannot say whether it is new. The route sweep in CI is green, so it probably does not count as a failed request there.
- Not checked: iOS Safari or WebKit (nothing in the diff is browser-facing).
- My first shell read of the checkout (`sed`/`grep` via Bash) was refused by a hook, so I used Read and Grep instead. This did not change what I could check.
