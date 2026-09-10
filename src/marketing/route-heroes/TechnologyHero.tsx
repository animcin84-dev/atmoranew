import { CinematicHeading } from '../../components/CinematicHeading'
import { OpticalMedia } from '../../components/OpticalMedia'
import { RouteLink } from '../../components/RouteLink'
import { ATMORA_ASSETS } from '../../lib/assets'

export function TechnologyHero() {
  const asset = ATMORA_ASSETS.condensationFlow
  return (
    <section className="route-hero technology-hero section--dark" aria-labelledby="technology-page-title">
      <div className="technology-hero__media" data-route-hero-media aria-hidden="true">
        <OpticalMedia intensity={0.48}><picture><source media="(max-width:699px)" type="image/avif" srcSet={asset.mobileAvifSrcSet ?? asset.mobileAvif} sizes="100vw" /><source type="image/avif" srcSet={asset.avifSrcSet ?? asset.avif} sizes="100vw" /><source media="(max-width:699px)" type="image/webp" srcSet={asset.mobileSrcSet ?? asset.mobile} sizes="100vw" /><img src={asset.src} srcSet={asset.srcSet} sizes="100vw" alt="" width={asset.width} height={asset.height} fetchPriority="high" /></picture></OpticalMedia>
        <div className="technology-hero__veil" />
      </div>
      <div className="technology-hero__datum" aria-hidden="true"><i /><span className="mono">DEW POINT / THRESHOLD</span></div>
      <div className="container technology-hero__grid">
        <div className="technology-hero__copy" data-route-hero-copy data-reveal>
          <p className="route-hero__eyebrow mono"><span>02 / 05</span><span>Technology / physical threshold</span></p>
          <CinematicHeading as="h1" id="technology-page-title" className="display technology-hero__title" lines={['Air crosses', 'a line.']} />
          <p className="route-hero__support">Atmospheric water begins with a measurable condition: a surface cools to the local dew point before visible condensation can begin.</p>
          <RouteLink className="button" to="#technology"><span>Explore the physics</span><span aria-hidden="true">→</span></RouteLink>
        </div>
        <aside className="technology-hero__instrument" aria-label="Illustrative dew-point instrument">
          <span className="route-hero__state mono">ILLUSTRATIVE PHYSICS</span>
          <div><span>Ambient</span><strong className="mono">27.1°C</strong></div>
          <div><span>RH</span><strong className="mono">64%</strong></div>
          <div className="is-threshold"><span>Dew point</span><strong className="mono">19.6°C</strong></div>
          <p className="mono">SURFACE → THRESHOLD → NUCLEATION</p>
        </aside>
      </div>
    </section>
  )
}
