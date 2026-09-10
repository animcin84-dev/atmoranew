export type PublicRoutePath = '/' | '/technology' | '/platform' | '/lab' | '/pilot' | '/privacy'
export type OperatorStaticRoutePath =
  | '/app/overview'
  | '/app/devices'
  | '/app/fleet'
  | '/app/analytics'
  | '/app/water'
  | '/app/alerts'
  | '/app/maintenance'
  | '/app/reports'
  | '/app/settings'
export type OperatorDetailRoutePath = `/app/devices/${string}` | `/app/water/${string}`
export type OperatorRoutePath = OperatorStaticRoutePath | OperatorDetailRoutePath
export type RoutePath = PublicRoutePath | OperatorRoutePath | '/404'

export type RouteKind = 'marketing' | 'operator' | 'utility'

export type AtmoraRoute = {
  path: RoutePath
  title: string
  navLabel: string
  transitionLabel: string
  description: string
  index: string
  kind?: RouteKind
  entityId?: string
}

export const ATMORA_ROUTES: readonly AtmoraRoute[] = [
  { path: '/', title: 'Atmora', navLabel: 'Home', transitionLabel: 'Condensation observatory', description: 'Atmosphere, condensation, water and evidence.', index: '01', kind: 'marketing' },
  { path: '/technology', title: 'Technology', navLabel: 'Technology', transitionLabel: 'Physics into water', description: 'Dew point, condensation and the physical device pathway.', index: '02', kind: 'marketing' },
  { path: '/platform', title: 'Platform', navLabel: 'Platform', transitionLabel: 'Measurement into insight', description: 'Climate, energy, telemetry and operational software.', index: '03', kind: 'marketing' },
  { path: '/lab', title: 'Atmora Lab', navLabel: 'Atmora Lab', transitionLabel: 'Water into evidence', description: 'Traceability, water states and the evidence chain.', index: '04', kind: 'marketing' },
  { path: '/pilot', title: 'Pilot', navLabel: 'Pilot', transitionLabel: 'Conditions into decision', description: 'Site assessment, measured pilot and decision pathway.', index: '05', kind: 'marketing' },
  { path: '/privacy', title: 'Privacy', navLabel: 'Privacy', transitionLabel: 'Data before submission', description: 'How this Atmora website handles assessment information and deployment-specific privacy responsibilities.', index: '—', kind: 'utility' },
] as const

export const APP_ROUTES: readonly AtmoraRoute[] = [
  { path: '/app/overview', title: 'Overview', navLabel: 'Overview', transitionLabel: 'Operator overview', description: 'Synthetic overview of an Atmora device and operating conditions.', index: '01', kind: 'operator' },
  { path: '/app/devices', title: 'Devices', navLabel: 'Devices', transitionLabel: 'Device fleet', description: 'Synthetic device inventory and operating state.', index: '02', kind: 'operator' },
  { path: '/app/fleet', title: 'Fleet', navLabel: 'Fleet', transitionLabel: 'Fleet state', description: 'Synthetic global fleet state and site conditions.', index: '03', kind: 'operator' },
  { path: '/app/analytics', title: 'Analytics', navLabel: 'Analytics', transitionLabel: 'Measured response', description: 'Synthetic production, climate and energy analytics.', index: '04', kind: 'operator' },
  { path: '/app/water', title: 'Water', navLabel: 'Water', transitionLabel: 'Water evidence', description: 'Synthetic water-state and batch evidence ledger.', index: '05', kind: 'operator' },
  { path: '/app/alerts', title: 'Alerts', navLabel: 'Alerts', transitionLabel: 'Attention state', description: 'Synthetic alerts and operator attention states.', index: '06', kind: 'operator' },
  { path: '/app/maintenance', title: 'Maintenance', navLabel: 'Maintenance', transitionLabel: 'Service state', description: 'Synthetic service and component-life information.', index: '07', kind: 'operator' },
  { path: '/app/reports', title: 'Reports', navLabel: 'Reports', transitionLabel: 'Evidence reports', description: 'Frontend-only report previews for synthetic operating evidence.', index: '08', kind: 'operator' },
  { path: '/app/settings', title: 'Settings', navLabel: 'Settings', transitionLabel: 'Console preferences', description: 'Local frontend display and unit preferences.', index: '09', kind: 'operator' },
] as const

export const NOT_FOUND_ROUTE: AtmoraRoute = {
  path: '/404', title: 'Page not found', navLabel: 'Not found', transitionLabel: 'Return to atmosphere',
  description: 'The requested Atmora page does not exist.', index: '—', kind: 'utility',
}

const publicByPath = new Map<string, AtmoraRoute>(ATMORA_ROUTES.map((route) => [route.path, route]))
const appByPath = new Map<string, AtmoraRoute>(APP_ROUTES.map((route) => [route.path, route]))

export function normalizePathname(pathname: string): string {
  const withLeadingSlash = pathname.startsWith('/') ? pathname : `/${pathname}`
  const collapsed = withLeadingSlash.replace(/\/{2,}/g, '/')
  if (collapsed === '/') return '/'
  return collapsed.replace(/\/+$/, '') || '/'
}

function operatorDetailRoute(path: string): AtmoraRoute | null {
  const device = path.match(/^\/app\/devices\/([^/]+)$/)
  if (device) {
    const id = decodeURIComponent(device[1])
    return { path: path as OperatorDetailRoutePath, title: `Device ${id}`, navLabel: 'Devices', transitionLabel: 'Device telemetry', description: `Synthetic telemetry and evidence for device ${id}.`, index: '02', kind: 'operator', entityId: id }
  }
  const batch = path.match(/^\/app\/water\/([^/]+)$/)
  if (batch) {
    const id = decodeURIComponent(batch[1])
    return { path: path as OperatorDetailRoutePath, title: `Batch ${id}`, navLabel: 'Water', transitionLabel: 'Batch evidence', description: `Synthetic evidence record for water batch ${id}.`, index: '05', kind: 'operator', entityId: id }
  }
  return null
}

export function routeForPath(pathname: string): AtmoraRoute {
  const normalized = normalizePathname(pathname)
  if (normalized === '/app') return appByPath.get('/app/overview')!
  if (normalized === '/404') return NOT_FOUND_ROUTE
  return publicByPath.get(normalized) ?? appByPath.get(normalized) ?? operatorDetailRoute(normalized) ?? NOT_FOUND_ROUTE
}

export function isOperatorRoute(route: AtmoraRoute | string): boolean {
  const path = typeof route === 'string' ? normalizePathname(route) : route.path
  return path === '/app' || path.startsWith('/app/')
}

export function isRoutePath(value: string): value is RoutePath {
  return routeForPath(value).path !== '/404' || normalizePathname(value) === '/404'
}
