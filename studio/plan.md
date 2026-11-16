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

QA tickets are cut from the QA report after G4.

## Schedule

- Start: 2026-11-18
- G4 working build: 2026-12-02
- G5 launch: 2026-12-09
- Launch: 2026-12-11

The start date has not passed (today is 2026-11-16), so the schedule fits.
