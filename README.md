# Oculordle

A daily diagnosis game for optometry and ophthalmology students. Each day
unlocks one real clinical case — five progressively-revealed clues, five
guesses, and teaching points at the end — in a Wordle-style format.

**Play it:** [oculordle.com](https://oculordle.com) <!-- update once the domain is live -->

## How it works

- A new case goes live for everyone at local midnight, picked from a
  365-case bank so the rotation repeats yearly.
- Guessing is autocomplete-driven and alias-aware (abbreviations,
  alternate names, and common misspellings all resolve to the same case).
- Each guess reveals the next clue and scores feedback (correct / close /
  wrong) based on category overlap with the real diagnosis.
- Points, streaks, and guess distribution persist locally per browser.
- Past cases are replayable from the archive in a practice mode that
  doesn't touch your stats or streak.

Cases are for education only and are not medical advice.

## Tech stack

- [Next.js](https://nextjs.org) (App Router) + React + TypeScript
- Tailwind CSS v4 + [shadcn/ui](https://ui.shadcn.com)
- [Framer Motion](https://www.framer.com/motion/) for animation
- [Vitest](https://vitest.dev) for unit tests

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm start` | Run a production build |
| `npm test` | Run the test suite |
| `npm run lint` | Lint the codebase |
| `npm run build:data` | Regenerate `src/data/cases.json` from `data/source/` |

## Project structure

```
src/
  app/            Routes (home, play, archive, stats)
  components/     UI components, grouped by feature
  lib/            Game logic, matching, storage, date/case utilities
  data/           Generated case bank (365 cases)
data/source/       Source spreadsheet the case bank is built from
scripts/           Build scripts (case bank generation)
```

## License

All rights reserved.
