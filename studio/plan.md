---
author: producer
---

# Plan: Harbour Bakery

A small site for a neighbourhood bakery in Porto with three pages: Home, Menu and Visit. It is warm, simple and mobile first. Profile: thin-slice. This is a throwaway project for testing the studio.

## Decisions (brief grill R1, owner: yes all)

- Launch: 2026-12-11.
- Key screens: designed in code as the first frontend build ticket (`packages/ui`). There is no Figma and no G3. The owner first judges the look at G4.
- CMS: a Payload `breads` collection (name, short description, weekdays baked) and an `opening-hours` global (hours per day, address, map link). Both are seeded with placeholder text and read through the Local API.
- Map: a plain link out. No embed and no third-party script.
- English only, no i18n.
- Motion: no WebGL, no signature moment, no `creative-developer` work. Only light CSS transitions, which are off under `prefers-reduced-motion`.
- Images: none at launch. No stock photos and no empty image slots.
- Launch target: no public domain and no analytics. G5 approves a release tag reviewed on the preview. There is no cookie banner.

## Scope

In:
- Home: name, tagline, intro, a short teaser of this week's breads, today's hours, and links to Menu and Visit.
- Menu: the weekly bread list. Each bread shows its description and the days it is baked.
- Visit: hours per day (closed days shown), the address, and the map link.
- A shared shell: header nav, footer and a styled not-found page.
- The starter cleanup from `README.md` "Starting a project": scope rename, starter names, and the glow example deleted.

Out:
- Photos, WebGL, i18n, analytics, cookie banner, public domain and DNS.
- Error monitor: `reportFault` keeps only logging. With no WebGL there are no motion faults to send.
- Real copy. Everything stays placeholder, as the brief says.

## Phases and gates

Brief intake → build → G4 working build → QA → G5 launch → launch.

## Gate criteria

G4 working build:
- [ ] Home, Menu and Visit are live on the preview, filled with seeded CMS content.
- [ ] Each page reads correctly at mobile and desktop widths. Owner's eyes.
- [ ] Every page shows all its content with JavaScript off (ADR-0008).
- [ ] A bread or an hours change saved in the admin shows on the site without a redeploy.
- [ ] CSS transitions are off under `prefers-reduced-motion`. No WebGL, no photos.
- [ ] `check` and `browser` CI pass on main: lint, typecheck, tests, assets, route sweep, axe, secrets.
- [ ] No starter leftovers: no `@house` scope, no `Project name`, no `/examples/glow`.

G5 launch:
- [ ] The QA rubric has run on the release candidate and no `qa-blocker` is open.
- [ ] Every G4 condition is met, or the owner has made the call on it.
- [ ] The release-candidate commit passes `check` and `browser` CI.
- [ ] The go/no-go checklist is filled in: browsers; redirects and DNS plan "n/a, no public domain"; analytics "none"; rollback trigger.

## Tickets (merge in NN order)

| Ticket | Class | Assignee | Blocked by |
| --- | --- | --- | --- |
| 01-project-setup | setup | backend | none |
| 02-content-model | hard | backend | 01 |
| 03-design-in-code | standard | frontend | 01 |
| 04-home-page | standard | frontend | 02, 03 |
| 05-menu-page | standard | frontend-2 | 02, 03 |
| 06-visit-page | standard | frontend-3 | 02, 03 |
| 07-starter-docs-leftovers | mechanical, gate-safe | backend | 01 |
| 08-favicon | standard | frontend | 03 |
| 09-home-links-prefetch | mechanical | frontend | 04, 05, 06 |
| 10-header-nav-prefetch | mechanical, gate-safe | frontend | 09 |
| 11-map-link-tap-target (G4 C1) | standard, gate-safe | frontend-3 | 10 |
| 12-logo-tap-target | standard, gate-safe | frontend | 11 |

## G4 outcome (attempt 1, approved with conditions)

- C1: the "Open the map" link on /visit gets a tap target at least 44 px tall. Ticket 11, due before G5 (2026-12-09).
- QA rubric `studio/qa/rubric-1.md` finding: the header logo link is 31 px tall. Ticket 12. Left out of G5 on the owner's word, because HQ's build had a machine fault four times. It stays open.
- Rubric findings with no ticket, because they are out of scope (no public domain, placeholder copy): robots.txt, sitemap, canonical, Open Graph, structured data, placeholder meta description.
- The owner still has to do: a tap-through on a real iPhone, and an admin edit of a bread showing on /menu.

## G5 outcome (attempt 1, approved: go)

- Released: tag `v1.0.0` on main at `c8d1db4` (after PR #11), reviewed on the main preview.
- Confirmed by the owner: CI on `c8d1db4` green (GitHub), QA rubric attempt 2 accepted (`studio/qa/rubric-2.md`), C1 map link measured 44 px.
- No public domain, no DNS, no analytics: nothing to cut over.

## Launch

- Done: G5 approved, `v1.0.0` tagged by HQ. No further release work in this profile.
- Left with the owner (not studio work): real-iPhone tap-through; admin edit of a bread showing on /menu; the real map URL (placeholder openstreetmap.org accepted for this QA project).
- Open after launch: ticket 12 (logo tap target, 31 px). Unmerged; HQ's build failed on a machine fault, not the code. It would ship in a later tag, not `v1.0.0`.
- No new tickets and no merges requested: launch is closed.

## Schedule

- Start: 2026-11-18
- G4 working build: 2026-12-02
- G5 launch: 2026-12-09
- Launch: 2026-12-11

The start date has not passed (today is 2026-11-16), so the schedule fits.
