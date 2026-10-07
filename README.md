# Harsh Bhogayata: Portfolio v3

A drawing set, not a template: every page is a sheet, the HB monogram is built procedurally, and the whole site moves on one easing curve.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static production build
npm run typecheck
```

## Edit the content

All copy lives in `/content`; components never hard-code text. Search for `PLACEHOLDER` to see what still needs real content.

| File | What's in it |
|---|---|
| `content/profile.ts` | Name, role, email, socials, pronunciation, intro, principles, now, uses, backstory milestones |
| `content/projects.ts` | Projects and full case studies (backstory, constraints, decisions, metrics, layers for the drawings) |
| `content/career.ts` | Experience, education, recognition, testimonials, tech stack by layer, GitHub repos/stats |
| `content/writing.ts` | Articles (with bodies) and research papers (abstract, BibTeX) |
| `content/site.ts` | Sheet index (navigation), lab experiments, portfolio versions for the archive |

Assets to add:
- `public/resume.pdf`: the résumé download
- `public/audio/name.mp3`: your name, spoken; then set `pronunciation.audio` in `profile.ts`

## Hidden controls

- `⌘K` / `Ctrl K`: command palette
- `S`: spec mode (grid, redlines and type specs of whatever you hover)
- `T`: switch Paper / Blueprint theme (auto mode follows daylight in IST)

## Structure

```
app/            routes (home, about, work, work/[slug], writing, writing/[slug], lab, now, archive, colophon, resume, contact, uses)
components/
  art/          procedural SVG: hero monogram, isometric stacks, contribution graph, portrait
  chrome/       header, index menu, footer, transitions, cursor, palette, spec mode, preloader
  home/         home page sections
  pages/        inner page building blocks
  motion/       SplitReveal, Reveal, CountUp, magnetic hook
content/        all copy and data
lib/            GSAP setup, Lenis, theme, reveal gate, utils
styles/         tokens + base, chrome, art, home, pages
docs/           site structure blueprint
```
