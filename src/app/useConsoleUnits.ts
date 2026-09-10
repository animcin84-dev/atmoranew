import { useConsolePreferences } from './useConsolePreferences'
import {
  convertEnergyIntensity,
  convertTemperature,
  convertVolume,
  energyLabel,
  temperatureLabel,
  volumeLabel,
} from '../lib/consoleUnits'

export function useConsoleUnits() {
  const { preferences } = useConsolePreferences()
  const temperature = (valueC: number) => convertTemperature(valueC, preferences.temperature)
  const volume = (valueL: number) => convertVolume(valueL, preferences.volume)
  const energy = (valueKwhPerL: number) => convertEnergyIntensity(valueKwhPerL, preferences.volume)
  return {
    preferences,
    temperature,
    temperatureUnit: temperatureLabel(preferences.temperature),
    volume,
    volumeUnit: volumeLabel(preferences.volume),
    energy,
    energyUnit: energyLabel(preferences.volume),
    temperatureSeries: (values: readonly number[]) => values.map(temperature),
    volumeSeries: (values: readonly number[]) => values.map(volume),
    energySeries: (values: readonly number[]) => values.map(energy),
  }
}
