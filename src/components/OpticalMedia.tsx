import { useRef, type PointerEvent, type ReactNode } from 'react'
import { useReducedData } from '../hooks/useReducedData'
import { useReducedMotion } from '../hooks/useReducedMotion'

type Props = { children: ReactNode; className?: string; intensity?: number }

export function OpticalMedia({ children, className = '', intensity = 1 }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()
  const reducedData = useReducedData()
  const disabled = reducedMotion || reducedData

  const reset = () => {
    ref.current?.style.setProperty('--optical-x', '0px')
    ref.current?.style.setProperty('--optical-y', '0px')
  }

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'touch') reset()
  }

  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (disabled || event.pointerType === 'touch' || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width - .5
    const y = (event.clientY - rect.top) / rect.height - .5
    ref.current.style.setProperty('--optical-x', `${x * 9 * intensity}px`)
    ref.current.style.setProperty('--optical-y', `${y * 7 * intensity}px`)
    ref.current.style.setProperty('--optical-glint-x', `${(x + .5) * 100}%`)
    ref.current.style.setProperty('--optical-glint-y', `${(y + .5) * 100}%`)
  }

  return (
    <div
      ref={ref}
      className={`optical-media ${className}`.trim()}
      data-media-reveal
      data-reduced-data={reducedData ? 'true' : 'false'}
      onPointerDown={handlePointerDown}
      onPointerMove={move}
      onPointerLeave={reset}
      onPointerCancel={reset}
    >
      {children}
    </div>
  )
}
