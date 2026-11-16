---
author: producer
---

# Brief grill, round 1: Harbour Bakery

The brief leaves these open. Answer `yes all`, or per number. "Yes" accepts my recommendation.

❓ **Q1** - **Launch date**: The brief gives no launch date, so I can't plan the schedule backwards. Thin-slice has two gates, G4 (working build) and G5 (launch).

➡️ Launch on 2026-12-11. Working backwards: start 2026-11-18, G4 working build 2026-12-02, G5 launch 2026-12-09, launch 2026-12-11.

---

❓ **Q2** - **Who makes the key screens**: The brief says it "needs design work (key screens) before build", but thin-slice has no page-design phase and no G3, so no gate approves the screens before build starts. Options:
- (a) Stay thin-slice. The first build ticket (`frontend`) designs the look in code in `packages/ui`: type, colour, spacing, and Home, Menu and Visit at mobile and desktop. The pages are built from it. You first judge the look at G4.
- (b) Stay thin-slice, but you supply Figma key screens (3 pages, mobile and desktop). Build waits until they arrive.
- (c) Switch to the full profile. That adds discover, motion concept and page design, plus G1 to G3, and moves launch later.

➡️ (a): stay thin-slice and design the key screens in code as the first build ticket.

---

❓ **Q3** - **Bread list and hours in the CMS**: The bread list changes weekly. Should the bakery edit it in Payload, or should it be hard-coded?

➡️ Yes, use the CMS. A `breads` collection holds each bread's name, a short description and the weekdays it's baked. An `opening-hours` global holds hours per day, the address and the map link. Both are seeded with placeholder text and read by the pages through the Local API. The map is a plain link out, not an embed (no third-party script).

---

❓ **Q4** - **Language**: The bakery is in Porto, but the brief is in English. Should the site be English only?

➡️ Yes, English only. No Portuguese version and no i18n routing.

---

❓ **Q5** - **Motion**: "Warm, simple", and thin-slice has no motion-concept phase. Should we skip WebGL and the signature moment?

➡️ Yes. No WebGL, no signature moment and no `creative-developer` tickets. Only light CSS transitions, turned off under reduced motion.

---

❓ **Q6** - **Images**: The brief supplies no photos, and seeding is text only (ADR-0010). Should the site launch without photography?

➡️ Yes, no photos at launch. Type, colour and layout carry the warmth. There are no stock images (no licensing to clear) and no empty image slots.

---

❓ **Q7** - **Where it launches**: `infra/project.env` still has the placeholder domain `example.com`, and the deploy and Cloudflare steps refuse to run with it. This is a throwaway project. Should it launch with no public domain and no analytics?

➡️ Yes. No public domain: G5 approves a release tag reviewed on the preview. At G5, the DNS-plan and redirect boxes read "n/a, no public domain" and analytics reads "none". There's no cookie banner.
