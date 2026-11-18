import type { ReactNode } from 'react'
import type { Blank } from '../content/lessons'
import { highlight } from './highlight'

export function CodePanel({
  code,
  blanks = [],
  values = {},
  active,
  onActivate,
  onType,
  typing = false,
  filename = 'knight.gd',
  footer,
  badge,
}: {
  code: string
  blanks?: Blank[]
  values?: Record<string, string>
  active?: string | null
  onActivate?: (id: string) => void
  onType?: (id: string, v: string) => void
  /** When true, blanks are text inputs (desktop). Otherwise they are buttons that pick from chips. */
  typing?: boolean
  filename?: string
  footer?: ReactNode
  badge?: ReactNode
}) {
  const body = code.replace(/\n$/, '')
  const byId = Object.fromEntries(blanks.map((b) => [b.id, b]))

  // Split into lines of text and blank segments, so wrapped lines keep a hanging indent.
  type Seg = { t: 'text'; v: string } | { t: 'blank'; id: string }
  const lines: Seg[][] = [[]]
  body.split(/\{\{(\w+)\}\}/).forEach((part, i) => {
    if (i % 2 === 1) return lines[lines.length - 1].push({ t: 'blank', id: part })
    part.split('\n').forEach((chunk, j) => {
      if (j > 0) lines.push([])
      if (chunk) lines[lines.length - 1].push({ t: 'text', v: chunk })
    })
  })

  const renderBlank = (b: Blank, key: string) => {
    const v = values[b.id] ?? ''
    const isActive = active === b.id
    const width = Math.max(v.length, b.answer.length) + 1
    const cls = `inline-block min-h-[1.6em] rounded-[5px] px-[.35ch] align-baseline font-mono [text-indent:0] transition-colors duration-150 ${
      isActive
        ? 'bg-brass/20 text-brass-bright ring-2 ring-brass'
        : v
          ? 'bg-raised text-text ring-1 ring-brass/45'
          : 'bg-brass/[0.06] text-faint outline-1 outline-dashed outline-brass/60'
    }`
    return typing ? (
      <input
        key={key}
        value={v}
        onFocus={() => onActivate?.(b.id)}
        onChange={(e) => onType?.(b.id, e.target.value)}
        aria-label={`Blank: ${b.label}`}
        spellCheck={false}
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
        placeholder={'·'.repeat(Math.min(b.answer.length, 8))}
        className={`${cls} border-0 bg-clip-padding outline-none placeholder:text-faint/60`}
        style={{ width: `${width}ch`, font: 'inherit', lineHeight: 'inherit', padding: '0 .35ch' }}
      />
    ) : (
      <button
        key={key}
        type="button"
        onClick={() => onActivate?.(b.id)}
        aria-label={`Blank: ${b.label}. ${v ? `Filled with ${v}` : 'Empty'}. Tap to choose.`}
        aria-pressed={isActive}
        className={`${cls} relative text-left before:absolute before:-inset-y-1.5 before:inset-x-0 before:content-['']`}
        style={{ minWidth: `${Math.min(width, 14)}ch`, font: 'inherit', lineHeight: 'inherit' }}
      >
        {v ? highlight(v, `${key}-`) : <span aria-hidden="true">{'_'.repeat(Math.min(b.answer.length, 10))}</span>}
      </button>
    )
  }

  return (
    <div className="overflow-hidden rounded-[10px] border border-line-strong bg-[#100e0b]">
      <div className="flex items-center justify-between gap-2 border-b border-hairline bg-[#16130f] px-3.5 py-2">
        <div className="flex items-center gap-2 font-mono text-[12.5px] text-muted">
          <span className="size-2 rounded-full bg-moss/70" aria-hidden="true" />
          {filename}
        </div>
        {badge}
      </div>
      <pre className="py-3 font-mono text-[12px] leading-[1.75] text-[#d9cfbd] xs:text-[12.5px] sm:text-[13px] md:text-[13.5px]">
        <code className="block">
          {lines.map((segs, li) => {
            const first = segs[0]
            const tabs = first && first.t === 'text' ? (first.v.match(/^\t*/)?.[0].length ?? 0) : 0
            return (
              <span key={li} className="flex">
                <span aria-hidden="true" className="w-[3.2ch] shrink-0 pr-[1ch] text-right text-faint/60 select-none sm:w-[4ch]">
                  {li + 1}
                </span>
                <span
                  className="min-w-0 flex-1 pr-3 whitespace-pre-wrap [--tab:2ch] md:[--tab:4ch]"
                  style={{ paddingLeft: `calc(${tabs} * var(--tab) + 2ch)`, textIndent: '-2ch' }}
                >
                  {segs.length === 0 && '\u00a0'}
                  {segs.map((sg, k) =>
                    sg.t === 'text' ? (
                      <span key={k}>{highlight(k === 0 ? sg.v.replace(/^\t+/, '') : sg.v, `l${li}s${k}-`)}</span>
                    ) : byId[sg.id] ? (
                      renderBlank(byId[sg.id], `l${li}b${k}`)
                    ) : null,
                  )}
                </span>
              </span>
            )
          })}
        </code>
      </pre>
      {footer}
    </div>
  )
}

/** The chips for the active blank. */
export function ChipTray({
  blank,
  value,
  onPick,
}: {
  blank: Blank | undefined
  value: string | undefined
  onPick: (v: string) => void
}) {
  if (!blank) return null
  return (
    <div className="border-t border-hairline bg-[#16130f] px-3 py-3">
      <div className="mb-2 text-[12.5px] font-semibold text-muted">
        Fill <span className="text-text">{blank.label}</span>
      </div>
      <div className="flex flex-wrap gap-2" role="group" aria-label={`Choices for ${blank.label}`}>
        {blank.options.map((o) => {
          const on = value === o
          return (
            <button
              key={o}
              type="button"
              onClick={() => onPick(o)}
              aria-pressed={on}
              className={`min-h-11 rounded-[8px] border px-3 py-1.5 font-mono text-[13px] transition-colors duration-150 ${
                on ? 'border-brass bg-brass/20 text-brass-bright' : 'border-line-strong bg-raised text-text hover:border-brass/60'
              }`}
            >
              {o}
            </button>
          )
        })}
      </div>
    </div>
  )
}
