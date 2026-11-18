import { Link, useParams } from 'react-router'
import { campaignBySlug, type CampaignSlug } from '../content/catalog'
import { playableQuest } from '../content/lessons'
import { planById } from '../content/plans'
import { CampaignMap, type WaypointState } from '../art/CampaignMap'
import { Icon } from '../components/Icon'
import { Pin } from '../components/Pin'
import { LevelTag, Price } from '../components/ui'
import { campaignOpen, levelPlanForCampaign, questAccess } from '../lib/access'
import { useDemo } from '../lib/store'
import { useUI } from '../lib/ui'
import { useTitle } from '../lib/useTitle'
import NotFound from './NotFound'

export default function CampaignPage() {
  const { slug = '' } = useParams()
  const c = campaignBySlug[slug as CampaignSlug]
  useTitle(c ? `${c.name} campaign` : 'Campaign')
  const state = useDemo()
  const openCheckout = useUI((s) => s.openCheckout)
  if (!c) return <NotFound />

  const plan = levelPlanForCampaign(c)
  const open = campaignOpen(state, c)
  const playableDone = !!state.lessonsDone[`${playableQuest}/1`] && !!state.lessonsDone[`${playableQuest}/2`]

  // done: finished in this concept; current: the next open stop; open; locked.
  const base: WaypointState[] = c.waypoints.map((w, i) => {
    if (w.quest === playableQuest && playableDone) return 'done'
    if (i === 0 || open) return 'open'
    if (w.quest && questAccess(state, w.quest).open) return 'open'
    return 'locked'
  })
  const cur = base.findIndex((s) => s === 'open')
  const states = base.map((s, i) => (i === cur ? 'current' : s)) as WaypointState[]
  const guild = planById.guild

  return (
    <div className="wrap pt-6 md:pt-10">
      <Link to="/campaigns" className="inline-flex min-h-10 items-center gap-1.5 text-[14px] text-muted hover:text-text">
        <Icon name="back" size={16} /> Campaign Board
      </Link>
      <div className="mt-2 grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-end lg:gap-12">
        <header>
          <LevelTag level={c.level} label={c.levelLabel} />
          <h1 className="mt-2 text-[2.2rem] md:text-[3.2rem]">{c.name}</h1>
          <p className="mt-2 max-w-[52ch] text-[17px] text-muted">{c.blurb}</p>
          <p className="mt-2 text-[15px] text-text/80">
            {c.questCount} quests, {c.lessonCount} lessons. The first quest is free.
          </p>
        </header>
        <div className="rounded-[12px] border border-hairline bg-surface p-4 md:p-5">
          <div className="flex items-center gap-3">
            <h2 className="font-sans text-[15px] font-semibold tracking-normal">Which plan opens it</h2>
            <Pin id="campaign-plan" />
          </div>
          {open ? (
            <p className="mt-2 text-[15px] text-moss">Your plan, {planById[state.viewAs].name}, opens the whole campaign.</p>
          ) : (
            <ul className="mt-2 space-y-2 text-[15px]">
              {plan && (
                <li className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                  <span>
                    <span className="font-semibold">{plan.name}</span> <Price amount={plan.price.month} suffix="a month" />
                  </span>
                  <button
                    type="button"
                    onClick={() => openCheckout({ kind: 'plan', plan: plan.id as 'apprentice' | 'adventurer', period: 'month' })}
                    className="inline-flex min-h-11 items-center font-semibold text-brass-bright"
                  >
                    Start free trial
                  </button>
                </li>
              )}
              <li className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-muted">
                <span>
                  or <span className="font-semibold text-text">Guild Hall</span> <Price amount={guild.price.month} suffix="a month" />
                </span>
                <Link to="/pricing?tab=membership" className="inline-flex min-h-11 items-center font-semibold text-brass-bright">
                  Compare
                </Link>
              </li>
            </ul>
          )}
        </div>
      </div>

      <div className="parchment on-parchment relative mt-8 overflow-hidden rounded-[8px] md:mt-10">
        <CampaignMap campaign={c} states={states} orient="tall" className="block w-full md:hidden" />
        <CampaignMap campaign={c} states={states} orient="wide" className="hidden w-full md:block" />
      </div>
      <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[14px] text-muted" aria-label="Map key">
        <li className="flex items-center gap-2"><span className="size-3.5 rounded-full border-2 border-[#2a2118] bg-moss-ink" /> Done</li>
        <li className="flex items-center gap-2"><span className="size-3.5 rounded-full bg-ember" /> You are here</li>
        <li className="flex items-center gap-2"><span className="size-3.5 rounded-full bg-parchment" /> Open</li>
        <li className="flex items-center gap-2"><span className="size-3.5 rounded-full border border-dashed border-muted" /> Locked</li>
        <li>Tap a stop to open its quest.</li>
      </ul>
    </div>
  )
}
