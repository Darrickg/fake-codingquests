import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router'
import { pins, recommendations, type PinId } from '../content/pins'
import { useDemo } from '../lib/store'
import { useUI } from '../lib/ui'
import { useIsDesktop } from '../lib/useMedia'
import { Sheet } from './Sheet'
import { Icon } from './Icon'

/** Small brass "New" pin. Only elements from our three recommendations carry one. */
export function Pin({ id, tone = 'dark', className = '' }: { id: PinId; tone?: 'dark' | 'light'; className?: string }) {
  const pinsOn = useDemo((s) => s.pinsOn)
  const dismissHint = useDemo((s) => s.dismissHint)
  const openPin = useUI((s) => s.openPin)
  const active = useUI((s) => s.pin?.id === id)
  if (!pinsOn) return null
  const rec = recommendations[pins[id].rec]
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        dismissHint()
        openPin(id, e.currentTarget)
      }}
      aria-haspopup="dialog"
      aria-expanded={active}
      aria-label={`New: ${rec.name}. What we changed and why`}
      className={`group relative inline-flex h-7 shrink-0 items-center gap-1.5 rounded-full border pr-2.5 pl-1 align-middle text-[11.5px] font-bold tracking-[0.08em] uppercase transition-colors duration-150 before:absolute before:-inset-2 before:content-[''] ${
        tone === 'dark'
          ? 'border-brass/55 bg-[#1b160f] text-brass-bright hover:border-brass hover:bg-[#241d13]'
          : 'border-brass-ink/45 bg-[#f3e8d0] text-brass-ink hover:border-brass-ink'
      } ${active ? 'ring-2 ring-brass/60' : ''} ${className}`}
    >
      <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true">
        <circle cx="10" cy="10" r="6.2" fill="url(#pinShine)" />
        <circle cx="10" cy="10" r="6.2" fill="none" stroke="#5c4519" strokeWidth=".8" />
        <circle cx="8.2" cy="8.1" r="1.6" fill="#fbecc4" opacity=".85" />
      </svg>
      New
    </button>
  )
}

function PinBody({ id, titleId }: { id: PinId; titleId: string }) {
  const pin = pins[id]
  const rec = recommendations[pin.rec]
  const closePin = useUI((s) => s.closePin)
  return (
    <div className="px-5 pt-3 pb-1 md:px-6 md:pt-5">
      <div className="eyebrow mb-1.5 flex items-center gap-2">
        <span className="grid size-5 place-items-center rounded-full bg-brass text-[11px] tracking-normal text-ink">{rec.letter}</span>
        Our recommendation
      </div>
      <h2 id={titleId} className="pr-10 text-[1.45rem]">
        {rec.name}
      </h2>
      <p className="mt-2 text-[16px] leading-snug font-medium text-text">{pin.change}</p>
      <dl className="mt-4 space-y-3.5 text-[15px] leading-relaxed">
        <div>
          <dt className="mb-0.5 text-[12px] font-semibold tracking-[0.12em] text-brass uppercase">Why</dt>
          <dd className="text-muted">{rec.why}</dd>
        </div>
        <div>
          <dt className="mb-0.5 text-[12px] font-semibold tracking-[0.12em] text-brass uppercase">What we would measure</dt>
          <dd className="text-muted">{rec.measure}</dd>
        </div>
      </dl>
      <Link
        to="/concept"
        onClick={closePin}
        className="mt-4 inline-flex min-h-11 items-center gap-1.5 text-[14.5px] font-semibold text-brass-bright"
      >
        All three recommendations <Icon name="arrow" size={16} />
      </Link>
    </div>
  )
}

/** Renders the open pin as a bottom sheet (phones) or popover (desktop). */
export function PinLayer() {
  const pin = useUI((s) => s.pin)
  const closePin = useUI((s) => s.closePin)
  const isDesktop = useIsDesktop()
  if (!pin) return null
  if (!isDesktop || !pin.rect) {
    return (
      <Sheet open onClose={closePin} labelledBy="pin-title">
        <PinBody id={pin.id} titleId="pin-title" />
      </Sheet>
    )
  }
  return <Popover id={pin.id} rect={pin.rect} trigger={pin.trigger} onClose={closePin} />
}

function Popover({ id, rect, trigger, onClose }: { id: PinId; rect: DOMRect; trigger: HTMLElement | null; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState<{ top: number; left: number; above: boolean }>({ top: -9999, left: 0, above: false })

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const w = el.offsetWidth
    const h = el.offsetHeight
    const vw = window.innerWidth
    const vh = window.innerHeight
    const left = Math.min(Math.max(12, rect.left + rect.width / 2 - w / 2), vw - w - 12)
    const below = rect.bottom + 10
    const above = below + h > vh - 12 && rect.top - h - 10 > 12
    setPos({ top: above ? rect.top - h - 10 : below, left, above })
    el.focus()
  }, [rect])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    const onDown = (e: PointerEvent) => {
      if (ref.current?.contains(e.target as Node) || trigger?.contains(e.target as Node)) return
      onClose()
    }
    const onScroll = () => onClose()
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onDown)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onDown)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      trigger?.focus()
    }
  }, [onClose, trigger])

  return createPortal(
    <div
      ref={ref}
      role="dialog"
      aria-labelledby="pin-pop-title"
      tabIndex={-1}
      className="anim-pop fixed z-[90] w-[380px] rounded-[12px] border border-brass/35 bg-surface pb-4 shadow-[0_24px_48px_-12px_rgba(0,0,0,.85)] outline-none"
      style={{ top: pos.top, left: pos.left }}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-2 right-2 grid size-10 place-items-center rounded-full text-muted hover:bg-raised"
        aria-label="Close"
      >
        <Icon name="close" size={18} />
      </button>
      <PinBody id={id} titleId="pin-pop-title" />
    </div>,
    document.body,
  )
}
