// Hand-drawn SVG pieces: pack folios, video cards and small motifs. All original.
import type { Pack } from '../content/packs'
import type { Video } from '../content/videos'

export function Motif({ name, color = 'currentColor', size = 40 }: { name: Pack['motif']; color?: string; size?: number }) {
  const p = { fill: 'none', stroke: color, strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} aria-hidden="true">
      {name === 'sword' && (
        <g {...p}>
          <path d="M28 6h6v6L16 30l-6-6z" />
          <path d="m8 22 10 10M6 30l4 4M11 27l-5 5" />
        </g>
      )}
      {name === 'compass' && (
        <g {...p}>
          <circle cx="20" cy="20" r="13" />
          <path d="m20 9 3.5 11L20 31l-3.5-11z" />
          <path d="M20 4v3M20 33v3M4 20h3M33 20h3" />
        </g>
      )}
      {name === 'satchel' && (
        <g {...p}>
          <path d="M7 15h26l-2 18H9z" />
          <path d="M14 15v-3a6 6 0 0 1 12 0v3" />
          <path d="M7 15c4 6 22 6 26 0" />
          <rect x="17.5" y="19" width="5" height="5" rx="1" />
        </g>
      )}
      {name === 'lantern' && (
        <g {...p}>
          <path d="M15 11h10l2 4v13l-2 4H15l-2-4V15z" />
          <path d="M17 7h6M20 7V4M13 15h14M13 28h14" />
          <path d="M20 18c-2 2.5-3 4-3 5.5a3 3 0 0 0 6 0c0-1.5-1-3-3-5.5z" />
        </g>
      )}
      {name === 'die' && (
        <g {...p}>
          <path d="M20 5 33 12v15l-13 8-13-8V12z" />
          <path d="m7 12 13 7 13-7M20 19v16" />
          <circle cx="20" cy="12" r="1" fill={color} />
          <circle cx="13" cy="21" r="1" fill={color} />
          <circle cx="15" cy="27" r="1" fill={color} />
          <circle cx="27" cy="21" r="1" fill={color} />
          <circle cx="25" cy="27" r="1" fill={color} />
        </g>
      )}
      {name === 'spark' && (
        <g {...p}>
          <path d="M8 30c4-1 6-5 6-9 2 3 5 4 8 3" />
          <path d="M26 6v6M23 9h6M31 16v4M29 18h4M18 8v3M16.5 9.5h3" />
          <ellipse cx="11" cy="32" rx="5" ry="1.5" />
        </g>
      )}
      {name === 'link' && (
        <g {...p}>
          <rect x="5" y="10" width="13" height="10" rx="1.5" />
          <rect x="22" y="20" width="13" height="10" rx="1.5" />
          <path d="M11.5 20v5h10M28.5 20v-5h-10" />
          <path d="m19 23 2.5 2-2.5 2M21 13l-2.5 2 2.5 2" />
        </g>
      )}
    </svg>
  )
}

/** A cloth-bound folio. Reads as something you own. */
export function PackArt({
  pack,
  owned = false,
  className = '',
  style,
}: {
  pack: Pick<Pack, 'cloth' | 'motif' | 'name'>
  owned?: boolean
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <svg viewBox="0 0 120 150" className={className} style={style} aria-hidden="true">
      {/* pages */}
      <path d="M18 12h88a4 4 0 0 1 4 4v118a4 4 0 0 1-4 4H18z" fill="#e9dcc3" />
      <path d="M104 16v118M107 18v114" stroke="#b9a582" strokeWidth=".8" />
      {/* cover */}
      <rect x="10" y="8" width="94" height="132" rx="4" fill={pack.cloth} />
      <rect x="10" y="8" width="94" height="132" rx="4" fill="url(#hatch)" opacity=".5" />
      <rect x="10" y="8" width="18" height="132" rx="3" fill="#000" opacity=".22" />
      <path d="M28 8v132" stroke="#000" strokeOpacity=".35" />
      <path d="M14 20h10M14 128h10" stroke="#c8a45c" strokeWidth="1.2" opacity=".7" />
      {/* brass corners */}
      <path d="M90 8h10a4 4 0 0 1 4 4v10z" fill="#c8a45c" />
      <path d="M90 140h10a4 4 0 0 0 4-4v-10z" fill="#c8a45c" />
      {/* label plate */}
      <rect x="38" y="42" width="56" height="56" rx="3" fill="none" stroke="#c8a45c" strokeWidth="1.2" opacity=".85" />
      <g transform="translate(46 50)" color="#dfbe78">
        <Motif name={pack.motif} color="#dfbe78" size={40} />
      </g>
      {/* ribbon */}
      <path d="M78 140v10l4-3 4 3v-10" fill="#8f2a1c" />
      {owned && (
        <g transform="translate(72 104) rotate(-10)">
          <circle r="16" fill="#8f2a1c" />
          <circle r="11.5" fill="none" stroke="#5e170e" strokeWidth="1.5" />
          <path d="m-6 0 4 4 8-8" fill="none" stroke="#f0c9a8" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}
    </svg>
  )
}

const glyphs: Record<Video['card']['glyph'], React.ReactNode> = {
  walk: (
    <g>
      <path d="M60 64h52M60 64l26 26" strokeDasharray="4 5" />
      <path d="m106 58 6 6-6 6M84 96l2-6-6-2" />
      <circle cx="56" cy="64" r="7" />
    </g>
  ),
  sword: (
    <g>
      <path d="M104 30h10v10L82 72l-10-10z" />
      <path d="m66 66 16 16M62 78l6 6M70 72l-8 8" />
      <path d="M118 74l8-4M120 84l9 1M114 92l6 6" />
    </g>
  ),
  eye: (
    <g>
      <path d="M58 64c10-14 22-20 34-20s24 6 34 20c-10 14-22 20-34 20s-24-6-34-20z" />
      <circle cx="92" cy="64" r="9" />
      <path d="M126 36c4-6 12-4 12 2 0 4-6 5-6 10M132 54v1" />
    </g>
  ),
  maze: (
    <g>
      <path d="M62 34h60v60H62zM62 50h30M106 34v30M78 64h44M78 64v16M92 80h14v14M62 80h4" />
      <path d="M118 88l8 0" />
      <circle cx="70" cy="42" r="3" />
    </g>
  ),
  spring: (
    <g>
      <path d="M54 92h28M100 70h28M64 92c0-24 10-36 22-40 10-3 20 4 26 18" />
      <path d="M68 88l-4 4 4 4M108 64l4 6 4-6" />
      <path d="M60 100l-6 4M88 100l6 4" />
    </g>
  ),
  door: (
    <g>
      <path d="M72 96V40h40v56M64 96h56" />
      <path d="M112 40l14 8v56l-14-8" />
      <circle cx="104" cy="70" r="2" />
      <path d="M86 54h12" />
    </g>
  ),
  pencil: (
    <g>
      <path d="M60 36h46v58H60z" />
      <path d="M68 50h22M68 60h30M68 70h16" />
      <path d="m122 40 8 8-30 30-10 2 2-10z" />
    </g>
  ),
  coin: (
    <g>
      <ellipse cx="80" cy="66" rx="16" ry="18" />
      <ellipse cx="80" cy="66" rx="9" ry="11" />
      <ellipse cx="114" cy="54" rx="9" ry="10" />
      <path d="M108 80l4 4M120 76l6 2M114 88v6M64 40l4 4M96 36l-2 6" />
    </g>
  ),
  menu: (
    <g>
      <path d="M62 34h60v60H62z" />
      <rect x="72" y="46" width="40" height="10" rx="2" />
      <rect x="72" y="62" width="40" height="10" rx="2" />
      <rect x="72" y="78" width="40" height="8" rx="2" />
      <path d="m66 51 3 0" />
    </g>
  ),
  cube: (
    <g>
      <path d="M92 36 120 52v32L92 100 64 84V52z" />
      <path d="m64 52 28 16 28-16M92 68v32" />
      <path d="M130 30v8M126 34h8M44 40l6 4" />
    </g>
  ),
}

/** A drawn stand-in for a video. No thumbnails are copied. */
export function VideoArt({ video, className = '' }: { video: Video; className?: string }) {
  return (
    <svg viewBox="0 0 184 104" className={className} aria-hidden="true">
      <rect width="184" height="104" rx="6" fill={video.card.tint} />
      <rect width="184" height="104" rx="6" fill="url(#hatch)" opacity=".18" />
      <g fill="none" stroke="#efe6d6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity=".88">
        {glyphs[video.card.glyph]}
      </g>
      <g transform="translate(150 80)">
        <circle r="13" fill="#0b0a09" opacity=".75" />
        <path d="M-4-6v12l10-6z" fill="#efe6d6" />
      </g>
      <rect x="10" y="10" width="34" height="14" rx="3" fill="#0b0a09" opacity=".6" />
      <text x="27" y="20.5" textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#efe6d6" fontFamily="DM Sans Variable, sans-serif" letterSpacing=".6">
        VIDEO
      </text>
    </svg>
  )
}
