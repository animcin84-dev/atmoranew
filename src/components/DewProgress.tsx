import { useEffect, useRef } from 'react'
import { useRouter } from '../hooks/useRouter'

export function DewProgress() {
  const { route } = useRouter()
  const barRef = useRef<HTMLSpanElement>(null)
  const markerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    let frame: number | null = null

    const update = () => {
      frame = null
      const root = document.documentElement
      const max = Math.max(1, root.scrollHeight - window.innerHeight)
      const progress = Math.max(0, Math.min(1, window.scrollY / max))
      if (barRef.current) barRef.current.style.transform = `scaleX(${progress})`
      if (markerRef.current) markerRef.current.style.left = `${progress * 100}%`
      root.style.setProperty('--page-progress', progress.toFixed(5))
    }

    const requestUpdate = () => {
      if (frame === null) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)
    return () => {
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
      if (frame !== null) cancelAnimationFrame(frame)
    }
  }, [route.path])

  return (
    <div className="dew-progress" aria-hidden="true">
      <span ref={barRef} />
      <i ref={markerRef} />
    </div>
  )
}
