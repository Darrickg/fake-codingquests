import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router'
import { site } from '../content/site'
import type { Level } from '../content/catalog'
import { money } from '../lib/format'
import { Icon, type IconName } from './Icon'

type Variant = 'primary' | 'secondary' | 'ghost' | 'ink'

const base =
  'inline-flex min-h-12 items-center justify-center gap-2 rounded-[10px] px-5 text-[15.5px] font-semibold leading-tight transition-[background-color,border-color,color,transform] duration-150 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50 select-none text-center'

const variants: Record<Variant, string> = {
  primary: 'bg-ember text-[#1a0e07] hover:bg-ember-bright shadow-[0_1px_0_rgba(255,220,190,.35)_inset,0_6px_16px_-8px_rgba(217,101,43,.7)]',
  secondary: 'border border-brass/60 text-brass-bright hover:border-brass hover:bg-brass/10',
  ghost: 'text-text hover:bg-raised',
  ink: 'bg-ink text-parchment hover:bg-[#3a2e22]',
}

export function Button({
  variant = 'primary',
  icon,
  iconRight,
  className = '',
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; icon?: IconName; iconRight?: IconName }) {
  return (
    <button type="button" className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {icon && <Icon name={icon} size={19} />}
      {children}
      {iconRight && <Icon name={iconRight} size={19} />}
    </button>
  )
}

export function LinkButton({
  variant = 'primary',
  icon,
  iconRight,
  className = '',
  children,
  ...rest
}: LinkProps & { variant?: Variant; icon?: IconName; iconRight?: IconName }) {
  return (
    <Link className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {icon && <Icon name={icon} size={19} />}
      {children}
      {iconRight && <Icon name={iconRight} size={19} />}
    </Link>
  )
}

export function ExampleTag({ tone = 'dark' }: { tone?: 'dark' | 'light' }) {
  if (!site.showExamplePriceTags) return null
  return (
    <span
      className={`ml-1.5 inline-block translate-y-[-1px] rounded-[4px] border px-1.5 py-px align-middle font-sans text-[10.5px] font-semibold tracking-[0.06em] uppercase ${
        tone === 'dark' ? 'border-faint/60 text-muted' : 'border-ink-muted/50 text-ink-muted'
      }`}
    >
      {site.examplePriceLabel}
    </span>
  )
}

/** A price with the example tag next to it. */
export function Price({
  amount,
  suffix,
  tone = 'dark',
  className = '',
  big = false,
}: {
  amount: number
  suffix?: string
  tone?: 'dark' | 'light'
  className?: string
  big?: boolean
}) {
  return (
    <span className={`tabular whitespace-nowrap ${className}`}>
      <span className={big ? 'font-display text-[2.1rem] leading-none font-semibold' : 'font-semibold'}>{money(amount)}</span>
      {suffix && <span className={tone === 'dark' ? 'text-muted' : 'text-ink-muted'}> {suffix}</span>}
      <ExampleTag tone={tone} />
    </span>
  )
}

const levelStyles: Record<Level, string> = {
  Beginner: 'text-moss border-moss/50',
  Intermediate: 'text-brass-bright border-brass/50',
  Advanced: 'text-[#e39a74] border-ember/50',
}
const levelStylesLight: Record<Level, string> = {
  Beginner: 'text-moss-ink border-moss-ink/50',
  Intermediate: 'text-brass-ink border-brass-ink/50',
  Advanced: 'text-ember-ink border-ember-ink/50',
}

export function LevelTag({ level, tone = 'dark', label }: { level: Level; tone?: 'dark' | 'light'; label?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[12px] font-semibold tracking-wide ${
        tone === 'dark' ? levelStyles[level] : levelStylesLight[level]
      }`}
    >
      {label ?? level}
    </span>
  )
}

export function SectionHead({
  eyebrow,
  title,
  sub,
  pin,
  id,
  as: As = 'h2',
}: {
  eyebrow?: ReactNode
  title: ReactNode
  sub?: ReactNode
  pin?: ReactNode
  id?: string
  as?: 'h1' | 'h2'
}) {
  return (
    <div className="mb-6 md:mb-8">
      {eyebrow && <div className="eyebrow mb-2">{eyebrow}</div>}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <As id={id} className={As === 'h1' ? 'text-[2.15rem] md:text-[3.2rem]' : 'text-[1.7rem] md:text-[2.25rem]'}>
          {title}
        </As>
        {pin}
      </div>
      {sub && <p className="mt-2 max-w-[60ch] text-[16.5px] text-muted">{sub}</p>}
    </div>
  )
}

/** The brass pin head that holds parchment notices. Decorative. */
export function PinHead({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 28" width="22" height="22" className={className} aria-hidden="true">
      <ellipse cx="15.5" cy="17" rx="7" ry="3.2" fill="rgba(30,15,5,.35)" />
      <circle cx="14" cy="13" r="7.2" fill="#a8843e" />
      <circle cx="14" cy="13" r="7.2" fill="url(#pinShine)" />
      <circle cx="11.6" cy="10.6" r="2.1" fill="#f6e3b0" opacity=".8" />
    </svg>
  )
}

/** Parchment notice held by one brass pin. */
export function Notice({
  children,
  className = '',
  tilt = 0,
  as: As = 'div',
}: {
  children: ReactNode
  className?: string
  tilt?: number
  as?: 'div' | 'article' | 'section' | 'li'
}) {
  return (
    <As
      className={`parchment on-parchment rounded-[3px] ${className}`}
      style={tilt ? { transform: `rotate(${tilt}deg)` } : undefined}
    >
      <PinHead className="absolute -top-2.5 left-1/2 -translate-x-1/2" />
      {children}
    </As>
  )
}

/** Wax seal used when a check passes or something becomes yours. */
export function Seal({ label = 'Passed', size = 84, animate = true }: { label?: string; size?: number; animate?: boolean }) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={animate ? 'anim-stamp' : ''}
      style={animate ? undefined : { transform: 'rotate(-8deg)' }}
      role="img"
      aria-label={label}
    >
      <path
        d="M50 4c6 0 8 5 13 6s10-2 14 2 1 9 4 13 9 5 9 11-5 8-5 13 4 10 1 14-9 3-12 7-3 10-9 12-9-3-15-3-10 5-15 2-4-8-8-11-10-2-12-7 3-9 2-14-6-8-4-13 7-6 9-10-1-9 3-12 9 0 13-3 6-7 12-7z"
        fill="#8f2a1c"
      />
      <circle cx="50" cy="50" r="31" fill="none" stroke="#5e170e" strokeWidth="2.5" />
      <circle cx="50" cy="50" r="31" fill="none" stroke="#c4553e" strokeWidth="1" opacity=".5" transform="translate(-1 -1)" />
      <path d="m36 51 9.5 9.5L65 41" fill="none" stroke="#f0c9a8" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" opacity=".92" />
      <ellipse cx="38" cy="30" rx="10" ry="5" fill="#fff" opacity=".12" transform="rotate(-30 38 30)" />
    </svg>
  )
}

export function XPBar({ xp, compact = false }: { xp: number; compact?: boolean }) {
  const level = Math.floor(xp / 100) + 1
  const into = xp % 100
  return (
    <div className={compact ? '' : 'w-full'}>
      <div className="mb-1.5 flex items-baseline justify-between gap-3 text-[14px]">
        <span className="font-semibold">Level {level}</span>
        <span className="tabular text-muted">
          {into} / 100 XP
        </span>
      </div>
      <div
        className="h-1.5 overflow-hidden rounded-full bg-raised ring-1 ring-hairline"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={into}
        aria-label={`Level ${level}, ${into} of 100 XP`}
      >
        <div className="h-full rounded-full bg-brass transition-[width] duration-250" style={{ width: `${into}%` }} />
      </div>
    </div>
  )
}

export function Chip({ children, tone = 'dark' }: { children: ReactNode; tone?: 'dark' | 'light' }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[12.5px] font-semibold ${
        tone === 'dark' ? 'bg-raised text-muted ring-1 ring-hairline' : 'bg-ink/10 text-ink-muted'
      }`}
    >
      {children}
    </span>
  )
}
