import { useEffect } from 'react'
import type { Locale } from '../data/types'
import { getSeo } from '../data/seo'

export function Seo({ locale }: { locale: Locale }) {
  useEffect(() => {
    const metadata = getSeo(locale)
    document.title = metadata.title
    const values = {
      'meta[name="description"]': metadata.description,
      'meta[name="robots"]': metadata.robots,
      'meta[property="og:title"]': metadata.ogTitle,
      'meta[property="og:description"]': metadata.description,
      'meta[property="og:locale"]': metadata.locale,
      'meta[property="og:url"]': metadata.canonical,
      'meta[property="og:image"]': metadata.image,
      'meta[name="twitter:title"]': metadata.ogTitle,
      'meta[name="twitter:description"]': metadata.description,
      'meta[name="twitter:image"]': metadata.image,
    }
    Object.entries(values).forEach(([selector, value]) => document.querySelector(selector)?.setAttribute('content', value))
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', metadata.canonical)
  }, [locale])
  return null
}
