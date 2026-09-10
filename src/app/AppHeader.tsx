import type { AtmoraRoute } from '../lib/routes'

export function AppHeader({ route }: { route:AtmoraRoute }) {
  return <header className="console-header">
    <div><span className="console-kicker">Operator console / SYNTHETIC DEMO DATA</span><h1>{route.title}</h1></div>
    <div className="console-header__meta"><span><i className="status-dot"/>Demo environment</span><span className="mono">{route.index} / APP</span></div>
  </header>
}
