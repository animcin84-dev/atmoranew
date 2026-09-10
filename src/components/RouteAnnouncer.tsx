import { useRouter } from '../hooks/useRouter'

export function RouteAnnouncer() {
  const { route } = useRouter()
  return <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">{route.title} page loaded</div>
}
