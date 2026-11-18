import { useCallback, useEffect, useRef, useState } from 'react'
import { site } from '../content/site'
import { velocityFor, type Frame, type Motion, type ScriptStep } from './sim'

const W = 360
const H = 200
const HALF_W = 9
const HALF_H = 11
const KEYMAP: Record<string, [number, number]> = {
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
  a: [-1, 0],
  d: [1, 0],
  w: [0, -1],
  s: [0, 1],
}
const norm = (k: string) => (k.length === 1 ? k.toLowerCase() : k)

export interface PreviewProps {
  /** null means the code has not run yet; the knight waits. */
  motion: Motion | null
  /** Change to restart from the start position. */
  runId: number
  script?: ScriptStep[] | null
  onScriptEnd?: () => void
  onFrame?: (f: Frame) => void
  start?: 'center' | 'left' | 'topleft'
  compact?: boolean
  /** Arrow keys work anywhere on the page unless a text field has focus. */
  globalKeys?: boolean
  idleLabel?: string
  className?: string
}

export default function Preview({
  motion,
  runId,
  script,
  onScriptEnd,
  onFrame,
  start = 'center',
  compact = false,
  globalKeys = false,
  idleLabel = 'Run the code to start',
  className = '',
}: PreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const readoutRef = useRef<HTMLSpanElement>(null)
  const keys = useRef(new Set<string>())
  const pad = useRef<[number, number]>([0, 0])
  const st = useRef({ x: W / 2, y: H / 2, face: 1, t: 0, walk: 0, trail: [] as { x: number; y: number; a: number }[], trailT: 0, speed: 0 })
  const motionRef = useRef(motion)
  const scriptRef = useRef<{ steps: ScriptStep[]; t: number; done: boolean } | null>(null)
  const cbRef = useRef({ onFrame, onScriptEnd })
  const [padDir, setPadDir] = useState<[number, number]>([0, 0])

  motionRef.current = motion
  cbRef.current = { onFrame, onScriptEnd }

  // Reset on each run.
  useEffect(() => {
    const s = st.current
    s.x = start === 'center' ? W / 2 : 40
    s.y = start === 'topleft' ? 48 : H / 2 + 6
    s.face = 1
    s.trail = []
    s.speed = 0
    scriptRef.current = script?.length ? { steps: script, t: 0, done: false } : null
  }, [runId])

  // Keyboard.
  useEffect(() => {
    const isTyping = () => {
      const a = document.activeElement
      return !!a && (a.tagName === 'INPUT' || a.tagName === 'TEXTAREA' || (a as HTMLElement).isContentEditable)
    }
    const owns = () => {
      const a = document.activeElement
      if (wrapRef.current?.contains(a)) return true
      return globalKeys && !isTyping() && !document.querySelector('[role="dialog"]')
    }
    const down = (e: KeyboardEvent) => {
      const k = norm(e.key)
      if (!(k in KEYMAP) || e.metaKey || e.ctrlKey || e.altKey) return
      if (!owns()) return
      e.preventDefault()
      keys.current.add(k)
    }
    const up = (e: KeyboardEvent) => {
      keys.current.delete(norm(e.key))
    }
    const clear = () => keys.current.clear()
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    window.addEventListener('blur', clear)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
      window.removeEventListener('blur', clear)
    }
  }, [globalKeys])

  // Main loop.
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let raf = 0
    let last = performance.now()
    let visible = true

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = canvas.clientWidth
      if (!w) return
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(((w * H) / W) * dpr)
      ctx.setTransform(canvas.width / W, 0, 0, canvas.height / H, 0, 0)
      draw(ctx, st.current)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
    })
    io.observe(canvas)

    const input = (): [number, number] => {
      const sc = scriptRef.current
      if (sc && !sc.done) {
        const step = sc.steps.find((s) => sc.t < s.until)
        if (step) return [step.ix, step.iy]
      }
      let ix = 0
      let iy = 0
      for (const k of keys.current) {
        const m = KEYMAP[k]
        if (m) {
          ix += m[0]
          iy += m[1]
        }
      }
      ix += pad.current[0]
      iy += pad.current[1]
      return [Math.max(-1, Math.min(1, ix)), Math.max(-1, Math.min(1, iy))]
    }

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick)
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      if (!visible || document.hidden) {
        if (!visible) draw(ctx, st.current)
        return
      }
      const s = st.current
      s.t += dt
      const m = motionRef.current
      const sc = scriptRef.current
      if (sc && !sc.done) {
        sc.t += dt
        if (sc.t >= sc.steps[sc.steps.length - 1].until) {
          sc.done = true
          cbRef.current.onScriptEnd?.()
        }
      }
      const [ix, iy] = m ? input() : [0, 0]
      let dx = 0
      let dy = 0
      let shown = 0
      if (m) {
        const [vx, vy] = velocityFor(m, ix, iy)
        const nx = Math.max(HALF_W + 6, Math.min(W - HALF_W - 6, s.x + vx * dt))
        const ny = Math.max(HALF_H + 8, Math.min(H - HALF_H - 4, s.y + vy * dt))
        dx = nx - s.x
        dy = ny - s.y
        const effX = Math.abs(dx) > 1e-6 ? vx : 0
        const effY = Math.abs(dy) > 1e-6 ? vy : 0
        shown = Math.round(Math.hypot(effX, effY))
        s.x = nx
        s.y = ny
        if (Math.abs(vx) > 0.01) s.face = vx > 0 ? 1 : -1
      }
      const moving = Math.abs(dx) + Math.abs(dy) > 0.001
      s.walk = moving ? s.walk + dt * 10 : 0
      s.trailT += dt
      if (moving && s.trailT > 0.12) {
        s.trailT = 0
        s.trail.push({ x: s.x, y: s.y + HALF_H - 1, a: 1 })
        if (s.trail.length > 26) s.trail.shift()
      }
      for (const p of s.trail) p.a = Math.max(0, p.a - dt * 0.45)
      if (shown !== s.speed) {
        s.speed = shown
        if (readoutRef.current) readoutRef.current.textContent = String(shown)
      }
      if (m) cbRef.current.onFrame?.({ ix, iy, dx, dy, dt, speed: shown })
      draw(ctx, s)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
    }
  }, [])

  const setPad = useCallback((d: [number, number]) => {
    pad.current = d
    setPadDir((p) => (p[0] === d[0] && p[1] === d[1] ? p : d))
  }, [])

  const idle = motion === null

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <div
        ref={wrapRef}
        tabIndex={0}
        role="group"
        aria-label="Game preview. Arrow keys or W A S D move the knight."
        aria-describedby="preview-help"
        className="relative overflow-hidden rounded-[10px] border border-line-strong bg-[#14110d] outline-none focus-visible:ring-2 focus-visible:ring-brass"
      >
        <canvas ref={canvasRef} className="block aspect-[360/200] w-full touch-none" aria-hidden="true" />
        <div className="pointer-events-none absolute top-2 left-2 flex items-baseline gap-1 rounded-[6px] bg-black/55 px-2 py-1 font-mono text-[12px] text-text">
          <span className="text-muted">speed</span>
          <span ref={readoutRef} className="tabular min-w-[3ch] text-right font-semibold text-brass-bright">
            0
          </span>
          <span className="text-muted">px/s</span>
        </div>
        {idle && (
          <div className="absolute inset-0 grid place-items-center bg-black/35">
            <span className="rounded-full bg-black/70 px-3 py-1.5 text-[13px] font-semibold text-text">{idleLabel}</span>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between gap-4">
        <p id="preview-help" className="max-w-[24ch] text-[12.5px] leading-snug text-faint">
          <span className="hidden md:inline">Arrow keys or WASD. </span>
          <span className="md:hidden">Hold an arrow. Corners go diagonal. </span>
          {site.previewSimulated}
        </p>
        <Pad dir={padDir} onDir={setPad} disabled={idle} small={compact} />
      </div>
    </div>
  )
}

const DIRS: { d: [number, number]; label: string; r: number }[] = [
  { d: [-1, -1], label: 'Up and left', r: -135 },
  { d: [0, -1], label: 'Up', r: -90 },
  { d: [1, -1], label: 'Up and right', r: -45 },
  { d: [-1, 0], label: 'Left', r: 180 },
  { d: [0, 0], label: '', r: 0 },
  { d: [1, 0], label: 'Right', r: 0 },
  { d: [-1, 1], label: 'Down and left', r: 135 },
  { d: [0, 1], label: 'Down', r: 90 },
  { d: [1, 1], label: 'Down and right', r: 45 },
]

/** 8-way on-screen pad. Press and slide; corners move diagonally. */
function Pad({ dir, onDir, disabled, small }: { dir: [number, number]; onDir: (d: [number, number]) => void; disabled: boolean; small?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const size = small ? 132 : 150
  const fromPoint = (e: React.PointerEvent) => {
    const r = ref.current!.getBoundingClientRect()
    const cx = (e.clientX - r.left) / r.width
    const cy = (e.clientY - r.top) / r.height
    const col = cx < 1 / 3 ? -1 : cx > 2 / 3 ? 1 : 0
    const row = cy < 1 / 3 ? -1 : cy > 2 / 3 ? 1 : 0
    onDir([col, row])
  }
  const timer = useRef<number | undefined>(undefined)
  const held = useRef(false)
  const release = () => {
    held.current = false
    onDir([0, 0])
  }
  return (
    <div
      ref={ref}
      className={`grid shrink-0 touch-none grid-cols-3 grid-rows-3 gap-1 select-none ${disabled ? 'opacity-40' : ''}`}
      style={{ width: size, height: size }}
      onPointerDown={(e) => {
        if (disabled) return
        e.preventDefault()
        held.current = true
        try {
          ref.current?.setPointerCapture(e.pointerId)
        } catch {
          /* capture is a nicety */
        }
        fromPoint(e)
      }}
      onPointerMove={(e) => {
        if (disabled || !held.current) return
        fromPoint(e)
      }}
      onPointerUp={release}
      onPointerCancel={release}
      onLostPointerCapture={release}
      onContextMenu={(e) => e.preventDefault()}
    >
      {DIRS.map(({ d, label, r }) =>
        d[0] === 0 && d[1] === 0 ? (
          <span key="c" className="grid place-items-center" aria-hidden="true">
            <span className="size-2.5 rounded-full bg-line-strong" />
          </span>
        ) : (
          <button
            key={label}
            type="button"
            tabIndex={-1}
            disabled={disabled}
            aria-label={`Move ${label.toLowerCase()}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onDir(d)
                window.clearTimeout(timer.current)
                timer.current = window.setTimeout(() => onDir([0, 0]), 450)
              }
            }}
            className={`grid place-items-center rounded-[9px] border transition-colors duration-100 ${
              dir[0] === d[0] && dir[1] === d[1]
                ? 'border-brass bg-brass/25 text-brass-bright'
                : d[0] !== 0 && d[1] !== 0
                  ? 'border-hairline bg-surface text-faint'
                  : 'border-line-strong bg-raised text-text'
            }`}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" style={{ transform: `rotate(${r}deg)` }} aria-hidden="true">
              <path d="M6 12h11m-4.5-5 5 5-5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        ),
      )}
    </div>
  )
}

type S = { x: number; y: number; face: number; t: number; walk: number; trail: { x: number; y: number; a: number }[] }

function draw(ctx: CanvasRenderingContext2D, s: S) {
  // Ground.
  ctx.fillStyle = '#17130e'
  ctx.fillRect(0, 0, W, H)
  ctx.strokeStyle = 'rgba(233,220,195,0.045)'
  ctx.lineWidth = 1
  ctx.beginPath()
  for (let x = 20; x < W; x += 20) {
    ctx.moveTo(x + 0.5, 0)
    ctx.lineTo(x + 0.5, H)
  }
  for (let y = 20; y < H; y += 20) {
    ctx.moveTo(0, y + 0.5)
    ctx.lineTo(W, y + 0.5)
  }
  ctx.stroke()

  // Grass tufts and stones, fixed.
  ctx.strokeStyle = 'rgba(124,154,106,0.45)'
  ctx.lineWidth = 1.2
  ctx.lineCap = 'round'
  for (const [x, y] of [
    [48, 40], [300, 34], [322, 160], [70, 168], [180, 30], [250, 176], [118, 120], [270, 100],
  ]) {
    ctx.beginPath()
    ctx.moveTo(x - 4, y)
    ctx.lineTo(x - 2, y - 5)
    ctx.moveTo(x, y)
    ctx.lineTo(x, y - 7)
    ctx.moveTo(x + 4, y)
    ctx.lineTo(x + 2.5, y - 5)
    ctx.stroke()
  }
  ctx.fillStyle = 'rgba(163,150,131,0.18)'
  for (const [x, y, r] of [[210, 60, 4], [96, 82, 3], [330, 120, 5], [30, 110, 3.5]]) {
    ctx.beginPath()
    ctx.ellipse(x, y, r * 1.3, r, 0, 0, Math.PI * 2)
    ctx.fill()
  }

  // Walls: an inked border.
  ctx.strokeStyle = 'rgba(200,164,92,0.55)'
  ctx.lineWidth = 2
  ctx.strokeRect(4, 4, W - 8, H - 8)
  ctx.strokeStyle = 'rgba(200,164,92,0.18)'
  ctx.lineWidth = 1
  ctx.strokeRect(8.5, 8.5, W - 17, H - 17)

  // Footprints: spacing shows speed.
  for (const p of s.trail) {
    if (p.a <= 0) continue
    ctx.fillStyle = `rgba(223,190,120,${0.55 * p.a})`
    ctx.beginPath()
    ctx.arc(p.x, p.y, 1.8, 0, Math.PI * 2)
    ctx.fill()
  }

  // Knight.
  const bob = s.walk ? Math.sin(s.walk) * 1.1 : 0
  ctx.save()
  ctx.translate(Math.round(s.x * 2) / 2, Math.round(s.y * 2) / 2)
  ctx.fillStyle = 'rgba(0,0,0,0.45)'
  ctx.beginPath()
  ctx.ellipse(0, HALF_H, 9, 3, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.scale(s.face, 1)
  ctx.translate(0, bob)
  ctx.lineWidth = 1.4
  ctx.strokeStyle = '#2a2118'
  // legs
  const step = s.walk ? Math.sin(s.walk) * 2 : 0
  ctx.fillStyle = '#5e4d3a'
  ctx.fillRect(-4.5 + step * 0.5, 5, 3.2, 5.5)
  ctx.fillRect(1.3 - step * 0.5, 5, 3.2, 5.5)
  // body
  ctx.fillStyle = '#c9c1b2'
  roundRect(ctx, -6.5, -3, 13, 10, 3)
  ctx.fill()
  ctx.stroke()
  // tabard
  ctx.fillStyle = '#d9652b'
  ctx.fillRect(-2, -2.3, 4, 8.6)
  // helmet
  ctx.fillStyle = '#e1dacb'
  ctx.beginPath()
  ctx.arc(0, -8, 6.6, 0, Math.PI * 2)
  ctx.fill()
  ctx.stroke()
  ctx.strokeStyle = '#2a2118'
  ctx.lineWidth = 1.6
  ctx.beginPath()
  ctx.moveTo(1, -8.5)
  ctx.lineTo(6, -8.5)
  ctx.stroke()
  // plume
  ctx.fillStyle = '#c8a45c'
  ctx.beginPath()
  ctx.moveTo(-1, -14)
  ctx.quadraticCurveTo(-9, -17, -10, -9)
  ctx.quadraticCurveTo(-6, -13, -1, -12)
  ctx.fill()
  ctx.restore()
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}
