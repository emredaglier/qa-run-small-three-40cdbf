# @harbour/ui

The Harbour Bakery design: tokens, fonts and the components the pages are built from. Warm, plain,
mobile first. There are no photos, so type, colour and layout carry the look.

- Tokens: `src/tokens.css` (Tailwind `@theme`; each token is a utility, e.g. `bg-flour`, `text-xl`).
- Fonts: `fonts.ts` only (ADR-0001). Fraunces (display) and Figtree (text), both SIL OFL, fetched
  by `next/font/google` at build time and served from our own origin.
- Components: `src/*.tsx`. They take props and read no data, so they render complete HTML with
  JavaScript off.
- Motion: colour fades on hover and focus only, switched off under `prefers-reduced-motion`.

## What each token is for

| Token                                 | Use                                                                               |
| ------------------------------------- | --------------------------------------------------------------------------------- |
| `cream`                               | Page background                                                                   |
| `flour`                               | Raised surfaces (bread cards); text on the dark footer                            |
| `ink`                                 | Body text and headings; footer background                                         |
| `ink-soft`                            | Secondary text (descriptions, intro lines, inactive nav)                          |
| `crust`                               | The one accent: links, chips, button background, focus ring                       |
| `crust-deep`                          | Hover state of `crust`                                                            |
| `on-crust`                            | Text on a `crust` button                                                          |
| `highlight`                           | Today's row in the hours table                                                    |
| `sand`                                | Small labels on the dark footer                                                   |
| `line`                                | Hairline dividers only. Decorative, never text and never the only mark of a state |
| `text-sm` to `text-3xl`               | Type scale. `base` is body text (17px); `3xl` (page title) grows with the screen  |
| `font-display` / `font-body`          | Fraunces for headings and the name; Figtree for everything else                   |
| `gutter`, `section`, `container-page` | Side padding, space above the footer, and the 46rem reading width                 |
| `rounded-chip` / `-button` / `-card`  | Pills for day chips, buttons, bread cards                                         |

Classes: `.link` (underlined text link), `.btn` (button, also `ButtonLink`), `.skip-link`.

## Contrast

Checked by computing the WCAG 2.x contrast ratio from each hex value (relative luminance, no
tool or estimate) for every text pairing in use. AA needs 4.5:1 for text.

| Text on background                 | Ratio |
| ---------------------------------- | ----- |
| `ink` on `cream`                   | 15.31 |
| `ink` on `flour`                   | 13.68 |
| `ink-soft` on `cream`              | 7.78  |
| `ink-soft` on `flour`              | 6.96  |
| `crust` on `cream`                 | 6.70  |
| `crust` on `flour`                 | 5.99  |
| `on-crust` on `crust`              | 6.89  |
| `on-crust` on `crust-deep` (hover) | 9.66  |
| `ink` on `highlight`               | 12.70 |
| `ink-soft` on `highlight`          | 6.46  |
| `crust` on `highlight`             | 5.56  |
| `cream` on `ink`                   | 15.31 |
| `flour` on `ink`                   | 13.68 |
| `sand` on `ink`                    | 11.64 |

The focus ring is `crust` on light areas (6.70 on `cream`) and `flour` in the footer (13.68 on
`ink`), both above the 3:1 needed for a UI outline. It is set once on `:focus-visible`, so every
link and button has it. `line` is 1.57 on `cream` and is used for dividers only.

Not checked: the rendered page in a browser (the ratios come from the token values).
