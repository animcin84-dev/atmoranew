import { RouteLink } from '../components/RouteLink'
import { AtmoraWordmark } from '../components/AtmoraWordmark'

export function NotFoundPage() {
  return (
    <section className="not-found section--dark" aria-labelledby="not-found-title">
      <div className="not-found__field" aria-hidden="true"><i /><i /><i /><span /></div>
      <div className="container not-found__content">
        <AtmoraWordmark />
        <p className="kicker">404 / Outside the measured field</p>
        <h1 id="not-found-title" className="display display--lg">No state<br />found here.</h1>
        <p className="body-lg">The requested page is outside the current Atmora site map. Return to the atmosphere and continue from a known state.</p>
        <RouteLink className="button" to="/"><span>Return home</span><span aria-hidden="true">→</span></RouteLink>
      </div>
    </section>
  )
}
