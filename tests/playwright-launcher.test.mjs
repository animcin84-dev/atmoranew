import test from 'node:test'
import assert from 'node:assert/strict'
import { chooseRuntimeProjects, findSystemChromium } from '../scripts/playwright-runtime.mjs'

test('findSystemChromium prefers the explicit ATMORA_CHROMIUM_PATH when executable', () => {
  const fake = '/tmp/atmora-fake-chromium'
  const exists = (candidate) => candidate === fake
  assert.equal(findSystemChromium({ ATMORA_CHROMIUM_PATH: fake, PATH: '' }, exists), fake)
})

test('findSystemChromium falls back to common Chromium executables on PATH', () => {
  const exists = (candidate) => candidate === '/usr/bin/chromium'
  assert.equal(findSystemChromium({ PATH: '/usr/bin:/bin' }, exists), '/usr/bin/chromium')
})

test('runtime QA uses one system Chromium project when a system browser is available', () => {
  assert.deepEqual(chooseRuntimeProjects('/usr/bin/chromium'), {
    chromiumOnly: true,
    chromiumPath: '/usr/bin/chromium',
  })
})

test('runtime QA keeps normal Playwright browser resolution when no system Chromium is available', () => {
  assert.deepEqual(chooseRuntimeProjects(null), {
    chromiumOnly: false,
    chromiumPath: null,
  })
})
