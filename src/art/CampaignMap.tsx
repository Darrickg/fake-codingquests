import { Link } from 'react-router'
import type { Campaign } from '../content/catalog'

export type WaypointState = 'done' | 'current' | 'open' | 'locked'

interface Pt {
  x: number
  y: number
}

function rng(seed: string) {
  let h = 2166136261
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619)
  return () => {
    h += 0x6d2b79f5
    let t = h
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Smooth path through points (Catmull-Rom to cubic Bezier). */
function roadPath(p: Pt[]) {
  let d = `M${p[0].x} ${p[0].y}`
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] ?? p[i]
    const p1 = p[i]
    const p2 = p[i + 1]
    const p3 = p[i + 2] ?? p2
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 }
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 }
    d += ` C${c1.x.toFixed(1)} ${c1.y.toFixed(1)} ${c2.x.toFixed(1)} ${c2.y.toFixed(1)} ${p2.x} ${p2.y}`
  }
  return d
}

function layout(n: number, orient: 'wide' | 'tall', seed: string) {
  const r = rng(seed)
  const phase = r() * Math.PI * 2
  if (orient === 'wide') {
    const W = 1200
    const H = 540
    const pts = Array.from({ length: n }, (_, i) => ({
      x: Math.round(90 + (i * (W - 200)) / (n - 1) + (r() - 0.5) * 24),
      y: Math.round(H / 2 + 10 + 150 * Math.sin(i * 0.92 + phase) + (r() - 0.5) * 36),
    }))
    return { W, H, pts, start: { x: 28, y: pts[0].y + 40 }, end: { x: W - 50, y: pts[n - 1].y + (pts[n - 1].y > H / 2 ? -40 : 40) }, compass: { x: W - 80, y: pts[n - 1].y > H / 2 ? 80 : H - 80 } }
  }
  const W = 360
  const H = 120 + n * 112
  const pts = Array.from({ length: n }, (_, i) => ({
    x: Math.round(W / 2 + 96 * Math.sin(i * 0.95 + phase) + (r() - 0.5) * 20),
    y: Math.round(78 + i * 112),
  }))
  return { W, H, pts, start: { x: pts[0].x + 30, y: 18 }, end: { x: pts[n - 1].x > W / 2 ? pts[n - 1].x - 50 : pts[n - 1].x + 50, y: H - 16 }, compass: { x: pts[n - 1].x > W / 2 ? 50 : W - 50, y: H - 64 } }
}

function Pine({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 0v-8M0-8l-8 10h16zM0-16l-6 9h12zM0-23l-4 7h8z" />
    </g>
  )
}
function Hill({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-26 0c8-14 16-20 26-20s18 6 26 20" />
      <path d="M-8-12l-5 6M2-15l-4 7M12-11l-4 6" opacity=".6" />
    </g>
  )
}
function Waves({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`} opacity=".7">
      <path d="M-18 0c4-4 8-4 12 0s8 4 12 0 8-4 12 0" />
      <path d="M-10 8c4-4 8-4 12 0s8 4 12 0" />
    </g>
  )
}

export function CampaignMap({
  campaign,
  states,
  orient,
  className = '',
}: {
  campaign: Campaign
  states: WaypointState[]
  orient: 'wide' | 'tall'
  className?: string
}) {
  const n = campaign.waypoints.length
  const { W, H, pts, start, end, compass } = layout(n, orient, campaign.slug)
  const full = [start, ...pts, end]
  const d = roadPath(full)
  const r = rng(campaign.slug + orient)

  const label = (i: number) => {
    const p = pts[i]
    const text = campaign.waypoints[i].label
    const w = text.length * 7.3 + 20
    if (orient === 'wide') {
      const prev = pts[i - 1] ?? pts[i]
      const next = pts[i + 1] ?? pts[i]
      // Put the label on the outside of the bend.
      const above = p.y <= (prev.y + next.y) / 2
      return { x: Math.max(8, Math.min(W - w - 8, p.x - w / 2)), y: above ? p.y - 56 : p.y + 30, w, text }
    }
    const left = p.x > W / 2
    return { x: left ? p.x - 30 - w : p.x + 30, y: p.y - 13, w, text }
  }

  const labels = campaign.waypoints.map((_, i) => label(i))
  // Flip a label to the other side of its stop when it would overlap the one before it.
  if (orient === 'wide') {
    for (let i = 1; i < labels.length; i++) {
      const a = labels[i - 1]
      const l = labels[i]
      const overlaps = l.x < a.x + a.w + 6 && a.x < l.x + l.w + 6 && Math.abs(l.y - a.y) < 32
      if (overlaps) {
        const p = pts[i]
        l.y = l.y < p.y ? p.y + 30 : p.y - 56
      }
    }
  }

  // Scatter decorations away from the road, the labels and the compass.
  const decos: { kind: 'pine' | 'hill' | 'waves'; x: number; y: number; s: number }[] = []
  for (let i = 0; i < (orient === 'wide' ? 70 : 34) && decos.length < (orient === 'wide' ? 26 : 16); i++) {
    const x = 30 + r() * (W - 60)
    const y = 40 + r() * (H - 70)
    const near = full.some((p) => Math.hypot(p.x - x, p.y - y) < (orient === 'wide' ? 95 : 70))
    const nearDeco = decos.some((p) => Math.hypot(p.x - x, p.y - y) < 46)
    // Avoid the straight segments between points too.
    const nearSeg = full.slice(1).some((p, k) => {
      const a = full[k]
      const t = Math.max(0, Math.min(1, ((x - a.x) * (p.x - a.x) + (y - a.y) * (p.y - a.y)) / ((p.x - a.x) ** 2 + (p.y - a.y) ** 2 || 1)))
      return Math.hypot(a.x + t * (p.x - a.x) - x, a.y + t * (p.y - a.y) - y) < 44
    })
    const onLabel = labels.some((l) => x > l.x - 18 && x < l.x + l.w + 18 && y > l.y - 6 && y < l.y + 52)
    const onCompass = Math.hypot(compass.x - x, compass.y - y) < 60
    if (near || nearDeco || nearSeg || onLabel || onCompass) continue
    const roll = r()
    decos.push({ kind: roll < 0.55 ? 'pine' : roll < 0.85 ? 'hill' : 'waves', x, y, s: 0.8 + r() * 0.5 })
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={className} role="group" aria-label={`Map of the ${campaign.name} campaign`}>
      <defs>
        <radialGradient id={`vignette-${orient}`} cx="50%" cy="50%" r="75%">
          <stop offset=".6" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#5a3d17" stopOpacity=".35" />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#vignette-${orient})`} />

      {/* compass */}
      <g transform={`translate(${compass.x} ${compass.y})`} fill="none" stroke="#5e4d3a" strokeWidth="1.2" opacity=".8">
        <circle r="22" />
        <circle r="16" strokeDasharray="2 3" />
        <path d="M0-30V30M-30 0H30" />
        <path d="M0-20l5 20-5 20-5-20z" fill="#5e4d3a" fillOpacity=".25" />
        <text y="-34" textAnchor="middle" fontSize="11" fill="#5e4d3a" stroke="none" fontFamily="Fraunces Variable, serif">
          N
        </text>
      </g>

      <g fill="none" stroke="#5e4d3a" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" filter="url(#roughen)">
        {decos.map((t, i) =>
          t.kind === 'pine' ? <Pine key={i} x={t.x} y={t.y} s={t.s} /> : t.kind === 'hill' ? <Hill key={i} x={t.x} y={t.y} s={t.s} /> : <Waves key={i} x={t.x} y={t.y} />,
        )}
      </g>

      {/* road */}
      <path d={d} fill="none" stroke="#2a2118" strokeOpacity=".22" strokeWidth="16" strokeLinecap="round" />
      <path
        d={d}
        fill="none"
        stroke="#7a5a1e"
        strokeWidth="2.4"
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray="1"
        strokeDashoffset="1"
        style={{ animation: 'draw 650ms cubic-bezier(.3,.7,.3,1) forwards' }}
        filter="url(#roughen)"
      />
      <path d={d} fill="none" stroke="#2a2118" strokeWidth="1.2" strokeDasharray="2 7" strokeLinecap="round" opacity=".55" />

      {/* start and finish */}
      <g transform={`translate(${start.x} ${start.y})`} fontFamily="DM Sans Variable, sans-serif">
        <circle r="4" fill="#2a2118" />
      </g>
      <g transform={`translate(${end.x} ${end.y})`} stroke="#2a2118" strokeWidth="1.6" fill="none" strokeLinejoin="round">
        <path d="M0 0v-30" />
        <path d="M0-30h18l-5 6 5 6H0" fill="#8f2a1c" stroke="#5e170e" />
      </g>

      {campaign.waypoints.map((w, i) => {
        const p = pts[i]
        const st = states[i]
        const l = labels[i]
        const stateText = { done: 'done', current: 'you are here', open: 'open', locked: 'locked' }[st]
        const inner = (
          <>
            <circle cx={p.x} cy={p.y} r="24" fill="transparent" />
            {st === 'current' && <circle cx={p.x} cy={p.y} r="17" fill="none" stroke="#9c3f12" strokeWidth="2" strokeDasharray="3 3" />}
            <circle
              cx={p.x}
              cy={p.y}
              r="11"
              fill={st === 'done' ? '#3f5a33' : st === 'current' ? '#d9652b' : st === 'open' ? '#efe3c8' : '#e2d4b6'}
              stroke={st === 'locked' ? '#8a7860' : '#2a2118'}
              strokeWidth="1.8"
              strokeDasharray={st === 'locked' ? '3 2.5' : undefined}
            />
            {st === 'done' && <path d={`M${p.x - 5} ${p.y}l3.5 3.5 6.5-7`} fill="none" stroke="#efe6d6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />}
            {st === 'locked' && (
              <g transform={`translate(${p.x - 5} ${p.y - 6})`} fill="none" stroke="#6b5a45" strokeWidth="1.4">
                <rect x="0" y="5" width="10" height="7" rx="1.5" />
                <path d="M2.5 5V3.5a2.5 2.5 0 0 1 5 0V5" />
              </g>
            )}
            {(st === 'open' || st === 'current') && (
              <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize="11" fontWeight="700" fill={st === 'current' ? '#1a0e07' : '#2a2118'} fontFamily="DM Sans Variable, sans-serif">
                {i + 1}
              </text>
            )}
            <g>
              <rect x={l.x} y={l.y} width={l.w} height="26" rx="3" fill={st === 'locked' ? '#e6d9bd' : '#f4ead4'} stroke={st === 'current' ? '#9c3f12' : '#2a2118'} strokeOpacity={st === 'locked' ? 0.25 : 0.45} strokeWidth="1" />
              <text x={l.x + l.w / 2} y={l.y + 17.5} textAnchor="middle" fontSize="13" fontWeight="600" fill={st === 'locked' ? '#6b5a45' : '#2a2118'} fontFamily="DM Sans Variable, sans-serif">
                {l.text}
              </text>
            </g>
          </>
        )
        return w.quest ? (
          <Link key={i} to={`/quests/${w.quest}`} aria-label={`${i + 1}. ${w.label}, ${stateText}`} className="map-wp">
            {inner}
          </Link>
        ) : (
          <g key={i} aria-label={`${i + 1}. ${w.label}, ${stateText}`}>
            {inner}
          </g>
        )
      })}
    </svg>
  )
}
