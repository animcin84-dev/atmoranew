import type { CSSProperties } from 'react'
import { useReducedData } from '../hooks/useReducedData'
import { useRouter } from '../hooks/useRouter'
import { ATMORA_ASSETS, type AtmoraAsset } from '../lib/assets'
import type { PublicRoutePath } from '../lib/routes'
import { PAGE_TRANSITION_COVER_MS, PAGE_TRANSITION_REVEAL_MS } from '../lib/motionTimings'

const transitionAssetByPath: Record<PublicRoutePath | '/404', AtmoraAsset> = {
  '/': ATMORA_ASSETS.hero,
  '/technology': ATMORA_ASSETS.condensationFlow,
  '/platform': ATMORA_ASSETS.cloud,
  '/lab': ATMORA_ASSETS.batch,
  '/pilot': ATMORA_ASSETS.hospitality,
  '/privacy': ATMORA_ASSETS.atmosphereLight,
  '/404': ATMORA_ASSETS.atmosphereLight,
}

export function PageTransition() {
  const { route, pendingRoute, transitionPhase } = useRouter()
  const reducedData = useReducedData()
  const destination = pendingRoute ?? route
  const asset = transitionAssetByPath[destination.path as PublicRoutePath | '/404'] ?? ATMORA_ASSETS.atmosphereLight
  const timingStyle = {
    '--transition-cover-ms': `${PAGE_TRANSITION_COVER_MS}ms`,
    '--transition-reveal-ms': `${PAGE_TRANSITION_REVEAL_MS}ms`,
  } as CSSProperties

  return (
    <div
      className="page-transition"
      data-transition-phase={transitionPhase}
      data-route={destination.path}
      data-reduced-data={reducedData ? 'true' : 'false'}
      aria-hidden="true"
      style={timingStyle}
    >
      <div className="page-transition__atmosphere" />
      <div className="page-transition__dry-state" />
      <div className="page-transition__media-wrap page-transition__condensed-state">
        {!reducedData ? (
          <picture>
            {asset.mobileAvif ? <source media="(max-width:699px)" type="image/avif" srcSet={asset.mobileAvifSrcSet ?? asset.mobileAvif} sizes="100vw" /> : null}
            {asset.mobile ? <source media="(max-width:699px)" type="image/webp" srcSet={asset.mobileSrcSet ?? asset.mobile} sizes="100vw" /> : null}
            {asset.avif ? <source type="image/avif" srcSet={asset.avifSrcSet ?? asset.avif} sizes="100vw" /> : null}
            <img className="page-transition__media" src={asset.src} srcSet={asset.srcSet} sizes="100vw" alt="" width={asset.width} height={asset.height} decoding="async" />
          </picture>
        ) : null}
        <div className="page-transition__media-veil" />
      </div>
      <div className="page-transition__dew-line">
        <i />
        <span className="mono">SURFACE = DEW POINT</span>
      </div>
      <div className="page-transition__content container">
        <span className="page-transition__index mono">{destination.index === '—' ? 'UTILITY' : `${destination.index} / 05`}</span>
        <div>
          <span className="page-transition__eyebrow mono">ATMORA / STATE CHANGE</span>
          <strong>{destination.transitionLabel}</strong>
        </div>
        <span className="page-transition__line" />
      </div>
      <div className="page-transition__datum mono">DRY STATE / THRESHOLD / CONDENSED STATE</div>
    </div>
  )
}
