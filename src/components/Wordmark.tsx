import { site } from '../content/site'

/** The wordmark is set in type, with a small drawn compass mark. Not the real logo. */
export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg viewBox="0 0 32 32" width="26" height="26" aria-hidden="true">
        <circle cx="16" cy="16" r="11.5" fill="none" stroke="#c8a45c" strokeWidth="1.6" />
        <circle cx="16" cy="16" r="8" fill="none" stroke="#c8a45c" strokeWidth=".8" opacity=".5" />
        <path d="M16 3.5v4M16 24.5v4M3.5 16h4M24.5 16h4" stroke="#c8a45c" strokeWidth="1.6" strokeLinecap="round" />
        <path d="m16 9 2.4 7L16 23l-2.4-7z" fill="#d9652b" />
        <path d="m16 9 2.4 7h-4.8z" fill="#efe6d6" />
      </svg>
      <span className="font-display text-[1.22rem] leading-none font-semibold tracking-[-0.01em] text-text" style={{ fontVariationSettings: '"opsz" 40' }}>
        {site.wordmark}
      </span>
    </span>
  )
}
