import { Link, useParams } from 'react-router'
import { questBySlug } from '../content/catalog'
import { lessonBySlug, playableQuest } from '../content/lessons'
import { site } from '../content/site'
import { LinkButton, Notice } from '../components/ui'
import { LessonPlayer } from '../lesson/LessonPlayer'
import { useTitle } from '../lib/useTitle'

export default function Learn() {
  const { quest = '', lesson = '' } = useParams()
  const l = lessonBySlug[lesson]
  const playable = quest === playableQuest && !!l
  useTitle(playable ? `${l.title}` : 'Lesson')

  if (!playable) {
    const q = questBySlug[quest]
    return (
      <div className="wrap py-14 md:py-20">
        <Notice className="mx-auto max-w-[560px] px-6 pt-8 pb-7 md:px-8">
          <div className="eyebrow !text-brass-ink">Not playable in this concept</div>
          <h1 className="mt-2 text-[1.8rem] text-ink">{q ? `${q.title}, lesson ${lesson}` : 'This lesson'}</h1>
          <p className="mt-3 text-[16px] leading-relaxed text-ink-muted">{site.onlyOneQuestPlayable}</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <LinkButton to={`/learn/${playableQuest}/1`} icon="play">
              Play lesson 1
            </LinkButton>
            {q && (
              <Link to={`/quests/${q.slug}`} className="link inline-flex min-h-12 items-center px-2 font-semibold">
                Back to {q.title}
              </Link>
            )}
          </div>
        </Notice>
      </div>
    )
  }

  return (
    <div className="wrap pt-6 pb-4 md:pt-10">
      <LessonPlayer lessonSlug={l.slug} />
    </div>
  )
}
