import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { site } from '../content/site'
import { useDemo } from '../lib/store'
import { Icon, type IconName } from './Icon'
import { Sheet } from './Sheet'
import { Wordmark } from './Wordmark'

export const navItems: { to: string; label: string; icon: IconName; isNew?: boolean }[] = [
  { to: '/campaigns', label: 'Campaigns', icon: 'map' },
  { to: '/quests', label: 'Quests', icon: 'shelf' },
  { to: '/packs', label: 'Packs', icon: 'pack', isNew: true },
  { to: '/pricing', label: 'Pricing', icon: 'scale' },
  { to: '/realm', label: 'Realm', icon: 'tower' },
]

export function Switch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="group inline-flex min-h-11 shrink-0 items-center gap-2 text-[13px] font-semibold text-text"
    >
      <span
        className={`relative block h-[22px] w-[38px] shrink-0 rounded-full border transition-colors duration-150 ${
          checked ? 'border-brass bg-brass/85' : 'border-line-strong bg-raised'
        }`}
        aria-hidden="true"
      >
        <span
          className={`absolute top-[2px] left-0 block size-4 rounded-full shadow transition-transform duration-150 ${
            checked ? 'translate-x-[18px] bg-ground' : 'translate-x-[2px] bg-muted'
          }`}
        />
      </span>
      <span>{label}</span>
    </button>
  )
}

function ConceptLine({ className = '' }: { className?: string }) {
  return (
    <p className={className}>
      <Link to="/concept" className="font-semibold text-brass-bright underline decoration-brass/40 underline-offset-[3px]">
        {site.conceptBar.line}
      </Link>{' '}
      <a
        href={site.realSiteUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="underline decoration-faint underline-offset-[3px]"
      >
        {site.conceptBar.notReal}
      </a>
    </p>
  )
}

function ConceptBar({ barRef }: { barRef: React.RefObject<HTMLDivElement | null> }) {
  const pinsOn = useDemo((s) => s.pinsOn)
  const setPinsOn = useDemo((s) => s.setPinsOn)
  const hintDismissed = useDemo((s) => s.hintDismissed)
  const dismissHint = useDemo((s) => s.dismissHint)
  return (
    <div ref={barRef} role="region" aria-label="Concept notice" className="relative z-40 border-b border-brass/25 bg-[#17130d]">
      <div className="wrap flex flex-col gap-x-4 pt-[max(8px,env(safe-area-inset-top))] sm:flex-row sm:items-center sm:justify-between sm:py-1.5">
        <ConceptLine className="text-[13px] leading-snug text-text/90 md:text-[13.5px]" />
        <Switch checked={pinsOn} onChange={setPinsOn} label={site.conceptBar.changesSwitch} />
      </div>
      {!hintDismissed && pinsOn && (
        <div className="border-t border-brass/15 bg-brass/[0.07]">
          <div className="wrap flex min-h-10 items-center justify-between gap-3 text-[13.5px] text-brass-bright">
            <span className="flex items-center gap-2">
              <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
                <circle cx="10" cy="10" r="6.2" fill="url(#pinShine)" />
              </svg>
              {site.conceptBar.firstVisitHint}
            </span>
            <button
              type="button"
              onClick={dismissHint}
              aria-label="Dismiss hint"
              className="-mr-2 grid size-10 shrink-0 place-items-center rounded-full text-brass hover:bg-brass/10"
            >
              <Icon name="close" size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function ConceptPill() {
  const [open, setOpen] = useState(false)
  const pinsOn = useDemo((s) => s.pinsOn)
  const setPinsOn = useDemo((s) => s.setPinsOn)
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="anim-fade relative inline-flex h-8 items-center gap-1.5 rounded-full border border-brass/50 bg-[#1b160f] px-3 text-[12px] font-bold tracking-[0.08em] text-brass-bright uppercase before:absolute before:-inset-1.5 before:content-['']"
        aria-label="Concept demo. Show details"
      >
        <span className="size-1.5 rounded-full bg-brass" aria-hidden="true" />
        {site.conceptBar.pill}
      </button>
      <Sheet open={open} onClose={() => setOpen(false)} labelledBy="concept-pill-title" maxWidth={440}>
        <div className="px-5 pt-3 md:px-6 md:pt-5">
          <h2 id="concept-pill-title" className="pr-10 text-[1.4rem]">
            This is a concept
          </h2>
          <ConceptLine className="mt-2 text-[15.5px] leading-relaxed text-muted" />
          <div className="mt-4 rounded-[10px] border border-hairline bg-raised px-4 py-1">
            <Switch checked={pinsOn} onChange={setPinsOn} label={site.conceptBar.changesSwitch} />
          </div>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 pb-2 text-[14.5px]">
            <Link to="/concept" onClick={() => setOpen(false)} className="link inline-flex min-h-11 items-center">
              {site.conceptBar.aboutLink}
            </Link>
            <a href={site.realSiteUrl} target="_blank" rel="noopener noreferrer" className="link inline-flex min-h-11 items-center">
              The real {site.brand}
            </a>
          </div>
        </div>
      </Sheet>
    </>
  )
}

function Header({ showPill }: { showPill: boolean }) {
  const pinsOn = useDemo((s) => s.pinsOn)
  return (
    <header className="sticky top-0 z-30 border-b border-hairline/80 bg-ground/92 backdrop-saturate-150 supports-[backdrop-filter]:bg-ground/85 supports-[backdrop-filter]:backdrop-blur-[6px]">
      <div className="wrap flex h-14 items-center justify-between gap-4 md:h-16">
        <Link to="/" className="-ml-1 flex min-h-11 items-center px-1" aria-label={`${site.wordmark}, home`}>
          <Wordmark />
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {navItems.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) =>
                `relative flex min-h-11 items-center gap-1.5 rounded-[8px] px-3.5 text-[15px] font-medium transition-colors ${
                  isActive ? 'text-brass-bright' : 'text-text/85 hover:text-text'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {n.label}
                  {n.isNew && pinsOn && <span className="size-1.5 rounded-full bg-brass" aria-label="(new)" />}
                  {isActive && <span className="absolute inset-x-3.5 -bottom-[11px] h-0.5 rounded-full bg-brass" aria-hidden="true" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          {showPill && <ConceptPill />}
          <Link
            to="/learn/2d-top-down-character-movement/1"
            className="hidden min-h-10 items-center rounded-[9px] bg-ember px-4 text-[14.5px] font-semibold text-[#1a0e07] hover:bg-ember-bright lg:inline-flex"
          >
            {site.home.primaryCta}
          </Link>
        </div>
      </div>
    </header>
  )
}

function TabBar() {
  const pinsOn = useDemo((s) => s.pinsOn)
  const { pathname } = useLocation()
  if (pathname.startsWith('/learn/')) return null
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-hairline bg-[#0f0d0b]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-[6px] md:hidden"
    >
      <ul className="mx-auto grid h-16 max-w-[520px] grid-cols-5">
        {navItems.map((n) => (
          <li key={n.to}>
            <NavLink
              to={n.to}
              className={({ isActive }) =>
                `relative flex h-full flex-col items-center justify-center gap-0.5 text-[11.5px] font-semibold ${
                  isActive ? 'text-brass-bright' : 'text-muted'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && <span className="absolute top-0 h-0.5 w-8 rounded-full bg-brass" aria-hidden="true" />}
                  <span className="relative">
                    <Icon name={n.icon} size={23} />
                    {n.isNew && pinsOn && (
                      <span className="absolute -top-0.5 -right-1.5 size-2 rounded-full bg-brass ring-2 ring-[#0f0d0b]" aria-hidden="true" />
                    )}
                  </span>
                  {n.label}
                  {n.isNew && pinsOn && <span className="sr-only">(new)</span>}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

function Footer() {
  const { pathname } = useLocation()
  const noTabs = pathname.startsWith('/learn/')
  return (
    <footer className={`mt-20 border-t border-hairline bg-[#0d0b09] md:pb-10 ${noTabs ? 'pb-8' : 'pb-[calc(var(--tabbar-h)+24px)]'}`}>
      <div className="wrap grid gap-8 py-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Wordmark />
          <p className="mt-3 max-w-[48ch] text-[14.5px] leading-relaxed text-muted">{site.footer.note}</p>
        </div>
        <nav aria-label="Footer">
          <div className="eyebrow mb-2">Explore</div>
          <ul className="grid grid-cols-2 gap-x-4 text-[15px] md:grid-cols-1">
            {navItems.map((n) => (
              <li key={n.to}>
                <Link to={n.to} className="inline-flex min-h-10 items-center text-text/85 hover:text-text">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <div className="eyebrow mb-2">The concept</div>
          <ul className="text-[15px]">
            <li>
              <Link to="/concept" className="inline-flex min-h-10 items-center text-text/85 hover:text-text">
                {site.conceptBar.aboutLink}
              </Link>
            </li>
            <li>
              <a href={site.realSiteUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-1.5 text-text/85 hover:text-text">
                The real {site.brand} <Icon name="external" size={15} />
              </a>
            </li>
            <li>
              <Link to="/realm#demo" className="inline-flex min-h-10 items-center text-text/85 hover:text-text">
                Reset demo
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}

export function Layout({ children }: { children: ReactNode }) {
  const barRef = useRef<HTMLDivElement>(null)
  const [barGone, setBarGone] = useState(false)
  const { pathname, hash } = useLocation()

  useEffect(() => {
    const el = barRef.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setBarGone(!e.isIntersecting), { threshold: 0 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (hash) {
      const t = window.setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ block: 'start' }), 60)
      return () => window.clearTimeout(t)
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded-md focus:bg-brass focus:px-4 focus:py-2 focus:text-ink"
      >
        Skip to content
      </a>
      <ConceptBar barRef={barRef} />
      <Header showPill={barGone} />
      <main id="main" className="min-h-[60dvh]">
        {children}
      </main>
      <Footer />
      <TabBar />
    </>
  )
}
