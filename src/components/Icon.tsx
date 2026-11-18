// One set of line icons, drawn on a 24 grid at a single stroke weight.
import type { SVGProps } from 'react'

const paths = {
  map: (
    <>
      <path d="M3.5 6.2 9 4l6 2.2 5.5-2.2v13.8L15 20l-6-2.2-5.5 2.2z" />
      <path d="M9 4v13.8M15 6.2V20" />
    </>
  ),
  shelf: (
    <>
      <path d="M3 20.5h18" />
      <path d="M5 20.5V6h3v14.5M8 20.5V8.5h3v12" />
      <path d="m12.6 9.2 2.9-.8 3.4 12.1" />
    </>
  ),
  pack: (
    <>
      <path d="M5 9.5h14l-1 10.5H6z" />
      <path d="M8.5 9.5V7a3.5 3.5 0 0 1 7 0v2.5" />
      <path d="M5.5 13.5h13" />
      <circle cx="12" cy="13.5" r="1.4" />
    </>
  ),
  scale: (
    <>
      <path d="M12 4v16M7 20h10" />
      <path d="M5 7h14" />
      <path d="m5 7-2.5 6h5zM19 7l-2.5 6h5z" />
    </>
  ),
  tower: (
    <>
      <path d="M6 20.5V9h12v11.5" />
      <path d="M5 9V5h2.5v2h2V5h5v2h2V5H19v4" />
      <path d="M10 20.5v-4a2 2 0 0 1 4 0v4" />
      <path d="M3.5 20.5h17" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="10.5" width="14" height="10" rx="2" />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
      <path d="M12 14.5v2.5" />
    </>
  ),
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  arrow: (
    <>
      <path d="M4.5 12h15" />
      <path d="m13.5 6 6 6-6 6" />
    </>
  ),
  back: (
    <>
      <path d="M19.5 12h-15" />
      <path d="m10.5 6-6 6 6 6" />
    </>
  ),
  play: <path d="M8 5.5v13l10.5-6.5z" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6" />
      <path d="m15 15 5.5 5.5" />
    </>
  ),
  sliders: (
    <>
      <path d="M4 7h9M17 7h3M4 17h3M11 17h9" />
      <circle cx="15" cy="7" r="2" />
      <circle cx="9" cy="17" r="2" />
    </>
  ),
  flame: (
    <>
      <path d="M12 21c-3.6 0-6-2.4-6-5.6 0-3.3 2.6-5 3.6-8.4.4 1.9 1.4 3 2.6 3.6.3-2.5 1.3-4.6 3.1-6.1-.3 2.8 2.7 5.4 2.7 9.2 0 4.2-2.6 7.3-6 7.3z" />
    </>
  ),
  tent: (
    <>
      <path d="M2.5 20 12 4.5 21.5 20z" />
      <path d="M12 4.5 9 20M12 4.5l3 15.5" />
    </>
  ),
  key: (
    <>
      <circle cx="8" cy="12" r="3.5" />
      <path d="M11.5 12H21M17.5 12v3M20 12v2.5" />
    </>
  ),
  chevron: <path d="m6 9 6 6 6-6" />,
  chevronRight: <path d="m9 6 6 6-6 6" />,
  reset: (
    <>
      <path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3" />
      <path d="M4.5 4v4.5H9" />
    </>
  ),
  external: (
    <>
      <path d="M13.5 4.5h6v6" />
      <path d="m19.5 4.5-8 8" />
      <path d="M18 14v5.5H4.5V6H10" />
    </>
  ),
  video: (
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="2" />
      <path d="m10 9.5 4.5 2.5-4.5 2.5z" />
    </>
  ),
  scroll: (
    <>
      <path d="M7 4.5h11a2 2 0 0 1 2 2v1.5h-4" />
      <path d="M16 6.5v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-1.5h10" />
      <path d="M7 4.5a2 2 0 0 0-2 2V16M9 9h4.5M9 12h4.5" />
    </>
  ),
  door: (
    <>
      <path d="M6 20.5V5a1.5 1.5 0 0 1 1.5-1.5h9A1.5 1.5 0 0 1 18 5v15.5" />
      <path d="M3.5 20.5h17" />
      <circle cx="14.5" cy="12.5" r=".9" fill="currentColor" stroke="none" />
    </>
  ),
  code: (
    <>
      <path d="m8 7-5 5 5 5M16 7l5 5-5 5" />
      <path d="m13.5 4.5-3 15" />
    </>
  ),
  sparkle: (
    <>
      <path d="M12 3.5v4M12 16.5v4M3.5 12h4M16.5 12h4" />
      <path d="m6.5 6.5 2 2M15.5 15.5l2 2M6.5 17.5l2-2M15.5 8.5l2-2" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v5.5" />
      <circle cx="12" cy="7.8" r=".9" fill="currentColor" stroke="none" />
    </>
  ),
} as const

export type IconName = keyof typeof paths

export function Icon({ name, size = 22, ...rest }: { name: IconName; size?: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {paths[name]}
    </svg>
  )
}
