import { CinematicHeading } from '../../components/CinematicHeading'
import { OpticalMedia } from '../../components/OpticalMedia'
import { RouteLink } from '../../components/RouteLink'
import { ATMORA_ASSETS } from '../../lib/assets'

const trace = [
  ['01', 'Conditions', 'Temperature / RH / dew point'],
  ['02', 'Telemetry', 'Water / energy / operating state'],
  ['03', 'Interpretation', 'Context before recommendation'],
] as const

export function PlatformHero() {
  const asset = ATMORA_ASSETS.cloud
  return (
    <section className="route-hero platform-hero section--dark" aria-labelledby="platform-page-title">
      <div className="container platform-hero__head" data-route-hero-copy data-reveal>
        <p className="route-hero__eyebrow mono"><span>03 / 05</span><span>Platform / conditions into operation</span></p>
        <div className="platform-hero__headline-grid">
          <CinematicHeading as="h1" id="platform-page-title" className="platform-hero__title" lines={['Measure', 'what changes.']} />
          <p className="route-hero__support">Climate, energy, water state and system behavior remain connected to the conditions that produced them.</p>
        </div>
      </div>
      <div className="platform-hero__stage" data-route-hero-media>
        <div className="platform-hero__trace" aria-label="Conditions become operational telemetry">
          {trace.map(([index, title, detail]) => <div key={index}><span className="mono">{index}</span><strong>{title}</strong><small>{detail}</small></div>)}
        </div>
        <OpticalMedia className="platform-hero__media" intensity={0.32}>
          <picture><source media="(max-width:699px)" type="image/avif" srcSet={asset.mobileAvifSrcSet ?? asset.mobileAvif} sizes="100vw" /><source type="image/avif" srcSet={asset.avifSrcSet ?? asset.avif} sizes="100vw" /><source media="(max-width:699px)" type="image/webp" srcSet={asset.mobileSrcSet ?? asset.mobile} sizes="100vw" /><img src={asset.src} srcSet={asset.srcSet} sizes="100vw" alt={asset.alt} width={asset.width} height={asset.height} fetchPriority="high" /></picture>
        </OpticalMedia>
        <span className="route-hero__state platform-hero__state mono">SYNTHETIC DEMO / INTERFACE STUDY</span>
      </div>
      <div className="container platform-hero__footer">
        <RouteLink className="button button--ghost" to="#platform"><span>Enter Atmora Cloud</span><span aria-hidden="true">→</span></RouteLink>
        <p className="mono">MEASUREMENT FIRST / PREDICTION WHEN DATA EARNS IT</p>
      </div>
    </section>
  )
}
