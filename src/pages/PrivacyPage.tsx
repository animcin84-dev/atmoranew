import { RouteLink } from '../components/RouteLink'

export function PrivacyPage() {
  return (
    <article className="legal-page section--light" aria-labelledby="privacy-title">
      <header className="legal-page__hero container">
        <p className="route-hero__eyebrow mono"><span>UTILITY</span><span>Privacy / data state</span></p>
        <h1 id="privacy-title" className="legal-page__title">Privacy<br />by state.</h1>
        <p className="legal-page__lede">Atmora treats personal data the same way it treats water and evidence: the state must be explicit before a claim or action is made.</p>
      </header>

      <div className="legal-page__body container">
        <section aria-labelledby="privacy-local">
          <span className="legal-page__index mono">01</span>
          <div><p className="kicker">Local demo</p><h2 id="privacy-local">Nothing leaves the browser.</h2><p>When no production assessment endpoint is configured, the Site Assessment is a local interface demonstration. The information you enter is held only in the current page state and is not transmitted by the assessment flow.</p></div>
        </section>
        <section aria-labelledby="privacy-remote">
          <span className="legal-page__index mono">02</span>
          <div><p className="kicker">Remote submission</p><h2 id="privacy-remote">Consent comes before contact.</h2><p>If a production assessment endpoint is configured, the website can send the site name, intended use, approximate temperature and humidity, your name, email address and optional organization to that endpoint. Remote submission requires an explicit privacy acknowledgement before the request is sent.</p></div>
        </section>
        <section aria-labelledby="privacy-purpose">
          <span className="legal-page__index mono">03</span>
          <div><p className="kicker">Purpose</p><h2 id="privacy-purpose">Assessment context, not hidden profiling.</h2><p>The assessment fields exist to provide context for a site conversation. This frontend does not add advertising identifiers, sell assessment data, or infer sensitive personal attributes from the form.</p></div>
        </section>
        <section aria-labelledby="privacy-deployment">
          <span className="legal-page__index mono">04</span>
          <div><p className="kicker">Deployment responsibility</p><h2 id="privacy-deployment">The operator must define the real policy.</h2><p>A production deployment that enables remote collection must also publish the responsible legal entity, privacy contact, lawful basis where required, retention period, processors and deletion/request procedure for that deployment. This page describes the behavior of the supplied frontend; it does not invent those deployment-specific facts.</p></div>
        </section>
        <aside className="legal-page__boundary">
          <span className="mono">DATA THRESHOLD</span>
          <strong>LOCAL STATE <i /> EXPLICIT CONSENT <i /> REMOTE REQUEST</strong>
          <RouteLink to="/pilot#assessment">Return to site assessment <span aria-hidden="true">→</span></RouteLink>
        </aside>
      </div>
    </article>
  )
}
