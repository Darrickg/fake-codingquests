import { Link, useParams } from 'react-router'
import { campaignBySlug, questBySlug, type CampaignSlug } from '../content/catalog'
import { candidateById, packBySlug } from '../content/packs'
import { playableQuest } from '../content/lessons'
import { planById } from '../content/plans'
import { site } from '../content/site'
import { videoBySlug, videoCopy } from '../content/videos'
import { VideoArt } from '../art/Art'
import { CampaignNotice } from '../components/catalog'
import { PackCard, PackCreditNote, PlanCard, VoteBoard } from '../components/commerce'
import { Icon } from '../components/Icon'
import { LessonList } from '../components/LessonList'
import { Pin } from '../components/Pin'
import { LevelTag, LinkButton } from '../components/ui'
import { LessonPlayer } from '../lesson/LessonPlayer'
import { useTitle } from '../lib/useTitle'
import NotFound from './NotFound'

export default function FromVideo() {
  const { slug = '' } = useParams()
  const v = videoBySlug[slug]
  useTitle(v ? `From the video, ${v.title}` : 'Video')
  if (!v) return <NotFound />
  const q = questBySlug[v.quest]
  const playable = v.quest === playableQuest

  return (
    <div className="wrap pt-8 md:pt-12">
      <header className="grid items-center gap-5 md:grid-cols-[minmax(0,1fr)_280px] md:gap-10">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="eyebrow">{videoCopy.watched}</span>
            <Pin id="from-page" />
          </div>
          <h1 className="mt-2 text-[2rem] leading-[1.08] md:text-[3rem]">{v.title}</h1>
          <p className="mt-3 font-display text-[1.45rem] text-brass-bright md:text-[1.8rem]">{videoCopy.headline}</p>
          <p className="mt-2 max-w-[52ch] text-[16.5px] text-muted">{playable ? videoCopy.playableLead : videoCopy.listLead}</p>
        </div>
        <VideoArt video={v} className="hidden w-full rounded-[10px] md:block" />
      </header>

      <section className="mt-8 md:mt-10" aria-labelledby="quest-title">
        <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1">
          <h2 id="quest-title" className="text-[1.3rem] md:text-[1.5rem]">
            <Link to={`/quests/${q.slug}`} className="hover:text-brass-bright">
              {q.title}
            </Link>
          </h2>
          <LevelTag level={q.level} />
          {q.lessons && <span className="text-[14px] text-muted">{q.lessons} lessons</span>}
        </div>
        {playable ? (
          <div className="rounded-[16px] border border-hairline bg-[#100e0b] p-4 md:p-7">
            <LessonPlayer lessonSlug="1" embedded />
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-start">
            <LessonList q={q} limit={6} />
            <div className="rounded-[12px] border border-brass/30 bg-brass/[0.05] p-5">
              <LinkButton to={`/learn/${playableQuest}/1`} icon="play" className="w-full">
                Start the first lesson
              </LinkButton>
              <p className="mt-3 flex gap-2 text-[14.5px] leading-snug text-muted">
                <Icon name="info" size={18} className="mt-0.5 shrink-0 text-brass" />
                <span>
                  {site.onlyOneQuestPlayable} Start opens that one, so you can see how a lesson works.
                </span>
              </p>
            </div>
          </div>
        )}
      </section>

      <section className="mt-14 md:mt-20" aria-labelledby="offer-title">
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <h2 id="offer-title" className="text-[1.6rem] md:text-[2rem]">
            {videoCopy.nextTitle}
          </h2>
          <Pin id="from-offer" />
        </div>
        <Offer offer={v.offer} />
      </section>
    </div>
  )
}

function Offer({ offer }: { offer: (typeof videoBySlug)[string]['offer'] }) {
  if (offer.kind === 'pack') {
    const p = packBySlug[offer.pack]
    return (
      <div className="grid gap-5 md:grid-cols-[minmax(0,420px)_1fr] md:items-start">
        <PackCard pack={p} />
        <div className="space-y-4 md:pt-2">
          <p className="max-w-[46ch] text-[16px] text-muted">This video&rsquo;s topic comes as a Quest Pack: the quests that go with it, plus project files. One payment, yours to keep.</p>
          <PackCreditNote />
          <Link to="/packs" className="inline-flex min-h-11 items-center gap-2 font-semibold text-brass-bright">
            All packs <Icon name="arrow" size={17} />
          </Link>
        </div>
      </div>
    )
  }
  if (offer.kind === 'campaign') {
    const c = campaignBySlug[offer.campaign as CampaignSlug]
    return (
      <div className="grid gap-6 md:grid-cols-[minmax(0,380px)_1fr] md:items-center">
        <CampaignNotice c={c} />
        <p className="max-w-[46ch] text-[16px] text-muted">
          This quest is one stop on the {c.name} campaign, which ends in a finished game. The first quest is free.
        </p>
      </div>
    )
  }
  if (offer.kind === 'vote') {
    const cand = candidateById[offer.candidate]
    return (
      <div className="grid gap-6 md:grid-cols-[minmax(0,420px)_1fr] md:items-start">
        <VoteBoard only={[cand.id]} compact />
        <div className="space-y-3">
          <p className="max-w-[46ch] text-[16px] text-muted">There is no {cand.name} pack yet. If you would want one, say so. It helps decide which pack gets made next.</p>
          <Link to="/packs#vote" className="inline-flex min-h-11 items-center gap-2 font-semibold text-brass-bright">
            See all the candidates <Icon name="arrow" size={17} />
          </Link>
        </div>
      </div>
    )
  }
  return (
    <div className="grid gap-6 md:grid-cols-[minmax(0,380px)_1fr] md:items-start">
      <PlanCard plan={planById[offer.plan]} period="month" />
      <p className="max-w-[46ch] text-[16px] text-muted">Menus, Sound & Polish is part of the advanced material. Guild Hall opens it along with everything else, including feedback on your builds from the creator.</p>
    </div>
  )
}
