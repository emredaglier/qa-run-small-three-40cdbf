---
symptom: The launch gate document says "release candidate passes CI: not confirmed" because an agent never reported its smoke run, even though CI had already passed
detail: The producer filled the CI criterion from agents' reports (backend's pnpm smoke, migrate and seed output), which never came, so G5 went up with the box unticked. The owner then checked the CI run for the candidate commit on GitHub and found it green. When writing a gate document, name the exact candidate commit and ask HQ for that commit's check and browser CI result, or tell the owner where to read it. Don't wait on agent reports for a result that CI already records
cause: observed
fix-verified: At G5 the owner read the CI result for commit c8d1db4 on GitHub, found it green, and approved on that basis
date: 2026-11-16
form: rule
source: studio/gates/G5-1.md, gate criterion "release-candidate commit passes check and browser CI"
principle: Fill gate criteria from the record of truth (CI on the exact commit), not from agents' reports
applies-to: general
---
