import { RouteLink } from '../components/RouteLink'
import { OpticalMedia } from '../components/OpticalMedia'
import { ATMORA_ASSETS, type AtmoraAsset } from '../lib/assets'

type RouteTeaserChapter = { readonly index: string; readonly label: string; readonly title: string; readonly to: string; readonly asset: AtmoraAsset; readonly className: string }

const chapters: readonly RouteTeaserChapter[] = [
  { index: '02', label: 'Technology', title: 'Cross the physical threshold.', to: '/technology', asset: ATMORA_ASSETS.condensationGrowth, className: 'technology' },
  { index: '03', label: 'Platform', title: 'Turn conditions into legible operation.', to: '/platform', asset: ATMORA_ASSETS.cloud, className: 'platform' },
  { index: '04', label: 'Atmora Lab', title: 'Give every litre an evidence state.', to: '/lab', asset: ATMORA_ASSETS.batch, className: 'lab' },
]

export function RouteTeasers() {
  return <section className="route-teasers section--dark" aria-labelledby="route-teasers-title"><div className="container route-teasers__head"><p className="kicker">Explore the system</p><h2 id="route-teasers-title" className="display display--md" data-reveal>One atmosphere.<br/>Three deeper views.</h2></div><div className="route-teasers__list">{chapters.map((chapter) => <RouteLink key={chapter.to} className={`route-teaser route-teaser--${chapter.className}`} to={chapter.to}><div className="container route-teaser__grid"><span className="route-teaser__index mono">{chapter.index}</span><div className="route-teaser__copy" data-reveal><span className="data-label">{chapter.label}</span><h3>{chapter.title}</h3><span className="route-teaser__action">Explore chapter <b aria-hidden="true">↗</b></span></div><OpticalMedia className="route-teaser__media" intensity={.45}><img src={chapter.asset.src} srcSet={chapter.asset.srcSet} sizes="(max-width:699px) 100vw, 34vw" alt="" width={chapter.asset.width} height={chapter.asset.height} loading="lazy" decoding="async" /></OpticalMedia></div></RouteLink>)}</div></section>
}


export function ChapterNext({ to, index, label, title, asset = ATMORA_ASSETS.atmosphereLight }: { to: string; index: string; label: string; title: string; asset?: AtmoraAsset }) {
  return <RouteLink className="chapter-next section--dark" to={to}><OpticalMedia className="chapter-next__media" intensity={.32}><img src={asset.src} srcSet={asset.srcSet} sizes="100vw" alt="" width={asset.width} height={asset.height} loading="lazy" decoding="async" /></OpticalMedia><div className="chapter-next__veil" aria-hidden="true"/><div className="container chapter-next__layout"><span className="chapter-next__index mono">{index}</span><div data-reveal><span className="kicker">Next / {label}</span><h2 className="display display--lg">{title}</h2><span className="chapter-next__action">Open chapter <b aria-hidden="true">↗</b></span></div></div></RouteLink>
}
