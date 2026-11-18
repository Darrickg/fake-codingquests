import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Icon } from './Icon'

/**
 * Bottom sheet on phones, centred dialog on desktop.
 * Escape and the scrim close it. Focus moves in and returns to the trigger.
 */
export function Sheet({
  open,
  onClose,
  labelledBy,
  children,
  tone = 'dark',
  maxWidth = 520,
}: {
  open: boolean
  onClose: () => void
  labelledBy: string
  children: ReactNode
  tone?: 'dark' | 'parchment'
  maxWidth?: number
}) {
  const panel = useRef<HTMLDivElement>(null)
  const restore = useRef<Element | null>(null)

  useEffect(() => {
    if (!open) return
    restore.current = document.activeElement
    const t = window.setTimeout(() => {
      const first = panel.current?.querySelector<HTMLElement>('[data-autofocus]') ?? panel.current
      first?.focus()
    }, 20)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'Tab' && panel.current) {
        const els = panel.current.querySelectorAll<HTMLElement>(
          'a[href],button:not([disabled]),input,textarea,select,[tabindex]:not([tabindex="-1"])',
        )
        if (!els.length) return
        const first = els[0]
        const last = els[els.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.clearTimeout(t)
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
      if (restore.current instanceof HTMLElement) restore.current.focus()
    }
  }, [open, onClose])

  if (!open) return null
  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-end justify-center md:items-center md:p-6">
      <div className="anim-fade absolute inset-0 bg-black/65" onClick={onClose} aria-hidden="true" />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        style={{ maxWidth }}
        className={`anim-sheet md:anim-pop relative max-h-[88dvh] w-full overflow-y-auto rounded-t-[18px] pb-[max(20px,env(safe-area-inset-bottom))] outline-none md:rounded-[14px] md:pb-6 ${
          tone === 'parchment' ? 'parchment on-parchment' : 'border border-hairline bg-surface'
        }`}
      >
        <div className="sticky top-0 z-10 flex justify-center pt-2.5 md:hidden" aria-hidden="true">
          <span className={`h-1 w-10 rounded-full ${tone === 'parchment' ? 'bg-ink/25' : 'bg-line-strong'}`} />
        </div>
        <button
          type="button"
          onClick={onClose}
          className={`absolute top-2.5 right-2.5 z-20 grid size-11 place-items-center rounded-full ${
            tone === 'parchment' ? 'text-ink-muted hover:bg-ink/10' : 'text-muted hover:bg-raised'
          }`}
          aria-label="Close"
        >
          <Icon name="close" size={20} />
        </button>
        {children}
      </div>
    </div>,
    document.body,
  )
}
