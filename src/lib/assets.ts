import { isReducedDataRequested } from '../hooks/useReducedData'
import { isOperatorRoute, routeForPath, type PublicRoutePath, type RoutePath } from './routes'

export type AssetCategory = 'hero'|'atmosphere'|'condensation'|'device'|'cutaway'|'cloud'|'fleet'|'evidence'|'use-case'|'reference'
export type AssetState = 'concept'|'synthetic-demo'|'illustrative'|'reference-only'

export type AtmoraAsset = {
  source: string
  src: string
  avif?: string
  srcSet?: string
  avifSrcSet?: string
  mobile?: string
  mobileAvif?: string
  mobileSrcSet?: string
  mobileAvifSrcSet?: string
  poster?: string
  width: number
  height: number
  alt: string
  category: AssetCategory
  state: AssetState
}

const heroResponsive = {
  srcSet: '/assets/hero-condensation-960.webp 960w, /assets/hero-condensation-1280.webp 1280w, /assets/hero-condensation.webp 1672w',
  avifSrcSet: '/assets/hero-condensation-960.avif 960w, /assets/hero-condensation-1280.avif 1280w, /assets/hero-condensation.avif 1672w',
  mobileSrcSet: '/assets/hero-condensation-mobile-480.webp 480w, /assets/hero-condensation-mobile-720.webp 720w, /assets/hero-condensation-mobile.webp 900w',
  mobileAvifSrcSet: '/assets/hero-condensation-mobile-480.avif 480w, /assets/hero-condensation-mobile-720.avif 720w, /assets/hero-condensation-mobile.avif 900w',
} as const

const technologyResponsive = {
  srcSet: '/assets/condensation-flow-960.webp 960w, /assets/condensation-flow-1280.webp 1280w, /assets/condensation-flow.webp 1672w',
  avifSrcSet: '/assets/condensation-flow-960.avif 960w, /assets/condensation-flow-1280.avif 1280w, /assets/condensation-flow.avif 1672w',
  mobileSrcSet: '/assets/condensation-flow-mobile-480.webp 480w, /assets/condensation-flow-mobile-720.webp 720w, /assets/condensation-flow-mobile.webp 900w',
  mobileAvifSrcSet: '/assets/condensation-flow-mobile-480.avif 480w, /assets/condensation-flow-mobile-720.avif 720w, /assets/condensation-flow-mobile.avif 900w',
} as const

const platformResponsive = {
  srcSet: '/assets/cloud-dashboard-960.webp 960w, /assets/cloud-dashboard-1280.webp 1280w, /assets/cloud-dashboard.webp 1448w',
  avifSrcSet: '/assets/cloud-dashboard-960.avif 960w, /assets/cloud-dashboard-1280.avif 1280w, /assets/cloud-dashboard.avif 1448w',
  mobileSrcSet: '/assets/cloud-dashboard-mobile-480.webp 480w, /assets/cloud-dashboard-mobile-720.webp 720w, /assets/cloud-dashboard-mobile.webp 900w',
  mobileAvifSrcSet: '/assets/cloud-dashboard-mobile-480.avif 480w, /assets/cloud-dashboard-mobile-720.avif 720w, /assets/cloud-dashboard-mobile.avif 900w',
} as const

const labResponsive = {
  srcSet: '/assets/water-batch-960.webp 960w, /assets/water-batch-1280.webp 1280w, /assets/water-batch.webp 1448w',
  avifSrcSet: '/assets/water-batch-960.avif 960w, /assets/water-batch-1280.avif 1280w, /assets/water-batch.avif 1448w',
  mobileSrcSet: '/assets/water-batch-mobile-480.webp 480w, /assets/water-batch-mobile-720.webp 720w, /assets/water-batch-mobile.webp 900w',
  mobileAvifSrcSet: '/assets/water-batch-mobile-480.avif 480w, /assets/water-batch-mobile-720.avif 720w, /assets/water-batch-mobile.avif 900w',
} as const

const pilotResponsive = {
  srcSet: '/assets/usecase-hospitality-960.webp 960w, /assets/usecase-hospitality-1280.webp 1280w, /assets/usecase-hospitality.webp 1672w',
  avifSrcSet: '/assets/usecase-hospitality-960.avif 960w, /assets/usecase-hospitality-1280.avif 1280w, /assets/usecase-hospitality.avif 1672w',
  mobileSrcSet: '/assets/usecase-hospitality-mobile-480.webp 480w, /assets/usecase-hospitality-mobile-720.webp 720w, /assets/usecase-hospitality-mobile.webp 900w',
  mobileAvifSrcSet: '/assets/usecase-hospitality-mobile-480.avif 480w, /assets/usecase-hospitality-mobile-720.avif 720w, /assets/usecase-hospitality-mobile.avif 900w',
} as const

export const ATMORA_ASSETS = {
  hero:{source:'ChatGPT Image Sep 9, 2026, 07_36_10 PM (3)(1).png',src:'/assets/hero-condensation.webp',avif:'/assets/hero-condensation.avif',mobile:'/assets/hero-condensation-mobile.webp',mobileAvif:'/assets/hero-condensation-mobile.avif',...heroResponsive,width:1672,height:941,alt:'Condensation forming on a cold finned surface in atmospheric mist.',category:'hero',state:'illustrative'},
  atmosphereLight:{source:'ChatGPT Image Sep 9, 2026, 07_36_11 PM (4)(1).png',src:'/assets/atmosphere-light.webp',mobile:'/assets/atmosphere-light-mobile.webp',width:1672,height:941,alt:'A bright mountain atmosphere rising through cloud layers.',category:'atmosphere',state:'illustrative'},
  measurementMountains:{source:'ChatGPT Image Sep 9, 2026, 07_36_12 PM (6)(1).png',src:'/assets/measurement-mountains.webp',width:1672,height:941,alt:'Mountain atmosphere used as an illustrative backdrop for measurement concepts.',category:'atmosphere',state:'illustrative'},
  condensationAmbient:{source:'ChatGPT Image Sep 9, 2026, 08_48_17 PM (1)(1).png',src:'/assets/condensation-ambient.webp',width:1672,height:941,alt:'A cold fin surface covered with fine condensation droplets.',category:'condensation',state:'illustrative'},
  condensationGrowth:{source:'ChatGPT Image Sep 9, 2026, 08_48_18 PM (2)(1).png',src:'/assets/condensation-growth.webp',width:1672,height:941,alt:'Larger droplets growing and merging on a cold fin surface.',category:'condensation',state:'illustrative'},
  condensationFlow:{source:'ChatGPT Image Sep 9, 2026, 08_48_20 PM (3)(1).png',src:'/assets/condensation-flow.webp',avif:'/assets/condensation-flow.avif',mobile:'/assets/condensation-flow-mobile.webp',mobileAvif:'/assets/condensation-flow-mobile.avif',...technologyResponsive,width:1672,height:941,alt:'Condensed water flowing downward from a cold surface under gravity.',category:'condensation',state:'illustrative'},
  device:{source:'ChatGPT Image Sep 9, 2026, 08_48_22 PM (4)(1).png',src:'/assets/device-concept.webp',width:1448,height:1086,alt:'Atmora atmospheric water generator concept system render.',category:'device',state:'concept'},
  cutaway:{source:'ChatGPT Image Sep 9, 2026, 08_48_24 PM (5)(1).png',src:'/assets/device-cutaway.webp',width:1448,height:1086,alt:'Illustrative Atmora concept cutaway showing airflow, condensation, collection, treatment, storage and controls.',category:'cutaway',state:'concept'},
  cloud:{source:'ChatGPT Image Sep 9, 2026, 08_48_25 PM (6)(1).png',src:'/assets/cloud-dashboard.webp',avif:'/assets/cloud-dashboard.avif',mobile:'/assets/cloud-dashboard-mobile.webp',mobileAvif:'/assets/cloud-dashboard-mobile.avif',...platformResponsive,width:1448,height:1086,alt:'Synthetic demo of an Atmora device monitoring dashboard.',category:'cloud',state:'synthetic-demo'},
  fleet:{source:'ChatGPT Image Sep 9, 2026, 08_48_27 PM (7)(1).png',src:'/assets/fleet-dashboard.webp',width:1448,height:1086,alt:'Synthetic demo of an Atmora fleet monitoring interface.',category:'fleet',state:'synthetic-demo'},
  batch:{source:'ChatGPT Image Sep 9, 2026, 08_48_29 PM (8)(1).png',src:'/assets/water-batch.webp',avif:'/assets/water-batch.avif',mobile:'/assets/water-batch-mobile.webp',mobileAvif:'/assets/water-batch-mobile.avif',...labResponsive,width:1448,height:1086,alt:'Synthetic demo of an Atmora water batch evidence record.',category:'evidence',state:'synthetic-demo'},
  hospitality:{source:'ChatGPT Image Sep 9, 2026, 08_48_30 PM (9)(1).png',src:'/assets/usecase-hospitality.webp',avif:'/assets/usecase-hospitality.avif',mobile:'/assets/usecase-hospitality-mobile.webp',mobileAvif:'/assets/usecase-hospitality-mobile.avif',...pilotResponsive,width:1672,height:941,alt:'Illustrative remote hospitality setting with an Atmora concept device in a mountain environment.',category:'use-case',state:'concept'},
  research:{source:'ChatGPT Image Sep 9, 2026, 08_48_31 PM (10)(1).png',src:'/assets/usecase-research.webp',width:1672,height:941,alt:'Illustrative high-altitude research setting with an Atmora concept device.',category:'use-case',state:'concept'}
} as const satisfies Record<string,AtmoraAsset>

const ROUTE_HERO_ASSETS: Record<PublicRoutePath | '/404', AtmoraAsset> = {
  '/': ATMORA_ASSETS.hero,
  '/technology': ATMORA_ASSETS.condensationFlow,
  '/platform': ATMORA_ASSETS.cloud,
  '/lab': ATMORA_ASSETS.batch,
  '/pilot': ATMORA_ASSETS.hospitality,
  '/privacy': ATMORA_ASSETS.atmosphereLight,
  '/404': ATMORA_ASSETS.atmosphereLight,
}

const warmedHeroSources = new Set<string>()
const loadingHeroSources = new Map<string, Promise<void>>()

function routeHeroSource(pathname: string): string {
  const asset = heroAssetForRoute(pathname)
  const preferMobile = typeof window !== 'undefined' && window.matchMedia?.('(max-width: 699px)').matches
  return preferMobile ? (asset.mobileAvif ?? asset.mobile ?? asset.avif ?? asset.src) : (asset.avif ?? asset.src)
}

export function heroAssetForRoute(pathname: string): AtmoraAsset {
  const route = routeForPath(pathname)
  if (isOperatorRoute(route)) return ATMORA_ASSETS.cloud
  return ROUTE_HERO_ASSETS[route.path as PublicRoutePath | '/404']
}


export function prepareRouteHero(pathname: string, timeoutMs = 320): Promise<void> {
  if (isOperatorRoute(pathname) || typeof Image === 'undefined' || isReducedDataRequested()) return Promise.resolve()
  const source = routeHeroSource(pathname)
  if (warmedHeroSources.has(source)) return Promise.resolve()

  let loadPromise = loadingHeroSources.get(source)
  if (!loadPromise) {
    loadPromise = new Promise<void>((resolve) => {
      const image = new Image()
      let finished = false
      const finish = () => {
        if (finished) return
        finished = true
        warmedHeroSources.add(source)
        loadingHeroSources.delete(source)
        resolve()
      }
      image.decoding = 'async'
      image.onload = () => {
        const decode = image.decode?.()
        if (decode) decode.then(finish, finish)
        else finish()
      }
      image.onerror = finish
      image.src = source
      if (image.complete && image.naturalWidth > 0) finish()
    })
    loadingHeroSources.set(source, loadPromise)
  }

  const timeout = new Promise<void>((resolve) => window.setTimeout(resolve, Math.max(0, timeoutMs)))
  return Promise.race([loadPromise, timeout])
}

export function preloadRouteHero(pathname: string): void {
  if (isOperatorRoute(pathname) || isReducedDataRequested()) return
  void prepareRouteHero(pathname, 1200)
}
