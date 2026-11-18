import { Link } from 'react-router'
import type { Quest } from '../content/catalog'
import { knownLessonTitles, playableQuest } from '../content/lessons'
import { lessonOpen } from '../lib/access'
import { useDemo } from '../lib/store'
import { Icon } from './Icon'

/** Lessons of a quest with their open or locked state. Only the playable quest has titles. */
export function LessonList({ q, limit }: { q: Quest; limit?: number }) {
  const state = useDemo()
  if (!q.lessons) {
    return <p className="rounded-[10px] border border-hairline bg-surface p-4 text-[15px] text-muted">The lesson list for this follow-on quest is not shown in this concept.</p>
  }
  const titles = knownLessonTitles[q.slug] ?? {}
  const n = limit ? Math.min(limit, q.lessons) : q.lessons
  const playable = q.slug === playableQuest
  return (
    <ol className="divide-y divide-hairline overflow-hidden rounded-[12px] border border-hairline bg-surface">
      {Array.from({ length: n }, (_, i) => {
        const num = i + 1
        const open = lessonOpen(state, q.slug, num)
        const done = !!state.lessonsDone[`${q.slug}/${num}`]
        const canPlay = playable && !!titles[num]
        const row = (
          <>
            <span
              className={`grid size-8 shrink-0 place-items-center rounded-full text-[13px] font-semibold ${
                done ? 'bg-moss text-ground' : open ? 'border border-brass/50 text-brass-bright' : 'border border-hairline text-faint'
              }`}
            >
              {done ? <Icon name="check" size={15} strokeWidth={2.4} /> : num}
            </span>
            <span className="min-w-0 flex-1">
              <span className={`block text-[15.5px] ${open ? 'text-text' : 'text-muted'}`}>{titles[num] ?? `Lesson ${num}`}</span>
              {canPlay && <span className="block text-[12.5px] font-semibold text-brass">Playable in this concept</span>}
            </span>
            <span className={`inline-flex shrink-0 items-center gap-1 text-[13px] font-semibold ${open ? 'text-moss' : 'text-faint'}`}>
              {open ? (done ? 'Done' : 'Free') : <><Icon name="lock" size={14} /> Locked</>}
            </span>
          </>
        )
        return (
          <li key={num}>
            {canPlay ? (
              <Link to={`/learn/${q.slug}/${num}`} className="flex min-h-14 items-center gap-3.5 px-4 py-2.5 hover:bg-raised">
                {row}
              </Link>
            ) : (
              <div className="flex min-h-14 items-center gap-3.5 px-4 py-2.5">{row}</div>
            )}
          </li>
        )
      })}
      {limit && q.lessons > limit && (
        <li className="px-4 py-3 text-[14px] text-muted">and {q.lessons - limit} more</li>
      )}
    </ol>
  )
}
