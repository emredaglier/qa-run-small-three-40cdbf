---
symptom: Standalone links like the header logo or a map link have small tap targets on phones, and QA only finds them at the working-build gate, so they become late tickets that can miss the release
detail: Text-only links outside the nav (logo, "open the map" style links) kept their line height and measured 31 px tall at phone width, while the nav links were 44 px. Fix each one with padding or a 44 px minimum height, keeping the focus ring and avoiding sideways scroll. Producer side: put "every standalone link has a tap target of at least 44 px at phone width" in the acceptance criteria of the design-in-code or shell ticket, so it is built in rather than found by the QA rubric
cause: observed
fix-verified: The per-link fix in ticket 11 measured 44 px at 390 px and 1280 px in the QA report, and the owner confirmed 44 px at G5. Adding the criterion to the design ticket has not been tried yet
date: 2026-11-16
form: rule
source: ticket 11 (map link tap target), ticket 12 (logo tap target, unmerged at launch)
principle: Write known mobile accessibility minimums into the first build ticket's acceptance criteria, not into QA findings
applies-to: general
---
