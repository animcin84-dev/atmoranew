import { defineConfig, devices } from '@playwright/test'

const systemChromium = process.env.ATMORA_CHROMIUM_PATH
const chromiumOnly = process.env.ATMORA_CHROMIUM_ONLY === '1'
const chromiumProject = {
  name: 'chromium',
  use: {
    ...devices['Desktop Chrome'],
    ...(systemChromium ? { launchOptions: { executablePath: systemChromium } } : {}),
  },
}

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  timeout: 30_000,
  expect: { timeout: 5_000 },
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'artifacts/qa/playwright-report' }]],
  outputDir: 'artifacts/qa/playwright-results',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run preview',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: true,
    timeout: 30_000,
  },
  projects: chromiumOnly ? [chromiumProject] : [
    chromiumProject,
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
})
