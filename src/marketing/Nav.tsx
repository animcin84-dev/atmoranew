import { useCallback, useEffect, useRef, useState } from 'react'
import { RouteLink } from '../components/RouteLink'
import { useRouter } from '../hooks/useRouter'
import { AtmoraWordmark } from '../components/AtmoraWordmark'

const links = [
  ['Technology', '/technology'],
  ['Platform', '/platform'],
  ['Pilot', '/pilot'],
  ['Atmora Lab', '/lab'],
  ['Operator demo', '/app/overview'],
] as const

export function Nav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { route } = useRouter()
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const mobilePanelRef = useRef<HTMLDivElement>(null)

  const closeMenu = useCallback((restoreFocus = false) => {
    setOpen(false)
    if (restoreFocus) requestAnimationFrame(() => menuButtonRef.current?.focus())
  }, [])

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 56)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const backgrounds = [
      document.getElementById('main'),
      document.querySelector<HTMLElement>('.footer'),
    ].filter((node): node is HTMLElement => Boolean(node))
    backgrounds.forEach((node) => { node.inert = true })

    const focusables = () => Array.from(
      mobilePanelRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])') ?? [],
    ).filter((node) => !node.hasAttribute('disabled') && node.getAttribute('aria-hidden') !== 'true')

    requestAnimationFrame(() => focusables()[0]?.focus())

    const key = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeMenu(true)
        return
      }
      if (event.key === 'Tab') {
        const items = focusables()
        if (!items.length) return
        const first = items[0]
        const last = items[items.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }

    window.addEventListener('keydown', key)
    return () => {
      document.body.style.overflow = previousOverflow
      backgrounds.forEach((node) => { node.inert = false })
      window.removeEventListener('keydown', key)
    }
  }, [closeMenu, open])

  return (
    <header className="site-nav" data-surface={route.path === '/privacy' ? 'light' : 'dark'} data-open={open ? 'true' : 'false'} data-scrolled={scrolled ? 'true' : 'false'}>
      <RouteLink className="site-nav__brand" to="/" aria-label="Atmora home"><AtmoraWordmark /></RouteLink>
      <nav className="site-nav__links" aria-label="Primary navigation">
        {links.map(([label, to]) => <RouteLink key={to} to={to} aria-current={route.path === to ? 'page' : undefined}>{label}</RouteLink>)}
      </nav>
      <RouteLink className="site-nav__cta" to="/pilot#assessment">Assess your site <span aria-hidden="true">→</span></RouteLink>
      <button
        ref={menuButtonRef}
        className="site-nav__menu-button"
        type="button"
        aria-expanded={open}
        aria-controls="mobile-navigation"
        onClick={() => open ? closeMenu(true) : setOpen(true)}
      >
        <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span><i /><i />
      </button>
      <div
        ref={mobilePanelRef}
        id="mobile-navigation"
        className="site-nav__mobile"
        role="dialog"
        aria-modal={open ? 'true' : undefined}
        aria-label="Site navigation"
        aria-hidden={!open}
      >
        <nav aria-label="Mobile navigation">
          {links.map(([label, to], index) => (
            <RouteLink key={to} to={to} tabIndex={open ? undefined : -1} aria-current={route.path === to ? 'page' : undefined} onClick={() => closeMenu(false)}>
              <span className="mono">0{index + 1}</span>{label}
            </RouteLink>
          ))}
          <RouteLink to="/pilot#assessment" tabIndex={open ? undefined : -1} onClick={() => closeMenu(false)}><span className="mono">06</span>Assess your site</RouteLink>
        </nav>
      </div>
    </header>
  )
}
