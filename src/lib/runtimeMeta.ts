import routeMeta from './routeMeta.json'
import type { AtmoraRoute } from './routes'

type RouteMetaEntry = {
  path: string
  title: string
  description: string
  ogImage: string
  ogImageAlt?: string
  themeColor: string
}

const metadata = routeMeta as RouteMetaEntry[]

function ensureMeta(selector: string, attributes: Record<string, string>): HTMLMetaElement {
  const existing = document.head.querySelector<HTMLMetaElement>(selector)
  if (existing) return existing
  const meta = document.createElement('meta')
  Object.entries(attributes).forEach(([name, value]) => meta.setAttribute(name, value))
  document.head.append(meta)
  return meta
}

function setMeta(selector: string, attributes: Record<string, string>, content: string) {
  const meta = ensureMeta(selector, attributes)
  meta.setAttribute('content', content)
}

function canonicalFor(pathname: string): string | null {
  const canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!canonical?.href) return null
  const url = new URL(canonical.href)
  url.pathname = pathname === '/' ? '/' : pathname
  url.search = ''
  url.hash = ''
  return url.toString()
}

export function applyRuntimeRouteMeta(route: AtmoraRoute) {
  const entry = metadata.find((item) => item.path === route.path)
  const title = entry?.title ?? `${route.title} — Atmora`
  const description = entry?.description ?? route.description
  const themeColor = entry?.themeColor ?? '#030811'
  const ogImage = entry?.ogImage
  const ogImageAlt = entry?.ogImageAlt

  document.title = title
  setMeta('meta[name="description"]', { name: 'description' }, description)
  setMeta('meta[name="robots"]', { name: 'robots' }, route.path === '/404' || route.kind === 'operator' ? 'noindex, nofollow' : 'index, follow')
  setMeta('meta[name="theme-color"]', { name: 'theme-color' }, themeColor)
  setMeta('meta[property="og:title"]', { property: 'og:title' }, title)
  setMeta('meta[property="og:description"]', { property: 'og:description' }, description)
  setMeta('meta[name="twitter:title"]', { name: 'twitter:title' }, title)
  setMeta('meta[name="twitter:description"]', { name: 'twitter:description' }, description)

  if (ogImage) {
    const absoluteImage = new URL(ogImage, window.location.origin).toString()
    setMeta('meta[property="og:image"]', { property: 'og:image' }, absoluteImage)
    setMeta('meta[name="twitter:image"]', { name: 'twitter:image' }, absoluteImage)
    if (ogImageAlt) {
      setMeta('meta[property="og:image:alt"]', { property: 'og:image:alt' }, ogImageAlt)
      setMeta('meta[name="twitter:image:alt"]', { name: 'twitter:image:alt' }, ogImageAlt)
    }
  }


  const canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  const nextCanonical = canonicalFor(route.path)
  if (canonical && nextCanonical) {
    canonical.href = nextCanonical
    setMeta('meta[property="og:url"]', { property: 'og:url' }, nextCanonical)
  }
}
