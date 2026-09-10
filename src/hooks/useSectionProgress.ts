import { useEffect, useRef, type RefObject } from 'react'

export type SectionProgressHandler = (progress: number) => void

export function useSectionProgress(
  ref: RefObject<HTMLElement | null>,
  disabled = false,
  onProgress?: SectionProgressHandler,
) {
  const callbackRef = useRef(onProgress)

  useEffect(() => {
    callbackRef.current = onProgress
  }, [onProgress])

  useEffect(() => {
    let frame = 0

    const publish = (progress: number) => {
      const node = ref.current
      node?.style.setProperty('--section-progress', progress.toFixed(5))
      callbackRef.current?.(progress)
    }

    if (disabled) {
      publish(1)
      return
    }

    const update = () => {
      frame = 0
      const node = ref.current
      if (!node) return
      const rect = node.getBoundingClientRect()
      const scrollable = Math.max(1, node.offsetHeight - window.innerHeight)
      const travelled = Math.min(scrollable, Math.max(0, -rect.top))
      publish(travelled / scrollable)
    }

    const requestUpdate = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)

    return () => {
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [disabled, ref])
}
