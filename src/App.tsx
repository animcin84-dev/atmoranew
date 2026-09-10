import { Nav } from './marketing/Nav'
import { Footer } from './marketing/Footer'
import { HomePage } from './pages/HomePage'
import { TechnologyPage } from './pages/TechnologyPage'
import { PlatformPage } from './pages/PlatformPage'
import { LabPage } from './pages/LabPage'
import { PilotPage } from './pages/PilotPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { PrivacyPage } from './pages/PrivacyPage'
import { RouterProvider, useRouter } from './hooks/useRouter'
import { PageTransition } from './components/PageTransition'
import { RouteAnnouncer } from './components/RouteAnnouncer'
import { DewProgress } from './components/DewProgress'
import { MotionOrchestrator } from './components/MotionOrchestrator'
import { OperatorShell } from './app/OperatorShell'
import { isOperatorRoute } from './lib/routes'

function CurrentPage() {
  const { route, transitionPhase } = useRouter()
  if (isOperatorRoute(route)) return <OperatorShell route={route}/>
  let page
  switch (route.path) {
    case '/': page = <HomePage/>; break
    case '/technology': page = <TechnologyPage/>; break
    case '/platform': page = <PlatformPage/>; break
    case '/lab': page = <LabPage/>; break
    case '/pilot': page = <PilotPage/>; break
    case '/privacy': page = <PrivacyPage/>; break
    case '/404': page = <NotFoundPage/>; break
    default: page = <NotFoundPage/>
  }
  return <div className="app-shell" data-transition-phase={transitionPhase} data-route={route.path}><Nav key={route.path}/><DewProgress/><PageTransition/><RouteAnnouncer/><MotionOrchestrator routeKey={route.path}/><main id="main" key={route.path} tabIndex={-1}>{page}</main><Footer/></div>
}

export default function App() {
  return <RouterProvider><CurrentPage/></RouterProvider>
}
