import { Link } from 'react-router'
import { freePreviewLessons, type Campaign, type Quest } from '../content/catalog'
import { questAccess, levelPlanForCampaign, packsForQuest, campaignOpen } from '../lib/access'
import { useDemo } from '../lib/store'
import { plural } from '../lib/format'
import { Icon } from './Icon'
import { LevelTag, Notice } from './ui'

export function CampaignNotice({ c, index = 0, headingLevel = 3 }: { c: Campaign; index?: number; headingLevel?: 2 | 3 }) {
  const state = useDemo()
  const open = campaignOpen(state, c)
  const plan = levelPlanForCampaign(c)
  const tilt = [-0.6, 0.5, -0.3, 0.7, -0.5][index % 5]
  const H = headingLevel === 2 ? 'h2' : 'h3'
  return (
    <Notice as="article" tilt={tilt} className="flex h-full flex-col px-5 pt-6 pb-5">
      <div className="flex flex-wrap items-center gap-2">
        <LevelTag level={c.level} tone="light" label={c.levelLabel} />
      </div>
      <H className="mt-2.5 text-[1.45rem] text-ink">
        <Link to={`/campaigns/${c.slug}`} className="after:absolute after:inset-0 after:content-['']">
          {c.name}
        </Link>
      </H>
      <p className="mt-1.5 text-[15px] leading-snug text-ink-muted">{c.blurb}</p>
      <div className="mt-auto pt-4">
        <div className="mb-3 h-px bg-ink/15" />
        <div className="flex items-center justify-between gap-3 text-[13.5px] text-ink-muted">
          <span>
            {c.questCount} quests, {c.lessonCount} lessons
          </span>
          <span className="inline-flex items-center gap-1 font-semibold text-ink">
            {open ? 'Open' : 'First quest free'} <Icon name="arrow" size={15} />
          </span>
        </div>
        {plan && !open && <div className="mt-1.5 text-[12.5px] text-ink-muted">All of it with {plan.name} or Guild Hall</div>}
      </div>
    </Notice>
  )
}

/** A quest as a book-like tile on a shelf. */
export function QuestTile({ q }: { q: Quest }) {
  const state = useDemo()
  const a = questAccess(state, q.slug)
  const inPack = packsForQuest(q.slug).length > 0
  const status =
    q.access === 'free'
      ? 'Free'
      : a.reason === 'pack'
        ? 'In your pack'
        : a.reason === 'plan'
          ? 'In your plan'
          : q.access === 'members'
            ? 'Members only'
            : `${plural(freePreviewLessons(q), 'lesson')} free`
  return (
    <Link
      to={`/quests/${q.slug}`}
      className="group relative flex h-full min-h-[132px] flex-col rounded-[10px] border border-hairline bg-surface p-4 transition-colors hover:border-brass/50"
    >
      <span className="absolute inset-y-3 left-0 w-[3px] rounded-r-full bg-brass/40 group-hover:bg-brass" aria-hidden="true" />
      <div className="flex items-start justify-between gap-2">
        <LevelTag level={q.level} />
        {inPack && (
          <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-brass" title="In a Quest Pack">
            <Icon name="pack" size={15} />
            <span className="sr-only sm:not-sr-only">Pack</span>
          </span>
        )}
      </div>
      <h3 className="mt-2.5 font-display text-[1.08rem] leading-snug text-text">{q.title}</h3>
      <div className="mt-auto flex items-center justify-between gap-2 pt-3 text-[13px]">
        <span className="text-muted">{q.lessons ? plural(q.lessons, 'lesson') : 'Follow-on quest'}</span>
        <span
          className={`inline-flex items-center gap-1 font-semibold ${
            a.open ? 'text-moss' : q.access === 'members' ? 'text-faint' : 'text-brass-bright'
          }`}
        >
          {!a.open && q.access === 'members' && <Icon name="lock" size={13} />}
          {status}
        </span>
      </div>
    </Link>
  )
}
