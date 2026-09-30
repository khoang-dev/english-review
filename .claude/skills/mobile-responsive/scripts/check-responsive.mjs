// Screenshot pages at phone / tablet / desktop widths and flag responsive problems.
//
// Usage (dev server must be running):
//   npm run check:responsive -- [baseUrl] [path ...]
//   npm run check:responsive -- http://localhost:5173 / /mistakes
//
// Screenshots go to .responsive-shots/ (gitignored). Exits 1 if any page has horizontal
// overflow or console errors.
import { existsSync, mkdirSync } from 'node:fs'
import { chromium } from 'playwright'

const VIEWPORTS = [
  { name: 'phone-small', width: 360, height: 740, isMobile: true, hasTouch: true },
  { name: 'phone', width: 390, height: 844, isMobile: true, hasTouch: true },
  { name: 'tablet', width: 768, height: 1024, isMobile: true, hasTouch: true },
  { name: 'desktop', width: 1280, height: 800 },
]
const MIN_TAP_TARGET = 40 // px — WCAG 2.5.8 minimum is 24, Apple/Google recommend 44/48

const [baseUrl = 'http://localhost:5173', ...args] = process.argv.slice(2)
const paths = args.length ? args : ['/']
const outDir = '.responsive-shots'
mkdirSync(outDir, { recursive: true })

// Cloud sandboxes ship Chromium at a fixed path; locally Playwright uses its own browsers
const sandboxChromium = '/opt/pw-browsers/chromium'
const browser = await chromium.launch({
  executablePath:
    process.env.CHROMIUM_PATH ?? (existsSync(sandboxChromium) ? sandboxChromium : undefined),
})

let failed = false

for (const path of paths) {
  for (const { name, ...viewport } of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      isMobile: viewport.isMobile ?? false,
      hasTouch: viewport.hasTouch ?? false,
      deviceScaleFactor: 1,
    })
    const page = await context.newPage()
    const errors = []
    page.on('console', (msg) => msg.type() === 'error' && errors.push(msg.text()))
    page.on('pageerror', (err) => errors.push(err.message))

    await page.goto(baseUrl + path, { waitUntil: 'networkidle' })
    await page.waitForTimeout(500)

    const report = await page.evaluate((minTap) => {
      const vw = document.documentElement.clientWidth
      const overflow = document.documentElement.scrollWidth > vw
      // Elements sticking out past the right edge (ignoring those inside horizontal scrollers)
      const offenders = [...document.querySelectorAll('body *')]
        .filter((el) => {
          const r = el.getBoundingClientRect()
          if (r.width === 0 || r.right <= vw + 1) return false
          for (let p = el.parentElement; p; p = p.parentElement) {
            const ox = getComputedStyle(p).overflowX
            if (ox === 'auto' || ox === 'scroll' || ox === 'hidden') return false
          }
          return true
        })
        .slice(0, 5)
        .map((el) => `${el.tagName.toLowerCase()}.${[...el.classList].slice(0, 3).join('.')}`)
      const smallTargets = [...document.querySelectorAll('a, button, [role="button"], input')]
        .filter((el) => {
          const r = el.getBoundingClientRect()
          return r.width > 0 && r.height > 0 && (r.height < minTap || r.width < minTap)
        })
        .slice(0, 5)
        .map((el) =>
          (el.textContent || el.getAttribute('aria-label') || el.tagName).trim().slice(0, 30),
        )
      return { overflow, offenders, smallTargets }
    }, MIN_TAP_TARGET)

    const file = `${outDir}/${path.replace(/\W+/g, '_') || 'root'}-${name}.png`
    await page.screenshot({ path: file, fullPage: true })

    const problems = []
    if (report.overflow) problems.push(`horizontal overflow (${report.offenders.join(', ')})`)
    if (errors.length) problems.push(`console errors: ${errors.join(' | ')}`)
    const warnings =
      viewport.hasTouch && report.smallTargets.length
        ? ` (warn: small tap targets: ${report.smallTargets.join(', ')})`
        : ''

    if (problems.length) failed = true
    console.log(
      `${problems.length ? '✗' : '✓'} ${path} @ ${name} ${viewport.width}px → ${file}` +
        (problems.length ? `\n    ${problems.join('\n    ')}` : '') +
        warnings,
    )
    await context.close()
  }
}

await browser.close()
process.exit(failed ? 1 : 0)
