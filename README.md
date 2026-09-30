# English Review

Vue 3 + Vite app using Vue Router, Ant Design Vue, and Tailwind CSS v4.

## Stack

- **Vue 3** (`<script setup>`) with **Vite**
- **Vue Router** — routes in `src/router/index.js`
- **Ant Design Vue 4** — components are auto-imported on demand via
  `unplugin-vue-components` (just use `<a-button>` etc. in templates)
- **Tailwind CSS v4** — via `@tailwindcss/vite`, entry at `src/assets/main.css`
- **ESLint** (flat config) + **Prettier**
- **yorkie** + **lint-staged** — runs ESLint/Prettier on staged files before each commit

## Scripts

```sh
npm install        # also installs the git hooks (yorkie)
npm run dev        # start dev server
npm run build      # production build
npm run preview    # preview the build
npm run lint       # eslint --fix
npm run format     # prettier --write src/
```

## Daily review

The app opens on today's review (`/review`). Swipe left (or use the date strip / ← → keys) to go
back through previous days; `/review/YYYY-MM-DD` links to a specific day. `/mistakes` groups every
mistake by type across all days.

Writing corrections live in `src/data/lessons.js`. Add an object to `lessons` with the `date` it
belongs to and it appears on that day.

## Checking mobile layouts

With `npm run dev` running:

```sh
npm run check:responsive -- http://localhost:5173 /review /mistakes
```

Screenshots at 360/390/768/1280px go to `.responsive-shots/`. Locally, run
`npx playwright install chromium` once first.
