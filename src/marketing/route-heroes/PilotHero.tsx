import { CinematicHeading } from '../../components/CinematicHeading'
import { OpticalMedia } from '../../components/OpticalMedia'
import { RouteLink } from '../../components/RouteLink'
import { ATMORA_ASSETS } from '../../lib/assets'

export function PilotHero() {
  const asset = ATMORA_ASSETS.hospitality
  return (
    <section className="route-hero pilot-hero" aria-labelledby="pilot-page-title">
      <div className="pilot-hero__scene" data-route-hero-media>
        <OpticalMedia intensity={0.4}><picture><source media="(max-width:699px)" type="image/avif" srcSet={asset.mobileAvifSrcSet ?? asset.mobileAvif} sizes="100vw" /><source type="image/avif" srcSet={asset.avifSrcSet ?? asset.avif} sizes="100vw" /><source media="(max-width:699px)" type="image/webp" srcSet={asset.mobileSrcSet ?? asset.mobile} sizes="100vw" /><img src={asset.src} srcSet={asset.srcSet} sizes="100vw" alt={asset.alt} width={asset.width} height={asset.height} fetchPriority="high" /></picture></OpticalMedia>
        <div className="pilot-hero__veil" />
        <span className="route-hero__state pilot-hero__state mono">CONCEPT SITE / ASSESSMENT CONTEXT</span>
        <div className="pilot-hero__site-note mono"><span>SITE FIRST</span><i /><span>CONDITIONS BEFORE CAPACITY</span></div>
      </div>
      <div className="container pilot-hero__panel" data-route-hero-copy data-reveal>
        <p className="route-hero__eyebrow mono"><span>05 / 05</span><span>Pilot / conditions into decision</span></p>
        <div className="pilot-hero__copy">
          <CinematicHeading as="h1" id="pilot-page-title" className="pilot-hero__title" lines={['A site', 'before a machine.']} />
          <div className="pilot-hero__aside">
            <p>A site assessment defines the question. A measured pilot tests climate, device behavior, water pathway and energy context before a larger decision.</p>
            <RouteLink className="button button--dark" to="#assessment"><span>Assess your site</span><span aria-hidden="true">→</span></RouteLink>
          </div>
        </div>
        <div className="pilot-hero__protocol mono"><span>SITE</span><i /><span>ASSESSMENT</span><i /><span>PILOT</span><i /><span>MEASUREMENT</span><i /><span>DECISION</span></div>
      </div>
    </section>
  )
}
