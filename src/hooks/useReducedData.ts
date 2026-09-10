import { useEffect, useState } from 'react'

type NetworkInformationLike = EventTarget & {
  saveData?: boolean
}

type NavigatorWithConnection = Navigator & {
  connection?: NetworkInformationLike
  mozConnection?: NetworkInformationLike
  webkitConnection?: NetworkInformationLike
}

function dataConnection(): NetworkInformationLike | undefined {
  if (typeof navigator === 'undefined') return undefined
  const nav = navigator as NavigatorWithConnection
  return nav.connection ?? nav.mozConnection ?? nav.webkitConnection
}

export function isReducedDataRequested(): boolean {
  const connection = dataConnection()
  if (connection?.saveData) return true
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false
  return window.matchMedia('(prefers-reduced-data: reduce)').matches
}

export function useReducedData(): boolean {
  const [reduced, setReduced] = useState(isReducedDataRequested)

  useEffect(() => {
    const connection = dataConnection()
    const media = typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-reduced-data: reduce)')
      : undefined
    const update = () => setReduced(isReducedDataRequested())

    connection?.addEventListener?.('change', update)
    media?.addEventListener?.('change', update)
    update()

    return () => {
      connection?.removeEventListener?.('change', update)
      media?.removeEventListener?.('change', update)
    }
  }, [])

  return reduced
}
