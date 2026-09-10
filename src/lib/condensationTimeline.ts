export type CondensationStageKey =
  | 'ambient'
  | 'cooling'
  | 'threshold'
  | 'nucleation'
  | 'growth'
  | 'coalescence'
  | 'flow'
  | 'collection'

export type CondensationStage = {
  index: string
  key: CondensationStageKey
  label: string
  description: string
  start: number
  end: number
  waterVisible: boolean
}

export type CondensationState = {
  progress: number
  stage: CondensationStage
  surfaceTempC: number
  dewPointC: number
  deltaC: number
  thresholdCrossed: boolean
  waterVisible: boolean
}

export const CONDENSATION_DEW_POINT_C = 19.6
export const CONDENSATION_THRESHOLD_PROGRESS = 0.5
export const CONDENSATION_NUCLEATION_PROGRESS = 0.54

export const CONDENSATION_TIMELINE: readonly CondensationStage[] = [
  { index: '01', key: 'ambient', label: 'Ambient air', description: 'Moist air passes across a colder surface.', start: 0, end: 0.13, waterVisible: false },
  { index: '02', key: 'cooling', label: 'Cooling', description: 'Surface temperature is driven toward the local dew point.', start: 0.13, end: 0.34, waterVisible: false },
  { index: '03', key: 'threshold', label: 'Threshold', description: 'The surface reaches the dew point before visible nucleation begins.', start: 0.34, end: 0.54, waterVisible: false },
  { index: '04', key: 'nucleation', label: 'Nucleation', description: 'Microscopic droplets begin forming on the cold surface.', start: 0.54, end: 0.64, waterVisible: true },
  { index: '05', key: 'growth', label: 'Growth', description: 'More vapor condenses into existing droplets.', start: 0.64, end: 0.74, waterVisible: true },
  { index: '06', key: 'coalescence', label: 'Coalescence', description: 'Nearby droplets merge and gain mass.', start: 0.74, end: 0.85, waterVisible: true },
  { index: '07', key: 'flow', label: 'Flow', description: 'Gravity pulls the water film downward.', start: 0.85, end: 0.94, waterVisible: true },
  { index: '08', key: 'collection', label: 'Collection', description: 'Condensate leaves the surface for the water pathway.', start: 0.94, end: 1.000001, waterVisible: true },
] as const

export function clampCondensationProgress(progress: number): number {
  if (!Number.isFinite(progress)) return 0
  return Math.max(0, Math.min(1, progress))
}

export function condensationStageAt(progress: number): CondensationStage {
  const p = clampCondensationProgress(progress)
  return CONDENSATION_TIMELINE.find((stage) => p >= stage.start && p < stage.end) ?? CONDENSATION_TIMELINE.at(-1)!
}

export function condensationSurfaceTempAt(progress: number): number {
  const p = clampCondensationProgress(progress)
  const start = 25.2
  const dew = CONDENSATION_DEW_POINT_C
  const end = 16.1
  if (p <= CONDENSATION_THRESHOLD_PROGRESS) {
    const t = p / CONDENSATION_THRESHOLD_PROGRESS
    return start + (dew - start) * t
  }
  const t = (p - CONDENSATION_THRESHOLD_PROGRESS) / (1 - CONDENSATION_THRESHOLD_PROGRESS)
  return dew + (end - dew) * t
}

export function condensationStateAt(progress: number): CondensationState {
  const p = clampCondensationProgress(progress)
  const stage = condensationStageAt(p)
  const surfaceTempC = condensationSurfaceTempAt(p)
  const deltaC = surfaceTempC - CONDENSATION_DEW_POINT_C
  const thresholdCrossed = p >= CONDENSATION_THRESHOLD_PROGRESS && deltaC <= 0.000001
  return {
    progress: p,
    stage,
    surfaceTempC,
    dewPointC: CONDENSATION_DEW_POINT_C,
    deltaC,
    thresholdCrossed,
    waterVisible: thresholdCrossed && stage.waterVisible,
  }
}
