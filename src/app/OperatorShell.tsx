import type { AtmoraRoute } from '../lib/routes'
import { OperatorNav } from './OperatorNav'
import { AppHeader } from './AppHeader'
import { OverviewPage } from './pages/OverviewPage'
import { DevicesPage } from './pages/DevicesPage'
import { DeviceDetailPage } from './pages/DeviceDetailPage'
import { FleetPage } from './pages/FleetPage'
import { AnalyticsPage } from './pages/AnalyticsPage'
import { WaterPage } from './pages/WaterPage'
import { BatchDetailPage } from './pages/BatchDetailPage'
import { AlertsPage } from './pages/AlertsPage'
import { MaintenancePage } from './pages/MaintenancePage'
import { ReportsPage } from './pages/ReportsPage'
import { SettingsPage } from './pages/SettingsPage'
import { RouteAnnouncer } from '../components/RouteAnnouncer'
import { ConsolePreferencesProvider } from './useConsolePreferences'

function OperatorPage({route}:{route:AtmoraRoute}){
  const path=route.path
  if(path==='/app/overview')return <OverviewPage/>
  if(path==='/app/devices')return <DevicesPage/>
  if(path.startsWith('/app/devices/'))return <DeviceDetailPage id={route.entityId ?? path.split('/').at(-1) ?? ''}/>
  if(path==='/app/fleet')return <FleetPage/>
  if(path==='/app/analytics')return <AnalyticsPage/>
  if(path==='/app/water')return <WaterPage/>
  if(path.startsWith('/app/water/'))return <BatchDetailPage id={route.entityId ?? path.split('/').at(-1) ?? ''}/>
  if(path==='/app/alerts')return <AlertsPage/>
  if(path==='/app/maintenance')return <MaintenancePage/>
  if(path==='/app/reports')return <ReportsPage/>
  if(path==='/app/settings')return <SettingsPage/>
  return <OverviewPage/>
}

function OperatorShellFrame({route}:{route:AtmoraRoute}){
  return <div className="console-shell" data-console-route={route.path}>
    <OperatorNav route={route}/><RouteAnnouncer/>
    <div className="console-workspace"><AppHeader route={route}/><main id="main" className="console-main" tabIndex={-1}><div className="console-route-frame" key={route.path}><OperatorPage route={route}/></div></main><footer className="console-footer"><span>ATMORA / OPERATOR</span><span>SYNTHETIC DEMO DATA</span><span>Frontend-only environment</span></footer></div>
  </div>
}

export function OperatorShell({route}:{route:AtmoraRoute}){
  return <ConsolePreferencesProvider><OperatorShellFrame route={route}/></ConsolePreferencesProvider>
}
