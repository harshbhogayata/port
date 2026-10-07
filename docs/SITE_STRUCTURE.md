# Harsh Bhogayata — Portfolio Site Structure

> Blueprint for the 2D portfolio. The visual language follows the existing hero:
> axonometric drawing, construction lines, measured nodes, mono annotations,
> blue + lime on paper white. Every page is treated as a **sheet** in a drawing set.

---

## 0. Principles for the structure

1. **Home is curated, depth is one click away.** The homepage tells the story in about 2–3 minutes; everything else lives on its own page.
2. **Every claim links to proof.** A skill links to a project, a principle links to a decision, a number links to a case study.
3. **Recruiter path in 30 seconds:** hero → selected work → experience → résumé/contact. Never blocked by animation.
4. **Curious path in 30 minutes:** case studies → writing → lab → archive → colophon.
5. **One motion system** across the site: one easing curve, shared durations, drafting-style transitions.

---

## 1. Sitemap (the drawing set)

| Sheet | Route | Page |
|---|---|---|
| A-00 | `/` | Home |
| A-01 | `/about` | About (story, name, principles, education) |
| A-02 | `/work` | All work (filterable index) |
| A-02.x | `/work/[slug]` | Case study |
| A-03 | `/writing` | Articles + research papers |
| A-03.x | `/writing/[slug]` | Article reader |
| A-04 | `/lab` | Experiments & playground |
| A-05 | `/now` | What I'm doing now |
| A-06 | `/archive` | Portfolio evolutions (v1 → current) |
| A-07 | `/colophon` | How this site was built |
| A-08 | `/resume` | Web résumé + PDF download |
| A-09 | `/contact` | Contact (also a homepage section) |
| — | `/uses` *(optional)* | Hardware, editor, tools |
| — | `/404` | Lost sheet |

---

## 2. Global elements (on every page)

### Header
- **Monogram + name** → home.
- **Location + live clock:** "Based in India · 18:51 IST".
- **Availability dot:** lime = open to work, grey = not looking (tooltip explains).
- **Index menu** ("Index 06"), see below.

### Index menu (full-screen)
- Sheet list (A-00 … A-09) with numbers, titles and a one-line description each.
- Current sheet marked with the lime square.
- **Title block** in the corner: drawn by, date, revision (`Rev 214 · a3f9c1e`, from the latest git commit), scale.
- Quick links: résumé, email (copy), GitHub, LinkedIn.

### Command palette (`⌘K` / `Ctrl K`)
- Jump to any page, project or article.
- Actions: copy email, download résumé, toggle theme, toggle spec mode.

### Spec mode (press `S`)
- Overlays the real layout grid, spacing redlines, type specs and token names.
- Shows the site's own design system, which proves design and engineering craft at once.

### Cursor
- Drafting crosshair with mono coordinates; snaps to nodes; contextual labels ("View", "Read", "Drag", "Copy").
- Disabled on touch devices.

### Theme
- Paper (light) by day; **blueprint navy** after sunset in IST, plus a manual toggle.

### Page transitions
- Content dissolves into construction lines → lines re-route into the next page's grid → new content inks in.
- The lime square acts as the shared element across the cut.

### Footer (drawing-set title block)
- Sitemap columns: Work · Writing · About · More (Lab, Now, Archive, Colophon, Uses).
- Socials: GitHub, LinkedIn, X, email, RSS.
- **Title block:** © year · Rev number · last deployed · built with (→ colophon).
- Live local time and a "Back to top" control that redraws the hero lines.
- A small Easter egg (e.g. a console message for developers who open DevTools).

---

## 3. Home (`/`): A-00

Order and purpose of each section:

### 3.1 Hero
- Monogram, name, role ("Software Development Engineer."), positioning line.
- CTAs: **Explore work** · **Read résumé**.
- Labels: 01 Design · 02 Build · 03 Ship; Web / Mobile / Systems / Products.
- **Currently** strip: "Curator — Preparing for launch ↗".
- Motion: preloader draws construction lines → headline split-reveal → monogram inks in.

### 3.2 Intro + name pronunciation
- Large paragraph that fills in word by word on scroll (2–3 sentences about who you are).
- **Name card:** "Harsh Bhogayata" · IPA · 🔊 play button (your recorded voice) · optional one-line meaning/origin.
- Portrait (optional), shown as a halftone/dithered image matching the grain style.

### 3.3 Selected work (3–4 projects)
- Each: number, title, one-line outcome, role, year, stack tags, cover visual.
- Hover: cover reveals with a construction-line frame; cursor says "View".
- Click: shared-element transition into the case study.
- Link: **All work →** `/work`.

### 3.4 Principles: "How I build"
- 3–4 short statements, each with a proof link (e.g. "Performance is a feature → p99 840ms → 92ms on Project X").

### 3.5 Tech stack
- Grouped by layer of the stack: **Interface → Client → API → Services → Data → Infra → Tooling**.
- Each tool shows where it was used (links to projects). No logo walls, no % bars.
- Hover a layer: it lifts out like an exploded plate.

### 3.6 Experience
- Compact timeline: role, company, dates, location, one impact line each.
- Expand a row for 2–3 bullet achievements.
- Link: **Full résumé →** `/resume`.

### 3.7 Education
- Degree, institution, years, notable coursework/thesis/honours (1–2 lines each).
- Certifications (optional, max 3, only meaningful ones).

### 3.8 Open source & activity
- Live GitHub data: contribution graph (in blueprint style), pinned repos, notable PRs merged into other projects.
- Stats: repos, stars, contributions this year (fetched at build time, revalidated daily).

### 3.9 Writing & research
- Latest 3 items mixed, each tagged **Article** or **Paper**.
- Papers show: venue, year, co-authors, PDF/DOI links.
- Link: **All writing →** `/writing`.

### 3.10 Recognition *(only if you have it)*
- Talks, awards, hackathon wins, features. One line each, with year.

### 3.11 Social proof
- 2–3 short quotes from leads, clients or collaborators: name, role, company, avatar.
- Slow horizontal drift; pauses on hover.

### 3.12 Now (teaser)
- "This month: building Curator, reading X, learning Y." → `/now`.

### 3.13 Contact
- Huge CTA line, e.g. "Let's build something that ships."
- Email with **copy on click** (confirmation toast), availability status, preferred project types.
- Socials + "Book a call" link (optional).
- Local time and typical reply time ("I usually reply within 24 hours").

### 3.14 Footer
- See global footer.

---

## 4. About (`/about`): A-01

1. **Opening:** Large statement + portrait.
2. **Name:** Pronunciation (audio + IPA) and meaning.
3. **Backstory:** How you got into software; key turning points as a vertical timeline ("first program", "first shipped product", "first production incident", …).
4. **Principles:** Full version of the homepage principles, with longer explanations.
5. **Education:** Full details.
6. **Outside of work:** Interests, a few personal photos (optional, makes you human).
7. **Contact CTA.**

---

## 5. Work index (`/work`): A-02

- Filter by: **Type** (Web · Mobile · Systems · Product · Open source) and **Year**.
- Toggle view: **Grid** (covers) / **List** (dense table: name, role, stack, year, outcome).
- Each entry → case study.
- Smaller projects without a full case study get a short card with links (live, repo).

---

## 6. Case study (`/work/[slug]`): A-02.x

Every case study follows the same template:

1. **Cover:** Title, one-line outcome, meta (role, team, duration, year, stack, links).
2. **Backstory:** Why this project existed: the moment, person or frustration behind it.
3. **Problem & constraints:** Technical, time, team, budget.
4. **My role:** Exactly what you did, versus the team.
5. **Process:** Design → Build → Ship (your three stages) with artefacts: sketches, wireframes, prototypes.
6. **Architecture:** Blueprint-style diagram; layers explode on scroll with annotated callouts.
7. **Key decisions & trade-offs:** 2–4 decisions, each with options considered and why.
8. **The hard part:** One deep technical story (a bug, a scaling wall, an incident).
9. **Outcome:** Real numbers, before/after, screenshots, user feedback.
10. **Reflection:** What I'd do differently.
11. **Next project:** Full-width link with a transition into the next case study.

Sidebar (desktop): sticky table of contents with reading progress.

---

## 7. Writing (`/writing`): A-03

- Tabs or filters: **All · Articles · Research papers**.
- **Articles:** title, date, reading time, tags, excerpt.
- **Papers:** title, authors, venue, year, abstract (expandable), PDF, DOI, BibTeX copy button.
- Article page: comfortable reading width, code blocks with copy, footnotes in the margin, table of contents, related posts, RSS.

---

## 8. Lab (`/lab`): A-04

- Grid of experiments: interaction studies, shaders, small tools, prototypes.
- Each: short video/GIF loop, one-line description, date, links (demo, code).
- Tone: playful; this is where personality lives.

---

## 9. Now (`/now`): A-05

- What you're building, learning, reading, listening to; where you're based.
- "Last updated" date. Short and honest.

---

## 10. Archive: portfolio evolutions (`/archive`): A-06

Presented as a **revision table** (drawing-set style) or a git log:

| Rev | Year | Stack | Concept | What I learned |
|---|---|---|---|---|
| v1 | — | — | — | — |
| v2 | — | — | — | — |
| v3 (current) | 2026 | — | — | — |

- Each version: screenshots, live link if still hosted, a short reflection.
- Ends with "What's next for v4".

---

## 11. Colophon (`/colophon`): A-07

- Stack, hosting, fonts, colour tokens, motion principles.
- Live performance numbers (Lighthouse, bundle size, Core Web Vitals).
- Accessibility commitments.
- Credits and inspirations.
- Link to the source repo (if public).

---

## 12. Résumé (`/resume`): A-08

- Web version: one page, printable (`@media print` styles).
- **Download PDF** button and last-updated date.
- Sections: summary, experience, projects, education, skills, publications.

---

## 13. Contact (`/contact`): A-09

- Same as the homepage section, plus a short form (name, email, what you're building, budget/timeline for freelance).
- Spam protection without CAPTCHAs (honeypot + rate limit).

---

## 14. 404

- "Sheet not found": a blank drawing sheet with a lost construction line drifting, and links back to Home and Work.

---

## 15. Cross-cutting requirements

### Accessibility
- Full keyboard navigation, visible focus states, skip-to-content link.
- `prefers-reduced-motion`: replace motion with crossfades; no smooth-scroll hijacking.
- Colour contrast AA minimum; text alternatives for all diagrams.

### Performance budgets
- LCP < 1.5s, CLS < 0.05, INP < 200ms.
- Initial JS < 150KB gzip on Home; images in AVIF/WebP with blur placeholders.
- Preloader ≤ 1.5s and skipped on repeat visits.

### SEO & sharing
- Per-page titles and descriptions; JSON-LD (`Person`, `Article`, `ScholarlyArticle`, `CreativeWork`).
- Generated Open Graph images in the blueprint style (one per page/project/article).
- `sitemap.xml`, `robots.txt`, RSS feed.

### Analytics
- Privacy-friendly (e.g. Plausible/Umami), no cookie banner needed.
- Track: résumé downloads, email copies, case-study reads.

---

## 16. Content model

```ts
Project   { slug, title, outcome, year, role, team, duration, type[], stack[],
            cover, links{live, repo}, featured, backstory, problem, constraints,
            decisions[], hardPart, results[], reflection }
Experience{ company, role, start, end, location, summary, achievements[] }
Education { institution, degree, field, start, end, notes }
Article   { slug, title, date, readingTime, tags[], excerpt, body }
Paper     { title, authors[], venue, year, abstract, pdf, doi, bibtex }
Testimonial{ quote, name, role, company, avatar }
LabItem   { title, description, media, date, links }
Version   { rev, year, stack[], concept, screenshots[], url, learned }
Now       { updated, building[], learning[], reading[] }
Profile   { name, pronunciation{ipa, audio, meaning}, location, timezone,
            availability, email, socials{}, resumePdf }
```

---

## 17. Content checklist (needed from Harsh)

- [ ] Positioning line + 2–3 sentence intro
- [ ] Name pronunciation (voice recording), IPA, meaning
- [ ] Portrait / personal photos (optional)
- [ ] 3–4 featured projects with backstories, numbers, visuals
- [ ] Other projects (short cards)
- [ ] Experience entries
- [ ] Education entries
- [ ] Articles and research papers (titles, links, PDFs)
- [ ] 2–3 testimonials
- [ ] Talks / awards (if any)
- [ ] Lab experiments (if any)
- [ ] Previous portfolio versions (screenshots, years)
- [ ] Current "Now" details
- [ ] Availability status, email, social links, résumé PDF
