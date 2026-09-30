---
name: mobile-responsive
description: Mobile-first responsive design and verification for this project. Use whenever building or changing any UI — pages, components, layout, navigation, modals/drawers, carousels — so it works on phones (360–430px), tablets and desktop, and verify it with the bundled screenshot check before finishing.
---

# Mobile-responsive UI

Most use of this app is on a phone. Every UI change must work at **360px** width first, then
scale up. Styling itself follows the `tailwind-styling` skill (Tailwind classes, no custom CSS).

## Design mobile-first

- Write base classes for phones; add `sm:` (640), `md:` (768), `lg:` (1024) only to _enhance_
  for bigger screens: `grid gap-3 md:grid-cols-2`, `text-2xl sm:text-3xl`, `p-5 sm:p-6`.
- Page gutter is **16px** (`px-4`) on phones. Content width caps at `max-w-3xl` (the app
  shell already centres `main`).
- Single column on phones. Side-by-side layouts start at `md:`.
- Never rely on a fixed width that exceeds 360px. Use `w-full`, `min-w-0`, `max-w-*`, `flex-wrap`.
- Long words/phrases (code, URLs, English examples) need `break-words`; flex children with
  text need `min-w-0`.
- Horizontal lists that may not fit (date chips, filter chips, tabs) scroll inside their own
  row: `flex gap-2 overflow-x-auto [scrollbar-width:none]` with `shrink-0` children — never
  let them widen the page.

## Touch

- Tap targets are at least **44×44px**: `min-h-11`, `h-11`, `size-11`, antd `size="large"`.
  Icon-only buttons need an `aria-label`.
- Don't hide functionality behind hover. `hover:` is decoration only; add `active:` feedback
  for touch.
- Swipe interactions use native scroll snap (`snap-x snap-mandatory` + `snap-center`) — see
  `src/components/DayCarousel.vue` — rather than JS gesture libraries, and always have a
  button/keyboard alternative.
- Text inputs must be `text-base` (16px) or iOS zooms the page on focus.

## Navigation and overlays

- App shell (`src/App.vue`): sticky top bar; on phones a fixed bottom tab bar (`md:hidden`)
  and desktop links in the header (`hidden md:flex`). Keep `main`'s bottom padding (`pb-28`)
  so content isn't hidden behind the tab bar, and `pb-[env(safe-area-inset-bottom)]` for the
  iPhone home indicator (`viewport-fit=cover` is set in `index.html`).
- Sticky sub-headers sit below the 56px top bar: `sticky top-14`.
- Drawers/modals: bottom sheet on phones, side panel on desktop —
  `:placement="isDesktop ? 'right' : 'bottom'"` with `useMediaQuery('(min-width: 768px)')` from
  `src/composables/useMediaQuery.js`. Prefer CSS breakpoints; use the composable only for antd
  props that CSS can't change.
- Use `min-h-dvh` (not `min-h-screen`) so mobile browser toolbars don't cause jumps.

## Verify before finishing (required)

1. Start the dev server in the background: `npm run dev` (port 5173).
2. Run the check for every page you touched:

   ```sh
   npm run check:responsive -- http://localhost:5173 /review /mistakes
   ```

   It loads each path at 360, 390, 768 and 1280px, saves full-page screenshots to
   `.responsive-shots/`, fails on horizontal overflow or console errors, and warns about tap
   targets under 40px on touch viewports.

3. **Look at the screenshots** (at least `phone-small` and `desktop`) with the Read tool.
   Check: nothing cut off or overlapping, text readable, spacing consistent, primary action
   easy to reach with a thumb, bottom tab bar not covering content.
4. For interactive changes (carousel, drawer, accordions), drive them with Playwright at 390px
   (click/swipe, then screenshot) — static screenshots alone don't prove they work.
5. Fix every ✗ and every visual problem before committing.

The script uses Playwright (dev dependency). In the cloud sandbox it uses the pre-installed
Chromium automatically; locally run `npx playwright install chromium` once.
