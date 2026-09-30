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
