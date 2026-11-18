import { useEffect } from 'react'
import { site } from '../content/site'

export function useTitle(page?: string) {
  useEffect(() => {
    document.title = page ? `${site.titlePrefix} ${page} | ${site.wordmark}` : site.defaultTitle
  }, [page])
}
