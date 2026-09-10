import { useEffect } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

export function MotionOrchestrator({ routeKey }: { routeKey: string }) {
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal],[data-media-reveal]'))
    if (reducedMotion || !('IntersectionObserver' in window)) {
      nodes.forEach((node) => node.dataset.visible = 'true')
    } else {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const node = entry.target as HTMLElement
          node.dataset.visible = 'true'
          observer.unobserve(node)
        })
      }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' })
      nodes.forEach((node) => observer.observe(node))
      return () => observer.disconnect()
    }
  }, [reducedMotion, routeKey])

  useEffect(() => {
    if (reducedMotion) return
    const nativeScrollTimeline = typeof CSS !== 'undefined' && CSS.supports('animation-timeline: view()')
    if (nativeScrollTimeline) return

    const root = document.documentElement
    const heroes = Array.from(document.querySelectorAll<HTMLElement>('.route-hero'))
    if (!heroes.length) return

    root.dataset.scrollTimelineFallback = 'true'
    let raf = 0

    const update = () => {
      raf = 0
      const viewport = Math.max(window.innerHeight, 1)
      heroes.forEach((hero) => {
        const rect = hero.getBoundingClientRect()
        const progress = clamp01(-rect.top / Math.max(Math.min(rect.height, viewport), 1))
        const media = hero.querySelector<HTMLElement>('[data-route-hero-media]')
        const copy = hero.querySelector<HTMLElement>('[data-route-hero-copy]')
        if (media) {
          media.style.setProperty('--hero-exit-y', `${(-progress * viewport * 0.025).toFixed(2)}px`)
          media.style.setProperty('--hero-exit-scale', (1 + progress * 0.045).toFixed(4))
        }
        if (copy) {
          copy.style.setProperty('--hero-exit-y', `${(-progress * viewport * 0.065).toFixed(2)}px`)
          copy.style.setProperty('--hero-exit-opacity', Math.max(.16, 1 - progress * .84).toFixed(3))
        }
      })
    }

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    schedule()
    addEventListener('scroll', schedule, { passive: true })
    addEventListener('resize', schedule)

    return () => {
      removeEventListener('scroll', schedule)
      removeEventListener('resize', schedule)
      if (raf) cancelAnimationFrame(raf)
      delete root.dataset.scrollTimelineFallback
      heroes.forEach((hero) => {
        hero.querySelector<HTMLElement>('[data-route-hero-media]')?.style.removeProperty('--hero-exit-y')
        hero.querySelector<HTMLElement>('[data-route-hero-media]')?.style.removeProperty('--hero-exit-scale')
        hero.querySelector<HTMLElement>('[data-route-hero-copy]')?.style.removeProperty('--hero-exit-y')
        hero.querySelector<HTMLElement>('[data-route-hero-copy]')?.style.removeProperty('--hero-exit-opacity')
      })
    }
  }, [reducedMotion, routeKey])

  return null
}
