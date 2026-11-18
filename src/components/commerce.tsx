import { useState } from 'react'
import { Link } from 'react-router'
import { questBySlug } from '../content/catalog'
import { bundle, nextPackCandidates, packBySlug, packCopy, packCredit, packs, voteCopy, type Pack } from '../content/packs'
import { planById, planCopy, poll, trialDays, type Period, type Plan } from '../content/plans'
import { site } from '../content/site'
import { videoBySlug } from '../content/videos'
import { PackArt, Motif } from '../art/Art'
import { availableCredit } from '../lib/access'
import { money } from '../lib/format'
import { ownedPackSlugs, useDemo } from '../lib/store'
import { useUI, type CheckoutItem } from '../lib/ui'
import { Icon } from './Icon'
import { Pin } from './Pin'
import { Sheet } from './Sheet'
import { Button, ExampleTag, Price, Seal } from './ui'

export const packLessons = (p: Pack) => p.quests.reduce((n, q) => n + (questBySlug[q]?.lessons ?? 0), 0)

export function useOwned() {
  const purchases = useDemo((s) => s.purchases)
  return ownedPackSlugs({ purchases })
}

export function bundleRemaining(owned: Set<string>) {
  const ownedValue = packs.filter((p) => owned.has(p.slug)).reduce((n, p) => n + p.price, 0)
  return Math.max(0, bundle.price - ownedValue)
}

export function PackCreditNote({ className = '', tone = 'dark' }: { className?: string; tone?: 'dark' | 'light' }) {
  return (
    <div className={`flex items-start gap-2.5 text-[14.5px] leading-snug ${tone === 'dark' ? 'text-muted' : 'text-ink-muted'} ${className}`}>
      <Icon name="key" size={18} className={`mt-0.5 shrink-0 ${tone === 'dark' ? 'text-brass' : 'text-brass-ink'}`} />
      <span>
        <span className={`font-semibold ${tone === 'dark' ? 'text-text' : 'text-ink'}`}>{packCredit.title}.</span> {packCredit.rule}
      </span>
    </div>
  )
}

export function PackCard({ pack, headingLevel = 3, compact = false }: { pack: Pack; headingLevel?: 2 | 3; compact?: boolean }) {
  const owned = useOwned().has(pack.slug)
  const openCheckout = useUI((s) => s.openCheckout)
  const H = headingLevel === 2 ? 'h2' : 'h3'
  return (
    <article className="relative flex h-full flex-col rounded-[14px] border border-hairline bg-surface p-5 transition-colors hover:border-line-strong">
      <div className="flex gap-4">
        <Link to={`/packs/${pack.slug}`} className="shrink-0" tabIndex={-1} aria-hidden="true">
          <PackArt pack={pack} owned={owned} className="h-[118px] w-[94px] drop-shadow-[0_10px_14px_rgba(0,0,0,.55)]" />
        </Link>
        <div className="min-w-0">
          <H className="text-[1.3rem] leading-tight">
            <Link to={`/packs/${pack.slug}`} className="hover:text-brass-bright">
              {pack.name}
            </Link>
          </H>
          <div className="mt-1 text-[13.5px] text-muted">
            {pack.quests.length} quests, {packLessons(pack)} lessons
          </div>
          <div className="mt-2.5">
            {owned ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-moss/15 px-2.5 py-1 text-[13px] font-semibold text-moss">
                <Icon name="check" size={14} /> {packCopy.ownedLabel}
              </span>
            ) : (
              <Price amount={pack.price} suffix="once" />
            )}
          </div>
        </div>
      </div>
      <p className="mt-4 text-[15px] leading-relaxed text-text/90">{pack.promise}</p>
      <ul className={`mt-3 space-y-1 text-[14px] text-muted ${compact ? 'max-md:hidden' : ''}`}>
        {pack.quests.map((q) => (
          <li key={q} className="flex gap-2">
            <span className="mt-[9px] size-1 shrink-0 rounded-full bg-brass/70" aria-hidden="true" />
            {questBySlug[q]?.title}
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-5">
        <div className="mb-3 text-[13.5px] text-muted">
          {packCopy.keepLine} {packCredit.short}
        </div>
        {owned ? (
          <Link to={`/packs/${pack.slug}`} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[10px] border border-moss/50 text-[15px] font-semibold text-moss">
            Open your pack <Icon name="arrow" size={17} />
          </Link>
        ) : (
          <div className="flex gap-2">
            <Button variant="secondary" className="flex-1" onClick={() => openCheckout({ kind: 'pack', pack: pack.slug })}>
              Get this pack
            </Button>
            <Link
              to={`/packs/${pack.slug}`}
              className="inline-flex min-h-12 items-center justify-center rounded-[10px] px-4 text-[15px] font-semibold text-brass-bright hover:bg-raised"
            >
              Details
            </Link>
          </div>
        )}
      </div>
    </article>
  )
}

export function BundleCard() {
  const owned = useOwned()
  const openCheckout = useUI((s) => s.openCheckout)
  const ownedCount = packs.filter((p) => owned.has(p.slug)).length
  const all = ownedCount === packs.length
  const remaining = bundleRemaining(owned)
  const fullPrice = packs.reduce((n, p) => n + p.price, 0)
  return (
    <div className="parchment on-parchment relative flex flex-col gap-5 rounded-[6px] p-5 sm:flex-row sm:items-center md:p-6">
      <div className="flex -space-x-10" aria-hidden="true">
        {packs.map((p, i) => (
          <PackArt
            key={p.slug}
            pack={p}
            owned={owned.has(p.slug)}
            className="h-[96px] w-[78px] drop-shadow-[0_8px_10px_rgba(40,20,5,.45)]"
            style={{ transform: `rotate(${(i - 1) * 6}deg)` }}
          />
        ))}
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="text-[1.35rem] text-ink">{bundle.name}</h3>
        <p className="mt-1 text-[15px] text-ink-muted">
          {bundle.line} {ownedCount > 0 && !all && packCopy.bundleOwnedSome(ownedCount)}
        </p>
        <div className="mt-2 text-ink">
          {all ? (
            <span className="font-semibold text-moss-ink">You own all three.</span>
          ) : (
            <>
              <Price amount={remaining} tone="light" suffix="once" />
              {ownedCount === 0 && <span className="ml-2 text-[14px] text-ink-muted line-through decoration-ink-muted/60">{money(fullPrice)}</span>}
            </>
          )}
        </div>
      </div>
      {!all && (
        <Button variant="ink" className="sm:min-w-[180px]" onClick={() => openCheckout({ kind: 'bundle' })}>
          Get all three
        </Button>
      )}
    </div>
  )
}

export function PlanCard({ plan, period }: { plan: Plan; period: Period }) {
  const viewAs = useDemo((s) => s.viewAs)
  const openCheckout = useUI((s) => s.openCheckout)
  const current = viewAs === plan.id
  const price = plan.price[period]
  const isGuild = plan.id === 'guild'
  return (
    <article
      className={`relative flex h-full flex-col rounded-[14px] border p-5 md:p-6 ${
        isGuild ? 'border-brass/45 bg-[linear-gradient(180deg,#221c13,#15120f_60%)]' : 'border-hairline bg-surface'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-[1.45rem]">{plan.name}</h3>
        {plan.isNew && <Pin id="level-plans" />}
        {isGuild && <span className="rounded-full border border-brass/40 px-2 py-0.5 text-[12px] font-semibold text-brass-bright">Unchanged</span>}
      </div>
      <p className="mt-1.5 min-h-[3em] text-[14.5px] leading-snug text-muted">{plan.short}</p>
      <div className="mt-4">
        <Price amount={price} suffix={period === 'month' ? 'a month' : 'a year'} big />
        {period === 'year' && (
          <div className="mt-1 text-[13px] text-muted">
            {money(Math.round((price / 12) * 100) / 100)} a month, {planCopy.yearlyNote.toLowerCase()}
          </div>
        )}
      </div>
      <ul className="mt-5 space-y-2 text-[14.5px]">
        {plan.includes.map((i) => (
          <li key={i} className="flex gap-2.5">
            <Icon name="check" size={17} className="mt-0.5 shrink-0 text-brass" />
            <span className="text-text/90">{i}</span>
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-6">
        {current ? (
          <div className="flex min-h-12 items-center justify-center rounded-[10px] border border-moss/50 text-[15px] font-semibold text-moss">Your plan</div>
        ) : (
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => openCheckout({ kind: 'plan', plan: plan.id as Exclude<typeof plan.id, 'free'>, period })}
          >
            Start {trialDays}-day free trial
          </Button>
        )}
      </div>
    </article>
  )
}

export function PeriodSwitch({ period, onChange }: { period: Period; onChange: (p: Period) => void }) {
  return (
    <div role="radiogroup" aria-label="Billing period" className="inline-flex rounded-full border border-hairline bg-surface p-1">
      {(['month', 'year'] as const).map((p) => (
        <button
          key={p}
          type="button"
          role="radio"
          aria-checked={period === p}
          onClick={() => onChange(p)}
          className={`min-h-10 rounded-full px-4 text-[14px] font-semibold transition-colors ${
            period === p ? 'bg-brass text-ink' : 'text-muted hover:text-text'
          }`}
        >
          {p === 'month' ? 'Monthly' : 'Yearly'}
        </button>
      ))}
    </div>
  )
}

export function StoredLine({ tone = 'dark' }: { tone?: 'dark' | 'light' }) {
  return (
    <p role="status" className={`anim-rise mt-3 flex items-center gap-2 text-[14.5px] font-medium ${tone === 'dark' ? 'text-moss' : 'text-moss-ink'}`}>
      <Icon name="check" size={17} /> {site.storedOnDeviceLine}
    </p>
  )
}

/** "Which pack should come next?" (recommendation C). */
export function VoteBoard({ only, compact = false }: { only?: string[]; compact?: boolean }) {
  const votes = useDemo((s) => s.votes)
  const toggleVote = useDemo((s) => s.toggleVote)
  const list = only ? nextPackCandidates.filter((c) => only.includes(c.id)) : nextPackCandidates
  const anyVoted = list.some((c) => votes[c.id])
  return (
    <div>
      <ul className={`grid gap-3 ${compact ? '' : 'sm:grid-cols-2 lg:grid-cols-4'}`}>
        {list.map((c) => {
          const on = !!votes[c.id]
          return (
            <li key={c.id}>
              <button
                type="button"
                aria-pressed={on}
                onClick={() => toggleVote(c.id)}
                className={`flex h-full min-h-[64px] w-full items-start gap-3.5 rounded-[12px] border p-4 text-left transition-colors duration-150 ${
                  on ? 'border-brass bg-brass/10' : 'border-dashed border-line-strong bg-surface/60 hover:border-brass/50'
                }`}
              >
                <span className={`shrink-0 ${on ? 'text-brass-bright' : 'text-muted'}`}>
                  <Motif name={c.motif} size={36} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-[1.12rem] leading-tight text-text">{c.name}</span>
                  <span className="mt-1 block text-[14px] leading-snug text-muted">{c.line}</span>
                  <span className={`mt-2.5 inline-flex items-center gap-1.5 text-[13.5px] font-semibold ${on ? 'text-brass-bright' : 'text-text/80'}`}>
                    {on ? <Icon name="check" size={15} /> : <span className="size-3.5 rounded-full border-[1.5px] border-current" aria-hidden="true" />}
                    {on ? voteCopy.voted : voteCopy.vote}
                  </span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>
      {anyVoted && <StoredLine />}
    </div>
  )
}

/** One-question pricing poll (recommendation C). */
export function Poll() {
  const answer = useDemo((s) => s.pollAnswer)
  const setPoll = useDemo((s) => s.setPoll)
  return (
    <div className="parchment on-parchment rounded-[6px] p-5 md:p-7">
      <div className="flex flex-wrap items-center gap-3">
        <div className="eyebrow !text-brass-ink">One question</div>
        <Pin id="pricing-poll" tone="light" />
      </div>
      <h3 id="poll-q" className="mt-2 text-[1.4rem] text-ink md:text-[1.6rem]">
        {poll.question}
      </h3>
      <div role="radiogroup" aria-labelledby="poll-q" className="mt-4 grid gap-2 sm:grid-cols-2">
        {poll.options.map((o) => {
          const on = answer === o.id
          return (
            <button
              key={o.id}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => setPoll(o.id)}
              className={`flex min-h-12 items-center gap-3 rounded-[8px] border px-4 py-2.5 text-left text-[15.5px] transition-colors duration-150 ${
                on ? 'border-ink bg-ink text-parchment' : 'border-ink/25 bg-[#f3e8d0]/60 text-ink hover:border-ink/50'
              }`}
            >
              <span className={`grid size-5 shrink-0 place-items-center rounded-full border-2 ${on ? 'border-parchment' : 'border-ink/40'}`} aria-hidden="true">
                {on && <span className="size-2 rounded-full bg-parchment" />}
              </span>
              {o.label}
            </button>
          )
        })}
      </div>
      {answer && <StoredLine tone="light" />}
    </div>
  )
}

/* ---------------- Mock checkout ---------------- */

function describe(item: CheckoutItem, owned: Set<string>) {
  if (item.kind === 'pack') {
    const p = packBySlug[item.pack]
    return { title: p.name, lines: p.quests.map((q) => questBySlug[q]?.title ?? q), price: p.price, art: p }
  }
  if (item.kind === 'bundle') {
    return { title: bundle.name, lines: packs.map((p) => p.name), price: bundleRemaining(owned), art: packs[1] }
  }
  const plan = planById[item.plan]
  return { title: `${plan.name} membership`, lines: plan.includes.slice(0, 4), price: plan.price[item.period], art: null }
}

export function CheckoutSheet() {
  const item = useUI((s) => s.checkout)
  const close = useUI((s) => s.closeCheckout)
  return item ? <CheckoutBody key={JSON.stringify(item)} item={item} onClose={close} /> : null
}

function CheckoutBody({ item, onClose }: { item: CheckoutItem; onClose: () => void }) {
  const state = useDemo()
  const owned = ownedPackSlugs(state)
  const [done, setDone] = useState(false)
  const d = describe(item, owned)
  const credit = item.kind === 'plan' ? Math.min(availableCredit(state), d.price) : 0
  const firstPayment = d.price - credit

  const buy = () => {
    if (item.kind === 'pack') state.buyPacks([item.pack], d.price, 'pack')
    else if (item.kind === 'bundle') state.buyPacks(packs.filter((p) => !owned.has(p.slug)).map((p) => p.slug), d.price, 'bundle')
    else state.joinPlan(item.plan, item.period)
    setDone(true)
  }

  return (
    <Sheet open onClose={onClose} labelledBy="checkout-title" maxWidth={480}>
      <div className="px-5 pt-3 md:px-7 md:pt-6">
        {done ? (
          <div className="flex flex-col items-center pt-4 pb-2 text-center" role="status">
            <Seal size={96} label="Unlocked" />
            <h2 id="checkout-title" className="mt-4 text-[1.6rem]">
              {item.kind === 'plan' ? `Welcome to ${planById[item.plan].name}.` : 'Yours to keep.'}
            </h2>
            <p className="mt-2 max-w-[34ch] text-[15.5px] text-muted">
              {item.kind === 'plan'
                ? 'Quests in your plan now show as open across the site. Nothing was charged.'
                : 'It now shows as owned everywhere on this site, and in your Realm. Nothing was charged.'}
            </p>
            <div className="mt-6 flex w-full flex-col gap-2 sm:flex-row">
              <Button className="flex-1" onClick={onClose} data-autofocus>
                Continue
              </Button>
              <Link
                to="/realm"
                onClick={onClose}
                className="inline-flex min-h-12 flex-1 items-center justify-center rounded-[10px] text-[15px] font-semibold text-brass-bright hover:bg-raised"
              >
                See your Realm
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="eyebrow">Checkout</div>
            <h2 id="checkout-title" className="mt-1 pr-10 text-[1.55rem]">
              {d.title}
            </h2>
            <div className="mt-4 flex gap-4">
              {d.art && <PackArt pack={d.art} className="h-[92px] w-[74px] shrink-0" />}
              <ul className="space-y-1 text-[14.5px] text-muted">
                {d.lines.map((l) => (
                  <li key={l} className="flex gap-2">
                    <Icon name="check" size={16} className="mt-0.5 shrink-0 text-brass" />
                    {l}
                  </li>
                ))}
              </ul>
            </div>

            <dl className="mt-5 divide-y divide-hairline rounded-[10px] border border-hairline bg-raised text-[15px]">
              {item.kind === 'plan' ? (
                <>
                  <Row label={`${trialDays}-day free trial`} value={<span className="font-semibold">{money(0)} today</span>} />
                  <Row
                    label={item.period === 'month' ? 'Then each month' : 'Then each year'}
                    value={<Price amount={d.price} />}
                  />
                  {credit > 0 && (
                    <Row
                      label={
                        <span className="flex items-center gap-2">
                          Pack credit <Pin id="checkout-credit" />
                        </span>
                      }
                      value={<span className="font-semibold text-moss">-{money(credit)}</span>}
                    />
                  )}
                  <Row label="First payment" value={<span className="font-display text-[1.25rem] font-semibold">{money(firstPayment)}<ExampleTag /></span>} />
                </>
              ) : (
                <>
                  <Row label="One payment" value={<Price amount={d.price} />} />
                  <Row label="Yours to keep" value={<span className="text-muted">Forever</span>} />
                </>
              )}
            </dl>

            {item.kind !== 'plan' && <PackCreditNote className="mt-4" />}
            {item.kind === 'plan' && <p className="mt-3 text-[13.5px] text-muted">{planCopy.trialLine}</p>}

            <p className="mt-5 flex items-center gap-2.5 rounded-[10px] border border-brass/40 bg-brass/[0.08] px-4 py-3 text-[15px] font-semibold text-brass-bright">
              <Icon name="info" size={19} className="shrink-0" />
              {site.noPaymentLine}
            </p>
            <Button className="mt-4 w-full" onClick={buy} data-autofocus>
              {site.fakeBuyButton}
            </Button>
            <button type="button" onClick={onClose} className="mt-1 inline-flex min-h-11 w-full items-center justify-center text-[14.5px] font-semibold text-muted hover:text-text">
              Not now
            </button>
          </>
        )}
      </div>
    </Sheet>
  )
}

function Row({ label, value }: { label: React.ReactNode; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3">
      <dt className="text-muted">{label}</dt>
      <dd className="text-right">{value}</dd>
    </div>
  )
}

export function PairedVideo({ pack }: { pack: Pack }) {
  const v = pack.pairsWithVideo ? videoBySlug[pack.pairsWithVideo] : undefined
  if (!v) return null
  return (
    <Link to={`/from/${v.slug}`} className="inline-flex min-h-11 items-center gap-2 text-[14.5px] text-muted hover:text-text">
      <Icon name="video" size={18} className="text-brass" />
      Pairs with the video <span className="font-semibold text-text">{v.title}</span>
    </Link>
  )
}
