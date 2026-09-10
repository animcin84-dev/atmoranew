import {
  createContext,
  createElement,
  useContext,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react'

export type ConsolePreferences = {
  temperature: 'C' | 'F'
  volume: 'L' | 'gal'
  density: 'comfortable' | 'compact'
  reducedMotion: boolean
  notifications: boolean
}

type ConsolePreferencesContextValue = {
  preferences: ConsolePreferences
  setPreferences: Dispatch<SetStateAction<ConsolePreferences>>
}

const KEY = 'atmora-console-preferences-v1'
const defaults: ConsolePreferences = {
  temperature: 'C',
  volume: 'L',
  density: 'comfortable',
  reducedMotion: false,
  notifications: true,
}

const ConsolePreferencesContext = createContext<ConsolePreferencesContextValue | null>(null)

function readPreferences(): ConsolePreferences {
  if (typeof localStorage === 'undefined') return defaults
  try {
    return { ...defaults, ...JSON.parse(localStorage.getItem(KEY) ?? '{}') }
  } catch {
    return defaults
  }
}

export function ConsolePreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<ConsolePreferences>(readPreferences)

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(preferences))
    document.documentElement.dataset.consoleDensity = preferences.density
    document.documentElement.dataset.consoleMotion = preferences.reducedMotion ? 'reduced' : 'system'
  }, [preferences])

  useEffect(() => () => {
    delete document.documentElement.dataset.consoleDensity
    delete document.documentElement.dataset.consoleMotion
  }, [])

  const value = useMemo(() => ({ preferences, setPreferences }), [preferences])
  return createElement(ConsolePreferencesContext.Provider, { value }, children)
}

export function useConsolePreferences() {
  const context = useContext(ConsolePreferencesContext)
  if (!context) throw new Error('useConsolePreferences must be used within ConsolePreferencesProvider')
  return context
}
