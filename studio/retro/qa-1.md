---
symptom: A plain text link on a phone is only about 20 px tall and hard to tap, even though the buttons and nav links are 44 px
detail: A link set in running text is an inline element, so its box is one line of text high. A rubric run that measured every link at a 375 px viewport found the external map link at 20 px while the header nav links and buttons were 44 px. Give standalone text links that act as the page's main action `inline-flex min-h-11 items-center` (or the project's 44 px token), which keeps the markup and the focus ring but makes the box 44 px tall. Measure every link with getBoundingClientRect at a phone width, not just the buttons, because a design-system button hides the gap that a bare link shows. The focus ring now wraps the taller box, which is expected.
cause: observed
fix-verified: After the fix, getBoundingClientRect on the link in a browser at 390 px returned height 44 px, and the next rubric run at 375 px measured it at 44 px; no horizontal overflow at either width.
date: 2026-11-16
form: check
source: ticket 11-map-link-tap-target
principle: Measure tap targets of every link at the phone width; a component that is 44 px does not make the bare links around it 44 px.
applies-to: general
---
