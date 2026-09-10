import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const manifest = JSON.parse(await fs.readFile(path.join(root, 'src/lib/routeMeta.json'), 'utf8'))
const siteUrl = (process.env.ATMORA_SITE_URL || '').replace(/\/$/, '')
const template = await fs.readFile(path.join(dist, 'index.html'), 'utf8')

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character])
}

function replaceOrAppend(head, pattern, replacement) {
  return pattern.test(head) ? head.replace(pattern, replacement) : head.replace('</head>', `  ${replacement}\n</head>`)
}

function documentFor(route, pathname = route.path) {
  const canonical = siteUrl ? `${siteUrl}${pathname === '/' ? '/' : pathname}` : ''
  const image = siteUrl ? `${siteUrl}${route.ogImage}` : route.ogImage
  let html = template
  html = replaceOrAppend(html, /<title>.*?<\/title>/s, `<title>${escapeHtml(route.title)}</title>`)
  html = replaceOrAppend(html, /<meta\s+name="description"[^>]*>/i, `<meta name="description" content="${escapeHtml(route.description)}" />`)
  html = replaceOrAppend(html, /<meta\s+name="theme-color"[^>]*>/i, `<meta name="theme-color" content="${route.themeColor}" />`)
  html = replaceOrAppend(html, /<meta\s+property="og:title"[^>]*>/i, `<meta property="og:title" content="${escapeHtml(route.title)}" />`)
  html = replaceOrAppend(html, /<meta\s+property="og:description"[^>]*>/i, `<meta property="og:description" content="${escapeHtml(route.description)}" />`)
  html = replaceOrAppend(html, /<meta\s+property="og:site_name"[^>]*>/i, '<meta property="og:site_name" content="Atmora" />')
  html = replaceOrAppend(html, /<meta\s+property="og:image"[^>]*>/i, `<meta property="og:image" content="${escapeHtml(image)}" />`)
  html = replaceOrAppend(html, /<meta\s+name="twitter:card"[^>]*>/i, '<meta name="twitter:card" content="summary_large_image" />')
  html = replaceOrAppend(html, /<meta\s+name="twitter:title"[^>]*>/i, `<meta name="twitter:title" content="${escapeHtml(route.title)}" />`)
  html = replaceOrAppend(html, /<meta\s+name="twitter:description"[^>]*>/i, `<meta name="twitter:description" content="${escapeHtml(route.description)}" />`)
  html = replaceOrAppend(html, /<meta\s+name="twitter:image"[^>]*>/i, `<meta name="twitter:image" content="${escapeHtml(image)}" />`)
  if (route.ogImageAlt) {
    html = replaceOrAppend(html, /<meta\s+property="og:image:alt"[^>]*>/i, `<meta property="og:image:alt" content="${escapeHtml(route.ogImageAlt)}" />`)
    html = replaceOrAppend(html, /<meta\s+name="twitter:image:alt"[^>]*>/i, `<meta name="twitter:image:alt" content="${escapeHtml(route.ogImageAlt)}" />`)
  }
  html = replaceOrAppend(html, /<meta\s+name="robots"[^>]*>/i, `<meta name="robots" content="${escapeHtml(route.robots || 'index, follow')}" />`)
  if (route.heroAvif) {
    const desktopPreload = `<link rel="preload" as="image" type="image/avif" href="${escapeHtml(route.heroAvif)}" imagesrcset="${escapeHtml(route.heroAvifSrcSet || route.heroAvif)}" imagesizes="${escapeHtml(route.heroSizes || '100vw')}" media="(min-width: 700px)" fetchpriority="high" />`
    const mobilePreload = `<link rel="preload" as="image" type="image/avif" href="${escapeHtml(route.heroMobileAvif || route.heroAvif)}" imagesrcset="${escapeHtml(route.heroMobileAvifSrcSet || route.heroMobileAvif || route.heroAvif)}" imagesizes="${escapeHtml(route.heroSizes || '100vw')}" media="(max-width: 699px)" fetchpriority="high" />`
    html = html.replace('</head>', `  ${desktopPreload}\n  ${mobilePreload}\n</head>`)
  }
  if (canonical) {
    html = replaceOrAppend(html, /<link\s+rel="canonical"[^>]*>/i, `<link rel="canonical" href="${escapeHtml(canonical)}" />`)
    html = replaceOrAppend(html, /<meta\s+property="og:url"[^>]*>/i, `<meta property="og:url" content="${escapeHtml(canonical)}" />`)
  }
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': pathname === '/' ? 'WebSite' : 'WebPage',
    name: route.title,
    description: route.description,
    ...(canonical ? { url: canonical } : {}),
    isPartOf: { '@type': 'WebSite', name: 'Atmora', ...(siteUrl ? { url: `${siteUrl}/` } : {}) },
  }
  html = html.replace('</head>', `  <script type="application/ld+json">${JSON.stringify(structuredData).replace(/</g, '\\u003c')}</script>\n</head>`)
  const fallback = `<noscript><main class="seo-fallback"><h1>${escapeHtml(route.heading)}</h1><p>${escapeHtml(route.description)}</p></main></noscript>`
  html = html.replace('<div id="root"></div>', `<div id="root"></div>\n  ${fallback}`)
  return html
}

for (const route of manifest) {
  if (route.path === '/') {
    await fs.writeFile(path.join(dist, 'index.html'), documentFor(route), 'utf8')
    continue
  }
  const routeDirectory = path.join(dist, route.path.slice(1))
  await fs.mkdir(routeDirectory, { recursive: true })
  await fs.writeFile(path.join(routeDirectory, 'index.html'), documentFor(route), 'utf8')
}

const notFound = {
  title: 'Page not found — Atmora',
  description: 'The requested page is outside the current Atmora site map.',
  ogImage: '/assets/atmosphere-light.webp',
  themeColor: '#030811',
  heading: 'No state found here.',
  ogImageAlt: 'Bright mountain atmosphere above cloud layers.',
  robots: 'noindex, nofollow',
}
await fs.writeFile(path.join(dist, '404.html'), documentFor(notFound, '/404'), 'utf8')

let robots = 'User-agent: *\nAllow: /\n'
if (siteUrl) robots += `Sitemap: ${siteUrl}/sitemap.xml\n`
await fs.writeFile(path.join(dist, 'robots.txt'), robots, 'utf8')

if (siteUrl) {
  const urls = manifest.map((route) => `${siteUrl}${route.path === '/' ? '/' : route.path}`)
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((url) => `  <url><loc>${escapeHtml(url)}</loc></url>`).join('\n')}\n</urlset>\n`
  await fs.writeFile(path.join(dist, 'sitemap.xml'), sitemap, 'utf8')
}

console.log(`Prerendered ${manifest.length} Atmora routes${siteUrl ? ` for ${siteUrl}` : ' (canonical/sitemap deferred until ATMORA_SITE_URL is set)'}.`)
