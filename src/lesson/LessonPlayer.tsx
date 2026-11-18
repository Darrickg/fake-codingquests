import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router'
import { lessonCopy, lessons, playableQuest, type Lesson, type PredictStep, type WriteStep } from '../content/lessons'
import { questBySlug } from '../content/catalog'
import { Camp } from '../art/Camp'
import { Icon } from '../components/Icon'
import { Pin } from '../components/Pin'
import { Button, LinkButton, Seal, XPBar } from '../components/ui'
import { useDemo } from '../lib/store'
import { useCoarse } from '../lib/useMedia'
import { ChipTray, CodePanel } from './CodePanel'
import { buildMotion, lesson1Motion, normalizeTyped, rightOnlyMotion, type Frame, type Motion, type ScriptStep } from './sim'

const Preview = lazy(() => import('./Preview'))

const quest = questBySlug[playableQuest]
const lessonKey = (l: Lesson) => `${playableQuest}/${l.slug}`

type CheckState = {
  goals: { id: string; label: string; done: boolean }[]
  message: string | null
  passed: boolean
}

function initialCheck(stepKey: string): CheckState {
  if (stepKey === '1-write')
    return {
      goals: [
        { id: 'left', label: 'Left', done: false },
        { id: 'right', label: 'Right', done: false },
        { id: 'up', label: 'Up', done: false },
        { id: 'down', label: 'Down', done: false },
      ],
      message: null,
      passed: false,
    }
  if (stepKey === '2-write')
    return {
      goals: [
        { id: 'straight', label: 'Straight at 120', done: false },
        { id: 'diagonal', label: 'Diagonal at 120', done: false },
      ],
      message: null,
      passed: false,
    }
  return { goals: [{ id: 'fast', label: 'Readout says 180', done: false }], message: null, passed: false }
}

const dirName = (ix: number, iy: number) =>
  ix < 0 ? 'left' : ix > 0 ? 'right' : iy < 0 ? 'up' : iy > 0 ? 'down' : ''

export function LessonPlayer({ lessonSlug, embedded = false }: { lessonSlug: string; embedded?: boolean }) {
  const lesson = lessons.find((l) => l.slug === lessonSlug) ?? lessons[0]
  const [stepIdx, setStepIdx] = useState(0)
  const [finished, setFinished] = useState(false)
  const step = lesson.steps[stepIdx]
  const stepKey = `${lesson.number}-${step.kind}`
  const completeLesson = useDemo((s) => s.completeLesson)
  const completeProve = useDemo((s) => s.completeProve)
  const done = useDemo((s) => !!s.lessonsDone[lessonKey(lesson)])
  const liveRef = useRef<HTMLDivElement>(null)
  const topRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setStepIdx(0)
    setFinished(false)
  }, [lessonSlug])

  const announce = useCallback((msg: string) => {
    if (liveRef.current) liveRef.current.textContent = msg
  }, [])

  const goNext = () => {
    if (step.kind === 'write' && lesson.number === 2) completeLesson(lessonKey(lesson), lesson.xp)
    if (stepIdx < lesson.steps.length - 1) setStepIdx(stepIdx + 1)
    else {
      if (step.kind === 'write') completeLesson(lessonKey(lesson), lesson.xp)
      if (step.kind === 'prove') completeProve(lessonKey(lesson), lesson.proveXp ?? 0)
      setFinished(true)
    }
    window.setTimeout(() => topRef.current?.scrollIntoView({ block: 'start', behavior: 'smooth' }), 30)
  }

  const skipProve = () => {
    setFinished(true)
    window.setTimeout(() => topRef.current?.scrollIntoView({ block: 'start', behavior: 'smooth' }), 30)
  }

  return (
    <div ref={topRef} className={embedded ? '' : 'scroll-mt-20'}>
      <div ref={liveRef} aria-live="polite" className="sr-only" />
      {!embedded && <LessonHeader lesson={lesson} done={done} />}
      <StepRail lesson={lesson} stepIdx={finished ? lesson.steps.length : stepIdx} />
      {finished ? (
        <Finished lesson={lesson} embedded={embedded} />
      ) : step.kind === 'predict' ? (
        <PredictView key={stepKey} step={step} lesson={lesson} onNext={goNext} embedded={embedded} announce={announce} />
      ) : (
        <WriteView
          key={stepKey}
          step={step}
          stepKey={stepKey}
          lesson={lesson}
          onNext={goNext}
          onSkip={step.kind === 'prove' ? skipProve : undefined}
          embedded={embedded}
          announce={announce}
          isLast={stepIdx === lesson.steps.length - 1}
        />
      )}
    </div>
  )
}

function LessonHeader({ lesson, done }: { lesson: Lesson; done: boolean }) {
  return (
    <div className="mb-5">
      <Link to={`/quests/${playableQuest}`} className="inline-flex min-h-10 items-center gap-1.5 text-[14px] text-muted hover:text-text">
        <Icon name="back" size={16} /> {quest.title}
      </Link>
      <div className="mt-1 flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
        <div>
          <div className="eyebrow">
            Lesson {lesson.number} of {quest.lessons}
            {done && <span className="ml-2 text-moss">Done</span>}
          </div>
          <h1 className="mt-1 text-[1.9rem] md:text-[2.5rem]">{lesson.title}</h1>
        </div>
      </div>
    </div>
  )
}

function StepRail({ lesson, stepIdx }: { lesson: Lesson; stepIdx: number }) {
  return (
    <ol className="mb-5 flex items-center gap-2 text-[13px] font-semibold" aria-label="Steps">
      {lesson.steps.map((s, i) => {
        const state = i < stepIdx ? 'done' : i === stepIdx ? 'current' : 'todo'
        return (
          <li key={i} className="flex items-center gap-2" aria-current={state === 'current' ? 'step' : undefined}>
            {i > 0 && <span className="h-px w-4 bg-line-strong sm:w-8" aria-hidden="true" />}
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 ${
                state === 'current'
                  ? 'bg-brass/15 text-brass-bright ring-1 ring-brass/50'
                  : state === 'done'
                    ? 'text-moss'
                    : 'text-faint'
              }`}
            >
              {state === 'done' && <Icon name="check" size={14} />}
              {s.title}
            </span>
          </li>
        )
      })}
    </ol>
  )
}

/** Desktop: two columns. Phones: stacked, with a sticky action bar. */
function StepLayout({
  left,
  right,
  action,
  embedded,
}: {
  left: React.ReactNode
  right: React.ReactNode
  action: React.ReactNode
  embedded: boolean
}) {
  return (
    <>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,1fr)] lg:gap-10">
        <div className="min-w-0 space-y-5">{left}</div>
        <div className="min-w-0">
          <div className="space-y-4 lg:sticky lg:top-24">{right}</div>
        </div>
      </div>
      <div
        className={
          embedded
            ? 'mt-6'
            : 'sticky bottom-0 z-20 -mx-4 mt-6 border-t border-hairline bg-ground/95 px-4 py-3 pb-[max(12px,env(safe-area-inset-bottom))] backdrop-blur-[6px] md:static md:mx-0 md:border-0 md:bg-transparent md:px-0 md:py-0 md:backdrop-blur-none'
        }
      >
        <div className="flex flex-wrap items-center gap-3 md:justify-start">{action}</div>
      </div>
    </>
  )
}

/** On stacked (phone) layouts, bring the preview into view after a run. */
function revealPreview(el: HTMLElement | null) {
  if (!el || window.matchMedia('(min-width: 1024px)').matches) return
  window.setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'center' }), 40)
}

function PreviewFallback() {
  return <div className="aspect-[360/200] w-full animate-pulse rounded-[10px] border border-line-strong bg-[#14110d]" />
}

/* ---------------- Predict ---------------- */

function PredictView({
  step,
  lesson,
  onNext,
  embedded,
  announce,
}: {
  step: PredictStep
  lesson: Lesson
  onNext: () => void
  embedded: boolean
  announce: (m: string) => void
}) {
  const [choice, setChoice] = useState<string | null>(null)
  const [runId, setRunId] = useState(0)
  const [running, setRunning] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const seen = useRef({ straight: 0, diagonal: 0 })
  const [seenView, setSeenView] = useState({ straight: 0, diagonal: 0 })
  const previewRef = useRef<HTMLDivElement>(null)

  const isL1 = lesson.number === 1
  const motion: Motion | null = runId === 0 ? null : isL1 ? rightOnlyMotion : lesson1Motion
  const script: ScriptStep[] | null = isL1
    ? [{ until: 2.6, ix: 0, iy: 0 }]
    : [
        { until: 1.0, ix: 1, iy: 0 },
        { until: 1.25, ix: 0, iy: 0 },
        { until: 2.05, ix: 1, iy: 1 },
        { until: 2.3, ix: 0, iy: 0 },
      ]

  const run = () => {
    seen.current = { straight: 0, diagonal: 0 }
    setRunning(true)
    setRunId((n) => n + 1)
    revealPreview(previewRef.current)
  }
  const onScriptEnd = () => {
    setRunning(false)
    setRevealed(true)
    setSeenView({ ...seen.current })
    const right = choice === step.correct
    announce(`${right ? 'Right.' : 'Not quite.'} ${step.explain}`)
  }
  const onFrame = (f: Frame) => {
    if (f.speed === 0) return
    if (f.ix !== 0 && f.iy !== 0 && f.dx !== 0 && f.dy !== 0) seen.current.diagonal = Math.max(seen.current.diagonal, f.speed)
    else if ((f.ix !== 0) !== (f.iy !== 0)) seen.current.straight = Math.max(seen.current.straight, f.speed)
  }

  const correct = choice === step.correct

  const left = (
    <>
      <p className="text-[17px] leading-relaxed text-text">{step.prompt}</p>
      <CodePanel code={step.code} />
      <div role="radiogroup" aria-label={step.prompt} className="grid gap-2">
        {step.choices.map((c) => {
          const on = choice === c.id
          const isRight = revealed && c.id === step.correct
          const isWrong = revealed && on && !correct
          return (
            <button
              key={c.id}
              type="button"
              role="radio"
              aria-checked={on}
              disabled={revealed || running}
              onClick={() => setChoice(c.id)}
              className={`flex min-h-12 items-center gap-3 rounded-[10px] border px-4 py-2.5 text-left text-[15.5px] transition-colors duration-150 disabled:cursor-default ${
                isRight
                  ? 'border-moss/70 bg-moss/10 text-text'
                  : isWrong
                    ? 'border-ember/60 bg-ember/10 text-text'
                    : on
                      ? 'border-brass bg-brass/10 text-text'
                      : 'border-hairline bg-surface text-text/90 hover:border-line-strong'
              }`}
            >
              <span
                className={`grid size-5 shrink-0 place-items-center rounded-full border-2 ${
                  isRight ? 'border-moss bg-moss text-ground' : on ? 'border-brass' : 'border-line-strong'
                }`}
                aria-hidden="true"
              >
                {isRight ? <Icon name="check" size={12} strokeWidth={3} /> : on ? <span className="size-2 rounded-full bg-brass" /> : null}
              </span>
              {c.label}
            </button>
          )
        })}
      </div>
      {revealed && (
        <div className={`anim-rise rounded-[10px] border p-4 ${correct ? 'border-moss/40 bg-moss/[0.07]' : 'border-brass/30 bg-brass/[0.06]'}`}>
          <div className={`mb-1 font-semibold ${correct ? 'text-moss' : 'text-brass-bright'}`}>{correct ? 'You called it.' : 'Not quite, and that is the point of predicting.'}</div>
          <p className="text-[15.5px] leading-relaxed text-text/90">{step.explain}</p>
        </div>
      )}
    </>
  )

  const right = (
    <div ref={previewRef} className="space-y-4">
      <Suspense fallback={<PreviewFallback />}>
        <Preview
          motion={motion}
          runId={runId}
          script={script}
          onScriptEnd={onScriptEnd}
          onFrame={onFrame}
          start={isL1 ? 'left' : 'topleft'}
          globalKeys={!embedded}
          idleLabel="Pick an answer, then run it"
        />
      </Suspense>
      {revealed && !isL1 && (
        <div className="anim-rise grid grid-cols-2 gap-2 text-center">
          <div className="rounded-[10px] border border-hairline bg-surface p-3">
            <div className="text-[12.5px] text-muted">Straight</div>
            <div className="tabular font-mono text-[1.4rem] text-text">{seenView.straight || 120}</div>
          </div>
          <div className="rounded-[10px] border border-ember/40 bg-ember/[0.07] p-3">
            <div className="text-[12.5px] text-muted">Diagonal</div>
            <div className="tabular font-mono text-[1.4rem] text-ember-bright">{seenView.diagonal || 170}</div>
          </div>
        </div>
      )}
    </div>
  )

  const action = revealed ? (
    <Button onClick={onNext} iconRight="arrow" className="w-full md:w-auto" data-autofocus>
      Next: write the code
    </Button>
  ) : (
    <Button onClick={run} disabled={!choice || running} icon="play" className="w-full md:w-auto">
      {running ? 'Running' : choice ? step.runLabel : 'Pick an answer first'}
    </Button>
  )

  return <StepLayout left={left} right={right} action={action} embedded={embedded} />
}

/* ---------------- Write and Prove It ---------------- */

function WriteView({
  step,
  stepKey,
  lesson,
  onNext,
  onSkip,
  embedded,
  announce,
  isLast,
}: {
  step: WriteStep
  stepKey: string
  lesson: Lesson
  onNext: () => void
  onSkip?: () => void
  embedded: boolean
  announce: (m: string) => void
  isLast: boolean
}) {
  const coarse = useCoarse()
  const [values, setValues] = useState<Record<string, string>>({})
  const [active, setActive] = useState<string | null>(step.blanks[0]?.id ?? null)
  const [motion, setMotion] = useState<Motion | null>(null)
  const [ranWith, setRanWith] = useState<string | null>(null)
  const [runId, setRunId] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [check, setCheck] = useState<CheckState>(() => initialCheck(stepKey))
  const [showHint, setShowHint] = useState(false)
  const checkRef = useRef(check)
  checkRef.current = check
  const previewRef = useRef<HTMLDivElement>(null)
  const mismatch = useRef({ key: '', t: 0, still: 0 })

  const filled = step.blanks.every((b) => (values[b.id] ?? '').trim() !== '')
  const valuesKey = JSON.stringify(values)
  const stale = ranWith !== null && ranWith !== valuesKey
  const activeBlank = step.blanks.find((b) => b.id === active)

  const pick = (v: string) => {
    if (!activeBlank) return
    const next = { ...values, [activeBlank.id]: v }
    setValues(next)
    const nextEmpty = step.blanks.find((b) => !(next[b.id] ?? '').trim())
    setActive(nextEmpty ? nextEmpty.id : activeBlank.id)
  }

  const run = () => {
    const built = buildMotion(stepKey, values)
    setRanWith(valuesKey)
    mismatch.current = { key: '', t: 0, still: 0 }
    setCheck(initialCheck(stepKey))
    if (!built.ok) {
      setError(built.error)
      setMotion(null)
      announce(built.error)
      return
    }
    setError(null)
    setMotion(built.motion)
    setRunId((n) => n + 1)
    announce(`Code is running. ${step.checkGoal}`)
    revealPreview(previewRef.current)
  }

  const setMessage = (m: string | null) => {
    if (checkRef.current.message === m) return
    setCheck((c) => ({ ...c, message: m }))
    if (m) announce(m)
  }
  const markGoal = (id: string) => {
    const c = checkRef.current
    if (c.passed || c.goals.find((g) => g.id === id)?.done) return
    const goals = c.goals.map((g) => (g.id === id ? { ...g, done: true } : g))
    const passed = goals.every((g) => g.done)
    const next = { goals, passed, message: passed ? null : c.message }
    checkRef.current = next
    setCheck(next)
    if (passed) announce(`Check passed. ${step.passLine}`)
  }

  const onFrame = (f: Frame) => {
    const c = checkRef.current
    if (c.passed) return
    const single = (f.ix !== 0) !== (f.iy !== 0)
    const both = f.ix !== 0 && f.iy !== 0
    const moved = Math.abs(f.dx) > 1e-4 || Math.abs(f.dy) > 1e-4
    const mm = mismatch.current

    // No input but moving: the code ignores input.
    if (f.ix === 0 && f.iy === 0) {
      if (moved && stepKey === '1-write') {
        mm.t += f.dt
        if (mm.t > 0.5) setMessage('The knight moves without any key pressed. velocity is not built from your input yet.')
      }
      return
    }
    if (!moved) {
      mm.still += f.dt
      if (mm.still > 0.6 && stepKey === '1-write' && motion?.base === 'zero')
        setMessage('You are pressing a key and the knight does not move. Look at what velocity is built from.')
      return
    }
    mm.still = 0

    if (single) {
      const want = dirName(f.ix, f.iy)
      const wentX = f.ix !== 0 ? Math.sign(f.dx) : 0
      const wentY = f.iy !== 0 ? Math.sign(f.dy) : 0
      const ok = f.ix !== 0 ? wentX === f.ix && Math.abs(f.dy) < 1e-4 : wentY === f.iy && Math.abs(f.dx) < 1e-4
      if (!ok) {
        const went = Math.abs(f.dx) > Math.abs(f.dy) ? (f.dx < 0 ? 'left' : 'right') : f.dy < 0 ? 'up' : 'down'
        const key = `${want}-${went}`
        mm.key === key ? (mm.t += f.dt) : ((mm.key = key), (mm.t = f.dt))
        if (mm.t > 0.15) {
          const tip =
            stepKey === '2-write' && motion?.transform === 'abs'
              ? ' abs() throws away the minus sign.'
              : stepKey === '1-write' && motion?.base === 'right'
                ? ' Look at what velocity is built from.'
                : ' Check the order of the actions inside get_axis().'
          setMessage(`You pressed ${want} and the knight went ${went}.${tip}`)
        }
        return
      }
      if (stepKey === '1-write') markGoal(want)
      else if (stepKey === '2-write') {
        if (f.speed === 120) markGoal('straight')
      } else if (stepKey === '2-prove') {
        if (f.speed === 180) markGoal('fast')
        else if (f.speed > 0) setMessage(`The readout says ${f.speed}. Half again as fast as 120 is 120 + 60.`)
      }
      return
    }

    if (both && Math.abs(f.dx) > 1e-4 && Math.abs(f.dy) > 1e-4) {
      if (stepKey === '2-write') {
        if (f.speed === 120) markGoal('diagonal')
        else setMessage(`On the diagonal the readout says ${f.speed}. Straight is 120. Still too fast.`)
      } else if (stepKey === '2-prove') {
        if (f.speed === 180) markGoal('fast')
        else if (f.speed > 0) setMessage(`The readout says ${f.speed}. Half again as fast as 120 is 120 + 60.`)
      }
    }
  }

  const right = (
    <div ref={previewRef} className="space-y-4">
      <Suspense fallback={<PreviewFallback />}>
        <Preview motion={motion} runId={runId} onFrame={onFrame} globalKeys={!embedded} idleLabel={error ? 'The code did not run' : 'Run the code to start'} />
      </Suspense>
      <CheckPanel step={step} check={check} running={!!motion} stale={stale} lesson={lesson} isLast={isLast} />
    </div>
  )

  const left = (
    <>
      <div>
        <p className="text-[17px] leading-relaxed text-text">{step.prompt}</p>
        {!coarse && <p className="mt-1 text-[14px] text-muted">Click a blank and type, or pick from the choices below it.</p>}
      </div>
      <CodePanel
        code={step.template}
        blanks={step.blanks}
        values={values}
        active={active}
        onActivate={setActive}
        onType={(id, v) => setValues((s) => ({ ...s, [id]: v }))}
        typing={!coarse}
        badge={
          error ? (
            <span className="text-[12px] font-semibold text-ember-bright">Did not run</span>
          ) : motion && !stale ? (
            <span className="text-[12px] font-semibold text-moss">Running</span>
          ) : null
        }
        footer={<ChipTray blank={activeBlank} value={activeBlank ? normalizeTyped(values[activeBlank.id] ?? '') : undefined} onPick={pick} />}
      />
      {error && (
        <div role="alert" className="rounded-[10px] border border-ember/50 bg-ember/[0.08] p-3.5 text-[15px] text-text">
          {error}
        </div>
      )}
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => setShowHint((v) => !v)}
          aria-expanded={showHint}
          className="inline-flex min-h-11 items-center gap-1.5 text-[14.5px] font-semibold text-brass-bright"
        >
          <Icon name="info" size={17} /> {showHint ? 'Hide the hint' : 'Show a hint'}
        </button>
        {showHint && <p className="anim-rise rounded-[10px] border border-hairline bg-surface p-3.5 text-[15px] leading-relaxed text-text/90">{step.hint}</p>}
        {step.aside && (
          <p className="border-l-2 border-brass/40 pl-3.5 text-[14.5px] leading-relaxed text-muted">{step.aside}</p>
        )}
      </div>
    </>
  )

  const runLabel = ranWith === null ? 'Run the code' : 'Run again'
  const action = check.passed ? (
    <Button onClick={onNext} iconRight="arrow" className="w-full md:w-auto">
      {isLast ? 'Finish lesson' : step.kind === 'write' && lesson.number === 2 ? 'Light the fire, then Prove It' : 'Next'}
    </Button>
  ) : (
    <>
      <Button onClick={run} disabled={!filled} icon="play" variant={ranWith !== null && !stale && !error ? 'secondary' : 'primary'} className="flex-1 md:flex-none">
        {filled ? runLabel : 'Fill every blank'}
      </Button>
      {onSkip && (
        <Button variant="ghost" onClick={onSkip} className="md:ml-1">
          Skip for now
        </Button>
      )}
    </>
  )

  return <StepLayout left={left} right={right} action={action} embedded={embedded} />
}

function CheckPanel({
  step,
  check,
  running,
  stale,
  lesson,
  isLast,
}: {
  step: WriteStep
  check: CheckState
  running: boolean
  stale: boolean
  lesson: Lesson
  isLast: boolean
}) {
  return (
    <div className={`rounded-[10px] border p-4 transition-colors duration-200 ${check.passed ? 'border-moss/50 bg-moss/[0.07]' : 'border-hairline bg-surface'}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="eyebrow mb-1">{step.kind === 'prove' ? 'Prove It' : 'Check'}</div>
          <p className="text-[15.5px] leading-snug text-text">{step.checkGoal}</p>
        </div>
        {check.passed && <Seal size={64} />}
      </div>
      <ul className="mt-3 flex flex-wrap gap-2" aria-label="Check progress">
        {check.goals.map((g) => (
          <li
            key={g.id}
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[13px] font-semibold ${
              g.done ? 'bg-moss/20 text-moss' : 'bg-raised text-muted ring-1 ring-hairline'
            }`}
          >
            {g.done ? <Icon name="check" size={14} /> : <span className="size-1.5 rounded-full bg-faint" aria-hidden="true" />}
            {g.label}
            <span className="sr-only">{g.done ? ', done' : ', not yet'}</span>
          </li>
        ))}
      </ul>
      {check.passed ? (
        <p className="mt-3 font-semibold text-moss">
          Check passed. {step.passLine}
          {step.kind === 'write' && lesson.number === 2 && !isLast ? ' ' + lesson.campLine : ''}
        </p>
      ) : check.message ? (
        <p className="mt-3 text-[15px] text-brass-bright">{check.message}</p>
      ) : stale ? (
        <p className="mt-3 text-[14.5px] text-muted">You changed the code. Run it again to test the new version.</p>
      ) : running ? (
        <p className="mt-3 text-[14.5px] text-muted">Move the knight. The check is watching.</p>
      ) : null}
    </div>
  )
}

/* ---------------- Finished ---------------- */

function Finished({ lesson, embedded }: { lesson: Lesson; embedded: boolean }) {
  const xp = useDemo((s) => s.xp)
  const lessonsDone = useDemo((s) => s.lessonsDone)
  const proveDone = useDemo((s) => !!s.proveDone[lessonKey(lesson)])
  const tent = !!lessonsDone[`${playableQuest}/1`]
  const fire = !!lessonsDone[`${playableQuest}/2`]
  const earned = lesson.xp + (proveDone ? (lesson.proveXp ?? 0) : 0)
  const isL1 = lesson.number === 1
  const nextSteps = useMemo(
    () => [
      { to: `/quests/${playableQuest}#lessons`, icon: 'scroll' as const, ...lessonCopy.nextLesson, pin: null },
      { to: '/packs/top-down-starter', icon: 'pack' as const, ...lessonCopy.ownTopic, pin: 'lesson-next' as const },
      { to: '/pricing?tab=membership', icon: 'scale' as const, ...lessonCopy.seeMemberships, pin: null },
    ],
    [],
  )

  return (
    <div className="anim-rise grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-start">
      <div className="overflow-hidden rounded-[14px] border border-line-strong bg-surface">
        <Camp tent={tent} fire={fire} animate className="block w-full" />
        <div className="flex items-center gap-4 border-t border-hairline p-4">
          <Seal size={58} label="Lesson complete" />
          <div className="min-w-0 flex-1">
            <div className="font-display text-[1.35rem]">{isL1 ? lesson.campLine : lessonCopy.doneTitle}</div>
            <div className="text-[14.5px] text-muted">
              Lesson {lesson.number} complete. <span className="font-semibold text-brass-bright">+{earned} XP</span>
              {proveDone && !isL1 && <span> including Prove It</span>}
            </div>
          </div>
        </div>
        <div className="border-t border-hairline p-4">
          <XPBar xp={xp} />
        </div>
      </div>

      {isL1 ? (
        <div className="lg:pt-2">
          <div className="flex items-center gap-3">
            <h2 className="text-[1.8rem] md:text-[2.2rem]">{lessonCopy.nudgeTitle}</h2>
            <Pin id="lesson-nudge" />
          </div>
          <p className="mt-2 max-w-[46ch] text-[16.5px] text-muted">{lessonCopy.nudgeBody}</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <LinkButton to={`/learn/${playableQuest}/2`} iconRight="arrow" className="sm:min-w-[220px]">
              {lessonCopy.nudgeCta}
            </LinkButton>
            {!embedded && (
              <LinkButton to={`/quests/${playableQuest}`} variant="ghost">
                Back to the quest
              </LinkButton>
            )}
          </div>
        </div>
      ) : (
        <div>
          <h2 className="text-[1.6rem] md:text-[2rem]">{lessonCopy.nextTitle}</h2>
          <ol className="mt-4 grid gap-3">
            {nextSteps.map((n, i) => (
              <li key={n.to} className="relative">
                <Link
                  to={n.to}
                  className="flex min-h-[76px] items-center gap-4 rounded-[12px] border border-hairline bg-surface p-4 pr-5 transition-colors hover:border-brass/50"
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-full border border-brass/40 text-brass-bright">
                    <Icon name={n.icon} size={21} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-text">
                      <span className="mr-1.5 text-faint">{i + 1}.</span>
                      {n.title}
                    </span>
                    <span className="block text-[14.5px] leading-snug text-muted">{n.body}</span>
                  </span>
                  <Icon name="chevronRight" size={18} className="shrink-0 text-faint" />
                </Link>
                {n.pin && (
                  <span className="absolute -top-3 right-3">
                    <Pin id={n.pin} />
                  </span>
                )}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  )
}
