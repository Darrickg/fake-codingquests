// A small GDScript highlighter with a restrained palette.
import type { ReactNode } from 'react'

const KEYWORDS = new Set([
  'extends', 'func', 'var', 'const', 'if', 'elif', 'else', 'for', 'while', 'in', 'return', 'match', 'pass',
  'and', 'or', 'not', 'class_name', 'signal', 'await', 'break', 'continue', 'static', 'self', 'true', 'false', 'null',
])
const TYPES = new Set(['CharacterBody2D', 'Vector2', 'float', 'int', 'void', 'Input', 'bool', 'String', 'Node2D'])

const RE = /(#[^\n]*)|("(?:[^"\\]|\\.)*")|(@\w+)|(\b\d+(?:\.\d+)?\b)|(\b[A-Za-z_]\w*\b)|(->|:=|[=*+\-/(),.:])|(\s+)|(.)/g

export const tokenColors = {
  comment: '#7d7160',
  string: '#a8c08f',
  annotation: '#d99a73',
  number: '#e2b77d',
  keyword: '#e5875a',
  type: '#d6b56e',
  func: '#efe6d6',
  ident: '#d9cfbd',
  punct: '#a39683',
}

export function highlight(code: string, keyPrefix = ''): ReactNode[] {
  const out: ReactNode[] = []
  let m: RegExpExecArray | null
  let i = 0
  RE.lastIndex = 0
  while ((m = RE.exec(code))) {
    const [t, comment, str, anno, num, ident, punct] = m
    const k = `${keyPrefix}${i++}`
    let color: string | undefined
    if (comment) color = tokenColors.comment
    else if (str) color = tokenColors.string
    else if (anno) color = tokenColors.annotation
    else if (num) color = tokenColors.number
    else if (ident) {
      if (KEYWORDS.has(ident)) color = tokenColors.keyword
      else if (TYPES.has(ident) || /^[A-Z][A-Z_]+$/.test(ident)) color = TYPES.has(ident) ? tokenColors.type : tokenColors.number
      else if (code[RE.lastIndex] === '(') color = tokenColors.func
      else color = tokenColors.ident
    } else if (punct) color = tokenColors.punct
    out.push(
      color ? (
        <span key={k} style={{ color }}>
          {t}
        </span>
      ) : (
        t
      ),
    )
  }
  return out
}
