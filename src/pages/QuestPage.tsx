import { Link, useParams } from 'react-router'
import { campaignsForQuest, freePreviewLessons, questBySlug, shelves } from '../content/catalog'
import { playableQuest } from '../content/lessons'
import { packCopy, packCredit } from '../content/packs'
import { planById } from '../content/plans'
import { site } from '../content/site'
import { videoForQuest } from '../content/videos'
import { PackArt } from '../art/Art'
import { packLessons, useOwned } from '../components/commerce'
import { Icon } from '../components/Icon'
import { LessonList } from '../components/LessonList'
import { Pin } from '../components/Pin'
import { LevelTag, LinkButton, Price } from '../components/ui'
import { levelPlanForQuest, packsForQuest, planOpensQuest, questAccess } from '../lib/access'
import { plural } from '../lib/format'
import { useDemo } from '../lib/store'
import { useUI } from '../lib/ui'
import { useTitle } from '../lib/useTitle'
import NotFound from './NotFound'

export default function QuestPage() {
  const { slug = '' } = useParams()
  const q = questBySlug[slug]
  useTitle(q ? q.title : 'Quest')
  const state = useDemo()
  const owned = useOwned()
  const openCheckout = useUI((s) => s.openCheckout)
  if (!q) return <NotFound />

  const access = questAccess(state, q.slug)
  const shelf = shelves.find((s) => s.id === q.shelf)
  const camps = campaignsForQuest(q.slug)
  const video = videoForQuest(q.slug)
  const qPacks = packsForQuest(q.slug)
  const levelPlan = levelPlanForQuest(q)
  const guild = planById.guild
  const playable = q.slug === playableQuest
  const freeN = q.access === 'free' ? (q.lessons ?? 0) : q.access === 'partial' ? freePreviewLessons(q) : 0
  const viewing = state.viewAs

  const freeLine =
    q.access === 'free'
      ? 'Every lesson in this quest is free.'
      : q.access === 'partial'
        ? `The first ${freeN === 1 ? 'lesson is' : `${plural(freeN, 'lesson')} are`} free.`
        : 'No free lessons. This quest is for members.'

  return (
    <div className="wrap pt-6 md:pt-10">
      <Link to="/quests" className="inline-flex min-h-10 items-center gap-1.5 text-[14px] text-muted hover:text-text">
        <Icon name="back" size={16} /> Quest Library{shelf ? `, ${shelf.name}` : ''}
      </Link>
      <header className="mt-2">
        <div className="flex flex-wrap items-center gap-2.5">
          <LevelTag level={q.level} />
          <span className="text-[14px] text-muted">{q.lessons ? plural(q.lessons, 'lesson') : 'Follow-on quest'}</span>
          {access.open && <span className="text-[14px] font-semibold text-moss">Open to you</span>}
        </div>
        <h1 className="mt-2 max-w-[22ch] text-[2.1rem] leading-[1.08] md:text-[3rem]">{q.title}</h1>
        {camps.length > 0 && (
          <p className="mt-3 text-[15px] text-muted">
            Part of{' '}
            {camps.map((c, i) => (
              <span key={c.slug}>
                {i > 0 && (i === camps.length - 1 ? ' and ' : ', ')}
                <Link to={`/campaigns/${c.slug}`} className="link">
                  {c.name}
                </Link>
              </span>
            ))}
            .
          </p>
        )}
        {video && (
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <Link to={`/from/${video.slug}`} className="inline-flex min-h-11 items-center gap-2 text-[15px] text-muted hover:text-text">
              <Icon name="video" size={18} className="text-brass" />
              Continues the video <span className="font-semibold text-text">{video.title}</span>
            </Link>
            <Pin id="quest-video" />
          </div>
        )}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <LinkButton to={`/learn/${playableQuest}/1`} icon="play" className="sm:min-w-[220px]">
            {playable ? 'Start lesson 1' : 'Start the first lesson'}
          </LinkButton>
          {!playable && <p className="max-w-[48ch] text-[14px] leading-snug text-muted">{site.onlyOneQuestPlayable}</p>}
        </div>
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-14">
        <section id="lessons" className="scroll-mt-24" aria-labelledby="lessons-title">
          <h2 id="lessons-title" className="mb-4 text-[1.45rem]">
            Lessons
          </h2>
          <LessonList q={q} />
        </section>

        <aside aria-labelledby="ways-title" className="lg:pt-1">
          <div className="lg:sticky lg:top-24">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <h2 id="ways-title" className="text-[1.45rem]">
                Ways to open this quest
              </h2>
              <Pin id="quest-ways" />
            </div>
            <ol className="space-y-3">
              <Way n={1} title="Free lessons" active={freeN > 0}>
                <p>{freeLine}</p>
              </Way>

              {qPacks.map((p) => {
                const isOwned = owned.has(p.slug)
                return (
                  <Way key={p.slug} n={2} title={`Buy the ${p.name}`} active={isOwned} isNew>
                    <div className="flex gap-3">
                      <PackArt pack={p} owned={isOwned} className="h-[64px] w-[52px] shrink-0" />
                      <div className="min-w-0">
                        <p>
                          This quest and {plural(p.quests.length - 1, 'other')} on the same topic, {packLessons(p)} lessons in all. {packCopy.keepLine}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
                          {isOwned ? (
                            <span className="font-semibold text-moss">You own it</span>
                          ) : (
                            <>
                              <Price amount={p.price} suffix="once" />
                              <button type="button" onClick={() => openCheckout({ kind: 'pack', pack: p.slug })} className="inline-flex min-h-11 items-center font-semibold text-brass-bright">
                                Get the pack
                              </button>
                            </>
                          )}
                        </div>
                        <p className="mt-1 text-[13px] text-faint">Counts toward a membership for {packCredit.days} days.</p>
                      </div>
                    </div>
                  </Way>
                )
              })}

              {levelPlan && (
                <Way n={qPacks.length ? 3 : 2} title={`Join ${levelPlan.name}`} active={viewing === levelPlan.id} isNew>
                  <p>Every {levelPlan.opens.levels === 'all' ? '' : (levelPlan.opens.levels as string[]).join(' and ')} quest, and the campaigns that go with them.</p>
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
                    <Price amount={levelPlan.price.month} suffix="a month" />
                    {viewing !== levelPlan.id && (
                      <button
                        type="button"
                        onClick={() => openCheckout({ kind: 'plan', plan: levelPlan.id as 'apprentice' | 'adventurer', period: 'month' })}
                        className="inline-flex min-h-11 items-center font-semibold text-brass-bright"
                      >
                        Start free trial
                      </button>
                    )}
                  </div>
                </Way>
              )}

              <Way n={qPacks.length && levelPlan ? 4 : levelPlan || qPacks.length ? 3 : 2} title="Join Guild Hall" active={viewing === 'guild'}>
                <p>Everything, plus new quests each month and feedback on your builds from the creator.</p>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
                  <Price amount={guild.price.month} suffix="a month" />
                  {viewing !== 'guild' && (
                    <Link to="/pricing?tab=membership" className="inline-flex min-h-11 items-center font-semibold text-brass-bright">
                      See memberships
                    </Link>
                  )}
                </div>
              </Way>
            </ol>
            {viewing !== 'free' && planOpensQuest(planById[viewing], q) && (
              <p className="mt-4 text-[14px] text-moss">Your current plan, {planById[viewing].name}, opens this quest.</p>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}

function Way({ n, title, active, isNew, children }: { n: number; title: string; active: boolean; isNew?: boolean; children: React.ReactNode }) {
  return (
    <li className={`rounded-[12px] border p-4 ${active ? 'border-moss/45 bg-moss/[0.06]' : 'border-hairline bg-surface'}`}>
      <div className="mb-1.5 flex items-center gap-2.5">
        <span className={`grid size-6 shrink-0 place-items-center rounded-full text-[12.5px] font-bold ${active ? 'bg-moss text-ground' : 'bg-raised text-muted ring-1 ring-hairline'}`}>
          {active ? <Icon name="check" size={13} strokeWidth={2.6} /> : n}
        </span>
        <h3 className="font-sans text-[16px] font-semibold tracking-normal">{title}</h3>
        {isNew && <span className="ml-auto text-[11px] font-bold tracking-[0.1em] text-brass uppercase">New</span>}
      </div>
      <div className="pl-[34px] text-[14.5px] leading-snug text-muted">{children}</div>
    </li>
  )
}
