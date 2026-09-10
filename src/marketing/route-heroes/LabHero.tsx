import { CinematicHeading } from '../../components/CinematicHeading'
import { OpticalMedia } from '../../components/OpticalMedia'
import { RouteLink } from '../../components/RouteLink'
import { ATMORA_ASSETS } from '../../lib/assets'

const states = ['RAW CONDENSATE', 'TREATED WATER', 'VERIFICATION', 'VERIFIED FOR INTENDED USE'] as const

export function LabHero() {
  const asset = ATMORA_ASSETS.batch
  return (
    <section className="route-hero lab-hero" aria-labelledby="lab-page-title">
      <div className="container lab-hero__grid">
        <div className="lab-hero__ledger" data-route-hero-copy data-reveal>
          <p className="route-hero__eyebrow mono"><span>04 / 05</span><span>Atmora Lab / evidence chain</span></p>
          <span className="lab-hero__batch mono">BATCH / A-00284</span>
          <CinematicHeading as="h1" id="lab-page-title" className="lab-hero__title" lines={['Evidence', 'before confidence.']} />
          <p className="route-hero__support">A litre is not just a volume. Conditions, treatment, verification scope and evidence class determine what can truthfully be said about it.</p>
          <RouteLink className="button button--dark" to="#evidence"><span>Read the evidence chain</span><span aria-hidden="true">→</span></RouteLink>
        </div>
        <div className="lab-hero__record" data-route-hero-media>
          <OpticalMedia className="lab-hero__media" intensity={0.24}><picture><source media="(max-width:699px)" type="image/avif" srcSet={asset.mobileAvifSrcSet ?? asset.mobileAvif} sizes="100vw" /><source type="image/avif" srcSet={asset.avifSrcSet ?? asset.avif} sizes="100vw" /><source media="(max-width:699px)" type="image/webp" srcSet={asset.mobileSrcSet ?? asset.mobile} sizes="100vw" /><img src={asset.src} srcSet={asset.srcSet} sizes="100vw" alt={asset.alt} width={asset.width} height={asset.height} fetchPriority="high" /></picture></OpticalMedia>
          <span className="route-hero__state mono">SYNTHETIC DEMO / EVIDENCE RECORD</span>
        </div>
        <ol className="lab-hero__states" aria-label="Water evidence states">
          {states.map((state, index) => <li key={state}><span className="mono">0{index + 1}</span><strong>{state}</strong></li>)}
        </ol>
      </div>
    </section>
  )
}
