import { useCallback, useRef, useState } from 'react'
import { DewPointField, type DewPointFieldHandle } from '../components/DewPointField'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { useReducedData } from '../hooks/useReducedData'
import { useSectionProgress } from '../hooks/useSectionProgress'
import { ATMORA_ASSETS } from '../lib/assets'
import {
  CONDENSATION_TIMELINE,
  condensationStateAt,
  type CondensationStage,
} from '../lib/condensationTimeline'

const cross = (progress: number, center: number, spread = 0.25) => Math.max(0, 1 - Math.abs(progress - center) / spread)

export function CondensationStory() {
  const ref = useRef<HTMLElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const ambientRef = useRef<HTMLImageElement>(null)
  const growthRef = useRef<HTMLImageElement>(null)
  const flowRef = useRef<HTMLImageElement>(null)
  const surfaceValueRef = useRef<HTMLElement>(null)
  const thresholdStateRef = useRef<HTMLSpanElement>(null)
  const surfaceLineRef = useRef<SVGLineElement>(null)
  const pointRef = useRef<SVGCircleElement>(null)
  const progressRef = useRef<HTMLElement>(null)
  const fieldRef = useRef<DewPointFieldHandle>(null)
  const reduced = useReducedMotion()
  const reducedData = useReducedData()
  const [stage, setStage] = useState<CondensationStage>(CONDENSATION_TIMELINE[0])
  const stageKeyRef = useRef(stage.key)

  const onProgress = useCallback((progress: number) => {
    const state = condensationStateAt(progress)
    const y = 24 + Math.min(88, progress * 88)

    if (state.stage.key !== stageKeyRef.current) {
      stageKeyRef.current = state.stage.key
      setStage(state.stage)
    }

    if (stickyRef.current) {
      stickyRef.current.dataset.condensationStage = state.stage.key
      stickyRef.current.dataset.thresholdCrossed = state.thresholdCrossed ? 'true' : 'false'
      stickyRef.current.style.setProperty('--condensation-progress', progress.toFixed(5))
    }

    if (surfaceValueRef.current) surfaceValueRef.current.textContent = `${state.surfaceTempC.toFixed(1)}°C`
    if (thresholdStateRef.current) {
      thresholdStateRef.current.textContent = state.thresholdCrossed
        ? (state.waterVisible ? 'CONDENSING' : 'THRESHOLD CROSSED')
        : `${state.deltaC.toFixed(1)}° ABOVE`
      thresholdStateRef.current.classList.toggle('is-crossed', state.thresholdCrossed)
    }

    surfaceLineRef.current?.setAttribute('y2', String(y))
    pointRef.current?.setAttribute('cx', String(10 + progress * 340))
    pointRef.current?.setAttribute('cy', String(y))
    if (progressRef.current) progressRef.current.style.transform = `scaleX(${progress})`
    fieldRef.current?.setProgress(progress)

    if (ambientRef.current) ambientRef.current.style.opacity = String(cross(progress, 0.24, 0.46))
    if (growthRef.current) growthRef.current.style.opacity = String(state.waterVisible ? cross(progress, 0.70, 0.24) : 0)
    if (flowRef.current) {
      const flowVisible = state.stage.key === 'flow' || state.stage.key === 'collection'
      flowRef.current.style.opacity = String(flowVisible ? cross(progress, 0.93, 0.2) : 0)
    }
  }, [])

  useSectionProgress(ref, reduced, onProgress)

  return (
    <section id="condensation" ref={ref} className={`condensation ${reduced ? 'condensation--reduced' : ''}`} aria-labelledby="condensation-title">
      <div ref={stickyRef} className="condensation__sticky" data-condensation-stage={stage.key} data-threshold-crossed="false">
        <div className="condensation__media" aria-hidden="true">
          <img ref={ambientRef} src={ATMORA_ASSETS.condensationAmbient.src} alt="" width={ATMORA_ASSETS.condensationAmbient.width} height={ATMORA_ASSETS.condensationAmbient.height} loading="lazy" decoding="async" />
          <img ref={growthRef} src={ATMORA_ASSETS.condensationGrowth.src} alt="" width={ATMORA_ASSETS.condensationGrowth.width} height={ATMORA_ASSETS.condensationGrowth.height} loading="lazy" decoding="async" style={{ opacity: 0 }} />
          <img ref={flowRef} src={ATMORA_ASSETS.condensationFlow.src} alt="" width={ATMORA_ASSETS.condensationFlow.width} height={ATMORA_ASSETS.condensationFlow.height} loading="lazy" decoding="async" style={{ opacity: 0 }} />
          <DewPointField ref={fieldRef} disabled={reduced || reducedData} />
          <div className="condensation__shade" />
        </div>
        <div className="container condensation__layout">
          <div className="condensation__copy">
            <p className="kicker">Condensation observatory / 02</p>
            <h2 id="condensation-title" className="display display--md">Watch air<br />cross the line.</h2>
            <div className="condensation__stage">
              <span className="mono">{stage.index}</span>
              <div><strong>{stage.label}</strong><p>{stage.description}</p></div>
            </div>
          </div>
          <div className="threshold" aria-label="Illustrative threshold instrument. Surface temperature cools to the dew point before visible condensation begins.">
            <div className="threshold__head">
              <span className="data-label">Threshold</span>
              <span ref={thresholdStateRef} className="threshold__state mono">5.6° ABOVE</span>
            </div>
            <div className="threshold__values" aria-hidden="true">
              <div><span>Surface temp</span><strong ref={surfaceValueRef} className="mono">25.2°C</strong></div>
              <div><span>Dew point</span><strong className="mono">19.6°C</strong></div>
            </div>
            <svg viewBox="0 0 360 120" role="img" aria-label="Surface temperature approaches, crosses, then remains below the dew point before nucleation begins">
              <line x1="10" y1="78" x2="350" y2="78" className="threshold__dew" />
              <line ref={surfaceLineRef} x1="10" y1="24" x2="350" y2="24" className="threshold__surface" />
              <circle ref={pointRef} cx="10" cy="24" r="5" />
            </svg>
            <div className="threshold__progress"><i ref={progressRef} /></div>
          </div>
        </div>
      </div>
      <ol className={reduced ? 'condensation__static container' : 'sr-only'} aria-label="Condensation process">
        {CONDENSATION_TIMELINE.map((item) => <li key={item.key}><span className="mono">{item.index}</span><strong>{item.label}</strong><p>{item.description}</p></li>)}
      </ol>
    </section>
  )
}
