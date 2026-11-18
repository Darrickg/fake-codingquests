import { Link, useParams } from 'react-router'
import { questBySlug } from '../content/catalog'
import { packBySlug, packCopy, packs } from '../content/packs'
import { PackArt } from '../art/Art'
import { PackCreditNote, PairedVideo, packLessons, useOwned } from '../components/commerce'
import { Icon } from '../components/Icon'
import { Pin } from '../components/Pin'
import { Button, LevelTag, Price } from '../components/ui'
import { useUI } from '../lib/ui'
import { useTitle } from '../lib/useTitle'
import NotFound from './NotFound'

export default function PackPage() {
  const { slug = '' } = useParams()
  const pack = packBySlug[slug]
  useTitle(pack ? pack.name : 'Pack')
  const owned = useOwned()
  const openCheckout = useUI((s) => s.openCheckout)
  if (!pack) return <NotFound />
  const isOwned = owned.has(pack.slug)
  const others = packs.filter((p) => p.slug !== pack.slug)

  return (
    <div className="wrap pt-6 md:pt-10">
      <Link to="/packs" className="inline-flex min-h-10 items-center gap-1.5 text-[14px] text-muted hover:text-text">
        <Icon name="back" size={16} /> All packs
      </Link>
      <div className="mt-3 grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-14">
        <div>
          <div className="flex items-start gap-5 md:gap-7">
            <PackArt pack={pack} owned={isOwned} className="h-[150px] w-[120px] shrink-0 drop-shadow-[0_14px_18px_rgba(0,0,0,.6)] md:h-[200px] md:w-[160px]" />
            <div className="min-w-0 pt-1">
              <div className="flex flex-wrap items-center gap-3">
                <span className="eyebrow">Quest Pack</span>
                <Pin id="packs-page" />
              </div>
              <h1 className="mt-2 text-[2rem] leading-tight md:text-[2.8rem]">{pack.name}</h1>
              <p className="mt-2 text-[15px] text-muted">
                {pack.quests.length} quests, {packLessons(pack)} lessons. {packCopy.includesFiles}
              </p>
            </div>
          </div>
          <p className="mt-6 max-w-[56ch] text-[17px] leading-relaxed text-text/90">{pack.promise}</p>
          <div className="mt-3">
            <PairedVideo pack={pack} />
          </div>

          <h2 className="mt-10 text-[1.4rem]">What is inside</h2>
          <ol className="mt-4 divide-y divide-hairline overflow-hidden rounded-[12px] border border-hairline bg-surface">
            {pack.quests.map((s, i) => {
              const q = questBySlug[s]
              return (
                <li key={s}>
                  <Link to={`/quests/${s}`} className="flex min-h-[68px] items-center gap-4 px-4 py-3 hover:bg-raised">
                    <span className="font-display text-[1.3rem] text-faint">{i + 1}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold text-text">{q.title}</span>
                      <span className="text-[14px] text-muted">{q.lessons} lessons{q.access === 'free' ? ', free to play, pack adds the project files' : ''}</span>
                    </span>
                    <LevelTag level={q.level} />
                  </Link>
                </li>
              )
            })}
          </ol>
        </div>

        <aside className="lg:pt-4">
          <div className="parchment on-parchment rounded-[6px] p-6 lg:sticky lg:top-24">
            <div className="font-display text-[1.6rem] text-ink">{packCopy.keepLine}</div>
            <div className="mt-3 text-ink">
              {isOwned ? <span className="font-semibold text-moss-ink">You own this pack.</span> : <Price amount={pack.price} tone="light" big />}
            </div>
            <ul className="mt-4 space-y-1.5 text-[15px] text-ink-muted">
              <li className="flex gap-2"><Icon name="check" size={17} className="mt-0.5 shrink-0 text-moss-ink" /> Every lesson in {pack.quests.length} quests</li>
              <li className="flex gap-2"><Icon name="check" size={17} className="mt-0.5 shrink-0 text-moss-ink" /> Godot project files</li>
              <li className="flex gap-2"><Icon name="check" size={17} className="mt-0.5 shrink-0 text-moss-ink" /> No subscription, nothing to cancel</li>
            </ul>
            <div className="mt-5">
              {isOwned ? (
                <Link to={`/quests/${pack.quests[0]}`} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[10px] bg-ink font-semibold text-parchment">
                  Start the first quest <Icon name="arrow" size={17} />
                </Link>
              ) : (
                <Button className="w-full" onClick={() => openCheckout({ kind: 'pack', pack: pack.slug })}>
                  Get this pack
                </Button>
              )}
            </div>
            <div className="mt-5 border-t border-ink/15 pt-4">
              <PackCreditNote tone="light" />
            </div>
          </div>
        </aside>
      </div>

      <section className="mt-16" aria-labelledby="other-packs">
        <h2 id="other-packs" className="text-[1.4rem]">Other packs</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {others.map((p) => (
            <li key={p.slug}>
              <Link to={`/packs/${p.slug}`} className="flex items-center gap-4 rounded-[12px] border border-hairline bg-surface p-3 hover:border-brass/50">
                <PackArt pack={p} owned={owned.has(p.slug)} className="h-[70px] w-[56px] shrink-0" />
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold">{p.name}</span>
                  <span className="text-[14px] text-muted">{p.quests.length} quests, {packLessons(p)} lessons</span>
                </span>
                <Icon name="chevronRight" size={18} className="text-faint" />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
