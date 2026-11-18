import { Link } from 'react-router'
import { recList } from '../content/pins'
import { conceptPage, site } from '../content/site'
import { videoBySlug, videoCopy } from '../content/videos'
import { VideoArt } from '../art/Art'
import { Icon } from '../components/Icon'
import { Pin } from '../components/Pin'
import { SectionHead } from '../components/ui'
import { useTitle } from '../lib/useTitle'

export default function Concept() {
  useTitle('About this concept')
  const v = videoBySlug[conceptPage.pasteExampleVideo]
  const url = `${site.publicLinkBase}/from/${v.slug}`
  return (
    <div className="wrap pt-8 md:pt-14">
      <SectionHead as="h1" eyebrow={`${site.team}, ${site.course}`} title={conceptPage.title} />
      <div className="max-w-[64ch] space-y-4 text-[17px] leading-relaxed text-text/90">
        {conceptPage.intro.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <a href={site.realSiteUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-[10px] border border-brass/60 px-5 font-semibold text-brass-bright hover:bg-brass/10">
          {conceptPage.realSiteCta} <Icon name="external" size={17} />
        </a>
        <a href={site.channelUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-[10px] px-4 font-semibold text-text/90 hover:bg-raised">
          {conceptPage.channelCta} <Icon name="external" size={17} />
        </a>
      </div>

      <section className="mt-16 md:mt-20" aria-labelledby="recs-title">
        <h2 id="recs-title" className="text-[1.7rem] md:text-[2.2rem]">
          Our three recommendations
        </h2>
        <ol className="mt-6 grid gap-4 lg:grid-cols-3">
          {recList.map((r) => (
            <li key={r.id} className="flex flex-col rounded-[14px] border border-hairline bg-surface p-5 md:p-6">
              <div className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-full bg-brass font-display text-[1.1rem] font-semibold text-ink">{r.letter}</span>
                <h3 className="text-[1.4rem]">{r.name}</h3>
              </div>
              <p className="mt-3 text-[15.5px] leading-relaxed text-text/90">{r.summary}</p>
              <dl className="mt-4 space-y-3 text-[14.5px] leading-relaxed">
                <div>
                  <dt className="text-[12px] font-semibold tracking-[0.12em] text-brass uppercase">Why</dt>
                  <dd className="text-muted">{r.why}</dd>
                </div>
                <div>
                  <dt className="text-[12px] font-semibold tracking-[0.12em] text-brass uppercase">What we would measure</dt>
                  <dd className="text-muted">{r.measure}</dd>
                </div>
              </dl>
              <div className="mt-auto pt-5">
                <div className="text-[12px] font-semibold tracking-[0.12em] text-faint uppercase">See it</div>
                <ul className="mt-1">
                  {r.seeIt.map((s) => (
                    <li key={s.to}>
                      <Link to={s.to} className="inline-flex min-h-10 items-center gap-1.5 text-[15px] font-semibold text-brass-bright">
                        {s.label} <Icon name="arrow" size={15} />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-16 md:mt-20" aria-labelledby="paste-title">
        <SectionHead id="paste-title" eyebrow="Recommendation B in practice" title={conceptPage.pasteTitle} sub={conceptPage.pasteSub} pin={<Pin id="concept-paste" />} />
        <div className="grid gap-5 lg:grid-cols-[320px_minmax(0,1fr)] lg:items-start">
          <div>
            <VideoArt video={v} className="w-full rounded-[10px]" />
            <div className="mt-3 font-semibold">{v.title}</div>
            <div className="text-[14px] text-muted">Example video, drawn for this concept</div>
          </div>
          <div className="space-y-4">
            <MockBlock label="First line of the description">
              <p className="font-mono text-[14px] leading-relaxed break-words text-text">
                {videoCopy.descriptionFirstLine}{' '}
                <span className="text-[#8fb3e0] underline decoration-[#8fb3e0]/40">{url}</span>
              </p>
            </MockBlock>
            <MockBlock label="Pinned comment">
              <div className="flex gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-raised ring-1 ring-hairline" aria-hidden="true">
                  <Icon name="tower" size={18} className="text-brass" />
                </span>
                <p className="text-[15px] leading-relaxed text-text/90">
                  {videoCopy.pinnedComment} <span className="text-[#8fb3e0] underline decoration-[#8fb3e0]/40">{url}</span>
                </p>
              </div>
            </MockBlock>
            <MockBlock label="Said once on camera">
              <p className="font-display text-[1.2rem] leading-snug text-text">{videoCopy.spokenLine}</p>
            </MockBlock>
          </div>
        </div>
      </section>

      <p className="mt-14 text-[14.5px] text-muted">
        {conceptPage.resetHint}{' '}
        <Link to="/realm#demo" className="link">
          Go to the demo controls
        </Link>
      </p>
    </div>
  )
}

function MockBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[12px] border border-hairline bg-[#0f0d0b] p-4 md:p-5">
      <div className="mb-2 text-[12px] font-semibold tracking-[0.12em] text-faint uppercase">{label}</div>
      {children}
    </div>
  )
}
