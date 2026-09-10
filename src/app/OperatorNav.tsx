import { useEffect, useRef } from 'react'
import { AtmoraWordmark } from '../components/AtmoraWordmark'
import { RouteLink } from '../components/RouteLink'
import { APP_ROUTES, type AtmoraRoute } from '../lib/routes'
import { useConsolePreferences } from './useConsolePreferences'

const icons: Record<string,string> = {
  '/app/overview':'⌁','/app/devices':'▤','/app/fleet':'⌖','/app/analytics':'⌁','/app/water':'◌','/app/alerts':'!','/app/maintenance':'◇','/app/reports':'▧','/app/settings':'··',
}

export function OperatorNav({ route }: { route:AtmoraRoute }) {
  const navRef=useRef<HTMLElement>(null)
  const { preferences }=useConsolePreferences()
  useEffect(()=>{
    if(!window.matchMedia('(max-width: 899px)').matches)return
    const active=navRef.current?.querySelector<HTMLElement>('[aria-current="page"]')
    if(!active)return
    const reduced=preferences.reducedMotion || window.matchMedia('(prefers-reduced-motion: reduce)').matches
    active.scrollIntoView({block:'nearest',inline:'center',behavior:reduced?'auto':'smooth'})
  },[preferences.reducedMotion,route.path])
  return <aside className="console-rail">
    <div className="console-rail__brand"><RouteLink to="/" aria-label="Atmora public website"><AtmoraWordmark/></RouteLink><span>OPERATOR</span></div>
    <nav ref={navRef} className="console-rail__nav" aria-label="Operator console">
      {APP_ROUTES.map(item=>{const current=route.navLabel===item.navLabel;return <RouteLink key={item.path} to={item.path} aria-current={current?'page':undefined}><i aria-hidden="true">{icons[item.path]}</i><span>{item.navLabel}</span><small>{item.index}</small></RouteLink>})}
    </nav>
    <div className="console-rail__foot"><div><span className="console-kicker">Environment</span><strong><i className="status-dot"/>Synthetic demo</strong><small>No live device connection</small></div><RouteLink to="/">Return to site <span aria-hidden="true">↗</span></RouteLink></div>
  </aside>
}
