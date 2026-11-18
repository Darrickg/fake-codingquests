// Shared SVG definitions, rendered once so many small drawings can reference them.
export function SvgDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="pinShine" cx=".35" cy=".3" r=".8">
          <stop offset="0" stopColor="#ecd093" />
          <stop offset=".55" stopColor="#c8a45c" />
          <stop offset="1" stopColor="#6d5222" />
        </radialGradient>
        <filter id="roughen" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency=".04" numOctaves="2" seed="3" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.2" />
        </filter>
        <filter id="paperEdge" x="-3%" y="-3%" width="106%" height="106%">
          <feTurbulence type="fractalNoise" baseFrequency=".09" numOctaves="3" seed="11" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="5" />
        </filter>
        <pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
          <path d="M0 0v6" stroke="#2a2118" strokeWidth=".8" opacity=".35" />
        </pattern>
      </defs>
    </svg>
  )
}
