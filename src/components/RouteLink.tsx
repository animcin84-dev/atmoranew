import type { AnchorHTMLAttributes, FocusEvent, MouseEvent, PointerEvent, ReactNode } from 'react'
import { useRouter } from '../hooks/useRouter'
import { preloadRouteHero } from '../lib/assets'

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  to: string
  children: ReactNode
}

export function RouteLink({ to, children, onClick, onPointerEnter, onFocus, target, ...props }: Props) {
  const { navigate } = useRouter()

  const warmDestination = () => {
    const url = new URL(to, window.location.href)
    if (url.origin === window.location.origin) preloadRouteHero(url.pathname)
  }

  const handlePointerEnter = (event: PointerEvent<HTMLAnchorElement>) => {
    onPointerEnter?.(event)
    if (!event.defaultPrevented && event.pointerType !== 'touch') warmDestination()
  }

  const handleFocus = (event: FocusEvent<HTMLAnchorElement>) => {
    onFocus?.(event)
    if (!event.defaultPrevented) warmDestination()
  }

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event)
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      target === '_blank'
    ) return

    const url = new URL(to, window.location.href)
    if (url.origin !== window.location.origin) return

    event.preventDefault()
    navigate(`${url.pathname}${url.hash}`)
  }

  return <a {...props} href={to} target={target} onPointerEnter={handlePointerEnter} onFocus={handleFocus} onClick={handleClick}>{children}</a>
}
