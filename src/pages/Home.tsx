import { useRef } from 'react'
import { Link, Navigate, useSearchParams } from 'react-router'
import { campaigns } from '../content/catalog'
import { playableQuest } from '../content/lessons'
import { packs } from '../content/packs'
import { site } from '../content/site'
import { videoBySlug, videos, videoCopy } from '../content/videos'
import { VideoArt } from '../art/Art'
import { CampaignNotice } from '../components/catalog'
import { PackCard, PackCreditNote } from '../components/commerce'
import { Icon, type IconName } from '../components/Icon'
import { Pin } from '../components/Pin'
import { LinkButton, PinHead, Seal, SectionHead } from '../components/ui'
import { MiniLesson } from '../lesson/MiniLesson'
import { highlight } from '../lesson/highlight'
import { useTitle } from '../lib/useTitle'

export default function Home() {
  const [params] = useSearchParams()
  const from = params.get('from')
  useTitle()
  if (from && videoBySlug[from]) return <Navigate to={`/from/${from}`} replace />

  return (
    <>
      <Hero />
      <VideoRow />
      <Road />
      <section className="wrap mt-20 md:mt-28" aria-labelledby="try-title">
        <SectionHead id="try-title" eyebrow="Playable" title={site.home.previewTitle} sub={site.home.previewSub} />
        <MiniLesson />
      </section>
      <section className="wrap mt-20 md:mt-28" aria-labelledby="campaigns-title">
        <SectionHead id="campaigns-title" eyebrow="Campaign Board" title={site.home.campaignsTitle} sub={site.home.campaignsSub} />
        <ol className="grid gap-x-5 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((c, i) => (
            <li key={c.slug}>
              <CampaignNotice c={c} index={i} />
            </li>
          ))}
          <li className="flex items-center justify-center rounded-[6px] border border-dashed border-line-strong p-6 sm:col-span-2 lg:col-span-1">
            <Link to="/campaigns" className="inline-flex min-h-11 items-center gap-2 font-semibold text-brass-bright">
              See every campaign map <Icon name="arrow" size={17} />
            </Link>
          </li>
        </ol>
      </section>
      <section className="wrap mt-20 md:mt-28" aria-labelledby="packs-title">
        <SectionHead
          id="packs-title"
          eyebrow="Quest Packs"
          title={site.home.packsTitle}
          sub={site.home.packsSub}
          pin={<Pin id="home-packs" />}
        />
        <div className="grid gap-4 md:grid-cols-3">
          {packs.map((p) => (
            <PackCard key={p.slug} pack={p} />
          ))}
        </div>
        <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <PackCreditNote className="max-w-[60ch]" />
          <Link to="/packs" className="inline-flex min-h-11 shrink-0 items-center gap-2 font-semibold text-brass-bright">
            All packs and the bundle <Icon name="arrow" size={17} />
          </Link>
        </div>
      </section>
      <Ways />
      <Closing />
    </>
  )
}

function Hero() {
  return (
    <section className="relative overflow-hidden" aria-labelledby="hero-title">
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{ background: 'radial-gradient(60% 70% at 78% 30%, rgba(200,164,92,.10), transparent 60%), radial-gradient(40% 50% at 10% 0%, rgba(217,101,43,.07), transparent 70%)' }}
        aria-hidden="true"
      />
      <div className="wrap relative grid items-center gap-10 pt-10 pb-12 md:pt-16 md:pb-20 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
        <div>
          <div className="eyebrow mb-4">Godot 4 and GDScript</div>
          <h1 id="hero-title" className="max-w-[14ch] text-[2.7rem] leading-[1.02] md:text-[4.1rem]" style={{ fontVariationSettings: '"opsz" 120' }}>
            {site.home.h1}
          </h1>
          <p className="mt-5 max-w-[46ch] text-[17.5px] leading-relaxed text-text/85 md:text-[19px]">{site.home.sub}</p>
          <div className="mt-7 flex flex-col gap-3 xs:flex-row">
            <LinkButton to={`/learn/${playableQuest}/1`} icon="play" className="xs:min-w-[200px]">
              {site.home.primaryCta}
            </LinkButton>
            <LinkButton to="/quests/godot-for-programmers" variant="secondary" iconRight="arrow">
              {site.home.secondaryCta}
            </LinkButton>
          </div>
          <p className="mt-4 text-[14px] text-muted">{site.home.noSignup}</p>
        </div>
        <HeroArt />
      </div>
    </section>
  )
}

/** A pinned quest notice, the code it asks for, and the seal you get. */
function HeroArt() {
  const snippet = `var direction := Vector2(
	Input.get_axis("move_left", "move_right"),
	Input.get_axis("move_up", "move_down")
)
velocity = direction * speed
move_and_slide()`
  return (
    <div className="relative mx-auto hidden w-full max-w-[520px] pt-4 pb-10 md:block" aria-hidden="true">
      <div className="parchment relative ml-auto w-[78%] rotate-[1.2deg] rounded-[3px] px-6 pt-7 pb-16">
        <PinHead className="absolute -top-2.5 left-1/2 -translate-x-1/2" />
        <div className="text-[11px] font-bold tracking-[0.16em] text-brass-ink uppercase">Quest notice</div>
        <div className="mt-1.5 font-display text-[1.45rem] leading-tight text-ink">2D Top-Down Character Movement</div>
        <div className="mt-3 space-y-1.5 text-[14px] text-ink-muted">
          <div className="flex items-center gap-2">
            <span className="grid size-5 place-items-center rounded-full bg-moss-ink text-parchment">
              <Icon name="check" size={12} strokeWidth={3} />
            </span>
            Predict what the code does
          </div>
          <div className="flex items-center gap-2">
            <span className="grid size-5 place-items-center rounded-full bg-moss-ink text-parchment">
              <Icon name="check" size={12} strokeWidth={3} />
            </span>
            Write it yourself
          </div>
          <div className="flex items-center gap-2">
            <span className="grid size-5 place-items-center rounded-full border-[1.5px] border-ink-muted/60" />
            Pass the check
          </div>
        </div>
      </div>
      <div className="relative -mt-14 w-[86%] -rotate-[0.8deg] overflow-hidden rounded-[10px] border border-line-strong bg-[#100e0b] shadow-[0_24px_40px_-16px_rgba(0,0,0,.9)]">
        <div className="flex items-center gap-2 border-b border-hairline bg-[#16130f] px-3.5 py-2 font-mono text-[12px] text-muted">
          <span className="size-2 rounded-full bg-moss/70" /> knight.gd, inside _physics_process()
        </div>
        <pre className="overflow-hidden px-4 py-3 font-mono text-[13px] leading-[1.7] text-[#d9cfbd]" style={{ tabSize: 4 }}>
          <code>{highlight(snippet, 'h')}</code>
        </pre>
      </div>
      <div className="absolute right-[6%] bottom-0">
        <Seal size={92} animate={false} label="Passed" />
      </div>
    </div>
  )
}

function VideoRow() {
  const scroller = useRef<HTMLUListElement>(null)
  const nudge = (dir: 1 | -1) => scroller.current?.scrollBy({ left: dir * 300, behavior: 'smooth' })
  return (
    <section id="videos" className="wrap scroll-mt-20" aria-labelledby="videos-title">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <div className="eyebrow mb-2">From the channel</div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 id="videos-title" className="text-[1.7rem] md:text-[2.25rem]">
              {site.home.videosTitle}
            </h2>
            <Pin id="home-videos" />
          </div>
          <p className="mt-2 max-w-[56ch] text-[16.5px] text-muted">{site.home.videosSub}</p>
        </div>
        <div className="hidden shrink-0 gap-2 md:flex">
          <button type="button" onClick={() => nudge(-1)} aria-label="Scroll videos left" className="grid size-11 place-items-center rounded-full border border-hairline text-muted hover:border-brass/50 hover:text-text">
            <Icon name="back" size={18} />
          </button>
          <button type="button" onClick={() => nudge(1)} aria-label="Scroll videos right" className="grid size-11 place-items-center rounded-full border border-hairline text-muted hover:border-brass/50 hover:text-text">
            <Icon name="arrow" size={18} />
          </button>
        </div>
      </div>
      <ul
        ref={scroller}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-2 md:-mx-8 md:scroll-px-8 md:px-8"
        aria-label="Videos"
      >
        {videos.map((v) => (
          <li key={v.slug} className="w-[244px] shrink-0 snap-start md:w-[272px]">
            <Link to={`/from/${v.slug}`} className="group block rounded-[12px] border border-hairline bg-surface p-2 transition-colors hover:border-brass/50">
              <VideoArt video={v} className="block w-full rounded-[7px]" />
              <div className="px-1.5 pt-2.5 pb-1.5">
                <div className="line-clamp-2 min-h-[2.6em] text-[15px] leading-snug font-semibold text-text">{v.title}</div>
                <div className="mt-1.5 inline-flex items-center gap-1 text-[13px] font-semibold text-brass-bright">
                  Build it yourself <Icon name="arrow" size={14} />
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <p className="sr-only">{videoCopy.playableLead}</p>
    </section>
  )
}

function Road() {
  const icons: IconName[] = ['scroll', 'code', 'sparkle', 'flame']
  return (
    <section className="wrap mt-20 md:mt-28" aria-labelledby="road-title">
      <SectionHead id="road-title" eyebrow="How it works" title={site.home.roadTitle} />
      <ol className="relative grid gap-6 md:grid-cols-4 md:gap-5">
        <svg className="pointer-events-none absolute top-[27px] left-[6%] hidden h-6 w-[88%] md:block" viewBox="0 0 400 24" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 12C60 2 80 22 133 12s80-10 134 0 80 10 133 0" fill="none" stroke="#c8a45c" strokeOpacity=".5" strokeWidth="1.6" strokeDasharray="5 6" vectorEffect="non-scaling-stroke" />
        </svg>
        <span className="absolute top-2 bottom-2 left-[27px] w-px border-l border-dashed border-brass/45 md:hidden" aria-hidden="true" />
        {site.home.road.map((r, i) => (
          <li key={r.title} className="relative flex gap-4 md:block">
            <span className="relative z-10 grid size-14 shrink-0 place-items-center rounded-full border border-brass/50 bg-ground text-brass-bright">
              <Icon name={icons[i]} size={24} />
            </span>
            <div className="md:mt-4">
              <div className="text-[12.5px] font-semibold text-faint">Step {i + 1}</div>
              <h3 className="text-[1.25rem]">{r.title}</h3>
              <p className="mt-1 max-w-[30ch] text-[15px] leading-snug text-muted">{r.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

function Ways() {
  const icons: IconName[] = ['door', 'pack', 'tower']
  return (
    <section className="wrap mt-20 md:mt-28" aria-labelledby="ways-title">
      <div className="rounded-[16px] border border-hairline bg-surface p-5 md:p-8">
        <div className="flex flex-wrap items-center gap-3">
          <h2 id="ways-title" className="text-[1.7rem] md:text-[2.1rem]">
            {site.home.waysTitle}
          </h2>
          <Pin id="home-ways" />
        </div>
        <ul className="mt-6 grid gap-5 md:grid-cols-3 md:gap-8">
          {site.home.ways.map((w, i) => (
            <li key={w.title} className="flex gap-3.5">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-raised text-brass-bright ring-1 ring-hairline">
                <Icon name={icons[i]} size={21} />
              </span>
              <div>
                <h3 className="font-sans text-[16.5px] font-semibold tracking-normal">{w.title}</h3>
                <p className="mt-0.5 text-[15px] leading-snug text-muted">{w.body}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-6 border-t border-hairline pt-5">
          <Link to="/pricing" className="inline-flex min-h-11 items-center gap-2 font-semibold text-brass-bright">
            Compare every way to pay <Icon name="arrow" size={17} />
          </Link>
        </div>
      </div>
    </section>
  )
}

function Closing() {
  return (
    <section className="wrap mt-20 md:mt-28" aria-labelledby="closing-title">
      <div className="relative overflow-hidden rounded-[18px] border border-brass/30 bg-[radial-gradient(80%_120%_at_50%_0%,#2a2014,#15120f_70%)] px-6 py-12 text-center md:py-16">
        <h2 id="closing-title" className="mx-auto max-w-[20ch] text-[2rem] md:text-[2.8rem]">
          {site.home.closingTitle}
        </h2>
        <p className="mx-auto mt-3 max-w-[44ch] text-[17px] text-muted">{site.home.closingSub}</p>
        <div className="mt-7 flex flex-col items-center justify-center gap-3 xs:flex-row">
          <LinkButton to={`/learn/${playableQuest}/1`} icon="play" className="w-full xs:w-auto xs:min-w-[220px]">
            {site.home.primaryCta}
          </LinkButton>
          <LinkButton to="/quests/godot-for-programmers" variant="ghost" iconRight="arrow" className="w-full xs:w-auto">
            {site.home.secondaryCta}
          </LinkButton>
        </div>
        <p className="mt-4 text-[14px] text-muted">{site.home.noSignup}</p>
      </div>
    </section>
  )
}
