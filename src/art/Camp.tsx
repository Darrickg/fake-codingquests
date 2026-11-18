// The unfinished place for 2D Top-Down Character Movement: a camp.
// Lesson 1 puts the tent up. Lesson 2 lights the fire.

export function Camp({
  tent,
  fire,
  animate = false,
  className = '',
  title = 'Your camp',
}: {
  tent: boolean
  fire: boolean
  animate?: boolean
  className?: string
  title?: string
}) {
  const desc = `${tent ? 'The tent is up' : 'The tent is not up yet'}. ${fire ? 'The fire is lit' : 'The fire is not lit yet'}.`
  return (
    <svg viewBox="0 0 320 190" className={className} role="img" aria-label={`${title}. ${desc}`}>
      <defs>
        <radialGradient id="campGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#d9652b" stopOpacity=".55" />
          <stop offset=".5" stopColor="#c8a45c" stopOpacity=".14" />
          <stop offset="1" stopColor="#c8a45c" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="campSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#14110d" />
          <stop offset="1" stopColor="#1d1812" />
        </linearGradient>
      </defs>
      <rect width="320" height="190" fill="url(#campSky)" />
      {/* stars */}
      <g fill="#efe6d6" opacity=".5">
        {[
          [24, 22, 0.9], [62, 40, 0.6], [110, 16, 0.8], [176, 30, 0.6], [230, 14, 0.9], [276, 38, 0.7], [300, 18, 0.5], [140, 46, 0.5],
        ].map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} />
        ))}
      </g>
      {/* hills */}
      <path d="M0 112c38-22 70-30 108-18s62 4 92-10 76-14 120 8v108H0z" fill="#191510" />
      <path d="M0 112c38-22 70-30 108-18s62 4 92-10 76-14 120 8" fill="none" stroke="#4a3f31" strokeWidth="1.2" />
      {/* clearing */}
      <ellipse cx="160" cy="150" rx="150" ry="30" fill="#211b14" />
      {fire && <ellipse cx="196" cy="150" rx="120" ry="44" fill="url(#campGlow)" className={animate ? 'anim-fade' : ''} />}
      {/* pines */}
      <g fill="none" stroke="#7c9a6a" strokeWidth="1.3" strokeLinejoin="round" strokeLinecap="round" opacity=".75">
        <path d="M28 128V96M28 96l-12 16h24zM28 86l-10 14h20zM28 76l-7 11h14z" />
        <path d="M52 132V108M52 108l-9 12h18zM52 98l-7 11h14z" />
        <path d="M292 130V92M292 92l-13 17h26zM292 80l-11 15h22zM292 70l-8 12h16z" />
      </g>
      {/* tent */}
      <g transform="translate(92 92)">
        {tent ? (
          <g className={animate ? 'anim-rise' : ''}>
            <path d="M-14 58 6 6l10 2 34 50z" fill="#e9dcc3" />
            <path d="M16 8 50 58H30z" fill="#cdbb98" />
            <path d="M6 6 30 58" stroke="#2a2118" strokeWidth="1.2" fill="none" />
            <path d="M12 58c3-14 6-22 9-28 3 8 5 16 9 28z" fill="#2a2118" />
            <path d="M-14 58 6 6l10 2 34 50z" fill="none" stroke="#2a2118" strokeWidth="1.6" strokeLinejoin="round" />
            <path d="M6 6 1 -2M16 8l4-9" stroke="#2a2118" strokeWidth="1.4" strokeLinecap="round" />
            <path d="M-14 58-24 64M50 58l12 6M4 18l-30 44M44 50l20 14" stroke="#a39683" strokeWidth=".8" fill="none" />
            <path d="M-24 64v-3M62 64v-3" stroke="#a39683" strokeWidth="1.4" />
          </g>
        ) : (
          <g fill="none" stroke="#a39683" strokeWidth="1.1" strokeDasharray="3 4" opacity=".7">
            <path d="M-14 58 6 6l10 2 34 50z" />
            <path d="M-24 64v-3M62 64v-3" strokeDasharray="none" strokeWidth="1.4" />
          </g>
        )}
      </g>
      {/* fire ring */}
      <g transform="translate(196 150)">
        {fire && (
          <g className="anim-flicker">
            <path d="M0-30c-8 9-15 14-15 22 0 7 7 10 15 10s15-3 15-10c0-9-8-12-9-20-2 5-3 7-6 8z" fill="#d9652b" />
            <path d="M0-16c-4 5-8 8-8 12 0 4 4 6 8 6s8-2 8-6c0-5-5-7-5-11-1 3-2 4-3 5z" fill="#efc46b" />
          </g>
        )}
        <g stroke="#2a2118" strokeWidth="1.2">
          <path d="M-18 2 16-6" stroke="#6b4a2c" strokeWidth="5" strokeLinecap="round" />
          <path d="M-16-6 18 2" stroke="#7d5733" strokeWidth="5" strokeLinecap="round" />
        </g>
        {[-24, -14, -2, 10, 22].map((x, i) => (
          <ellipse key={i} cx={x} cy={i % 2 ? 7 : 5} rx="5" ry="3.4" fill="#4a4237" stroke="#2a2118" strokeWidth=".8" />
        ))}
        {!fire && <text x="0" y="-14" textAnchor="middle" fontSize="9" fill="#a39683" fontFamily="DM Sans Variable, sans-serif">unlit</text>}
      </g>
    </svg>
  )
}
