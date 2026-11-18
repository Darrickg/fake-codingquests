import { useMemo, useState } from 'react'
import { levels, libraryCopy, quests, shelves, totalQuestCount, type Level } from '../content/catalog'
import { QuestTile } from '../components/catalog'
import { Icon } from '../components/Icon'
import { Pin } from '../components/Pin'
import { SectionHead } from '../components/ui'
import { packsForQuest } from '../lib/access'
import { useTitle } from '../lib/useTitle'

type Filters = { q: string; level: Level | 'all'; free: boolean; pack: boolean }

function Toggle({ on, onChange, children }: { on: boolean; onChange: (v: boolean) => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={() => onChange(!on)}
      className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-[14.5px] font-semibold transition-colors ${
        on ? 'border-brass bg-brass/15 text-brass-bright' : 'border-hairline bg-surface text-text/85 hover:border-line-strong'
      }`}
    >
      <span className={`grid size-4 place-items-center rounded-[4px] border ${on ? 'border-brass bg-brass text-ink' : 'border-line-strong'}`} aria-hidden="true">
        {on && <Icon name="check" size={12} strokeWidth={3} />}
      </span>
      {children}
    </button>
  )
}

export default function Quests() {
  useTitle('Quest Library')
  const [f, setF] = useState<Filters>({ q: '', level: 'all', free: false, pack: false })
  const set = (p: Partial<Filters>) => setF((x) => ({ ...x, ...p }))
  const filtering = f.q.trim() !== '' || f.level !== 'all' || f.free || f.pack

  const list = useMemo(() => {
    const term = f.q.trim().toLowerCase()
    return quests.filter(
      (q) =>
        (!term || q.title.toLowerCase().includes(term)) &&
        (f.level === 'all' || q.level === f.level) &&
        (!f.free || q.access === 'free') &&
        (!f.pack || packsForQuest(q.slug).length > 0),
    )
  }, [f])

  const filters = (
    <div className="space-y-5">
      <div>
        <label htmlFor="quest-search" className="mb-1.5 block text-[13px] font-semibold text-muted">
          Search
        </label>
        <div className="relative">
          <Icon name="search" size={19} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-faint" />
          <input
            id="quest-search"
            type="search"
            value={f.q}
            onChange={(e) => set({ q: e.target.value })}
            placeholder={libraryCopy.searchPlaceholder}
            autoComplete="off"
            className="min-h-12 w-full rounded-[10px] border border-hairline bg-surface pr-3 pl-11 text-[16px] text-text outline-none placeholder:text-faint focus:border-brass"
          />
        </div>
      </div>
      <div>
        <div id="lvl-label" className="mb-1.5 text-[13px] font-semibold text-muted">
          Level
        </div>
        <div role="radiogroup" aria-labelledby="lvl-label" className="flex flex-wrap gap-2 lg:flex-col lg:items-stretch">
          {(['all', ...levels] as const).map((l) => (
            <button
              key={l}
              type="button"
              role="radio"
              aria-checked={f.level === l}
              onClick={() => set({ level: l })}
              className={`min-h-11 rounded-full border px-4 text-left text-[14.5px] font-semibold transition-colors lg:rounded-[9px] ${
                f.level === l ? 'border-brass bg-brass/15 text-brass-bright' : 'border-hairline bg-surface text-text/85 hover:border-line-strong'
              }`}
            >
              {l === 'all' ? 'All levels' : l}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 lg:flex-col lg:items-start">
        <Toggle on={f.free} onChange={(v) => set({ free: v })}>
          Free only
        </Toggle>
        <span className="inline-flex items-center gap-2">
          <Toggle on={f.pack} onChange={(v) => set({ pack: v })}>
            In a pack
          </Toggle>
          <Pin id="library-pack-filter" />
        </span>
      </div>
    </div>
  )

  return (
    <div className="wrap pt-8 md:pt-14">
      <SectionHead as="h1" eyebrow="Quest Library" title={libraryCopy.title} sub={libraryCopy.sub} />
      <div className="grid gap-8 lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-12">
        <aside aria-label="Filters" className="lg:sticky lg:top-24 lg:self-start">
          {filters}
          <p className="mt-5 text-[14px] text-muted" role="status">
            {filtering ? `${list.length} ${list.length === 1 ? 'quest' : 'quests'} match` : `${totalQuestCount} quests`}
          </p>
          {filtering && (
            <button type="button" onClick={() => setF({ q: '', level: 'all', free: false, pack: false })} className="inline-flex min-h-11 items-center gap-1.5 text-[14.5px] font-semibold text-brass-bright">
              <Icon name="reset" size={16} /> Clear filters
            </button>
          )}
        </aside>
        <div className="min-w-0 space-y-12">
          {shelves.map((s) => {
            const items = list.filter((q) => q.shelf === s.id)
            if (!items.length) return null
            return (
              <section key={s.id} aria-labelledby={`shelf-${s.id}`}>
                <div className="mb-4 flex items-baseline justify-between gap-3">
                  <h2 id={`shelf-${s.id}`} className="text-[1.35rem] md:text-[1.55rem]">
                    {s.name}
                  </h2>
                  <span className="text-[13.5px] text-faint">{items.length}</span>
                </div>
                <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {items.map((q) => (
                    <li key={q.slug}>
                      <QuestTile q={q} />
                    </li>
                  ))}
                  {s.andMore && !filtering && (
                    <li className="flex min-h-[132px] items-center rounded-[10px] border border-dashed border-line-strong p-4 text-[15px] text-muted">
                      And more: {s.andMore}
                    </li>
                  )}
                </ul>
                <div className="mt-4 h-[3px] rounded-full bg-[linear-gradient(90deg,#3b3125,#5a4a33_20%,#3b3125_80%,transparent)] shadow-[0_2px_0_rgba(0,0,0,.6)]" aria-hidden="true" />
              </section>
            )
          })}
          {!list.length && <p className="rounded-[12px] border border-hairline bg-surface p-6 text-muted">No quests match. Try fewer filters.</p>}
        </div>
      </div>
    </div>
  )
}
