import { useSyncExternalStore } from 'react'

export function useMedia(query: string): boolean {
  return useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia(query)
      m.addEventListener('change', cb)
      return () => m.removeEventListener('change', cb)
    },
    () => window.matchMedia(query).matches,
    () => false,
  )
}

export const useIsDesktop = () => useMedia('(min-width: 768px)')
export const useCoarse = () => useMedia('(pointer: coarse)')
export const useReducedMotion = () => useMedia('(prefers-reduced-motion: reduce)')
