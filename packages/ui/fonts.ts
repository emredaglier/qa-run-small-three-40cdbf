// The ONLY place fonts are defined (ADR-0001). `src/fonts.test.ts` fails if `next/font` or
// `@font-face` is used anywhere else.
//
// Both faces are open-licensed (SIL OFL) variable fonts. `next/font/google` downloads them when
// the site is built and serves them from our own origin (the CDN prefix), so a visitor's browser
// never calls Google.
import { Figtree, Fraunces } from 'next/font/google'

/** Display face: soft, warm serif for the name, headings and bread names. */
const display = Fraunces({ subsets: ['latin'], variable: '--font-fraunces', display: 'swap' })

/** Text face: friendly, clear sans for body text, nav and hours. */
const body = Figtree({ subsets: ['latin'], variable: '--font-figtree', display: 'swap' })

/** Class names for `<html>`: defines the font CSS variables that `tokens.css` reads. */
export const fontVariables = `${display.variable} ${body.variable}`
