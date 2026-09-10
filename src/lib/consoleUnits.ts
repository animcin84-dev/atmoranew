export type TemperatureUnit = 'C' | 'F'
export type VolumeUnit = 'L' | 'gal'

const US_GALLON_LITRES = 3.785411784

const round = (value: number, digits: number) => Number(value.toFixed(digits))

export function convertTemperature(valueC: number, unit: TemperatureUnit): number {
  return unit === 'F' ? round((valueC * 9) / 5 + 32, 1) : round(valueC, 1)
}

export function convertVolume(valueL: number, unit: VolumeUnit): number {
  return unit === 'gal' ? round(valueL / US_GALLON_LITRES, 1) : round(valueL, 1)
}

export function convertEnergyIntensity(kwhPerL: number, volumeUnit: VolumeUnit): number {
  return volumeUnit === 'gal' ? round(kwhPerL * US_GALLON_LITRES, 2) : round(kwhPerL, 2)
}

export function temperatureLabel(unit: TemperatureUnit): '°C' | '°F' {
  return unit === 'F' ? '°F' : '°C'
}

export function volumeLabel(unit: VolumeUnit): 'L' | 'gal' {
  return unit
}

export function energyLabel(unit: VolumeUnit): 'kWh/L' | 'kWh/gal' {
  return unit === 'gal' ? 'kWh/gal' : 'kWh/L'
}
