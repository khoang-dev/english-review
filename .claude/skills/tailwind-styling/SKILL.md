---
name: tailwind-styling
description: Styling rules for this Vue 3 + Ant Design Vue + Tailwind CSS v4 project. Use whenever creating or editing a .vue component, template markup, layout, colours, spacing, or anything visual — and before reaching for a <style> block, inline style, or new CSS file.
---

# Styling with Tailwind in this project

Stack: Vue 3 (`<script setup>`), Ant Design Vue 4 (CSS-in-JS, components auto-imported as
`<a-*>`), Tailwind CSS v4 via `@tailwindcss/vite`. The only stylesheet is
`src/assets/main.css`.

## Core rule: Tailwind classes first, custom CSS last

Style everything with Tailwind utility classes in the template's `class` attribute.

**Do not:**

- add `<style>` or `<style scoped>` blocks to `.vue` files (ESLint `vue/no-restricted-block` fails)
- write static inline styles: `style="…"` or `:style="{ color: 'red' }"` (ESLint
  `vue/no-static-inline-styles` fails)
- create new `.css`/`.scss` files or add classes to `main.css`
- hard-code hex colours; use the Tailwind palette (`text-red-500`, `bg-green-50`) or Ant Design
  theme tokens

**Allowed exceptions (keep them rare and justify them in a comment):**

- `:style` bound to a genuinely runtime value that no utility can express (e.g. a computed
  width in px from data). Prefer Tailwind arbitrary values (`w-[37%]`, `grid-cols-[1fr_auto]`)
  when the value is known at build time.
- Global theme configuration in `src/assets/main.css` using Tailwind v4 directives
  (`@theme`, `@utility`, `@custom-variant`) — for design tokens or a reusable utility used in
  3+ places. Never plain CSS selectors there.

## Tailwind v4 specifics

- No `tailwind.config.js`. Configure in CSS: `@theme { --color-brand: #1677ff; }` makes
  `bg-brand`/`text-brand` available.
- Important modifier is a **suffix**: `text-white!`, `mb-1!` (not `!text-white`).
- Arbitrary values: `top-[3px]`, `max-w-[42rem]`; arbitrary properties: `[text-wrap:balance]`.
- Classes must appear as complete static strings so Tailwind can detect them. Build variants
  with lookup objects, never string concatenation:

  ```js
  // Good
  const tone = { error: 'text-red-500', ok: 'text-green-600' }
  // Bad — Tailwind can't see these class names
  const cls = `text-${color}-500`
  ```

## Working alongside Ant Design Vue

CSS cascade layers decide who wins:

- `ant-design-vue/dist/reset.css` is imported into Tailwind's `base` layer (see `main.css`), so
  Tailwind utilities override the reset. Keep it that way.
- Ant Design **component** styles are CSS-in-JS and **unlayered**, so they beat Tailwind
  utilities on the same property. Consequences:
  - **Spacing between antd components:** use `flex flex-col gap-4` / `grid gap-4` on the parent,
    not `space-y-*` (antd resets child margins like `.ant-card { margin: 0 }`).
  - **Overriding a property antd sets** (margin on `a-typography-title`, colour on icons,
    etc.): add the `!` suffix — `class="mb-1!"`, `class="text-red-500!"`. Use `!` only for
    these antd conflicts, not on plain elements.
- Change antd's look (primary colour, radius, font) through theme tokens on
  `<a-config-provider :theme="{ token: { … } }">` in `App.vue`, not by overriding `.ant-*`
  classes. Use component props (`size`, `type`, `ghost`, `block`) before classes.
- Never target `.ant-*` class names in CSS.
- Use antd for interactive widgets (buttons, inputs, tabs, menus, modals, messages) and Tailwind
  for layout, spacing, typography and colour of your own elements. Don't rebuild an antd widget
  with divs.

## Layout and responsiveness

- Mobile-first: base classes target phones, add `sm:`/`md:`/`lg:` for larger screens
  (`grid gap-4 md:grid-cols-2`).
- Page content wrapper: `mx-auto flex max-w-4xl flex-col gap-4`.
- Add `min-w-0` to flex children holding long text so it wraps instead of overflowing; `flex-wrap`
  on rows of tags/buttons.
- There must be no horizontal scroll at 390px width.

## Class hygiene

- Prettier formats templates; keep class lists on one attribute, don't split into many
  `:class` fragments unless conditional.
- Conditional classes: `:class="['base classes', condition && 'extra', lookup[key]]"`.
- If the same long class list repeats 3+ times, extract a Vue component — not a CSS class.

## Checklist before finishing

1. `npm run lint:check` passes (catches `<style>` blocks and static inline styles).
2. `npm run format:check` passes.
3. `grep -rn "<style\|style=" src` shows nothing new (or only a justified dynamic `:style`).
4. `npm run build` succeeds.
