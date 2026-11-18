import { notFoundCopy } from '../content/site'
import { LinkButton } from '../components/ui'
import { useTitle } from '../lib/useTitle'

export default function NotFound() {
  useTitle('Not found')
  return (
    <div className="wrap grid place-items-center py-16 text-center md:py-24">
      <svg viewBox="0 0 240 140" className="w-[260px] max-w-full" aria-hidden="true">
        <path d="M10 110c30-6 40-30 70-34s40 12 60 6" fill="none" stroke="#c8a45c" strokeWidth="2" strokeDasharray="6 7" strokeLinecap="round" />
        <path d="M150 70l20 20M170 70l-20 20" stroke="#d9652b" strokeWidth="3" strokeLinecap="round" />
        <path d="M196 120V58M196 58h30l-6 9 6 9h-30" fill="none" stroke="#efe6d6" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M30 120c40-4 150-4 200 0" stroke="#4a3f31" strokeWidth="1.2" fill="none" />
      </svg>
      <div className="eyebrow mt-6">Lost</div>
      <h1 className="mt-2 max-w-[18ch] text-[2.1rem] md:text-[2.8rem]">{notFoundCopy.title}</h1>
      <p className="mt-3 max-w-[42ch] text-[16.5px] text-muted">{notFoundCopy.body}</p>
      <LinkButton to="/" className="mt-7" icon="back">
        {notFoundCopy.cta}
      </LinkButton>
    </div>
  )
}
