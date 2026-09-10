import { expect, test } from '@playwright/test'

const routes = ['/', '/technology', '/platform', '/lab', '/pilot', '/privacy'] as const
const viewports = [
  { width: 1440, height: 900 },
  { width: 1280, height: 800 },
  { width: 1024, height: 768 },
  { width: 768, height: 1024 },
  { width: 430, height: 932 },
  { width: 390, height: 844 },
  { width: 360, height: 800 },
] as const

for (const viewport of viewports) {
  test.describe(`${viewport.width}px runtime`, () => {
    test.use({ viewport })

    for (const route of routes) {
      test(`${route} has loaded fonts, no horizontal overflow and a readable main heading`, async ({ page }, testInfo) => {
        const runtimeErrors: string[] = []
        page.on('pageerror', (error) => runtimeErrors.push(error.message))
        await page.goto(route, { waitUntil: 'networkidle' })
        await page.evaluate(() => document.fonts.ready.then(() => true))

        const metrics = await page.evaluate(() => ({
          scrollWidth: document.documentElement.scrollWidth,
          innerWidth: window.innerWidth,
          bodyScrollWidth: document.body.scrollWidth,
          bodyFont: getComputedStyle(document.body).fontFamily,
        }))

        expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.innerWidth + 1)
        expect(metrics.bodyScrollWidth).toBeLessThanOrEqual(metrics.innerWidth + 1)
        expect(metrics.bodyFont).toContain('IBM Plex Sans')
        await expect(page.locator('main h1').first()).toBeVisible()
        expect(runtimeErrors).toEqual([])

        if (process.env.ATMORA_QA_SCREENSHOTS === '1') {
          await page.screenshot({
            fullPage: true,
            path: `artifacts/qa/runtime-proof/${testInfo.project.name}-${viewport.width}-${route === '/' ? 'home' : route.slice(1)}.png`,
          })
        }
      })
    }
  })
}

test('reduced motion keeps content available without transition choreography', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/technology')
  await expect(page.locator('#technology')).toBeVisible()
  const transitionDisplay = await page.locator('.page-transition').evaluate((node) => getComputedStyle(node).display)
  expect(transitionDisplay).toBe('none')
  await expect(page.locator('.condensation__static')).toBeVisible()
})

test('route navigation preserves SPA semantics and moves focus to main content', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'Technology' }).first().click()
  await expect(page).toHaveURL(/\/technology$/)
  await expect(page.locator('#main')).toBeFocused()
  await expect(page.locator('#technology-page-title')).toBeVisible()
})

test('browser history keeps route content and focus coherent', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'Technology' }).first().click()
  await expect(page).toHaveURL(/\/technology$/)
  await expect(page.locator('#technology-page-title')).toBeVisible()

  await page.goBack()
  await expect(page).toHaveURL(/\/$/)
  await expect(page.locator('#hero-title')).toBeVisible()

  await page.goForward()
  await expect(page).toHaveURL(/\/technology$/)
  await expect(page.locator('#technology-page-title')).toBeVisible()
})

test('browser history restores the previous scroll position', async ({ page }) => {
  await page.goto('/technology')
  await page.evaluate(() => window.scrollTo(0, Math.min(900, document.documentElement.scrollHeight - window.innerHeight)))
  await page.waitForTimeout(180)
  const previousScroll = await page.evaluate(() => window.scrollY)
  expect(previousScroll).toBeGreaterThan(100)

  await page.getByRole('link', { name: 'Platform' }).first().click()
  await expect(page).toHaveURL(/\/platform$/)
  await page.goBack()
  await expect(page).toHaveURL(/\/technology$/)
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThanOrEqual(previousScroll - 4)
})

test('mobile menu traps focus, closes with Escape and restores the trigger', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  const trigger = page.getByRole('button', { name: 'Open menu' })
  await trigger.click()
  const dialog = page.getByRole('dialog', { name: 'Site navigation' })
  await expect(dialog).toBeVisible()
  await expect(page.getByRole('link', { name: 'Technology' }).last()).toBeFocused()

  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
  await expect(page.getByRole('button', { name: 'Open menu' })).toBeFocused()
})

test('progressive assessment moves focus to the newly revealed step heading', async ({ page }) => {
  await page.goto('/pilot#assessment')
  await page.getByLabel('City, region or site name').fill('Almaty region')
  await page.getByRole('button', { name: /Continue/ }).click()
  await expect(page.locator('#assessment-step-heading')).toBeFocused()
  await expect(page.locator('#assessment-step-heading')).toContainText('What would the water support?')
})

test('site assessment exposes validation instead of silently advancing', async ({ page }) => {
  await page.goto('/pilot#assessment')
  const site = page.getByLabel('City, region or site name')
  await site.fill('')
  await page.getByRole('button', { name: /Continue/ }).click()
  await expect(page.getByRole('alert')).toContainText('site')
  await site.fill('Almaty region')
  await page.getByRole('button', { name: /Continue/ }).click()
  await page.getByLabel('Hospitality').check()
  await page.getByRole('button', { name: /Continue/ }).click()

  await page.getByLabel('Typical temperature (°C)').fill('')
  await page.getByRole('button', { name: /Continue/ }).click()
  await expect(page.getByRole('alert')).toBeVisible()
})

test('unknown routes render the real not-found experience', async ({ page }) => {
  await page.goto('/404')
  await expect(page.locator('main h1')).toContainText(/No state|not found/i)
  await page.goto('/this-route-does-not-exist')
  await expect(page.locator('main h1')).toContainText(/No state|not found/i)
  await expect(page.getByRole('link', { name: /Return|Home/i }).first()).toBeVisible()
})

test('400% equivalent viewport keeps the primary content horizontally reflowable', async ({ page }) => {
  // 1440×900 at 400% browser zoom exposes roughly a 360×225 CSS-pixel viewport.
  // Model that effective viewport directly so responsive media queries participate,
  // instead of CSS `zoom`, which magnifies the desktop layout without changing them.
  await page.setViewportSize({ width: 360, height: 225 })
  await page.goto('/technology')
  const overflow = await page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth)
  expect(overflow).toBeLessThanOrEqual(1)
  await expect(page.locator('main h1').first()).toBeVisible()
})

test('critical mobile scenes remain coherent at DPR 2', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })
  const page = await context.newPage()
  await page.goto('http://127.0.0.1:4173/technology')
  await expect(page.locator('#technology-page-title')).toBeVisible()
  const overflow = await page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth)
  expect(overflow).toBeLessThanOrEqual(1)
  await context.close()
})


test('privacy route explains local and remote assessment data states', async ({ page }) => {
  await page.goto('/privacy')
  await expect(page.locator('#privacy-title')).toContainText(/Privacy/i)
  await expect(page.getByText('Nothing leaves the browser.')).toBeVisible()
  await expect(page.getByText('Consent comes before contact.')).toBeVisible()
  await expect(page.getByRole('link', { name: /Return to site assessment/i })).toHaveAttribute('href', '/pilot#assessment')
})
