/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { ATMORA_ROUTES, isOperatorRoute, routeForPath, type AtmoraRoute } from '../lib/routes'
import { useReducedMotion } from './useReducedMotion'
import { prepareRouteHero } from '../lib/assets'
import { applyRuntimeRouteMeta } from '../lib/runtimeMeta'
import { PAGE_TRANSITION_COVER_MS, PAGE_TRANSITION_MEDIA_TIMEOUT_MS, PAGE_TRANSITION_REVEAL_MS } from '../lib/motionTimings'

export type TransitionPhase = 'idle' | 'cover' | 'reveal'

type NavigateOptions = {
  history?: 'push' | 'replace' | 'none'
  restoreScrollY?: number
}

type RouterValue = {
  route: AtmoraRoute
  pendingRoute: AtmoraRoute | null
  transitionPhase: TransitionPhase
  navigate: (destination: string, options?: NavigateOptions) => void
}

const RouterContext = createContext<RouterValue | null>(null)

const SCROLL_STATE_KEY = '__atmoraScrollY'

function afterRoutePaint(callback: () => void) {
  requestAnimationFrame(() => requestAnimationFrame(callback))
}

function scrollToDestination(hash: string, restoreScrollY?: number) {
  afterRoutePaint(() => {
    const target = hash ? document.getElementById(hash.slice(1)) : null
    const top = typeof restoreScrollY === 'number'
      ? Math.max(0, restoreScrollY)
      : target
        ? target.getBoundingClientRect().top + window.scrollY
        : 0
    const root = document.documentElement
    const previous = root.style.scrollBehavior
    root.style.scrollBehavior = 'auto'
    window.scrollTo(0, top)
    root.style.scrollBehavior = previous
  })
}

function currentHistoryState(): Record<string, unknown> {
  const state = window.history.state
  return state && typeof state === 'object' ? state as Record<string, unknown> : {}
}

function persistCurrentScroll() {
  window.history.replaceState(
    { ...currentHistoryState(), [SCROLL_STATE_KEY]: window.scrollY },
    '',
    window.location.href,
  )
}

function focusRouteDestination(hash: string) {
  afterRoutePaint(() => {
    const target = hash ? document.getElementById(hash.slice(1)) : document.getElementById('main')
    if (!target) return
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1')
    target.focus({ preventScroll: true })
  })
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion()
  const [route, setRoute] = useState<AtmoraRoute>(() => routeForPath(window.location.pathname))
  const [pendingRoute, setPendingRoute] = useState<AtmoraRoute | null>(null)
  const [transitionPhase, setTransitionPhase] = useState<TransitionPhase>('idle')
  const timers = useRef<number[]>([])
  const transitionToken = useRef(0)

  const clearTimers = useCallback(() => {
    timers.current.forEach((timer) => window.clearTimeout(timer))
    timers.current = []
  }, [])

  const commit = useCallback((destination: string, options: NavigateOptions = {}) => {
    const history = options.history ?? 'push'
    const url = new URL(destination, window.location.href)
    const nextRoute = routeForPath(url.pathname)
    const nextUrl = `${nextRoute.path}${url.hash}`

    if (history === 'push') {
      persistCurrentScroll()
      window.history.pushState({ [SCROLL_STATE_KEY]: 0 }, '', nextUrl)
    }
    if (history === 'replace') {
      window.history.replaceState({ ...currentHistoryState(), [SCROLL_STATE_KEY]: 0 }, '', nextUrl)
    }

    setRoute(nextRoute)
    setPendingRoute(null)
    applyRuntimeRouteMeta(nextRoute)
    scrollToDestination(url.hash, options.restoreScrollY)
    focusRouteDestination(url.hash)
  }, [])

  const navigate = useCallback((destination: string, options: NavigateOptions = {}) => {
    const url = new URL(destination, window.location.href)
    const nextRoute = routeForPath(url.pathname)
    const current = `${route.path}${window.location.hash}`
    const next = `${nextRoute.path}${url.hash}`

    if (current === next) {
      scrollToDestination(url.hash)
      focusRouteDestination(url.hash)
      return
    }

    clearTimers()

    if (nextRoute.path === route.path) {
      commit(destination, options)
      return
    }

    if (reducedMotion || isOperatorRoute(route) || isOperatorRoute(nextRoute)) {
      commit(destination, options)
      return
    }

    const token = ++transitionToken.current
    setPendingRoute(nextRoute)
    setTransitionPhase('cover')
    const minimumCover = new Promise<void>((resolve) => window.setTimeout(resolve, PAGE_TRANSITION_COVER_MS))
    void Promise.all([minimumCover, prepareRouteHero(nextRoute.path, PAGE_TRANSITION_MEDIA_TIMEOUT_MS)]).then(() => {
      if (token !== transitionToken.current) return
      commit(destination, options)
      setTransitionPhase('reveal')
      timers.current.push(window.setTimeout(() => setTransitionPhase('idle'), PAGE_TRANSITION_REVEAL_MS))
    })
  }, [clearTimers, commit, reducedMotion, route.path])

  useEffect(() => {
    applyRuntimeRouteMeta(route)
  }, [route])

  useEffect(() => {
    const onPopState = (event: PopStateEvent) => {
      const stored = event.state?.[SCROLL_STATE_KEY]
      const restoreScrollY = typeof stored === 'number' && Number.isFinite(stored) ? stored : 0
      navigate(`${window.location.pathname}${window.location.hash}`, { history: 'none', restoreScrollY })
    }
    window.addEventListener('popstate', onPopState)
    return () => {
      window.removeEventListener('popstate', onPopState)
      clearTimers()
    }
  }, [clearTimers, navigate])

  useEffect(() => {
    const previousRestoration = window.history.scrollRestoration
    window.history.scrollRestoration = 'manual'
    persistCurrentScroll()

    let timer = 0
    const onScroll = () => {
      window.clearTimeout(timer)
      timer = window.setTimeout(persistCurrentScroll, 120)
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.clearTimeout(timer)
      persistCurrentScroll()
      window.history.scrollRestoration = previousRestoration
    }
  }, [])

  const value = useMemo<RouterValue>(() => ({ route, pendingRoute, transitionPhase, navigate }), [route, pendingRoute, transitionPhase, navigate])
  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>
}

export function useRouter() {
  const value = useContext(RouterContext)
  if (!value) throw new Error('useRouter must be used inside RouterProvider')
  return value
}

export { ATMORA_ROUTES }
