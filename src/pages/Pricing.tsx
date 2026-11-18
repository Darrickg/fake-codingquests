import { useSearchParams } from 'react-router'
import { packs } from '../content/packs'
import { paidPlans, planCopy, pricingCopy } from '../content/plans'
import { site } from '../content/site'
import { BundleCard, PackCard, PackCreditNote, PeriodSwitch, PlanCard, Poll } from '../components/commerce'
import { Icon } from '../components/Icon'
import { Pin } from '../components/Pin'
import { LinkButton, SectionHead } from '../components/ui'
import { useDemo } from '../lib/store'
import { useTitle } from '../lib/useTitle'

export default function Pricing() {
  useTitle('Pricing')
  const [params, setParams] = useSearchParams()
  const tab = params.get('tab') === 'membership' ? 'membership' : 'once'
  const period = useDemo((s) => s.period)
  const setPeriod = useDemo((s) => s.setPeriod)
  const setTab = (t: 'once' | 'membership') => setParams(t === 'once' ? {} : { tab: t }, { replace: true, preventScrollReset: true })

  return (
    <div className="wrap pt-8 md:pt-14">
      <SectionHead as="h1" eyebrow="Pricing" title={pricingCopy.title} sub={pricingCopy.sub} />
      <div className="mb-7 flex flex-col gap-3 rounded-[12px] border border-dashed border-line-strong px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between md:px-5">
        <p className="text-[15px] text-muted">
          <span className="font-semibold text-text">{pricingCopy.freeTitle}.</span> {pricingCopy.freeBody}
        </p>
        <LinkButton to="/learn/2d-top-down-character-movement/1" variant="ghost" iconRight="arrow" className="!min-h-11 shrink-0 !px-3 text-brass-bright">
          {site.home.primaryCta}
        </LinkButton>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div role="tablist" aria-label="Ways to pay" className="inline-flex rounded-[12px] border border-hairline bg-surface p-1">
          {(['once', 'membership'] as const).map((t) => (
            <button
              key={t}
              role="tab"
              type="button"
              id={`tab-${t}`}
              aria-selected={tab === t}
              aria-controls={`panel-${t}`}
              onClick={() => setTab(t)}
              className={`min-h-11 rounded-[9px] px-5 text-[15px] font-semibold transition-colors ${
                tab === t ? 'bg-raised text-text ring-1 ring-brass/50' : 'text-muted hover:text-text'
              }`}
            >
              {t === 'once' ? pricingCopy.tabOnce : pricingCopy.tabMember}
            </button>
          ))}
        </div>
        <Pin id="pricing-tabs" />
      </div>

      <div className="mt-6">
        {tab === 'once' ? (
          <div role="tabpanel" id="panel-once" aria-labelledby="tab-once">
            <div className="grid gap-4 md:grid-cols-3">
              {packs.map((p) => (
                <PackCard key={p.slug} pack={p} compact />
              ))}
            </div>
            <div className="mt-6">
              <BundleCard />
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <PackCreditNote className="min-w-0 flex-1" />
              <Pin id="pack-credit" />
            </div>
          </div>
        ) : (
          <div role="tabpanel" id="panel-membership" aria-labelledby="tab-membership">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <PeriodSwitch period={period} onChange={setPeriod} />
              <p className="text-[14px] text-muted">{planCopy.trialLine}</p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {paidPlans.map((p) => (
                <PlanCard key={p.id} plan={p} period={period} />
              ))}
            </div>
            <p className="mt-5 flex items-start gap-2.5 text-[15px] text-text/90">
              <Icon name="info" size={19} className="mt-0.5 shrink-0 text-brass" />
              {planCopy.currentMembersLine}
            </p>
          </div>
        )}
      </div>


      <section className="mt-16 md:mt-20" aria-labelledby="faq-title">
        <h2 id="faq-title" className="text-[1.7rem] md:text-[2.1rem]">
          {pricingCopy.faqTitle}
        </h2>
        <div className="mt-5 divide-y divide-hairline border-y border-hairline">
          {pricingCopy.faq.map((f) => (
            <details key={f.q} className="group">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 text-[16.5px] font-semibold [&::-webkit-details-marker]:hidden">
                {f.q}
                <Icon name="chevron" size={20} className="shrink-0 text-brass transition-transform duration-200 group-open:rotate-180" />
              </summary>
              <p className="max-w-[66ch] pb-4 text-[15.5px] leading-relaxed text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section id="poll" className="mt-16 scroll-mt-24 md:mt-20" aria-label="Poll">
        <Poll />
      </section>
    </div>
  )
}
