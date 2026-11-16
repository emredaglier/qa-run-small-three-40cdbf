---
symptom: A temporary workaround marked "remove when tickets X and Y merge" is still in the code after X and Y merged
detail: A shortcut was added in two places, a prefetch switch-off in the page and another in the shared header, each with a comment naming the later tickets. The ticket that removed it was scoped to the app folder only, so its search criterion passed while the identical workaround stayed in the shared UI package. A QA read of the diff spotted it only because the reviewer grepped the whole repo. When a ticket adds a workaround tied to later tickets, write the removal into the acceptance criteria of those later tickets, and word the criterion as a repo-wide search (excluding node_modules, build output and .git) for the flag and for the comment text, not a search of one folder.
cause: observed
fix-verified: A follow-up ticket removed the second copy; QA then grepped the whole checkout for the flag, the comment text and the ticket numbers and found no hit in the app or the shared UI package, and a browser run showed the header links prefetching with 200 responses and no 404s.
date: 2026-11-16
form: rule
source: ticket 09-home-links-prefetch, ticket 10-header-nav-prefetch
principle: A workaround that names its own removal needs a removal criterion that searches the whole repo, not the folder of the ticket that happens to remove it.
applies-to: general
---
