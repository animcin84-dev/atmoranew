import { existsSync } from 'node:fs'
import { delimiter, join } from 'node:path'
import { spawnSync } from 'node:child_process'
import { pathToFileURL } from 'node:url'

const CHROMIUM_NAMES = [
  'chromium',
  'chromium-browser',
  'google-chrome-stable',
  'google-chrome',
  'brave-browser',
  'brave-browser-stable',
]

const COMMON_CHROMIUM_PATHS = [
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  '/usr/bin/google-chrome-stable',
  '/usr/bin/google-chrome',
  '/usr/bin/brave-browser',
  '/usr/bin/brave-browser-stable',
]

export function findSystemChromium(env = process.env, exists = existsSync) {
  const explicit = env.ATMORA_CHROMIUM_PATH?.trim()
  if (explicit && exists(explicit)) return explicit

  const pathEntries = (env.PATH ?? '').split(delimiter).filter(Boolean)
  for (const directory of pathEntries) {
    for (const name of CHROMIUM_NAMES) {
      const candidate = join(directory, name)
      if (exists(candidate)) return candidate
    }
  }

  for (const candidate of COMMON_CHROMIUM_PATHS) {
    if (exists(candidate)) return candidate
  }

  return null
}

export function chooseRuntimeProjects(chromiumPath) {
  return chromiumPath
    ? { chromiumOnly: true, chromiumPath }
    : { chromiumOnly: false, chromiumPath: null }
}

function run(command, args, env = process.env) {
  return spawnSync(command, args, {
    cwd: process.cwd(),
    env,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  })
}

async function resolvePlaywrightChromium() {
  try {
    const { chromium } = await import('@playwright/test')
    const executable = chromium.executablePath()
    return existsSync(executable) ? executable : null
  } catch {
    return null
  }
}

async function main() {
  let chromiumPath = findSystemChromium()

  if (!chromiumPath) chromiumPath = await resolvePlaywrightChromium()

  if (!chromiumPath && process.env.ATMORA_QA_NO_BROWSER_INSTALL !== '1') {
    console.log('[atmora:qa] No usable Chromium found. Installing Playwright Chromium once...')
    const install = run(process.platform === 'win32' ? 'npx.cmd' : 'npx', ['playwright', 'install', 'chromium'])
    if (install.status === 0) chromiumPath = await resolvePlaywrightChromium()
  }

  if (!chromiumPath) {
    console.error('\n[atmora:qa] Runtime QA needs a Chromium executable.')
    console.error('Install one with: npx playwright install chromium')
    console.error('Or point to a system browser, for example:')
    console.error('ATMORA_CHROMIUM_PATH="$(command -v chromium)" npm run qa:runtime')
    process.exit(2)
  }

  const selection = chooseRuntimeProjects(chromiumPath)
  const env = {
    ...process.env,
    ATMORA_CHROMIUM_ONLY: selection.chromiumOnly ? '1' : '0',
    ATMORA_CHROMIUM_PATH: selection.chromiumPath ?? '',
  }

  console.log(`[atmora:qa] Running runtime QA with Chromium: ${chromiumPath}`)
  const result = run(process.platform === 'win32' ? 'npx.cmd' : 'npx', ['playwright', 'test'], env)
  process.exit(result.status ?? 1)
}

const invokedDirectly = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href
if (invokedDirectly) main()
