import { useState } from 'react'
import { Link } from 'react-router'
import { playableQuest } from '../content/lessons'
import { packBySlug } from '../content/packs'
import { planById, plans, type PlanId } from '../content/plans'
import { realmCopy } from '../content/site'
import { Camp } from '../art/Camp'
import { PackArt } from '../art/Art'
import { packLessons, useOwned } from '../components/commerce'
import { Icon } from '../components/Icon'
import { Pin } from '../components/Pin'
import { Button, LinkButton, SectionHead, XPBar } from '../components/ui'
import { useDemo } from '../lib/store'
import { useTitle } from '../lib/useTitle'

export default function Realm() {
  useTitle('Realm')
  const s = useDemo()
  const owned = [...useOwned()]
  const tent = !!s.lessonsDone[`${playableQuest}/1`]
  const fire = !!s.lessonsDone[`${playableQuest}/2`]
  const plan = planById[s.viewAs]
  const [confirm, setConfirm] = useState(false)
  const [resetDone, setResetDone] = useState(false)

  return (
    <div className="wrap pt-8 md:pt-14">
      <SectionHead as="h1" eyebrow="Realm" title={realmCopy.title} sub={realmCopy.sub} />
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
        <section aria-labelledby="camp-title" className="overflow-hidden rounded-[14px] border border-line-strong bg-surface">
          <Camp tent={tent} fire={fire} className="block w-full" />
          <div className="border-t border-hairline p-5">
            <h2 id="camp-title" className="text-[1.35rem]">
              {realmCopy.campTitle}
            </h2>
            <p className="mt-1 text-[15px] text-muted">{realmCopy.campSub}</p>
            <ul className="mt-3 flex flex-wrap gap-2 text-[13.5px] font-semibold">
              <li className={`rounded-full px-3 py-1 ${tent ? 'bg-moss/20 text-moss' : 'bg-raised text-muted ring-1 ring-hairline'}`}>Tent {tent ? 'up' : 'after lesson 1'}</li>
              <li className={`rounded-full px-3 py-1 ${fire ? 'bg-moss/20 text-moss' : 'bg-raised text-muted ring-1 ring-hairline'}`}>Fire {fire ? 'lit' : 'after lesson 2'}</li>
            </ul>
            <div className="mt-5">
              <XPBar xp={s.xp} />
            </div>
            {!fire && (
              <LinkButton to={`/learn/${playableQuest}/${tent ? 2 : 1}`} icon="play" className="mt-5 w-full sm:w-auto">
                {tent ? 'Light the fire: lesson 2' : 'Put the tent up: lesson 1'}
              </LinkButton>
            )}
          </div>
        </section>

        <div className="space-y-5">
          <section aria-labelledby="plan-title" className="rounded-[14px] border border-hairline bg-surface p-5">
            <h2 id="plan-title" className="text-[1.25rem]">
              {realmCopy.planTitle}
            </h2>
            <div className="mt-2 font-display text-[1.6rem] text-brass-bright">{plan.name}</div>
            <p className="mt-1 text-[14.5px] text-muted">{plan.short}</p>
            <div className="mt-3 flex flex-wrap gap-x-5">
              <Link to="/pricing?tab=membership" className="inline-flex min-h-11 items-center font-semibold text-brass-bright">
                Compare plans
              </Link>
              {s.viewAs !== 'free' && (
                <Link to="/realm/leave" className="inline-flex min-h-11 items-center font-semibold text-muted hover:text-text">
                  {realmCopy.leave}
                </Link>
              )}
            </div>
          </section>

          <section aria-labelledby="packs-title" className="rounded-[14px] border border-hairline bg-surface p-5">
            <div className="flex items-center gap-3">
              <h2 id="packs-title" className="text-[1.25rem]">
                {realmCopy.packsTitle}
              </h2>
              <Pin id="realm-packs" />
            </div>
            {owned.length ? (
              <ul className="mt-3 space-y-2">
                {owned.map((slug) => {
                  const p = packBySlug[slug]
                  return (
                    <li key={slug}>
                      <Link to={`/packs/${slug}`} className="flex items-center gap-3 rounded-[10px] p-1.5 hover:bg-raised">
                        <PackArt pack={p} owned className="h-[60px] w-[48px] shrink-0" />
                        <span className="min-w-0 flex-1">
                          <span className="block font-semibold">{p.name}</span>
                          <span className="text-[13.5px] text-muted">{packLessons(p)} lessons, yours to keep</span>
                        </span>
                        <Icon name="chevronRight" size={18} className="text-faint" />
                      </Link>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <p className="mt-2 text-[15px] text-muted">
                {realmCopy.noPacks}{' '}
                <Link to="/packs" className="link">
                  See the packs
                </Link>
              </p>
            )}
          </section>
        </div>
      </div>

      <section id="demo" aria-labelledby="demo-title" className="mt-12 scroll-mt-24 rounded-[14px] border border-dashed border-brass/40 p-5 md:p-7">
        <div className="eyebrow">Concept only</div>
        <h2 id="demo-title" className="mt-1 text-[1.45rem]">
          {realmCopy.demoTitle}
        </h2>
        <p className="mt-1 max-w-[56ch] text-[15px] text-muted">{realmCopy.demoSub}</p>
        <div id="viewas-label" className="mt-5 mb-2 text-[14px] font-semibold">
          {realmCopy.viewAs}
        </div>
        <div role="radiogroup" aria-labelledby="viewas-label" className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {plans.map((p) => (
            <button
              key={p.id}
              type="button"
              role="radio"
              aria-checked={s.viewAs === p.id}
              onClick={() => s.setViewAs(p.id as PlanId)}
              className={`min-h-12 rounded-[10px] border px-3 text-[15px] font-semibold transition-colors ${
                s.viewAs === p.id ? 'border-brass bg-brass/15 text-brass-bright' : 'border-hairline bg-surface text-text/85 hover:border-line-strong'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-hairline pt-5">
          {confirm ? (
            <>
              <span className="text-[15px]">{realmCopy.resetConfirm}</span>
              <Button
                variant="secondary"
                icon="reset"
                onClick={() => {
                  s.reset()
                  setConfirm(false)
                  setResetDone(true)
                }}
              >
                Yes, clear it
              </Button>
              <Button variant="ghost" onClick={() => setConfirm(false)}>
                Keep it
              </Button>
            </>
          ) : (
            <Button variant="secondary" icon="reset" onClick={() => (setConfirm(true), setResetDone(false))}>
              {realmCopy.reset}
            </Button>
          )}
          <span role="status" className="text-[14.5px] text-moss">
            {resetDone ? realmCopy.resetDone : ''}
          </span>
        </div>
      </section>
    </div>
  )
}
