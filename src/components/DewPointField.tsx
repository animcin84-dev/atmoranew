import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from 'react'
import { CONDENSATION_NUCLEATION_PROGRESS } from '../lib/condensationTimeline'

export type DewPointFieldHandle = {
  setProgress: (progress: number) => void
}

type Props = {
  disabled?: boolean
}

type DropletSeed = {
  x: number
  y: number
  threshold: number
  radius: number
  stretch: number
}

function seededRandom(seed: number) {
  let state = seed >>> 0
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0
    return state / 4294967296
  }
}

export const DewPointField = forwardRef<DewPointFieldHandle, Props>(function DewPointField({ disabled = false }, forwardedRef) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const activeRef = useRef(false)
  const progressRef = useRef(0)
  const drawRef = useRef<(progress: number) => void>(() => {})

  const droplets = useMemo<readonly DropletSeed[]>(() => {
    const random = seededRandom(28419)
    const fins = [0.535, 0.585, 0.635, 0.685, 0.735, 0.785, 0.835, 0.885, 0.935, 0.978]
    return Array.from({ length: 128 }, (_, index) => ({
      x: fins[index % fins.length] + (random() - 0.5) * 0.014,
      y: 0.055 + random() * 0.70,
      threshold: CONDENSATION_NUCLEATION_PROGRESS + random() * 0.255,
      radius: 0.75 + random() * 3.1,
      stretch: 0.72 + random() * 0.52,
    }))
  }, [])

  useEffect(() => {
    if (disabled) return
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d', { alpha: true })
    if (!context) return

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const scale = Math.min(window.devicePixelRatio || 1, 1.6)
      canvas.width = Math.max(1, Math.round(rect.width * scale))
      canvas.height = Math.max(1, Math.round(rect.height * scale))
      context.setTransform(scale, 0, 0, scale, 0, 0)
      drawRef.current(progressRef.current)
    }

    const draw = (progress: number) => {
      progressRef.current = progress
      if (!activeRef.current) return
      const { width, height } = canvas.getBoundingClientRect()
      context.clearRect(0, 0, width, height)
      if (progress < CONDENSATION_NUCLEATION_PROGRESS) return

      context.save()
      context.globalCompositeOperation = 'screen'
      for (const droplet of droplets) {
        if (progress < droplet.threshold) continue
        const local = Math.min(1, (progress - droplet.threshold) / 0.18)
        const radius = droplet.radius * (0.25 + local * 1.15)
        const x = droplet.x * width
        const y = droplet.y * height
        context.beginPath()
        context.ellipse(x, y, radius * droplet.stretch, radius * (1 + local * 0.35), 0, 0, Math.PI * 2)
        context.fillStyle = `rgba(205,236,255,${0.08 + local * 0.28})`
        context.fill()
        context.beginPath()
        context.ellipse(x - radius * 0.2, y - radius * 0.32, Math.max(0.3, radius * 0.18), Math.max(0.3, radius * 0.24), 0, 0, Math.PI * 2)
        context.fillStyle = `rgba(255,255,255,${0.12 + local * 0.34})`
        context.fill()
      }

      if (progress >= 0.74) {
        const merge = Math.min(1, (progress - 0.74) / 0.14)
        for (let i = 0; i < 9; i += 1) {
          const x = (0.56 + i * 0.052) * width
          const y = (0.22 + (i % 4) * 0.12) * height
          const radius = 3 + merge * (5 + (i % 3) * 2)
          context.beginPath()
          context.ellipse(x, y, radius * 0.72, radius * 1.25, 0, 0, Math.PI * 2)
          context.fillStyle = `rgba(205,236,255,${0.08 + merge * 0.22})`
          context.fill()
        }
      }

      if (progress >= 0.85) {
        const flow = Math.min(1, (progress - 0.85) / 0.15)
        context.lineCap = 'round'
        for (let i = 0; i < 5; i += 1) {
          const x = (0.60 + i * 0.085) * width
          const startY = (0.34 + (i % 2) * 0.12) * height
          context.beginPath()
          context.moveTo(x, startY)
          context.lineTo(x + (i % 2 ? 1.5 : -1.5), startY + flow * height * (0.10 + i * 0.012))
          context.strokeStyle = `rgba(220,244,255,${0.10 + flow * 0.30})`
          context.lineWidth = 1.4 + flow * 1.3
          context.stroke()
        }
      }
      context.restore()
    }

    drawRef.current = draw
    const observer = new IntersectionObserver(([entry]) => {
      activeRef.current = entry.isIntersecting
      if (entry.isIntersecting) draw(progressRef.current)
      else context.clearRect(0, 0, canvas.width, canvas.height)
    }, { rootMargin: '20% 0px' })
    const resizeObserver = new ResizeObserver(resize)
    observer.observe(canvas)
    resizeObserver.observe(canvas)
    resize()

    return () => {
      observer.disconnect()
      resizeObserver.disconnect()
      drawRef.current = () => {}
      activeRef.current = false
    }
  }, [disabled, droplets])

  useImperativeHandle(forwardedRef, () => ({
    setProgress(progress: number) {
      progressRef.current = progress
      drawRef.current(progress)
    },
  }), [])

  if (disabled) return null
  return <canvas ref={canvasRef} className="dew-point-field" aria-hidden="true" />
})
