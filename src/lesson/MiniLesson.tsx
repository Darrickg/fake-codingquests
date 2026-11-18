import { lazy, Suspense, useState } from 'react'
import { Link } from 'react-router'
import { playableQuest } from '../content/lessons'
import { Icon } from '../components/Icon'
import { ChipTray, CodePanel } from './CodePanel'
import { lesson1Motion, rightOnlyMotion } from './sim'

const Preview = lazy(() => import('./Preview'))

const code = `extends CharacterBody2D

@export var speed := 120.0

func _physics_process(_delta: float) -> void:
	var direction := Vector2(
		Input.get_axis("move_left", "move_right"),
		Input.get_axis("move_up", "move_down")
	)
	velocity = {{v}} * speed
	move_and_slide()
`
const blank = {
  id: 'v',
  label: 'what the velocity is built from',
  options: ['Vector2.RIGHT', 'direction'],
  answer: 'direction',
}

/** A compact, working taste of lesson 1 for the home page. */
export function MiniLesson() {
  const [v, setV] = useState('Vector2.RIGHT')
  const [runId, setRunId] = useState(1)
  const motion = v === 'direction' ? lesson1Motion : rightOnlyMotion
  return (
    <div className="grid gap-5 rounded-[16px] md:border md:border-hairline md:bg-surface md:p-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-8">
      <div className="min-w-0 space-y-4">
        <p className="text-[15.5px] text-text/90">
          Right now the knight only walks right. Swap the blank to <code className="rounded bg-raised px-1.5 py-0.5 text-[14px] text-brass-bright">direction</code> and it follows your keys.
        </p>
        <CodePanel
          code={code}
          blanks={[blank]}
          values={{ v }}
          active="v"
          footer={
            <ChipTray
              blank={blank}
              value={v}
              onPick={(x) => {
                setV(x)
                setRunId((n) => n + 1)
              }}
            />
          }
        />
      </div>
      <div className="min-w-0 space-y-4">
        <Suspense fallback={<div className="aspect-[360/200] w-full rounded-[10px] border border-line-strong bg-[#14110d]" />}>
          <Preview motion={motion} runId={runId} start={v === 'direction' ? 'center' : 'left'} compact />
        </Suspense>
        <Link
          to={`/learn/${playableQuest}/1`}
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[10px] border border-brass/60 px-5 text-[15.5px] font-semibold text-brass-bright hover:bg-brass/10"
        >
          Open the full lesson <Icon name="arrow" size={18} />
        </Link>
      </div>
    </div>
  )
}
