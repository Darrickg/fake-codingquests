// A small JavaScript stand-in for what the GDScript in each step does.
// It mirrors Input.get_axis, Vector2 maths and move_and_slide() against the walls of the preview.

export interface Motion {
  base: 'direction' | 'right' | 'zero'
  xAxis: 1 | -1
  yAxis: 1 | -1
  transform: 'none' | 'normalized' | 'abs' | 'round'
  speed: number
}

export type Built = { ok: true; motion: Motion } | { ok: false; error: string }

export const lesson1Motion: Motion = { base: 'direction', xAxis: 1, yAxis: 1, transform: 'none', speed: 120 }
export const rightOnlyMotion: Motion = { ...lesson1Motion, base: 'right' }
export const fixedMotion: Motion = { ...lesson1Motion, transform: 'normalized' }

/** Make typed code comparable with the chip text. */
export function normalizeTyped(v: string): string {
  return v
    .trim()
    .replace(/[‘’']/g, '"')
    .replace(/[“”]/g, '"')
    .replace(/\s*,\s*/g, ', ')
    .replace(/\(\s*\)$/, '')
    .replace(/\s+/g, ' ')
}

function axis(v: string | undefined, neg: string, pos: string): 1 | -1 | null {
  const n = normalizeTyped(v ?? '')
  if (n === `"${neg}", "${pos}"`) return 1
  if (n === `"${pos}", "${neg}"`) return -1
  return null
}

/** Build the motion for a step from the values in its blanks. */
export function buildMotion(stepKey: string, values: Record<string, string>): Built {
  if (stepKey === '1-write') {
    const x = axis(values.x, 'move_left', 'move_right')
    const y = axis(values.y, 'move_up', 'move_down')
    if (x === null) return { ok: false, error: 'The first get_axis() call needs two action names it knows, in quotes.' }
    if (y === null) return { ok: false, error: 'The second get_axis() call needs two action names it knows, in quotes.' }
    const v = normalizeTyped(values.v ?? '')
    const base = v === 'direction' ? 'direction' : v === 'Vector2.RIGHT' ? 'right' : v === 'Vector2.ZERO' ? 'zero' : null
    if (!base) return { ok: false, error: `velocity = ${v || '...'} * speed does not run here. Try one of the choices.` }
    return { ok: true, motion: { ...lesson1Motion, xAxis: x, yAxis: y, base } }
  }
  if (stepKey === '2-write') {
    const n = normalizeTyped(values.n ?? '')
    if (n === 'normalized' || n === 'abs' || n === 'round') return { ok: true, motion: { ...lesson1Motion, transform: n } }
    return { ok: false, error: `Vector2 has no method called ${n || 'that'} here. Try one of the choices.` }
  }
  if (stepKey === '2-prove') {
    const s = Number(normalizeTyped(values.s ?? ''))
    if (!Number.isFinite(s) || s <= 0 || s > 2000) return { ok: false, error: 'speed needs to be a number above zero, like 150.0.' }
    return { ok: true, motion: { ...fixedMotion, speed: s } }
  }
  return { ok: true, motion: lesson1Motion }
}

/** velocity for one physics frame, given raw input of -1, 0 or 1 on each axis. */
export function velocityFor(m: Motion, ix: number, iy: number): [number, number] {
  if (m.base === 'right') return [m.speed, 0]
  if (m.base === 'zero') return [0, 0]
  let dx = ix * m.xAxis
  let dy = iy * m.yAxis
  if (m.transform === 'normalized') {
    const len = Math.hypot(dx, dy)
    if (len > 0) {
      dx /= len
      dy /= len
    }
  } else if (m.transform === 'abs') {
    dx = Math.abs(dx)
    dy = Math.abs(dy)
  } else if (m.transform === 'round') {
    dx = Math.round(dx)
    dy = Math.round(dy)
  }
  return [dx * m.speed, dy * m.speed]
}

export interface Frame {
  ix: number
  iy: number
  /** actual movement this frame after the walls, in pixels */
  dx: number
  dy: number
  dt: number
  /** displayed speed in px/s, rounded */
  speed: number
}

export interface ScriptStep {
  until: number
  ix: number
  iy: number
}
