import type { DeviceWaterState } from '../../data/devices'

export function WaterStateBadge({ state }: { state: DeviceWaterState }) {
  const tone = state === 'VERIFIED FOR INTENDED USE' ? 'verified' : state === 'VERIFICATION' ? 'verification' : state === 'TREATED' ? 'treated' : 'raw'
  return <span className="water-state-badge" data-water-state={tone}>{state}</span>
}
