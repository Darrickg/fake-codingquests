import { useState } from 'react'
import { Link } from 'react-router'
import { packs } from '../content/packs'
import { leaveFlow, planById, plans } from '../content/plans'
import { PackArt } from '../art/Art'
import { StoredLine, useOwned } from '../components/commerce'
import { Icon } from '../components/Icon'
import { Pin } from '../components/Pin'
import { Button, LinkButton, Price } from '../components/ui'
import { money } from '../lib/format'
import { useDemo } from '../lib/store'
import { useUI } from '../lib/ui'
import { useTitle } from '../lib/useTitle'

type Reason = (typeof leaveFlow.reasons)[number]

export default function Leave() {
  useTitle('Cancel membership')
  const s = useDemo()
  const openCheckout = useUI((x) => x.openCheckout)
  const owned = useOwned()
  const [reason, setReason] = useState<Reason | null>(null)
  const [step, setStep] = useState<1 | 2 | 'done' | 'switched'>(1)
  const [text, setText] = useState('')
  const [sent, setSent] = useState(false)
  const plan = planById[s.viewAs]

  if (s.viewAs === 'free' && step !== 'done') {
    return (
      <div className="wrap max-w-[640px] py-14">
        <h1 className="text-[2rem]">Nothing to cancel</h1>
        <p className="mt-3 text-[16px] text-muted">
          You are viewing the site as Free. To try the leave flow, pick a paid plan under View the site as in your Realm.
        </p>
        <LinkButton to="/realm#demo" className="mt-6" variant="secondary">
          Go to the demo controls
        </LinkButton>
      </div>
    )
  }

  const cancel = () => {
    s.cancelPlan()
    setStep('done')
  }
  const cheaper = plans.filter((p) => p.isNew && p.rank < plan.rank).sort((a, b) => a.rank - b.rank)[0]

  return (
    <div className="wrap max-w-[760px] pt-6 md:pt-10">
      <Link to="/realm" className="inline-flex min-h-10 items-center gap-1.5 text-[14px] text-muted hover:text-text">
        <Icon name="back" size={16} /> {leaveFlow.back}
      </Link>

      {step === 'done' ? (
        <div className="mt-6" role="status">
          <h1 className="text-[2rem] md:text-[2.4rem]">Done.</h1>
          <p className="mt-3 max-w-[52ch] text-[17px] text-muted">{leaveFlow.cancelled} Nothing was charged or changed outside this concept.</p>
          <LinkButton to="/realm" className="mt-6" variant="secondary">
            {leaveFlow.back}
          </LinkButton>
        </div>
      ) : step === 'switched' ? (
        <div className="mt-6" role="status">
          <h1 className="text-[2rem] md:text-[2.4rem]">You are on {planById[s.viewAs].name} now.</h1>
          <p className="mt-3 max-w-[52ch] text-[17px] text-muted">Your progress stays as it was. Nothing was charged.</p>
          <LinkButton to="/realm" className="mt-6" variant="secondary">
            {leaveFlow.back}
          </LinkButton>
        </div>
      ) : step === 1 ? (
        <div className="mt-4">
          <div className="eyebrow">{leaveFlow.title}</div>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h1 id="leave-q" className="text-[2rem] md:text-[2.4rem]">
              {leaveFlow.question}
            </h1>
            <Pin id="leave-question" />
          </div>
          <p className="mt-2 text-[15.5px] text-muted">You are on {plan.name}. One question, then you decide.</p>
          <div role="radiogroup" aria-labelledby="leave-q" className="mt-6 grid gap-2">
            {leaveFlow.reasons.map((r) => {
              const on = reason?.id === r.id
              return (
                <button
                  key={r.id}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => {
                    setReason(r)
                    s.setLeaveAnswer(r.id)
                  }}
                  className={`flex min-h-13 items-center gap-3 rounded-[10px] border px-4 py-3 text-left text-[16px] transition-colors ${
                    on ? 'border-brass bg-brass/10' : 'border-hairline bg-surface hover:border-line-strong'
                  }`}
                >
                  <span className={`grid size-5 shrink-0 place-items-center rounded-full border-2 ${on ? 'border-brass' : 'border-line-strong'}`} aria-hidden="true">
                    {on && <span className="size-2 rounded-full bg-brass" />}
                  </span>
                  {r.label}
                </button>
              )
            })}
          </div>
          {reason && <StoredLine />}
          <Actions>
            <Button onClick={() => setStep(2)} disabled={!reason} className="flex-1" iconRight="arrow">
              {reason ? 'Continue' : 'Pick an answer'}
            </Button>
            <Button variant="secondary" onClick={cancel} className="flex-1">
              {leaveFlow.cancelAnyway}
            </Button>
          </Actions>
        </div>
      ) : (
        <div className="mt-4">
          <div className="eyebrow">You said: {reason?.label}</div>
          {reason?.offer === 'text' ? (
            <>
              <h1 className="mt-2 text-[2rem] md:text-[2.4rem]">{leaveFlow.textTitle}</h1>
              <p className="mt-2 text-[15.5px] text-muted">{leaveFlow.textBody}</p>
              <label htmlFor="what-broke" className="sr-only">
                {leaveFlow.textPlaceholder}
              </label>
              <textarea
                id="what-broke"
                value={text}
                onChange={(e) => {
                  setText(e.target.value)
                  setSent(false)
                }}
                rows={5}
                placeholder={leaveFlow.textPlaceholder}
                className="mt-5 w-full rounded-[10px] border border-hairline bg-surface p-4 text-[16px] text-text outline-none placeholder:text-faint focus:border-brass"
              />
              {sent && (
                <p role="status" className="mt-2 flex items-center gap-2 text-[14.5px] text-moss">
                  <Icon name="check" size={17} /> {leaveFlow.textSent}
                </p>
              )}
              <Actions>
                <Button onClick={() => setSent(true)} disabled={!text.trim()} className="flex-1">
                  {leaveFlow.textSend}
                </Button>
                <Button variant="secondary" onClick={cancel} className="flex-1">
                  {leaveFlow.cancelAnyway}
                </Button>
              </Actions>
            </>
          ) : reason?.offer === 'cheaper' && cheaper ? (
            <>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <h1 className="text-[2rem] md:text-[2.4rem]">{leaveFlow.cheaperOfferTitle}</h1>
                <Pin id="leave-offers" />
              </div>
              <p className="mt-2 max-w-[52ch] text-[16px] text-muted">{leaveFlow.cheaperOfferBody(cheaper.name, money(cheaper.price.month))}</p>
              <div className="mt-5 rounded-[12px] border border-hairline bg-surface p-5">
                <div className="font-display text-[1.4rem]">{cheaper.name}</div>
                <p className="mt-1 text-[14.5px] text-muted">{cheaper.short}</p>
                <div className="mt-3">
                  <Price amount={cheaper.price.month} suffix="a month" />
                  <span className="ml-3 text-[14px] text-faint line-through">{money(plan.price.month)}</span>
                </div>
              </div>
              <Actions>
                <Button
                  onClick={() => {
                    s.setViewAs(cheaper.id)
                    setStep('switched')
                  }}
                  className="flex-1"
                >
                  Switch to {cheaper.name}
                </Button>
                <Button variant="secondary" onClick={cancel} className="flex-1">
                  {leaveFlow.cancelAnyway}
                </Button>
              </Actions>
            </>
          ) : (
            <>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <h1 className="text-[2rem] md:text-[2.4rem]">{leaveFlow.packOfferTitle}</h1>
                <Pin id="leave-offers" />
              </div>
              <p className="mt-2 max-w-[54ch] text-[16px] text-muted">{reason?.offer === 'cheaper' ? leaveFlow.noCheaperBody : leaveFlow.packOfferBody}</p>
              <ul className="mt-5 grid gap-2">
                {packs.map((p) => {
                  const isOwned = owned.has(p.slug)
                  return (
                    <li key={p.slug} className="flex items-center gap-3 rounded-[12px] border border-hairline bg-surface p-3">
                      <PackArt pack={p} owned={isOwned} className="h-[62px] w-[50px] shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold">{p.name}</div>
                        {isOwned ? <span className="text-[14px] text-moss">Yours already</span> : <Price amount={p.price} suffix="once" className="text-[14.5px]" />}
                      </div>
                      {!isOwned && (
                        <button type="button" onClick={() => openCheckout({ kind: 'pack', pack: p.slug })} className="inline-flex min-h-11 shrink-0 items-center px-2 font-semibold text-brass-bright">
                          Keep this
                        </button>
                      )}
                    </li>
                  )
                })}
              </ul>
              <Actions>
                <LinkButton to="/realm" className="flex-1">
                  Keep my plan for now
                </LinkButton>
                <Button variant="secondary" onClick={cancel} className="flex-1">
                  {leaveFlow.cancelAnyway}
                </Button>
              </Actions>
            </>
          )}
        </div>
      )}
    </div>
  )
}

function Actions({ children }: { children: React.ReactNode }) {
  return <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">{children}</div>
}
